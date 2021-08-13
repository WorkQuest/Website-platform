<template>
  <ctm-modal-box
    class="ctm-modal"
    :is-header="false"
  >
    <div class="ctm-modal__content">
      <img
        :src="options.imageSrc"
        alt=""
      >
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
    max-width: 100% !important;
    width: auto !important;
    height: auto !important;
    padding: 0 !important;
  }
  &__content {
    padding: 28px 28px 5px 28px !important;
  }
}

</style>
