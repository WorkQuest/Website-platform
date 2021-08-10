<template>
  <div class="absence">
    <div class="absence__content">
      <img
        class="absence__img"
        src="~/assets/img/temp/smile_sad.svg"
        alt=""
      >
      <div
        v-if="description !== ''"
        class="absence__desc"
      >
        {{ description }}
      </div>
      <base-btn
        v-if="buttonLink !== ''"
        class="absence__button"
        :nuxt-link="buttonLink"
      >
        {{ buttonText }}
      </base-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyData',
  props: {
    description: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
    buttonLink: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.absence {
  width: 100%;
  background-color: #f6f8fa;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  justify-content: center;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-gap: 20px;
  }
  &__desc {
    color: #AAB0B9;
  }
}
</style>
