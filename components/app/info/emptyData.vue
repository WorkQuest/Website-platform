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
        v-if="link !== ''"
        class="absence__button"
        @click="toCreateQuest"
      >
        {{ btnText }}
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
    btnText: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
  methods: {
    toCreateQuest() {
      this.$router.push(this.link);
    },
  },
};
</script>

<style lang="scss" scoped>
.absence {
  width: 100%;
  background-color: #f6f8fa;
  margin-top: 60px;
  display: flex;
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
