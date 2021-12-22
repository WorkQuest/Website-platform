<template>
  <ul
    class="rating-area"
  >
    <li
      v-for="(star,index) in starsNumber"
      :key="index"
      class="rating-area__star"
    >
      <input
        :id="`${ratingType}-star-${starsNumber-index}`"
        type="radio"
        name="rating"
        :checked="(starsNumber-index)===rating"
        @click="$emit('input', starsNumber-index)"
      >
      <label
        :for="`${ratingType}-star-${starsNumber-index}`"
        :title="`Оценка «${starsNumber-index}»`"
        :class="(starsNumber-index)<=rating ? 'golden' : ''"
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
  },
};
</script>

<style lang="scss" scoped>
.rating-area {
  overflow: hidden;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  &__star > input{
    display: none;
  }
  &__star > label {
    float: right;
    padding: 0;
    cursor: pointer;
    font-size: 25px;
    line-height: 25px;
    color: lightgrey;
    text-shadow: 1px 1px #bbb;
  }
  &__star:not(:checked) > label:before {
    content: '★';
  }
  &__star:not(:checked) > label:hover,
  &__star:not(:checked) > label:hover ~ label {
    color: gold;
  }
}
.golden {
  color: gold !important;
}
/* .rating-area:not(:checked) > input {
  display: none;
}
.rating-area:not(:checked) > label {
  float: right;
  padding: 0;
  cursor: pointer;
  font-size: 25px;
  line-height: 25px;
  color: lightgrey;
  text-shadow: 1px 1px #bbb;
}
.rating-area:not(:checked) > label:before {
  content: '★';
}
.rating-area > input:checked ~ label {
  color: gold;
}
.rating-area:not(:checked) > label:hover,
.rating-area:not(:checked) > label:hover ~ label {
  color: gold;
}
.rating-area > input:checked + label:hover,
.rating-area > input:checked + label:hover ~ label,
.rating-area > input:checked ~ label:hover,
.rating-area > input:checked ~ label:hover ~ label,
.rating-area > label:hover ~ input:checked ~ label {
  color: gold;
  text-shadow: 1px 1px goldenrod;
}
.rate-area > label:active {
  position: relative;
} */
</style>
