<template>
  <div class="data__absence absence">
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
        v-if="buttonHref !== ''"
        class="absence__button"
        :nuxt-link="buttonHref"
      >
        {{ buttonText }}
      </base-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LackData',
  props: {
    description: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
    buttonHref: {
      type: String,
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    justify-content: center;
  }
}
.absence {
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
