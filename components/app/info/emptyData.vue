<template>
  <div
    class="absence"
    data-selector="COMPONENT-EMPTY-DATA"
  >
    <div class="absence__content">
      <img
        class="absence__img"
        :src="$options.images.SAD_SMILE"
        alt="empty-icon"
        width="110"
        height="110"
      >
      <div
        v-if="description"
        class="absence__desc"
      >
        {{ description }}
      </div>
      <base-btn
        v-if="link"
        class="absence__button"
        data-selector="CREATE-QUEST"
        @click="toLink"
      >
        {{ btnText }}
      </base-btn>
    </div>
  </div>
</template>

<script>
import { images } from '~/utils/images';

export default {
  name: 'EmptyData',
  images,
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
    toLink() {
      this.$router.push(this.link);
    },
  },
};
</script>

<style lang="scss" scoped>
.absence {
  width: 100%;
  margin-top: 20px;
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
