<template>
  <ctm-modal-box
    class="ctm-modal"
    :is-header="false"
  >
    <div class="ctm-modal__content content">
      <img
        class="content__img"
        :src="options.imageSrc"
        alt=""
      >
    </div>
    <div class="ctm-modal__desc desc">
      <div
        v-if="options.title"
        class="desc__title"
      >
        {{ options.title }}
      </div>
      <div
        v-if="options.desc"
        class="desc__desc"
      >
        {{ options.desc }}
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ShowImage',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 80% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
    padding: 0 !important;
  }
  &__content {
    padding: 0 28px 5px 28px !important;
  }
  &__desc {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
    padding: 28px 28px 5px 28px !important;
  }
}
.content {
  margin-top: 28px;
  overflow-y: auto;
  max-height: 800px;
  height: 100%;
  &__img {
    width: 100%;
    border-radius: 6px;
    object-fit: cover;
  }
}
.desc {
  display: flex;
  flex-direction: column;
  text-align: center;
  &__title {
    @include text-simple;
    justify-content: center;
    margin: 10px 10px 0 0;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    overflow: hidden;
    width: 100%;
  }
  &__desc {
    @include text-simple;
    display: flex;
    margin: 10px 10px 0 0;
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    width: 100%;
    word-break: break-word;
    white-space: pre-line;
  }
}

</style>
