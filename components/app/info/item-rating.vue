<template>
  <div class="container__status status">
    <span
      v-if="rating >= 0 && rating !== 3"
      class="status__level"
      :class="`status__level_${$options.UserRating[rating]}`"
    >
      {{ statusTitle }}
    </span>
  </div>
</template>

<script>
import { UserRating } from '~/utils/enums';

export default {
  name: 'ItemRating',
  UserRating,
  props: {
    rating: {
      type: Number,
      default: null,
    },
  },
  computed: {
    statusTitle() {
      return this.rating !== null ? this.$t(`rating.${UserRating[this.rating]}.title`) : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.status {
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
    width: auto;
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
