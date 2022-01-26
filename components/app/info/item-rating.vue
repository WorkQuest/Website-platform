<template>
  <div class="container__status status">
    <span
      v-if="rating !== 'noStatus'"
      class="status__level"
      :class="`status__level_${rating}`"
    >
      {{ $t(`rating.${rating}.title`) }}
    </span>
  </div>
</template>

<script>

export default {
  name: 'ItemRating',
  props: {
    rating: {
      type: String,
      default: 'noStatus',
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

    &_topRanked {
      @extend .status__levels;
      background-color: #F6CF00;
    }

    &_verified {
      @extend .status__levels;
      background-color: #BBC0C7;
    }

    &_reliable {
      @extend .status__levels;
      background-color: #B79768;
    }

    &_noStatus {
      display: none;
    }
  }
}
</style>
