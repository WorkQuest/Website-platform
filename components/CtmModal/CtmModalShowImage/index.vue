<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.showImage.quest')"
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
}
.messageSend {
  width: auto !important;
  max-width: 100% !important;
}

</style>
