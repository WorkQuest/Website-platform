<template>
  <ctm-modal-box
    class="messageSend"
    :is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            src="~/assets/img/ui/inviteSend.svg"
            alt="MessageSend"
          >
          <div class="ctm-modal__title">
            {{ $t('modals.titles.inviteSend') }}
          </div>
          <div class="ctm-modal__desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor
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
import { mapGetters } from 'vuex';

export default {
  name: 'ModalInviteSend',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
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
