<template>
  <div
    class="auction-card"
    :class="{'auction-card_completed': isCompleted}"
  >
    <template v-if="!isCompleted">
      <h3 class="auction-card__price">
        {{
          $t('auction.card.lotAmount', {
            amount: $options.LotsStatuses.STARTED === typeOfLot
              ? lot._collateral
              : lot._liquidityValue,
            symbol: lot.symbol
          })
        }}
      </h3>
      <p class="auction-card__text">
        {{ $t('auction.card.lotPrice', {price: lot._price}) }}
      </p>
      <p class="auction-card__text">
        {{ $t('auction.card.feeIncluded', { feePercent: 13 }) }}
      </p>
      <p
        v-if="typeOfLot === $options.LotsStatuses.INACTIVE"
        class="auction-card__duration"
      >
        {{ $moment(lot.createdAt).format('MMMM Do YYYY, hh:mm a') }}
      </p>
      <p
        v-else
        class="auction-card__duration"
      >
        {{ $t('auction.card.timeLeft') }}
        {{ auctionDuration.days ? $tc('meta.units.days', DeclOfNum(auctionDuration.days), { count: auctionDuration.days }) : '' }}
        {{ auctionDuration.hours ? $tc('meta.units.hours', DeclOfNum(auctionDuration.hours ), { count: auctionDuration.hours }) : '' }}
        {{ auctionDuration.minutes ? $tc('meta.units.minutes', DeclOfNum(auctionDuration.minutes), { count: auctionDuration.minutes }) : '' }}
      </p>
      <base-btn
        data-selector="ACTION-AUCTION"
        @click="handleLotAction"
      >
        {{ $options.LotsStatuses.INACTIVE === typeOfLot ? $t('meta.btns.init') : $t('meta.btns.buy') }}
      </base-btn>
    </template>
    <template v-else>
      <div
        v-for="field in completedLotFields"
        :key="`${field.title}-${lot.id}`"
        class="auction-card__field"
      >
        <h3 class="auction-card__field-title">
          {{ field.title }}
        </h3>
        <p
          v-if="!field.link"
          class="auction-card__field-value"
        >
          {{ field.value }}
        </p>
        <a
          v-else
          class="auction-card__field-value auction-card__field-link"
          :href="field.link"
          target="_blank"
        >
          {{ CutTxn(field.value) }}
        </a>
      </div>
    </template>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapActions, mapGetters } from 'vuex';
import { ExplorerUrl, TokenSymbols } from '~/utils/enums';
import { getContractFeeData, sendWalletTransaction } from '~/utils/wallet';
import { WQAuction } from '~/abi';

const LotsStatuses = {
  INACTIVE: 0,
  STARTED: 1,
  BOUGHT: 2,
  CANCELED: 3,
};

