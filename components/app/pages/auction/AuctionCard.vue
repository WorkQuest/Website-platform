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
    <template v-else>
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
        {{ durationTime.days ? $tc('meta.units.days', DeclOfNum(durationTime.days), {count: durationTime.days}) : '' }}
        {{ durationTime.hours ? $tc('meta.units.hours', DeclOfNum(durationTime.hours), {count: durationTime.hours}) : '' }}
        {{ durationTime.minutes ? $tc('meta.units.minutes', DeclOfNum(durationTime.minutes), {count: durationTime.minutes}) : '' }}
        {{ durationTime.seconds ? $tc('meta.units.seconds', DeclOfNum(durationTime.seconds), {count: durationTime.seconds}) : '' }}
      </p>
      <base-btn
        data-selector="ACTION-AUCTION"
        @click="handleLotAction"
      >
        {{ $options.LotsStatuses.INACTIVE === typeOfLot ? $t('meta.btns.init') : $t('meta.btns.buy') }}
      </base-btn>
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

const LotsStatuses = {
  INACTIVE: 0,
  STARTED: 1,
  BOUGHT: 2,
  CANCELED: 3,
};

const LOWER_BOUND_COST = {
  develop: 0.999,
  testnet: 0.999,
  master: 0.999,
}[process.env.BRANCH];

const UPPER_BOUND_COST = {
  develop: 1.01,
  testnet: 1.01,
  master: 1.01,
}[process.env.BRANCH];

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
    url() {
      return `${ExplorerUrl}/address/${this.lot.userWallet}`;
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
    this.intervalId = setInterval(() => {
      if (this.typeOfLot === LotsStatuses.STARTED) {
        const { auctionStarted } = this.lot;
        const { endCost, amount } = auctionStarted[0];
        this.calcStartedLotPrice(symbol, endCost, amount);
      }
      this.calcDurationTime(this.willFinish);
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    ...mapActions({
      calcFeeSetTokenPrices: 'oracle/feeSetTokensPrices',
      setTokenPrices: 'oracle/setCurrentPriceTokens',
    }),

    calcDurationTime(willFinish) {
      const now = this.$moment();
      let durationInSec = this.$moment(willFinish).diff(now) / 1000;

      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(86400)) {
        this.durationTime.days = new BigNumber(durationInSec).dividedToIntegerBy(86400).toFixed();
        durationInSec -= new BigNumber(86400).multipliedBy(this.durationTime.days).toFixed();
      }

      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(3600)) {
        this.durationTime.hours = new BigNumber(durationInSec).dividedToIntegerBy(3600).toFixed();
        durationInSec -= new BigNumber(3600).multipliedBy(this.durationTime.hours).toFixed();
      }

      if (new BigNumber(durationInSec).isGreaterThanOrEqualTo(60)) {
        this.durationTime.minutes = new BigNumber(durationInSec).dividedToIntegerBy(60).toFixed();
        durationInSec -= new BigNumber(60).multipliedBy(this.durationTime.minutes).toFixed();
      }

      this.durationTime.seconds = Math.ceil(durationInSec);
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
      this.startedLotPrice = new BigNumber(finalPrice).multipliedBy(_amount).toFixed(4, 1);
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
          this.$store.dispatch('wallet/getBalance'),
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
            this.$store.dispatch('wallet/getBalance'),
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

        const { ok: isSuccess, msg: errorMsg } = await sendWalletTransaction(method, {
          abi: WQAuction,
          address: this.contractAddress,
          value: null,
          data,
        });
        // TODO need to fix response for sendWalletTransaction
        if (isSuccess === false) this.ShowModalFail({ subtitle: errorMsg });
        else this.ShowModalSuccess({});
      }).catch(() => {
        console.log('User rejected method.');
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
