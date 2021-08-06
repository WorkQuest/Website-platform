<template>
  <ctm-modal-box
    class="copied"
    is-header="false"
  >
    <div class="copied__content">
      <img
        src="~/assets/img/ui/questAgreed.svg"
        alt="Agreed"
      >
      <div class="copied__title">
        {{ $t('modals.walletCopy') }}
      </div>
      <base-btn
        class="copied__action"
        @click="hide()"
      >
        {{ $t('meta.ok') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>

export default {
  name: 'ModalCopiedSuccess',
  data() {
    return {};
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
    grid-gap: 20px;
    padding: 30px;
  }
  &__action {
    margin-top: 10px;
  }
}
</style>
