<template>
  <ctm-modal-box
    class="copied"
    :is-header="false"
  >
    <div class="copied__content">
      <img
        src="~/assets/img/ui/questAgreed.svg"
        alt="Copied success"
        class="copied__picture"
      >
      <div class="copied__title">
        {{ $t('modals.textCopy') }}
      </div>
      <base-btn
        class="copied__action"
        @click="hide"
      >
        {{ $t('meta.ok') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'ModalCopiedSuccess',
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

.copied {
  max-width: 337px !important;
  &__title{
    font-size: 23px;
    line-height: 130%;
    font-weight: 500;
    text-align: center;
  }
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 30px;
    padding: 30px;
  }
}
</style>
