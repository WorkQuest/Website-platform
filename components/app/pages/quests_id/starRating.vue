<template>
  <div
    class="rating-area"
  >
    <input
      id="star-5"
      type="radio"
      name="rating"
      @click="setRating(5)"
    >
    <label
      for="star-5"
      title="Оценка «5»"
    />
    <input
      id="star-4"
      type="radio"
      name="rating"
      @click="setRating(4)"
    >
    <label
      for="star-4"
      title="Оценка «4»"
    />
    <input
      id="star-3"
      type="radio"
      name="rating"
      @click="setRating(3)"
    >
    <label
      for="star-3"
      title="Оценка «3»"
    />
    <input
      id="star-2"
      type="radio"
      name="rating"
      @click="setRating(2)"
    >
    <label
      for="star-2"
      title="Оценка «2»"
    />
    <input
      id="star-1"
      type="radio"
      name="rating"
      @click="setRating(1)"
    >
    <label
      for="star-1"
      title="Оценка «1»"
    />
  </div>
</template>
<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    setRating(n) {
      localStorage.setItem('questRating', n);
    },
  },
};
</script>

<style lang="scss" scoped>
.rating-area {
  overflow: hidden;
  width: 265px;
  margin: 0 auto;
}
.rating-area:not(:checked) > input {
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
}
</style>
