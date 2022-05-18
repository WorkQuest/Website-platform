<template>
  <ctm-modal-box
    class="messageSend"
    :is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            src="~assets/img/ui/messageStar.svg"
            alt="Thanks"
          >
          <div class="ctm-modal__title">
            {{ $t('modals.thanks') }}
          </div>
          <div class="ctm-modal__desc">
            {{ $t('modals.thanksText') }}
          </div>
          <base-btn
            class="email__action"
            data-selector="OK"
            @click="CloseModal"
          >
            {{ $t('meta.btns.ok') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>

export default {
  name: 'ModalThanksSend',
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.messageSend {
  max-width: 337px !important;

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }

  &__action {
    margin-top: 10px;
  }
}
</style>
