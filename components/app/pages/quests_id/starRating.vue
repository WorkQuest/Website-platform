<template>
  <!--  <ul class="rating-area">-->
  <!--    <li-->
  <!--      v-for="(star,index) in starsNumber"-->
  <!--      :key="index"-->
  <!--      class="rating-area__star"-->
  <!--      :class="getStarStyles"-->
  <!--    >-->
  <!--      <input-->
  <!--        :id="`${ratingType}-star-${questIndex}-${starsNumber-index}`"-->
  <!--        type="radio"-->
  <!--        name="rating"-->
  <!--        :checked="(starsNumber-index)===rating"-->
  <!--        :aria-label="`«${starsNumber-index}»`"-->
  <!--        @click="$emit('input', starsNumber-index)"-->
  <!--      >-->
  <!--      <label-->
  <!--        :for="`${ratingType}-star-${questIndex}-${starsNumber-index}`"-->
  <!--        :title="`«${starsNumber-index}»`"-->
  <!--        class="rating-area__star-label"-->
  <!--        :class="fillGoldenStars(index)"-->
  <!--      />-->
  <!--    </li>-->
  <!--  </ul>-->
  <fieldset class="rating">
    <div class="rating__group">
      <input
        v-for="(star, i) in starsNumber"
        :key="i"
        :class="fillStars(i)"
        :checked="(starsNumber-i)===rating"
        :aria-label="`«${starsNumber-i}»`"
        type="radio"
        name="rating"
        :disabled="isDisabled"
        class="rating__star"
        @click="$emit('input', starsNumber-i)"
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
    fillStars(i) {
      return (this.starsNumber - i) <= this.rating ? 'rating__star_checked' : '';
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
    width: 7.5em;
    height: 1.5em;
    background-image: url('assets/img/ui/star-empty.svg');
    background-size: 1.5em auto;
    background-repeat: repeat-x;
  }
  &__star {
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
    width: 1.5em;
    height: 1.5em;
    background-size: 1.5em auto;
    background-repeat: repeat-x;
    font-size: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    &:nth-of-type(1) {
      z-index: 5;
      width: 1.5em;
    }
    &:nth-of-type(2) {
      z-index: 4;
      width: 3em;
    }
    &:nth-of-type(3) {
      z-index: 3;
      width: 4.5em;
    }
    &:nth-of-type(4) {
      z-index: 2;
      width: 6em;
    }
    &:nth-of-type(5) {
      z-index: 1;
      width: 7.5em;
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
    &:checked, &:hover {
      background-image: url('assets/img/ui/star.svg');
    }
    &_checked {
      background-image: url('assets/img/ui/star.svg');
    }
  }
}
//.rating-area {
//  overflow: hidden;
//  display: flex;
//  flex-direction: row-reverse;
//  justify-content: flex-end;
//  height: 24px;
//  &__star > input {
//    display: none;
//  }
//  &__star-label {
//    float: right;
//    padding: 0;
//    cursor: pointer;
//    font-size: 25px;
//    line-height: 25px;
//    color: lightgrey;
//    text-shadow: 1px 1px #bbb;
//    &_golden {
//      color: gold;
//    }
//  }
//  &__star > label:before {
//    content: '★';
//  }
//  &__star:hover > label {
//    color: gold;
//  }
//  &__star:hover ~ &__star > label {
//    color: gold;
//    text-shadow: 1px 1px goldenrod;
//  }
//}
//.disabled {
//  pointer-events: none;
//}
//@include _575 {
//  .rating-area__star-label {
//      font-size: 20px;
//    }
//}
</style>
