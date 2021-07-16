<template>
  <ctm-modal-box
    class="messageSend"
    is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            src="~assets/img/ui/warning.svg"
            alt="warning"
          >
          <div class="ctm-modal__title">
            {{ $t('modals.warning') }}
          </div>
          <div class="ctm-modal__desc">
            {{ $t('modals.ifYouChangeRole') }}
          </div>
          <div class="btn__container">
            <div class="btn__wrapper">
              <base-btn
                class="message__action"
                @click="reason()"
              >
                {{ $t('meta.continue') }}
              </base-btn>
            </div>
            <div class="btn__wrapper">
              <base-btn
                :mode="'outline'"
                class="message__action"
                @click="hide()"
              >
                {{ $t('meta.cancel') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'CtmModalChangeRoleWarning',
  methods: {
    hide() {
      this.CloseModal();
    },
    reason() {
      this.ShowModal({
        key: modals.changeRoleReason,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
    width: 100%;
  }
  &__wrapper {
    width: 45%;
  }
}

.messageSend {
  max-width: 400px !important;
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
