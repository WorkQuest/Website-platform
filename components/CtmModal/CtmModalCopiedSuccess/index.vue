<template>
  <ctm-modal-box
    class="messageSend"
    is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            src="~/assets/img/ui/questAgreed.svg"
            alt="Agreed"
          >
          <div class="ctm-modal__title">
            {{ $t('modals.successCopied') }}
          </div>
          <base-btn
            class="email__action"
            @click="hide()"
          >
            {{ $t('meta.ok') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalMessageSend',
  data() {
    return {};
  },
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
  &__title {
    text-align: center;
  }
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
