<template>
  <div
    class="auction-card"
    :class="{'auction-card_completed':isCompleted}"
  >
    <template v-if="!isCompleted">
      <h3 class="auction-card__price">
        {{ auction.price }}
        {{ auction.currency }}
      </h3>
      <p class="auction-card__fee-info">
        <template v-if="auction.isFeeIncluded">
          {{ $t('auction.card.feeIncluded', { feePercent: auction.feePercent }) }}
        </template>
        <template v-else>
          {{ $t('auction.card.feeNotIncluded', { feePercent: auction.feePercent }) }}
        </template>
      </p>
      <p class="auction-card__duration">
        {{ $t('auction.card.auctionDuration') }}
        {{ auctionDuration.days ? $t('auction.card.days',{ n: auctionDuration.days }) : '' }}
        {{ auctionDuration.hours ? $t('auction.card.hours',{ n: auctionDuration.hours }) : '' }}
        {{ auctionDuration.minutes ? $t('auction.card.minutes',{ n: auctionDuration.minutes }) : '' }}
      </p>
      <base-btn
        @click="openModalBuyAuction"
      >
        {{ $t('auction.card.buy') }}
      </base-btn>
    </template>
    <template v-else>
      <div
        v-for="field in completedAuctionFields"
        :key="`${auction.txHash}-${field.fieldName}`"
        class="auction-card__field"
      >
        <h3 class="auction-card__field-title">
          {{ field.title }}
        </h3>
        <a
          v-if="field.fieldName === 'sender' || field.fieldName === 'txHash'"
          class="auction-card__field-value auction-card__field-link"
          :href="`https://etherscan.io/${field.fieldName === 'sender' ? 'address' : 'tx'}/${auction[field.fieldName]}`"
          target="_blank"
        >
          {{ `${auction[field.fieldName].substr(0,7)}...${auction[field.fieldName].substr(auction[field.fieldName].length - 4,4)}` }}
        </a>
        <p
          v-if="field.fieldName === 'lotSize'"
          class="auction-card__field-value"
        >
          {{ auction[field.fieldName] }} {{ auction.lotSizeCurrency }}
        </p>
        <p
          v-if="field.fieldName === 'price'"
          class="auction-card__field-value"
        >
          {{ auction[field.fieldName] }} {{ auction.priceCurrency }}
        </p>
        <p
          v-if="field.fieldName === 'timestamp'"
          class="auction-card__field-value"
        >
          {{ new Date(auction[field.fieldName] * 1000).toLocaleDateString($i18n.locale) }}
        </p>
        <p
          v-if="field.fieldName === 'type'"
          class="auction-card__field-value"
        >
          {{ auction[field.fieldName] }}
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  name: 'AuctionCard',
  props: {
    auction: {
      type: [Object, undefined],
      default: undefined,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    auctionDuration() {
      let durationInSec = this.auction.endsIn - this.auction.startTime;
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
        // durationInSec -= new BigNumber(60).multipliedBy(returnedValue.minutes).toFixed();   IF NEEDED TO CONTINUE TO SECs
      }
      return returnedValue;
    },
    completedAuctionFields() {
      return [
        {
          title: this.$t('auction.card.completed.type'),
          fieldName: 'type',
        },
        {
          title: this.$t('auction.card.completed.sender'),
          fieldName: 'sender',
        },
        {
          title: this.$t('auction.card.completed.lotSize'),
          fieldName: 'lotSize',
        },
        {
          title: this.$t('auction.card.completed.price'),
          fieldName: 'price',
        },
        {
          title: this.$t('auction.card.completed.timestamp'),
          fieldName: 'timestamp',
        },
        {
          title: this.$t('auction.card.completed.txHash'),
          fieldName: 'txHash',
        },
      ];
    },
  },
  methods: {
    openModalBuyAuction() {
      alert('buy');
    },
  },
};
</script>

<style scoped lang="scss">
.auction-card {
  background: #FFFFFF;
  border-radius: 6px;
  padding: 15px;
  &_completed {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;
  }
  &__price {
    color: $blue;
    font-weight: 600;
    font-size: 25px;
    line-height: 130%;
    margin-bottom: 10px;
  }
  &__fee-info {
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
    }
  }
}
</style>
