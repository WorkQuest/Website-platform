<template>
  <ctm-modal-box
    class="buy-wqt"
    title="Buy WQT"
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
      <div class="content__amount">
        <div
          v-if="tokenData"
          class="content__balance"
        >
          {{ $t('meta.balance') }} {{ tokenData.balance }} {{ tokenData.symbol }}
        </div>
        <base-field
          v-model="amount"
          :disabled="isNeedToChangeNetwork || !tokenData"
          :placeholder="$t('modals.amount')"
          :name="$t('modals.amount')"
          :rules="`required|decimal|decimalPlaces:${tokenList[selectedToken].decimals}`"
          data-selector="AMOUNT"
        />
      </div>
      <div class="content__wqt">
        <span v-if="wqtAmount">{{ $t('meta.amount.amountOfWQT') }}: {{ wqtAmount }}</span>
      </div>
      <base-btn
        :disabled="invalid || isNeedToChangeNetwork"
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
import { BuyWQTTokensData } from '~/utils/сonstants/bridge';
import { Chains, TokenSymbols } from '~/utils/enums';
import { WQTBuyCommission } from '~/utils/сonstants/commission';
import { getStyledAmount } from '~/utils/wallet';

export default {
  name: 'ModalBuyWQT',
  data() {
    return {
      selectedToken: 0,
      selectedNetwork: null,
      amount: null,
      selectedTokenBalance: 0,

      isNeedToChangeNetwork: false,

      wqtAmount: null, // Сколько мы получим wqt
      updatePriceId: null,
      inProgressWQT: false,

      tokenData: null,
    };
  },
  computed: {
    ...mapGetters({
      isMetamaskConnected: 'web3/isConnected',
      oraclePrices: 'oracle/getPrices',
      oracleSymbols: 'oracle/getSymbols',
    }),
    networkList() {
      return [
        BuyWQTTokensData.get(Chains.ETHEREUM),
        BuyWQTTokensData.get(Chains.BINANCE),
        // BuyWQTTokensData.get(Chains.POLYGON),
      ];
    },
    tokenList() {
      return this.networkList[this.selectedNetwork].tokens;
    },
  },
  watch: {
    async isMetamaskConnected(newVal) {
      if (newVal) { // && right chain id todo: нужно проверить на корректность сети текущей
        await this.updateTokenData();
      }
      console.log('reconnected metamask');
    },
    async selectedNetwork(newVal, prevVal) {
      this.tokenData = null;
      this.isNeedToChangeNetwork = false;
      const res = await this.$store.dispatch('web3/goToChain', { chain: this.networkList[newVal].chain });
      console.log('net', res);
      if (!res.ok) {
        this.isNeedToChangeNetwork = true;
        this.wqtAmount = null;
      }
    },
    // Определение сколько приблизительно WQT мы получим
    amount(newVal) {
      clearTimeout(this.updatePriceId);
      if (!newVal || isNaN(newVal)) {
        this.wqtAmount = null;
        return;
      }
      this.inProgressWQT = true;
      this.wqtAmount = `${this.$t('modals.pleaseWait')}...`;
      this.updatePriceId = setTimeout(async () => {
        await Promise.all([
          // TODO: вычислять комиссию за транзу и отнимать от конечной суммы
          this.$store.dispatch('oracle/getCurrentPrices'),
        ]);
        let priceWQT = this.oraclePrices[this.oracleSymbols.indexOf(TokenSymbols.WQT)];
        priceWQT = new BigNumber(priceWQT).shiftedBy(-18);
        const decimalAmount = new BigNumber(this.amount).multipliedBy(1 - WQTBuyCommission);
        console.log(decimalAmount.toString(), priceWQT.toString());
        this.wqtAmount = decimalAmount.dividedBy(priceWQT);
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
    // Updates balance by current network & token
    async updateTokenData() {
      const res = await this.$store.dispatch('web3/fetchTokenInfo', this.tokenList[this.selectedToken].tokenAddress);
      console.log('token', res);
      if (res.ok) {
        const r = res.result;
        this.tokenData = {
          ...r,
          balance: getStyledAmount(r.balance, false, r.decimals),
          fullBalance: getStyledAmount(r.balance, true, r.decimals),
        };
      } else this.tokenData = null;
    },
    submit() {
      if (this.inProgressWQT) return;
      console.log('haha');
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
    height: 20px;
  }
  &__balance {
    color: $black500;
  }
}
</style>
