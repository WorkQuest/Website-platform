<template>
  <ctm-modal-box
    class="buy-wqt"
    :title="$t('wallet.buyWQT.buyButton')"
  >
    <validation-observer
      v-slot="{handleSubmit, invalid}"
      class="buy-wqt__content content"
      tag="div"
    >
      <div class="content__field">
        <div class="content__field_label">
          {{ $t('modals.network') }}
        </div>
        <base-dd
          v-model="selectedNetwork"
          type="border"
          data-selector="NETWORK"
          :items="networkList"
          is-icon
        />
        <div
          v-if="isNeedToChangeNetwork"
          class="content__change-network"
        >
          {{ $t('modals.errors.errorNetwork', { network: networkList[selectedNetwork].title }) }}
        </div>
      </div>
      <div class="content__field">
        <div class="content__field_label">
          {{ $t('modals.token') }}
        </div>
        <base-dd
          v-model="selectedToken"
          :disabled="isNeedToChangeNetwork"
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
        <div>
          <base-field
            v-model="amount"
            :disabled="isNeedToChangeNetwork || !tokenData"
            :placeholder="$t('modals.amount')"
            :name="$t('modals.amount')"
            :rules="`required|is_not:0|decimal|decimalPlaces:${tokenData ? tokenData.decimals : 0}|min_value:5|max_value:${maxUSDTValue}`"
            data-selector="AMOUNT"
            @input="handleInput"
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
      </div>
      <div class="content__wqt">
        <span v-if="wqtAmount">
          {{ $t('meta.amount.amountOfWQT') }} ≈ {{ wqtAmount }}
        </span>
      </div>
      <base-btn
        :disabled="invalid || isNeedToChangeNetwork || inProgressWQT"
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
import { BlockchainIndex, BuyWQTTokensData, NetworkTokensData } from '~/utils/сonstants/bridge';
import { Chains, TokenSymbols } from '~/utils/enums';
import { WQTBuyCommission } from '~/utils/сonstants/commission';
import { getStyledAmount } from '~/utils/wallet';
import { getChainIdByChain } from '~/utils/web3';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalBuyWQT',
  data() {
    return {
      selectedToken: 0,
      selectedNetwork: null,
      amount: null,
      tokenData: null,
      updatePriceId: null,
      wqtAmount: null, // Сколько мы получим wqt
      inProgressWQT: false,
      isNeedToChangeNetwork: false,
    };
  },
  computed: {
    ...mapGetters({
      userWalletAddress: 'user/getUserWalletAddress',
      isMetamaskConnected: 'web3/isConnected',
      web3Account: 'web3/getAccount',
      oraclePrices: 'oracle/getPrices',
      oracleSymbols: 'oracle/getSymbols',
    }),
    networkList() {
      return [
        BuyWQTTokensData.get(Chains.WORKNET),
        BuyWQTTokensData.get(Chains.ETHEREUM),
        BuyWQTTokensData.get(Chains.BINANCE),
        BuyWQTTokensData.get(Chains.POLYGON),
      ];
    },
    tokenList() {
      return this.networkList[this.selectedNetwork].tokens;
    },
    maxUSDTValue() {
      if (!this.tokenData) return 0;
      if (new BigNumber(this.tokenData.fullBalance).isGreaterThan(100)) {
        return 100;
      }
      return this.tokenData.fullBalance;
    },
  },
  watch: {
    async isMetamaskConnected(newVal) {
      if (newVal) {
        if (!this.isChainCompareToCurrent()) {
          this.isNeedToChangeNetwork = true;
          this.clearData();
          this.SetLoader(false);
        } else {
          this.isNeedToChangeNetwork = false;
          await this.updateTokenData();
        }
      }
    },
    async selectedNetwork(newVal) {
      this.clearData();
      this.isNeedToChangeNetwork = false;
      const res = await this.$store.dispatch('web3/goToChain', { chain: this.networkList[newVal].chain });
      if (!res.ok) {
        this.isNeedToChangeNetwork = true;
        this.wqtAmount = null;
      } else {
        await this.updateTokenData();
      }
    },
    // Определение сколько приблизительно WQT мы получим
    amount(newVal) {
      clearTimeout(this.updatePriceId);
      const val = new BigNumber(newVal);
      if (!newVal || isNaN(newVal) || val.isGreaterThan(100) || new BigNumber(newVal).isLessThan(5)) {
        this.wqtAmount = null;
        return;
      }
      this.inProgressWQT = true;
      this.wqtAmount = `${this.$t('modals.pleaseWait')}...`;
      this.updatePriceId = setTimeout(async () => {
        await this.$store.dispatch('oracle/getCurrentTokensPrices');
        const priceWQT = new BigNumber(this.oraclePrices[this.oracleSymbols.indexOf(TokenSymbols.WQT)]).shiftedBy(-18);
        const decimalAmount = new BigNumber(this.amount);
        const receiveWithCommission = decimalAmount.dividedBy(priceWQT).multipliedBy(1 - WQTBuyCommission).decimalPlaces(18);
        const res = await this.$store.dispatch('wallet/getTransferFeeData', {
          recipient: this.userWalletAddress,
          value: receiveWithCommission.toString(),
        });
        const txPrice = res.result.fee;
        this.wqtAmount = receiveWithCommission.minus(txPrice).decimalPlaces(3);
        this.inProgressWQT = false;
      },
      400);
    },
  },
  async beforeMount() {
    if (!this.isMetamaskConnected) {
      this.ShowToast('Need to connect Metamask!');
      this.CloseModal();
      return;
    }
    this.selectedNetwork = 0;
    await this.updateTokenData();
  },
  methods: {
    handleInput(val) {
      if (!val || isNaN(val)) this.amount = val;
      else if (!this.tokenData) this.amount = 0;
      else if (new BigNumber(val).isGreaterThan(this.tokenData.fullBalance)) this.amount = this.tokenData.fullBalance;
      else this.amount = val;
    },
    clearData() {
      this.amount = null;
      this.tokenData = null;
      this.wqtAmount = null;
    },
    isChainCompareToCurrent() {
      return +this.web3Account.netId === +getChainIdByChain(this.networkList[this.selectedNetwork].chain);
    },
    maxValue() {
      if (!this.tokenData) return;
      this.amount = this.maxUSDTValue;
    },
    // Updates balance by current network & token
    async updateTokenData() {
      if (!this.isChainCompareToCurrent()) return;
      this.SetLoader(true);
      const res = await this.$store.dispatch('web3/fetchTokenInfo', this.tokenList[this.selectedToken].tokenAddress);
      this.SetLoader(false);
      if (!res.ok || !res.result.decimals) {
        this.tokenData = null;
        return;
      }
      const r = res.result;
      this.tokenData = {
        ...r,
        balance: getStyledAmount(r.balance, false, r.decimals),
        fullBalance: getStyledAmount(r.balance, true, r.decimals),
      };
    },
    async submit() {
      if (this.inProgressWQT || !this.tokenData || this.isNeedToChangeNetwork) return;
      this.SetLoader(true);
      const res = await this.$store.dispatch('wallet/swap', {
        amount: this.amount,
        tokenAddress: this.tokenList[this.selectedToken].tokenAddress,
        bridgeAddress: this.networkList[this.selectedNetwork].bridgeAddress,
        isNative: false,
        symbol: this.tokenData.symbol,
        toChainIndex: BlockchainIndex[Chains.WORKNET],
        decimals: this.tokenData.decimals,
      });
      this.SetLoader(false);
      if (res.ok) {
        this.ShowModal({ key: modals.transactionSend });
      }
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
    min-height: 24px;
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
