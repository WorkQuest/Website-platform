<template>
  <div
    class="auction-card"
    :class="{'auction-card_completed':isCompleted}"
  >
    <template v-if="!isCompleted">
      <h3 class="auction-card__price">
        {{ $t('auction.card.lotAmount', {amount: lot._collateral, symbol: lot.symbol}) }}
      </h3>
      <p class="auction-card__text">
        {{ $t('auction.card.lotPrice', {price: lot._price}) }}
      </p>
      <p class="auction-card__text">
        {{ $t('auction.card.feeIncluded', { feePercent: 13 }) }}
      </p>
      <p class="auction-card__duration">
        {{ $t('auction.card.timeLeft') }}
        {{ auctionDuration.days ? $tc('meta.units.days', DeclOfNum(auctionDuration.days), { count: auctionDuration.days }) : '' }}
        {{ auctionDuration.hours ? $tc('meta.units.hours', DeclOfNum(auctionDuration.hours ), { count: auctionDuration.hours }) : '' }}
        {{ auctionDuration.minutes ? $tc('meta.units.minutes', DeclOfNum(auctionDuration.minutes), { count: auctionDuration.minutes }) : '' }}
      </p>
      <base-btn
        data-selector="BUY-AUCTION"
        @click="openModalBuyAuction"
      >
        {{ $t('meta.btns.buy') }}
      </base-btn>
    </template>
    <template v-else>
      <div
        v-for="field in lotFields"
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
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { ExplorerUrl } from '~/utils/enums';

export default {
  name: 'AuctionCard',
  props: {
    lot: {
      type: Object,
      default: () => {},
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
    }),
    /**
     * @property lotBuyed
     * @property buyer
     * @property userWallet
     * @returns {[{link: string, title: VueI18n.TranslateResult, value: *},{link: string, title: VueI18n.TranslateResult, value: *},{link: boolean, title: VueI18n.TranslateResult, value: string},{link: boolean, title: VueI18n.TranslateResult, value: string},{link: boolean, title: VueI18n.TranslateResult, value: string},null]|*[]}
     */
    lotFields() {
      if (!this.lot.lotBuyed) return [];
      const buyerInfo = this.lot.lotBuyed[0];
      return [
        {
          title: this.$t('auction.card.completed.lotBuyer'),
          value: buyerInfo.buyer,
          link: `${ExplorerUrl}/address/${buyerInfo.buyer}`,
        },
        {
          title: this.$t('auction.card.completed.lotProvider'),
          value: this.lot.userWallet,
          link: `${ExplorerUrl}/address/${this.lot.userWallet}`,
        },
        {
          title: this.$t('auction.card.completed.lotAmount'),
          value: `${this.lot._collateral} ${this.lot.symbol}`,
          link: false,
        },
        {
          title: this.$t('auction.card.completed.lotPrice'),
          value: `${this.lot._price} WUSD`,
          link: false,
        },
        {
          title: this.$t('auction.card.completed.endPeriod'),
          value: this.$moment(buyerInfo.timestamp * 1000).format('MMMM Do YYYY, hh:mm a'),
          link: false,
        },
        {
          title: this.$t('auction.card.completed.txHash'),
          value: buyerInfo.transactionHash,
          link: `${ExplorerUrl}/tx/${buyerInfo.transactionHash}`,
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
  },
  methods: {
    openModalBuyAuction() {
      if (!this.isAuth) {
        this.ShowToast(this.$t('messages.loginToContinue'));
        return;
      }
      this.ShowModal({
        key: modals.buyAuction,
        auction: this.auction,
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
      color: #000;
    }
    &-value {
      font-size: 16px;
      line-height: 130%;
      color: #000;
      opacity: 0.5;
    }
    &-link {
      color: $blue;
      opacity: 1;
      display: block;
    }
  }
}
@include _767 {
  .auction-card {
    padding: 10px;

    &_completed {
      grid-template-columns: repeat(3, 1fr);
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
</style>
