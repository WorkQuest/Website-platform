<template>
  <div class="container__status status">
    <span
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
    color: $white;
  }
  &__level {
    display: grid;
    grid-template-columns: 20px auto;
    grid-gap: 7px;
    font-size: 12px;
    justify-content: flex-start;
    align-items: center;
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