export default {
  name: 'AuctionCard',
  LotsStatuses,
  props: {
    lot: {
      type: Object,
      default: () => {},
    },
    typeOfLot: {
      type: Number,
      default: LotsStatuses.STARTED,
    },
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      walletAddress: 'user/getUserWalletAddress',
      balanceData: 'wallet/getBalanceData',
    }),
    isCompleted() {
      return this.typeOfLot === LotsStatuses.BOUGHT;
    },
    /**
     * @property lotBuyed
     * @property buyerInfo - information about the completed purchase
     * @property userWallet
     * @returns {[{link: string, title: VueI18n.TranslateResult, value: *},{link: string, title: VueI18n.TranslateResult, value: *},{link: boolean, title: VueI18n.TranslateResult, value: string},{link: boolean, title: VueI18n.TranslateResult, value: string},{link: boolean, title: VueI18n.TranslateResult, value: string},null]|*[]}
     */
    completedLotFields() {
      const {
        lotBuyed,
        symbol,
        userWallet,
      } = this.lot;

      if (!lotBuyed && !lotBuyed.length) return [];

      const {
        cost,
        buyer,
        amount,
        timestamp,
        transactionHash,
      } = lotBuyed[0];

      const buyerConverted = this.convertToBech32('wq', buyer);
      const userWalletConverted = this.convertToBech32('wq', userWallet);

      const lotDecimals = this.balanceData[symbol].decimals;
      const lotAmount = new BigNumber(amount).shiftedBy(-lotDecimals).toFixed(4, 1);
      const lotPrice = new BigNumber(cost).shiftedBy(-18).toFixed(4, 1);

      return [
        {
          title: this.$t('auction.card.completed.lotBuyer'),
          value: buyerConverted,
          link: `${ExplorerUrl}/address/${buyerConverted}`,
        },
        {
          title: this.$t('auction.card.completed.lotProvider'),
          value: userWalletConverted,
          link: `${ExplorerUrl}/address/${userWalletConverted}`,
        },
        {
          title: this.$t('auction.card.completed.lotAmount'),
          value: `${lotAmount} ${symbol}`,
          link: false,
        },
        {
          title: this.$t('auction.card.completed.lotPrice'),
          value: `${lotPrice} ${TokenSymbols.WUSD}`,
          link: false,
        },
        {
          title: this.$t('auction.card.completed.endPeriod'),
          value: this.$moment(timestamp * 1000).format('MMMM Do YYYY, hh:mm a'),
          link: false,
        },
        {
          title: this.$t('auction.card.completed.txHash'),
          value: transactionHash,
          link: `${ExplorerUrl}/tx/${transactionHash}`,
        },
      ];
    },
    url() {
      return `${ExplorerUrl}/address/${this.lot.userWallet}`;
    },
    auctionDuration() {
      const started = this.$moment(this.lot.createdAt);
      let durationInSec = this.$moment().diff(started) / 1000;
      const returnedValue = {};
      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(86400)) {
        returnedValue.days = new BigNumber(durationInSec).dividedToIntegerBy(86400).toFixed();
        durationInSec -= new BigNumber(86400).multipliedBy(returnedValue.days).toFixed();
      }
      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(3600)) {
        returnedValue.hours = new BigNumber(durationInSec).dividedToIntegerBy(3600).toFixed();
        durationInSec -= new BigNumber(3600).multipliedBy(returnedValue.hours).toFixed();
      }
      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(60)) {
        returnedValue.minutes = new BigNumber(durationInSec).dividedToIntegerBy(60).toFixed();
      }
      return returnedValue;
    },
    contractAddress() {
      return {
        [TokenSymbols.BNB]: this.ENV.WORKNET_BNB_AUCTION,
        [TokenSymbols.ETH]: this.ENV.WORKNET_ETH_AUCTION,
        [TokenSymbols.USDT]: this.ENV.WORKNET_USDT_AUCTION,
        [TokenSymbols.USDC]: this.ENV.WORKNET_USDC_AUCTION,
      }[this.lot.symbol];
    },
  },
  methods: {
    ...mapActions({
      calcFeeSetTokenPrices: 'oracle/feeSetTokensPrices',
      setTokenPrices: 'oracle/setCurrentPriceTokens',
    }),

    async handleLotAction() {
      if (!this.isAuth) {
        this.ShowToast(this.$t('messages.loginToContinue'));
        return;
      }
      this.SetLoader(true);

      let method = 'buyLot';
      let isContinue = true;
      const data = [this.lot.index];

      const needToStart = this.typeOfLot === LotsStatuses.INACTIVE;

      if (needToStart) {
        const [setTokensFeeRes] = await Promise.all([
          this.calcFeeSetTokenPrices(),
          this.$store.dispatch('wallet/getBalance'),
        ]);

        this.SetLoader(false);
        if (!setTokensFeeRes.ok) {
          this.ShowToast(setTokensFeeRes.msg, this.$t('toasts.error'));
          return;
        }

        method = 'startAuction';
        data.push(new BigNumber(this.lot.liquidityValue).shiftedBy(-12).toFixed(0));

        await this.ShowTxReceipt({
          title: this.$t('modals.updatePrices'),
          from: this.convertToBech32('wq', this.walletAddress),
          to: this.ENV.WORKNET_ORACLE,
          fee: setTokensFeeRes.result,
        }).then(async () => {
          this.SetLoader({ isLoading: true });
          await Promise.all([
            this.setTokenPrices(),
            this.$store.dispatch('wallet/getBalance'),
          ]);
        }).catch(() => {
          isContinue = false;
        }).finally(() => {
          this.SetLoader(false);
        });
      }

      if (!isContinue) {
        this.SetLoader(false);
        return;
      }

      const { ok, result: feeForMethod, msg } = await getContractFeeData(
        method,
        WQAuction,
        this.contractAddress,
        data,
      );

      this.SetLoader(false);
      if (!ok) {
        this.ShowToast(msg, this.$t('toasts.error'));
        return;
      }

      await this.ShowTxReceipt({
        title: needToStart ? this.$t('modals.titles.initializeLot') : this.$t('modals.titles.buyLot'),
        from: this.convertToBech32('wq', this.walletAddress),
        to: this.contractAddress,
        fee: { gas: feeForMethod.gasEstimate, gasPrice: feeForMethod.gasPrice },
      }).then(async () => {
        this.SetLoader({ isLoading: true });

        const { ok: isSuccess, msg: errorMsg } = await sendWalletTransaction(method, {
          abi: WQAuction,
          address: this.contractAddress,
          value: null,
          data,
        });
        // TODO need to fix response for sendWalletTransaction
        if (isSuccess === false) this.ShowModalFail({ subtitle: errorMsg });
        else this.ShowModalSuccess({});
      }).catch((e) => {
        this.ShowToast(e.msg);
      }).finally(() => {
        this.SetLoader(false);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.auction-card {
  background: #FFFFFF;
  border-radius: 6px;
  padding: 15px;
  &:hover {
    @include shadow;
  }
  &_completed {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 30px;
  }
  &__price {
    color: $blue;
    font-weight: 600;
    font-size: 25px;
    line-height: 130%;
    margin-bottom: 10px;
  }
  &__text {
    color: $black800;
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 10px;
  }
  &__duration {
    color: $black600;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    opacity: 0.4;
    margin-bottom: 30px;
  }
  &__field {
    &-title {
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
      color: $black800;
    }
    &-value {
      font-size: 16px;
      line-height: 130%;
      color: $black800;
      opacity: 0.5;
    }
    &-link {
      color: $blue;
      opacity: 1;
      width: fit-content;
    }
  }
}

@include _991 {
  .auction-card {
    padding: 10px;

    &_completed {
      grid-gap: 10px;
    }

    &__price {
      font-size: 20px;
    }
    &__fee-info {
      font-size: 13px;
    }
    &__duration {
      font-size: 12px;
    }

    &__field {
      &-title {
        font-size: 13px;
      }
      &-value {
        font-size: 13px;
      }
    }
  }
}

@include _380 {
  .auction-card_completed {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
