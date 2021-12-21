<template>
  <div
    class="rating-area"
  >
    <input
      id="star-5"
      type="radio"
      name="rating"
      :checked="5 === value"
      @click="$emit('input', 5)"
    >
    <label
      for="star-5"
      title="Оценка «5»"
    />
    <input
      id="star-4"
      type="radio"
      name="rating"
      :checked="4 === value"
      @click="$emit('input', 4)"
    >
    <label
      for="star-4"
      title="Оценка «4»"
    />
    <input
      id="star-3"
      type="radio"
      name="rating"
      :checked="3 === value"
      @click="$emit('input', 3)"
    >
    <label
      for="star-3"
      title="Оценка «3»"
    />
    <input
      id="star-2"
      type="radio"
      name="rating"
      :checked="2 === value"
      @click="$emit('input', 2)"
    >
    <label
      for="star-2"
      title="Оценка «2»"
    />
    <input
      id="star-1"
      type="radio"
      name="rating"
      :checked="1 === value"
      @click="$emit('input', 1)"
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
    value: {
      type: Number,
      default: 0,
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
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
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
