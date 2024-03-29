<template>
  <ctm-modal-box
    class="swap"
    :title="$tc('modals.titles.swapTitle')"
  >
    <validation-observer
      v-slot="{handleSubmit, invalid}"
      ref="observer"
      tag="div"
      class="swap__content content"
    >
      <div class="content__grid grid">
        <div class="grid__body">
          <div class="grid__field">
            <div class="grid__title">
              {{ $t('modals.coin') }}
            </div>
            <base-dd
              v-model="tokenId"
              :items="tokens"
              class="grid__drop"
              data-selector="TOKENS"
            />
          </div>
          <div class="grid__field">
            <div class="grid__title">
              {{ $t('modals.amount') }}
            </div>
            <base-field
              ref="amount"
              v-model.lazy="amount"
              type="number"
              placeholder="0,05"
              class="grid__input"
              data-selector="AMOUNT"
              :name="$tc('modals.amountField')"
              :rules="`required|decimal|decimalPlaces:${ currentToken.decimals || 18 }|not_enough_funds:${currentToken.amount}|min_value:0.00001|max_value:${currentToken.amount}`"
            >
              <template
                v-slot:right-absolute
                class="content__max max"
              >
                <base-btn
                  mode="max"
                  class="max__button"
                  data-selector="MAX"
                  @click="setMaxValue"
                >
                  <span class="max__text">{{ $t('modals.maximum') }}</span>
                </base-btn>
              </template>
            </base-field>
          </div>
        </div>
      </div>
      <div class="content__body body">
        <div>
          <div class="body__title">
            {{ $t('modals.recipientAddress') }}
          </div>
          <base-field
            disabled
            :value="accountAddress"
            data-selector="RECIPIENT_ADDRESS"
            :name="$tc('modals.recipientAddress')"
          />
        </div>
      </div>
      <div class="content__buttons buttons">
        <base-btn
          mode="outline"
          data-selector="CANCEL"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          :disabled="invalid || currentToken.amount === 0"
          data-selector="CREATE-SWAP"
          @click="handleSubmit(showSwapInfoModal)"
        >
          {{ $t('modals.createSwap') }}
        </base-btn>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { Chains, ConnectionTypes, TokenSymbols } from '~/utils/enums';
import { BlockchainIndex, BridgeAddresses, SwapAddresses } from '~/utils/сonstants/bridge';
import { getChainIdByChain, GetWeb3Provider, getNativeBalance } from '~/utils/web3';
import { GetWalletProvider } from '~/utils/wallet';

export default {
  name: 'ModalSwap',
  data() {
    return {
      amount: 0,
      tokenId: 0,
    };
  },
  computed: {
    ...mapGetters({
      isConnected: 'web3/isConnected',
      account: 'web3/getAccount',
      options: 'modals/getOptions',
      currentToken: 'bridge/getToken',

      web3Account: 'web3/getAccount',
      userWalletAddress: 'user/getUserWalletAddress',
      connectionType: 'web3/getConnectionType',
    }),
    getProviderByConnection() {
      if (this.connectionType === ConnectionTypes.WEB3) return GetWeb3Provider;
      return GetWalletProvider;
    },
    tokens() {
      const { from, to } = this.options;
      if ((from.chain === Chains.BINANCE && to.chain === Chains.ETHEREUM)
        || (from.chain === Chains.ETHEREUM && to.chain === Chains.BINANCE)) {
        return [TokenSymbols.WQT];
      }
      // const toRemoveSymbol = to.chain === Chains.BINANCE ? TokenSymbols.ETH : TokenSymbols.BNB;
      const toRemoveSymbols = [TokenSymbols.ETH, TokenSymbols.BNB];
      const swapsData = SwapAddresses.get(from.chain);
      return [
        swapsData.nativeSymbol,
        ...Object.keys(SwapAddresses.get(from.chain).tokenAddress),
      ].filter((item) => !toRemoveSymbols.includes(item));
    },
    accountAddress() {
      const chain = this.options?.to?.chain;
      if (chain === Chains.WORKNET) return this.convertToBech32('wq', this.account.address);
      return this.account.address;
    },
    account() {
      if (this.connectionType === ConnectionTypes.WEB3) return this.web3Account;
      return { address: this.userWalletAddress };
    },
  },
  watch: {
    async tokenId(index) {
      this.amount = 0;
      await this.handlerFetchBalance(this.tokens[index]);
    },
    async isConnected(val) {
      const id = +getChainIdByChain(this.options?.from?.chain);
      if (val && this.account.netId !== id) {
        await this.CloseModal();
        this.ShowToast(this.$t('modals.incorrectChain'));
      }
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.handlerFetchBalance(this.tokens[0]);
    this.SetLoader(false);
  },
  methods: {
    ...mapActions({
      fetchBalance: 'bridge/fetchBalance',
    }),
    async handlerFetchBalance(symbol) {
      this.SetLoader(true);
      const { to, from } = this.options;
      const provider = this.getProviderByConnection();
      await this.fetchBalance({
        accountAddress: this.account.address,
        symbol,
        toChainIndex: to.index,
        tokenAddress: from.tokenAddress[symbol],
        bridgeAddress: BridgeAddresses[from.chain],
        isNative: from.nativeSymbol === symbol,
        provider,
      });
      if (
        symbol === 'WQT' && this.options.from.chain === Chains.WORKNET
      ) {
        const [balance] = await Promise.all([
          getNativeBalance(this.account.address, provider),
        ]);
        if (balance) {
          const tokenBalance = Number(balance);
          const tokenBalanceFormated = (new BigNumber(tokenBalance).div('1e+18'));
          this.$store.commit('bridge/setToken', {
            ...this.currentToken,
            amount: tokenBalanceFormated.toNumber(),
            decimals: 18,
          });
        }
      }
      // Bridge contract from BSC net for USDT & USDC decimals limit 6
      if (from.chain === Chains.BINANCE && [TokenSymbols.USDT, TokenSymbols.USDC].includes(this.currentToken.symbol)) {
        this.$store.commit('bridge/setToken', {
          ...this.currentToken,
          amount: new BigNumber(this.currentToken.amount).decimalPlaces(6).toString(),
          decimals: 6,
        });
      }
      this.SetLoader(false);
    },
    setMaxValue() {
      this.amount = this.currentToken.amount;
      this.$refs.amount.$refs.input.focus();
      this.$refs.amount.$refs.input.blur();
    },
    async showSwapInfoModal() {
      this.amount = (this.amount.toString()).replace(/[,]/g, '.');
      const { submit, from } = this.options;
      await submit({
        amount: this.amount,
        symbol: this.tokens[this.tokenId],
        isNative: from.nativeSymbol === this.tokens[this.tokenId],
        decimals: this.currentToken.decimalsForSubmit,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.swap {
  max-width: 700px !important;

  &__content {
    padding: 0 28px 30px 28px;
  }
}

.grid {
  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    align-items: flex-end;
    margin: 20px 0 15px 0;
    grid-gap: 15px;
  }

  &__title {
    margin-bottom: 3px;
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }

  &__drop {
    border: 1px solid $black0;
    border-radius: 6px;
    margin-bottom: 23px;
  }
}

.max {
  &__button {
    background: transparent !important;
  }
}

.buttons {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 25px;
}

.button {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;

  &__icon::before {
    font-size: 25px;
    color: $blue !important;
    margin-right: 12px;
  }
}

.body {
  &__title {
    margin-bottom: 3px;
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
}
</style>
