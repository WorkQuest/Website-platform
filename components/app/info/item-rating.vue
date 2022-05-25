<template>
  <div class="container__status status">
    <img
      v-if="isActiveRaiseView"
      src="~assets/img/ui/arrow-worker-profile.svg"
      alt="arrow-profile"
      class="status__img"
    >
    <span
      v-if="isQuestRating || ratingStr !== $options.Ratings.NO_STATUS"
      class="status__level"
      :class="styles"
    >
      {{ statusTitle }}
    </span>
  </div>
</template>

<script>
import { UserRating, Ratings, RaiseViewStatus } from '~/utils/enums';

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
      type: Object,
      default: () => {
      },
    },
    isQuestRating: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    styles() {
      if (!this.isQuestRating) return `status__level_${this.ratingStr}`;
      return `status__level_${{
        0: 'topRanked',
        1: 'topRanked',
        2: 'reliable',
        3: 'verified',
      }[this.rating]}`;
    },
    ratingStr() {
      return UserRating[this.rating] || Ratings.NO_STATUS;
    },
    statusTitle() {
      if (!this.isQuestRating) return this.rating !== null ? this.$t(`rating.${this.ratingStr}.title`) : '';
      return this.$t(`quests.levels.${+this.rating + 1}.shortTitle`);
    },
    isActiveRaiseView() {
      return this.raiseView && RaiseViewStatus[this.raiseView.status];
    },
  },
};
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  align-items: center;

  &__levels {
    padding: 2px 5px;
    margin: 0 5px 0 0;
    align-items: center;
    border-radius: 3px;
  }

  &__img {
    margin-right: 12px;
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
