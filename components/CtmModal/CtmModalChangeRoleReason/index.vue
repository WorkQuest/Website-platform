<template>
  <ctm-modal-box
    :is-unclosable="true"
    :title="$t('modals.reason')"
    class="messageSend"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <span class="messageSend__title">{{ $t('modals.pleaseDescribe') }}</span>
        <div class="messageSend__content">
          <base-field
            v-model="reasonInput"
            class="message__action"
            :placeholder="$t('modals.reason')"
          />
          <div class="btn__container">
            <div class="btn__wrapper">
              <base-btn
                class="message__action"
                @click="secureCheck()"
              >
                {{ $t('meta.change') }}
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
  name: 'CtmModalChangeRoleReason',
  data() {
    return {
      reasonInput: '',
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    secureCheck() {
      this.ShowModal({
        key: modals.changeRoleSecureCheck,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.message {
  &__action {
    width: 100%;
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }
  &__wrapper {
    width: 45%;
  }
}

.messageSend {
  max-width: 400px !important;
  display: flex;
  flex-direction: column;
  &__title {
    letter-spacing: -0.025em;
    margin-bottom: 13px;
    color: #212529;
  }
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 10px;
  }
  &__action {
    margin-top: 10px;
    width: 100%;
  }
}
.messageSend__content div div {
  height: auto !important;
}
</style>
