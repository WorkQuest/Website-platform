<template>
  <ctm-modal-box
    class="buy-wqt"
    :title="$tc('modals.titles.swap')"
  >
    <validation-observer
      v-slot="{handleSubmit, invalid}"
      ref="buyWQT"
      class="buy-wqt__content content"
      tag="div"
    >
      <div class="content__field">
        <div class="content__field_label">
          {{ $t('modals.network') }}
        </div>
        <base-dd
          :value="selectedNetworkIndex"
          type="border"
          data-selector="NETWORK"
          :items="networkList"
          is-icon
          @input="handleSwitchNetwork"
        />
      </div>
      <div class="content__field">
        <div class="content__field_label">
          {{ $t('modals.token') }}
        </div>
        <base-dd
          v-model="selectedToken"
          type="border"
          data-selector="TOKEN"
          :items="tokenList"
          is-icon
        />
      </div>
      <div class="content__field">
        <div
          v-if="tokenData"
          class="content__field_label"
        >
          {{ $t('meta.balance') }} {{ tokenData.fullBalance }} {{ tokenData.symbol }}
        </div>
        <base-field
          ref="amount"
          v-model="amount"
          :disabled="!tokenData"
          :placeholder="$t('modals.amount')"
          :name="$t('modals.amount')"
          :rules="amountRules"
          type="number"
          data-selector="AMOUNT"
        >
          <template
            v-slot:right-absolute
            class="content__max max"
          >
            <base-btn
              mode="max"
              class="max__button"
              data-selector="MAX"
              @click="maxValue"
            >
              <span class="max__text">
                {{ $t('modals.maximum') }}
              </span>
            </base-btn>
          </template>
        </base-field>
      </div>
      <div class="content__wqt">
        <template v-if="wqtAmount && !invalid">
          <div class="content__wqt-amount">
            {{ $t('meta.amount.amountOfWQTToReceive') }}: {{ wqtAmount }}
          </div>
          <div class="content__wqt-fee">
            {{ $t('wallet.buyWQT.worknetFee') }}
          </div>
        </template>
      </div>
      <base-btn
        :disabled="invalid || inProgressWQT"
        @click="handleSubmit(submit)"
      >
        {{ $t('meta.btns.confirm') }}
      </base-btn>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { BlockchainIndex, BuyWQTTokensData } from '~/utils/сonstants/bridge';
import {
  Chains, Path, TokenSymbols, WalletTokensData,
} from '~/utils/enums';
import { WQTBuyCommission } from '~/utils/сonstants/commission';
import { getStyledAmount, GetWalletProvider, getWalletTransactionCount } from '~/utils/wallet';
import { fetchContractData } from '~/utils/web3';
import modals from '~/store/modals/modals';
import { BuyWQT, ERC20 } from '~/abi';
import walletOperations from '~/plugins/mixins/walletOperations';

const MIN_AMOUNT = 5;
const MAX_AMOUNT = 100;

