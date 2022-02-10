<template>
  <ul class="rating-area">
    <li
      v-for="(star,index) in starsNumber"
      :key="index"
      class="rating-area__star"
      :class="getStarStyles"
    >
      <input
        :id="`${ratingType}-star-${questIndex}-${starsNumber-index}`"
        type="radio"
        name="rating"
        :checked="(starsNumber-index)===rating"
        @click="$emit('input', starsNumber-index)"
      >
      <label
        :for="`${ratingType}-star-${questIndex}-${starsNumber-index}`"
        :title="`«${starsNumber-index}»`"
        class="rating-area__star-label"
        :class="fillGoldenStars(index)"
      />
    </li>
  </ul>
</template>
<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: Number,
      default: 0,
    },
    ratingType: {
      type: String,
      default: '',
    },
    starsNumber: {
      type: Number,
      default: 0,
    },
    questIndex: {
      type: Number,
      default: 0,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getStarStyles() {
      return [
        { disabled: this.isDisabled },
      ];
    },
  },
  methods: {
    fillGoldenStars(index) {
      return (this.starsNumber - index) <= this.rating ? 'rating-area__star-label_golden' : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.rating-area {
  overflow: hidden;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  height: 24px;
  &__star > input {
    display: none;
  }
  &__star-label {
    float: right;
    padding: 0;
    cursor: pointer;
    font-size: 25px;
    line-height: 25px;
    color: lightgrey;
    text-shadow: 1px 1px #bbb;
    &_golden {
      color: gold;
    }
  }
  &__star > label:before {
    content: '★';
  }
  &__star:hover > label {
    color: gold;
  }
  &__star:hover ~ &__star > label {
    color: gold;
    text-shadow: 1px 1px goldenrod;
  }
}
.disabled {
  pointer-events: none;
}
@include _575 {
  .rating-area__star-label {
      font-size: 20px;
    }
}
</style>
