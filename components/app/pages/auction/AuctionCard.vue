<template>
  <div
    class="auction-card"
    :class="{'auction-card_completed': isCompleted}"
  >
    <template v-if="isCompleted">
      <div
        v-for="field in completedLotFields"
        :key="`${field.title}-${lot.id}`"
        class="auction-card__field"
      >
        <h3 class="auction-card__field-title">
          {{ field.title }}
        </h3>
        <a
          v-if="field.link"
          class="auction-card__field-value auction-card__field-link"
          :href="field.link"
          target="_blank"
        >
          {{ CutTxn(field.value) }}
        </a>
        <p
          v-else
          class="auction-card__field-value"
        >
          {{ field.value }}
        </p>
      </div>
    </template>
    <template v-else-if="!isStartedLotCompleted">
      <h3 class="auction-card__price">
        {{
          $t('auction.card.lotAmount', {
            amount: $options.LotsStatuses.STARTED === typeOfLot
              ? startedLotAmount
              : lot._liquidityValue,
            symbol: lot.symbol
          })
        }}
      </h3>
      <p class="auction-card__text">
        {{
          $t('auction.card.lotPrice', {
            price: $options.LotsStatuses.STARTED === typeOfLot
              ? startedLotPrice
              : lot._price
          })
        }}
      </p>
      <p
        v-if="typeOfLot === $options.LotsStatuses.STARTED"
        class="auction-card__text"
      >
        {{ $t('auction.card.rewardIncluded', {rewardPercent: 3}) }}
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
        {{ durationTime.days }}
        {{ durationTime.hours }}
        {{ durationTime.minutes }}
        {{ durationTime.seconds }}
      </p>
      <base-btn
        data-selector="ACTION-AUCTION"
        @click="handleLotAction"
      >
        {{ $options.LotsStatuses.INACTIVE === typeOfLot ? $t('meta.btns.init') : $t('meta.btns.buy') }}
      </base-btn>
    </template>
    <template v-else>
      <div class="auction-card_started-lot-completed">
        {{ $t('meta.completed') }}
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
import walletOperations from '~/plugins/mixins/walletOperations';
import { LotsStatuses, LOWER_BOUND_COST, UPPER_BOUND_COST } from '~/utils/сonstants/auction';