export default {
  name: 'ModalBuyWQT',
  mixins: [walletOperations],
  data() {
    return {
      selectedToken: 0,
      amount: 0,
      tokenData: null,
      updatePriceId: null,
      wqtAmount: null, // Сколько мы получим wqt
      inProgressWQT: false,
    };
  },
  computed: {
    ...mapGetters({
      selectedNetwork: 'wallet/getSelectedNetwork',
      userWalletAddress: 'user/getUserWalletAddress',
      userData: 'user/getUserData',
      oraclePrices: 'oracle/getPrices',
      oracleSymbols: 'oracle/getSymbols',
    }),
    amountRules() {
      const { tokenData, selectedSymbol, amount } = this;
      const minTokensAmount = `min_tokens_amount:${tokenData && tokenData.fullBalance},${MIN_AMOUNT},${selectedSymbol}`;
      const haveFounds = `have_funds:${tokenData && tokenData.fullBalance},${amount},${selectedSymbol}`;
      const decimalPlaces = `decimalPlaces:${tokenData ? tokenData.decimals : 0}`;
      const minBuy = `min_buy_wqt:${MIN_AMOUNT},${selectedSymbol}`;
      const maxBuy = `max_buy_wqt:${MAX_AMOUNT},${selectedSymbol}`;
      return `required|decimal|${minTokensAmount}|${decimalPlaces}|${minBuy}|${maxBuy}|${haveFounds}`;
    },
    networkList() {
      return [
        BuyWQTTokensData.get(Chains.ETHEREUM),
        BuyWQTTokensData.get(Chains.BINANCE),
        BuyWQTTokensData.get(Chains.POLYGON),
      ];
    },
    selectedNetworkIndex() {
      for (let i = 0; i < this.networkList.length; i += 1) {
        if (this.networkList[i].chain === this.selectedNetwork) return i;
      }
      console.error('Error on: selectedNetworkIndex', this.selectedNetwork);
      return 0;
    },
    tokenList() {
      if (this.selectedNetwork === Chains.WORKNET) return [];
      return this.networkList[this.selectedNetworkIndex].tokens;
    },
    maxUSDTValue() {
      if (!this.tokenData) return 0;
      if (new BigNumber(this.tokenData.fullBalance).isGreaterThan(100)) {
        return 100;
      }
      return this.tokenData.fullBalance;
    },
    selectedSymbol() {
      return this.tokenData && this.tokenData.symbol;
    },
  },
  watch: {
    async selectedNetwork() {
      this.clearData();
      await this.updateTokenData();
    },
    // Определение сколько приблизительно WQT мы получим
    amount(nV) {
      clearTimeout(this.updatePriceId);

      // что бы не слать запросы на оракул и ноду, если нет баланса или значение не валидное
      if (
        nV === ''
        || new BigNumber(nV).isLessThan(MIN_AMOUNT)
        || new BigNumber(nV).isGreaterThan(MAX_AMOUNT)
        || (this.tokenData?.fullBalance && new BigNumber(this.tokenData?.fullBalance).isLessThan(nV))
      ) return;

      this.inProgressWQT = true;
      this.wqtAmount = `${this.$t('modals.pleaseWait')}...`;
      this.updatePriceId = setTimeout(async () => {
        await this.$store.dispatch('oracle/getCurrentTokensPrices');
        const priceWQT = new BigNumber(this.oraclePrices[this.oracleSymbols.indexOf(TokenSymbols.WQT)]).shiftedBy(-18);
        const decimalAmount = new BigNumber(nV);
        const receiveWithCommission = decimalAmount.dividedBy(priceWQT).multipliedBy(1 - WQTBuyCommission).decimalPlaces(18);
        const value = new BigNumber(receiveWithCommission).shiftedBy(18).toString();

        let txFee;
        try {
          const provider = new Web3(this.ENV.WQ_PROVIDER);
          const [gasPrice, gasEstimate] = await Promise.all([
            provider.eth.getGasPrice(),
            provider.eth.estimateGas({
              from: this.userWalletAddress,
              to: this.userWalletAddress,
              value,
            }),
          ]);
          txFee = new BigNumber(gasPrice).multipliedBy(gasEstimate).shiftedBy(-18).toString();
        } catch (e) {
          txFee = 18; // user doesnt has balance of wqt in worknet
        }

        this.wqtAmount = receiveWithCommission.decimalPlaces(3).minus(txFee).toFixed(0);
        this.inProgressWQT = false;
      }, 400);
    },
  },
  async beforeMount() {
    await this.updateTokenData();
  },
  methods: {
    async handleSwitchNetwork(index) {
      if (this.selectedNetworkIndex === index) return;
      this.SetLoader(true);
      await this.$store.dispatch('wallet/connectToProvider', this.networkList[index].chain);
      this.SetLoader(false);
    },
    clearData() {
      this.amount = null;
      this.tokenData = null;
      this.wqtAmount = null;
      this.insufficientFunds = null;
    },
    maxValue() {
      if (!this.tokenData) return;
      this.amount = this.maxUSDTValue;
      this.$refs.amount.$refs.input.focus();
      this.$refs.amount.$refs.input.blur();
    },
    // Updates balance by current network & token
    async updateTokenData() {
      this.SetLoader(true);
      const { tokenAddress } = this.tokenList[this.selectedToken];
      const provider = GetWalletProvider();
      const [balance, decimals, symbol] = await Promise.all([
        fetchContractData('balanceOf', ERC20, tokenAddress, [this.userWalletAddress], provider),
        fetchContractData('decimals', ERC20, tokenAddress, [], provider),
        fetchContractData('symbol', ERC20, tokenAddress, [], provider),
      ]);
      this.SetLoader(false);
      if (!decimals || !symbol) {
        this.tokenData = null;
        return;
      }
      this.tokenData = {
        decimals,
        symbol,
        balance: getStyledAmount(balance, false, decimals),
        fullBalance: getStyledAmount(balance, true, decimals),
      };
    },
    async submit() {
      if (this.inProgressWQT || !this.tokenData || this.insufficientFunds) return;

      this.SetLoader(true);

      const {
        amount, userWalletAddress, selectedNetwork, userData: { id: userId },
      } = this;
      const { decimals, symbol } = this.tokenData;
      const { tokenAddress } = this.tokenList[this.selectedToken];
      const { bridgeAddress } = this.networkList[this.selectedNetworkIndex];
      const nativeTokenSymbol = WalletTokensData[selectedNetwork].tokenList[0].title;

      await this.MakeApprove({
        title: 'BuyWQT Approve',
        contractAddress: bridgeAddress,
        tokenAddress,
        amount,
        symbol,
        nativeTokenSymbol,
        isHexUserWalletAddress: true,
      }).then(async () => {
        this.SetLoader(true);
        const nonce = await getWalletTransactionCount();
        const BNValue = new BigNumber(amount).shiftedBy(Number(decimals)).toString();
        const [feeRes] = await Promise.all([
          this.$store.dispatch('wallet/getContractFeeData', {
            method: 'swap',
            abi: BuyWQT,
            contractAddress: bridgeAddress,
            data: [nonce, BlockchainIndex[Chains.WORKNET], BNValue, userWalletAddress, userId, symbol],
          }),
          this.$store.dispatch('wallet/getBalance'),
        ]);

        this.SetLoader(false);
        if (!feeRes.ok) {
          this.ShowToast(feeRes.msg, 'Approve error');
          return;
        }

        this.ShowModal({
          key: modals.transactionReceipt,
          title: 'BuyWQT Swap',
          fields: {
            from: { name: this.$t('meta.fromBig'), value: userWalletAddress },
            to: { name: this.$t('meta.toBig'), value: bridgeAddress },
            fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: nativeTokenSymbol },
          },
          submitMethod: async () => {
            const res = await this.$store.dispatch('wallet/swap', {
              toChainIndex: BlockchainIndex[Chains.WORKNET],
              isNative: false,
              bridgeAddress,
              amount,
              symbol,
              decimals,
              isHexUserWalletAddress: true,
            });
            this.SetLoader(false);
            if (res.ok) {
              const { transactionHash } = res.result;
              this.ShowModal({
                key: modals.pendingHash,
                firstTxLink: `${WalletTokensData[selectedNetwork].explorer}/tx/${transactionHash}`,
              });
              await this.$store.dispatch('wallet/connectToProvider', Chains.WORKNET);
            }
          },
        });
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.SetLoader(false);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.buy-wqt {
  &__content {
    padding: 20px 28px 30px 28px !important;
  }
}
.content {
  display: grid;
  grid-gap: 20px;
  &__change-network {
    color: $red;
  }
  &__field {
    display: grid;
    grid-gap: 10px;
    &_label {
      color: $black500;
    }
  }
  &__wqt {
    min-height: 48px;
  }
  &__balance {
    color: $black500;
  }
}
.max {
  &__text {
    padding: 0 10px;
  }
}
</style>
