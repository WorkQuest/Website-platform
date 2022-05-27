<template>
  <div
    class="raise"
    data-selector="PAGE-RAISED-VIEWS"
  >
    <raise-views-panel
      :back-button-callback="goBack"
      :period-tabs="periodTabs"
      :level-tabs="levelTabs"
      :level="level"
      :period="period"
      @switchPeriod="switchPeriod"
      @switchLevel="switchLevel"
    >
      <template #actions>
        <base-btn
          class="raise__submit"
          :disabled="level < 0"
          data-selector="SHOW-PAYMENT-MODAl"
          @click="showPaymentModal"
        >
          {{ $t('meta.pay') }}
        </base-btn>
      </template>
    </raise-views-panel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import {
  Path, RaiseViewTariffPeriods, TariffByIndex, TokenSymbols, UserRole,
} from '~/utils/enums';
import { PaidTariff } from '~/utils/сonstants/quests';
import { ERC20, WQPromotion } from '~/abi';

export default {
  name: 'RaisedViews',
  middleware: ['worker-role'],
  data() {
    return {
      period: 0,
      level: -1,
      levelPrices: null,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      isWalletConnected: 'wallet/getIsWalletConnected',
      balanceData: 'wallet/getBalanceData',
      userWalletAddress: 'user/getUserWalletAddress',
    }),
    periodTabs() {
      return [
        this.$t('raising-views.forOneDay'),
        this.$t('raising-views.forOneWeek'),
        this.$t('raising-views.forOneMonth'),
      ];
    },
    levelTabs() {
      return [
        {
          title: this.$t('quests.levels.1.title'),
          description: this.$t('quests.levels.1.desc'),
          color: 'gold',
          price: this.levelPrices ? this.levelPrices[PaidTariff.GoldPlus][this.period] : '',
        },
        {
          title: this.$t('quests.levels.2.title'),
          description: this.$t('quests.levels.2.desc'),
          color: 'gold',
          price: this.levelPrices ? this.levelPrices[PaidTariff.Gold][this.period] : '',
        },
        {
          title: this.$t('quests.levels.3.title'),
          description: this.$t('quests.levels.3.desc'),
          color: 'silver',
          price: this.levelPrices ? this.levelPrices[PaidTariff.Silver][this.period] : '',
        },
        {
          title: this.$t('quests.levels.4.title'),
          description: this.$t('quests.levels.4.desc'),
          color: 'bronze',
          price: this.levelPrices ? this.levelPrices[PaidTariff.Bronze][this.period] : '',
        },

      ];
    },
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    const pricesRes = await this.$store.dispatch('user/fetchRaiseViewPrice', { type: 'usersTariff' });
    this.levelPrices = pricesRes?.result;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    switchLevel(i) {
      this.level = i;
    },
    switchPeriod(i) {
      this.period = i;
    },
    async showPaymentModal() {
      if (!this.levelPrices) return;

      const levelPrice = this.levelPrices[TariffByIndex[this.level]][this.period];
      const promotionAddress = process.env.WORKNET_PROMOTION;
      const tokenAddress = process.env.WORKNET_WUSD_TOKEN;

      new Promise(async (resolve, reject) => {
        this.SetLoader(true);
        await this.$store.dispatch('wallet/fetchWalletData', {
          method: 'balanceOf',
          address: this.userWalletAddress,
          abi: ERC20,
          token: tokenAddress,
          symbol: TokenSymbols.WUSD,
        });
        if (new BigNumber(this.balanceData.WUSD.fullBalance).isLessThan(levelPrice)) {
          this.ShowToast(`${this.$t('errors.transaction.notEnoughFunds')} (${TokenSymbols.WUSD})`);
          this.SetLoader(false);
          reject();
          return;
        }
        await this.MakeApprove({
          tokenAddress,
          contractAddress: promotionAddress,
          amount: levelPrice,
          approveTitle: `${this.$t('meta.raiseViews')} ${this.$t('meta.approve')}`,
        }).then(async () => {
          await resolve();
        }).catch((err) => {
          this.SetLoader(false);
          reject(err);
        });
      }).then(async () => {
        const data = [this.level, RaiseViewTariffPeriods.usersTariff[this.period]];
        const [feeRes] = await Promise.all([
          this.$store.dispatch('wallet/getContractFeeData', {
            method: 'promoteUser',
            abi: WQPromotion,
            contractAddress: promotionAddress,
            data,
          }),
          this.$store.dispatch('wallet/getBalance'),
          this.$store.dispatch('wallet/fetchWalletData', {
            method: 'balanceOf',
            address: this.userWalletAddress,
            abi: ERC20,
            token: tokenAddress,
            symbol: TokenSymbols.WUSD,
          }),
        ]);
        this.SetLoader(false);
        if (!feeRes.ok) {
          this.ShowToast(feeRes.msg);
          return;
        }
        this.ShowModal({
          key: modals.transactionReceipt,
          title: this.$t('meta.raiseViews'),
          isShowSuccess: this.mode === 'raise',
          fields: {
            from: { name: this.$t('meta.fromBig'), value: this.$store.getters['user/getUserWalletAddress'] },
            to: { name: this.$t('meta.toBig'), value: promotionAddress },
            amount: { name: this.$t('modals.amount'), value: levelPrice, symbol: TokenSymbols.WUSD },
            fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee.toString(), symbol: TokenSymbols.WQT },
          },
          submitMethod: async () => {
            const res = await this.$store.dispatch('quests/promote', { method: 'promoteUser', data });
            if (!res.ok) {
              this.ShowToast(res.msg);
              return;
            }
            this.ShowModal({
              key: modals.status,
              img: res.ok ? require('~/assets/img/ui/questAgreed.svg') : require('~/assets/img/ui/error.svg'),
              title: res.ok ? this.$t('modals.yourLevelHasBeenRaised') : this.$t('modals.errors.error'),
              callback: res.ok
                ? () => {
                  if (window.history.length > 2) this.$router.go(-1);
                  else this.$router.push(Path.PROFILE);

                  this.$store.dispatch('user/getUserData');
                } : '',
            });
            this.SetLoader(false);
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.raise {
  max-width: 1180px;
  display: flex;
  margin: 20px auto 0 auto;
  &__submit {
    width: 200px;
  }
}

@include _1199 {
  .raise {
    padding: 0 10px;
  }
}
</style>