export default {
  name: 'AuctionCard',
  LotsStatuses,
  mixins: [walletOperations],
  props: {
    lot: {
      type: Object,
      default: () => {
      },
    },
    typeOfLot: {
      type: Number,
      default: LotsStatuses.STARTED,
    },
  },
  data() {
    return {
      startedLotPrice: null,
      intervalId: null,
      durationTime: {
        days: '',
        hours: '',
        minutes: '',
        seconds: '',
      },
      isStartedLotCompleted: false,
    };
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      walletAddress: 'user/getUserWalletAddress',
      balanceData: 'wallet/getBalanceData',
      duration: 'auction/getDuration',
    }),
    isCompleted() {
      return this.typeOfLot === LotsStatuses.BOUGHT;
    },
    completedLotFields() {
      const {
        symbol,
        userWallet,
        lotAmount,
        lotPrice,
        buyer,
        timestamp,
        transactionHash,
      } = this.lot;

      const buyerConverted = this.convertToBech32('wq', buyer);
      const userWalletConverted = this.convertToBech32('wq', userWallet);

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
          // TODO Дождаться Васю, я не должен в итоговую сумму лота прибавлять 3%
          value: `${new BigNumber(lotAmount).multipliedBy(1.03).toFixed(4, 1)} ${symbol}`,
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
    startedLotAmount() {
      const { auctionStarted, symbol } = this.lot;
      if (this.typeOfLot !== LotsStatuses.STARTED || !auctionStarted?.length) {
        return { lotAmount: '' };
      }
      // amount - its amount of collateral token on liquidation
      const { amount } = auctionStarted[0];

      const lotDecimals = this.balanceData[symbol].decimals;
      return Number(new BigNumber(amount).shiftedBy(-lotDecimals).multipliedBy(1.03).toFixed(4, 1));
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
  /**
   * @property auctionStarted - info about started lot
   */
  mounted() {
    if (this.typeOfLot !== LotsStatuses.STARTED) return;
    const { symbol } = this.lot;
    this.willFinish = this.$moment(this.lot.auctionStarted[0].timestamp * 1000).add(this.duration[symbol], 'seconds');

    this.runCalculating();
    this.intervalId = setInterval(() => {
      this.runCalculating();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    ...mapActions({
      calcFeeSetTokenPrices: 'oracle/feeSetTokensPrices',
      setTokenPrices: 'oracle/setCurrentPriceTokens',

      setCallback: 'auction/setCallbackWS',
      getBalance: 'wallet/getBalance',
    }),

    runCalculating() {
      if (this.typeOfLot === LotsStatuses.STARTED) {
        const { auctionStarted, symbol } = this.lot;
        const { endCost, amount } = auctionStarted[0];
        this.calcStartedLotPrice(symbol, endCost, amount);
      }
      this.calcDurationTime(this.willFinish);
    },

    calcDurationTime(willFinish) {
      const now = this.$moment();
      let durationInSec = this.$moment(willFinish).diff(now) / 1000;

      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(86400)) {
        const days = new BigNumber(durationInSec).dividedToIntegerBy(86400).toFixed();
        this.durationTime.days = days ? this.$tc('meta.units.days', this.DeclOfNum(days), { count: days }) : '';
        durationInSec -= new BigNumber(86400).multipliedBy(days).toFixed();
      }

      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(3600)) {
        const hours = new BigNumber(durationInSec).dividedToIntegerBy(3600).toFixed();
        this.durationTime.hours = hours ? this.$tc('meta.units.hours', this.DeclOfNum(hours), { count: hours }) : '';
        durationInSec -= new BigNumber(3600).multipliedBy(hours).toFixed();
      }

      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(60)) {
        const minutes = new BigNumber(durationInSec).dividedToIntegerBy(60).toFixed();
        this.durationTime.minutes = minutes ? this.$tc('meta.units.minutes', this.DeclOfNum(minutes), { count: minutes }) : '';
        durationInSec -= new BigNumber(60).multipliedBy(minutes).toFixed();
      }

      const seconds = Math.ceil(durationInSec);
      this.durationTime.seconds = seconds && seconds > 0 ? this.$tc('meta.units.seconds', this.DeclOfNum(seconds), { count: seconds }) : '';
    },

    calcStartedLotPrice(symbol, endCost, amount) {
      //              a
      // (lot.endPrice * lowerBoundCost) / 1e18 +
      //               b                                            c
      // ((lot.endTime - block.timestamp) * (upperBoundCost - lowerBoundCost) * lot.endPrice) / auctionDuration / 1e18;
      const a = new BigNumber(endCost).multipliedBy(LOWER_BOUND_COST).shiftedBy(-18).toString();

      const b = new BigNumber(this.willFinish?.unix()).minus(this.$moment().unix()).toString();

      const c = new BigNumber(UPPER_BOUND_COST).minus(LOWER_BOUND_COST).multipliedBy(endCost).toString();

      const d = new BigNumber(b).multipliedBy(c).dividedBy(this.duration[symbol]).shiftedBy(-18)
        .toString();

      const finalPrice = new BigNumber(a).plus(d);
      const lotDecimals = this.balanceData[symbol].decimals;
      const _amount = new BigNumber(amount).shiftedBy(-lotDecimals).toString();
      const lotPrice = new BigNumber(finalPrice).multipliedBy(_amount).toFixed(4, 1);

      if (new BigNumber(lotPrice).isGreaterThan(0)) this.startedLotPrice = lotPrice;
      else {
        this.isStartedLotCompleted = true;
        clearInterval(this.intervalId);
      }
    },

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
          this.getBalance(),
        ]);

        this.SetLoader(false);
        if (!setTokensFeeRes.ok) {
          this.ShowToast(setTokensFeeRes.msg, this.$t('toasts.error'));
          return;
        }

        method = 'startAuction';
        const lotDecimals = +(this.balanceData[this.lot.symbol].decimals) === 6 ? 12 : 0;
        data.push(new BigNumber(this.lot.liquidityValue).shiftedBy(-lotDecimals).toFixed(0));

        await this.ShowTxReceipt({
          title: this.$t('modals.updatePrices'),
          from: this.convertToBech32('wq', this.walletAddress),
          to: this.ENV.WORKNET_ORACLE,
          fee: setTokensFeeRes.result,
        }).then(async () => {
          this.SetLoader({ isLoading: true });
          await Promise.all([
            this.setTokenPrices(),
            this.getBalance(),
          ]);
        }).catch(() => {
          isContinue = false;
        }).finally(() => {
          this.SetLoader(false);
        });
      } else {
        await this.MakeApprove({
          tokenAddress: this.ENV.WORKNET_WUSD_TOKEN,
          contractAddress: this.ENV.WORKNET_ROUTER,
          amount: this.startedLotAmount,
        }).then(() => { isContinue = true; });
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

        const { ok: isSuccess, msg: errorMsg, transactionHash } = await sendWalletTransaction(method, {
          abi: WQAuction,
          address: this.contractAddress,
          value: null,
          data,
        });
        // TODO need to fix response for sendWalletTransaction
        if (isSuccess === false) this.ShowModalFail({ subtitle: errorMsg });
        else {
          await this.setCallback(() => {
            this.SetLoader(false);
            this.ShowModalSuccess({
              link: `${ExplorerUrl}/tx/${transactionHash}`,
            });
          });
        }
      }).catch(() => {
        // User rejected method
      });
    },
  },
};
</script>

<style scoped lang="scss">
.auction-card {
  background: $white;
  border-radius: 6px;
  padding: 15px;

  &:hover {
    @include shadow;
  }

  &_started-lot-completed {
    display: flex;
    height: 195.69px;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    color: $black200;
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
