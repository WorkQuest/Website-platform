<template>
  <div
    class="rating-area"
  >
    <input
      :id="`${ratingType}-star-5`"
      type="radio"
      name="rating"
      :value="5"
      :checked="rating==='5'"
      @click="$emit('input', $event.target.value)"
    >
    <label
      :for="`${ratingType}-star-5`"
      title="Оценка «5»"
    />
    <input
      :id="`${ratingType}-star-4`"
      type="radio"
      name="rating"
      :value="4"
      :checked="rating==='4'"
      @click="$emit('input', $event.target.value)"
    >
    <label
      :for="`${ratingType}-star-4`"
      title="Оценка «4»"
    />
    <input
      :id="`${ratingType}-star-3`"
      type="radio"
      name="rating"
      :value="3"
      :checked="rating==='3'"
      @click="$emit('input', $event.target.value)"
    >
    <label
      :for="`${ratingType}-star-3`"
      title="Оценка «3»"
    />
    <input
      :id="`${ratingType}-star-2`"
      type="radio"
      name="rating"
      :value="2"
      :checked="rating==='2'"
      @click="$emit('input', $event.target.value)"
    >
    <label
      :for="`${ratingType}-star-2`"
      title="Оценка «2»"
    />
    <input
      :id="`${ratingType}-star-1`"
      type="radio"
      name="rating"
      :value="1"
      :checked="rating==='1'"
      @click="$emit('input', $event.target.value)"
    >
    <label
      :for="`${ratingType}-star-1`"
      title="Оценка «1»"
    />
  </div>
</template>
<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: String,
      default: '',
    },
    ratingType: {
      type: String,
      default: '',
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
