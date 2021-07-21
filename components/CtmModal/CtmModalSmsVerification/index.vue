<template>
  <ctm-modal-box
    :title="$t('modals.smsVerification')"
    class="messageSend"
  >
    <div class="ctm-modal__content">
      <div class="message__sub">
        <span v-if="step === 1">{{ $t('modals.enterPhone') }}</span>
        <span v-if="step === 2">{{ $t('modals.enterSMSCode') }}</span>
      </div>
      <div class="messageSend">
        <div class="messageSend__content">
          <span
            v-if="step === 1"
            class="message__top"
          >
            {{ $t('modals.phoneNumber') }}
          </span>
          <span
            v-if="step === 2"
            class="message__top"
          >
            {{ $t('modals.codeFromSMS') }}
          </span>
          <base-field
            v-if="step === 1"
            v-model="phoneInput"
            class="message__action"
            :placeholder="$t('modals.phoneNumber')"
            :is-hide-error="true"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-phone_outline" />
            </template>
          </base-field>
          <base-field
            v-if="step === 2"
            v-model="codeInput"
            class="message__action"
            :placeholder="$t('modals.codeFromSMS')"
            :is-hide-error="true"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-Lock" />
            </template>
          </base-field>
          <span
            v-if="step === 2"
            class="message__bottom"
          >
            {{ $t('modals.haventSMS') }} <button class="btn__resend">{{ $t('meta.resendSMS') }}</button>
          </span>
          <div class="btn__container">
            <base-btn
              v-if="step === 1"
              class="message__action"
              @click="nextStep()"
            >
              {{ $t('meta.next') }}
            </base-btn>
            <base-btn
              v-if="step === 2"
              class="message__action"
              @click="success()"
            >
              {{ $t('meta.connectSMSVer') }}
            </base-btn>
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
  data() {
    return {
      codeInput: '',
      phoneInput: '',
      step: 1,
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    success() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/success.svg'),
        title: this.$t('modals.success'),
        subtitle: this.$t('modals.SMSVerConnected'),
      });
    },
    nextStep() {
      // eslint-disable-next-line no-plusplus
      this.step++;
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.icon {
  color: $blue;
  font-size: 20px;
  &-Lock:before {
    content: "\ea24";
    @extend .icon;
  }
  &-phone_outline:before {
    content: "\ea2c";
    @extend .icon;
  }
}

.message {
  &__action {
    width: 100%;
  }
  &__top {
    margin: 25px 0 0 0;
    display: flex;
    justify-self: flex-start;
  }
  &__bottom {
    @extend .message__top;
    margin: 0;
    font-weight: 400;
    font-size: 14px;
  }
  &__sub {
    @include text-simple;
    font-weight: 400;
    color: $black400;
    font-size: 16px;
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 25px 0 0 0;
    width: 100%;
  }
  &__resend {
    border: 0;
    background: transparent;
    color: $blue;
    font-size: 14px;
    margin: 0 0 0 5px;
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
    grid-gap: 10px;
  }
  &__action {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
