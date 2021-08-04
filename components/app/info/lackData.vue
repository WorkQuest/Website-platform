<template>
  <div class="data data__absence">
    <div class="absence absence__content">
      <img
        class="absence__img"
        src="~/assets/img/temp/smile_sad.svg"
      >
      <div class="absence__desc">
        {{ description }}
      </div>
      <button class="absence__button">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LackData',
  props: {
    description: {
      type: text,
      default: '',
    },
    buttonText: {
      type: text,
      default: '',
    },
    buttonHref: {
      type: text,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.data {
  width: 100%;
  background-color: #f6f8fa;
  &__absence {
    display: flex;
    justify-content: center;
  }
}
</style>
