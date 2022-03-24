<template>
  <div class="container__status status">
    <img
      v-if="raiseView"
      src="~assets/img/ui/arrow-worker-profile.svg"
      alt="Enable2FA"
      class="transaction__image"
    >
    <span
      v-if="ratingStr !== $options.Ratings.NO_STATUS"
      class="status__level"
      :class="`status__level_${ratingStr}`"
    >
      {{ statusTitle }}
    </span>
  </div>
</template>

<script>
import { UserRating, Ratings } from '~/utils/enums';

export default {
  name: 'ItemRating',
  UserRating,
  Ratings,
  props: {
    rating: {
      type: Number,
      default: null,
    },
    raiseView: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ratingStr() {
      return UserRating[this.rating] || Ratings.NO_STATUS;
    },
    statusTitle() {
      return this.rating !== null ? this.$t(`rating.${this.ratingStr}.title`) : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__levels {
    padding: 2px 5px;
    margin: 0 5px 0 0;
    align-items: center;
    border-radius: 3px;
  }
  &__level {
    @include text-simple;
    font-weight: 500;
    color: $white;
    font-size: 12px;
    line-height: 130%;
    height: 20px;
    text-transform: uppercase;
    width: max-content;
    display: flex;
    justify-content: center;

    &_topRanked {
      @extend .status__levels;
      background-color: $yellow100;
    }

    &_verified {
      @extend .status__levels;
      background-color: $brown;
    }

    &_reliable {
      @extend .status__levels;
      background-color: $grey200;
    }

    &_noStatus {
      display: none;
    }
  }
}
@include _991 {
  .status__levels {
    margin: 0;
  }
}
</style>
