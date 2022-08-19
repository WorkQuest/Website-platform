<template>
  <fieldset class="rating">
    <div
      v-if="isDisabled && starsNumber"
      class="checked__group"
    >
      <img
        v-for="(star, i) in starsNumber"
        :key="i + 1"
        class="checked__star"
        :src="i + 1 <= rating ? require('assets/img/ui/star.svg') : require('assets/img/ui/star-empty.svg')"
        alt=""
      >
    </div>
    <div
      v-else
      class="rating__group"
    >
      <input
        v-for="(star, i) in starsNumber"
        :id="`star-${i + 1}`"
        :key="i + 1"
        :class="fillStars(i + 1)"
        :checked="(i + 1) === rating"
        :aria-label="`«${i + 1}»`"
        :data-selector="`STAR-RATING-STAR-${i}`"
        type="radio"
        name="rating"
        :disabled="isDisabled"
        @click="$emit('input', i + 1)"
      >
    </div>
  </fieldset>
</template>
<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: Number,
      default: 0,
    },
    starsNumber: {
      type: Number,
      default: 0,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      starRating: this.rating,
    };
  },
  methods: {
    fillStars(i) {
      if (i <= this.rating && this.isDisabled) return 'rating__star rating__star_checked';
      if (!this.isDisabled || this.rating === 0) return 'rating__star rating__star-hover';
      return 'rating__star';
    },
  },
};
</script>

<style lang="scss" scoped>
.rating {
  margin: 0;
  padding: 0;
  border: none;
  &__group {
    position: relative;
    width: 6em;
    height: 1.2em;
    background-image: url('assets/img/ui/star-empty.svg');
    background-size: 1.2em auto;
    background-repeat: repeat-x;
  }
  &__star {
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
    width: 1.2em;
    height: 1.2em;
    background-size: 1.2em auto;
    background-repeat: repeat-x;
    font-size: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    &-hover {
      &:checked, &:hover {
        background-image: url('assets/img/ui/star.svg');
        cursor: pointer;
      }
      &:hover ~ .rating__star {
        background-image: url('assets/img/ui/star-empty.svg');
        cursor: pointer;
      }
    }
    &:nth-of-type(1) {
      z-index: 5;
      width: 1.2em;
    }
    &:nth-of-type(2) {
      z-index: 4;
      width: 2.4em;
    }
    &:nth-of-type(3) {
      z-index: 3;
      width: 3.6em;
    }
    &:nth-of-type(4) {
      z-index: 2;
      width: 4.8em;
    }
    &:nth-of-type(5) {
      z-index: 1;
      width: 6em;
    }
    &:focus {
      outline: none;
    }
    &:focus ~ .rating__focus {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      outline: solid 0.2em $blue;
      outline-offset: 0.2em;
    }
    &_checked {
      background-image: url('assets/img/ui/star.svg');
    }
  }
}
.checked {
  &__group {
    display: flex;
    height: 1.2em;
  }
  &__star {
    width: 1.2em;
    height: 1.2em;
  }
}
</style>
