<template>
  <div class="ctm-modal__box">
    <div
      v-if="isHeader"
      class="ctm-modal__header"
    >
      <div class="ctm-modal__title">
        <img
          v-if="titleImgAlt"
          src="~assets/img/ui/attention-warning-outline.svg"
          :alt="titleImgAlt"
          class="ctm-modal__title-image"
        >
        {{ title || options.title || 'Default' }}
      </div>
      <button
        v-if="!isUnclosable"
        class="ctm-modal__x"
        @click="close()"
      >
        <img
          src="~assets/img/ui/close-big.svg"
          alt="x"
        >
      </button>
    </div>
    <slot />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalBox',
  props: {
    title: {
      type: String,
      default: '',
    },
    isUnclosable: {
      type: Boolean,
      default: false,
    },
    isHeader: {
      type: Boolean,
      default: true,
    },
    titleImgAlt: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    close() {
      this.$store.dispatch('modals/hide');
    },
  },
};
</script>
<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}
</style>
