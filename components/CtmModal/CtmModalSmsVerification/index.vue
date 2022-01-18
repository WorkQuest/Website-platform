<template>
  <ctm-modal-box
    :title="!secondNumber ? 'Error SMS verification' : $t('modals.smsVerification')"
    class="verification"
  >
    <div
      class="verification__content content"
    >
      <div v-if="userData.phone && Object.keys(userData.phone).length > 0">
        <img
          src="~assets/img/ui/warning.svg"
          alt="Already Verified!"
          class="content__picture"
        >
        <div class="content__subtitle content__subtitle_error">
          Phone number already verified!
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            @click="hide"
          >
            {{ $t('meta.confirm') }}
          </base-btn>
        </div>
      </div>
      <div v-if="!secondNumber">
        <img
          src="~assets/img/ui/warning.svg"
          alt="Please fill phone number!"
          class="content__picture"
        >
        <div class="content__subtitle content__subtitle_error">
          {{ this.$t('modals.fillNumber') }}
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            @click="hide"
          >
            {{ $t('meta.confirm') }}
          </base-btn>
        </div>
      </div>
      <validation-observer
        v-if="!userData.phone && secondNumber && secondNumber.fullPhone"
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__subtitle">
          {{ step === 1 ? $t('modals.enterPhone') : $t('modals.enterSMSCode') }}
        </div>
        <span class="content__top">
          {{ step === 1 ? $t('modals.phoneNumber') : $t('modals.codeFromSMS') }}
        </span>
        <base-field
          v-if="step === 1"
          v-model="secondNumber.fullPhone"
          class="content__action"
          :placeholder="$t('modals.phoneNumber')"
          mode="icon"
          :disabled="true"
          :name="$t('modals.phoneNumberField')"
        >
          <template
            v-slot:left
            class="content__picture"
          >
            <div class="icon-phone_outline content__icon" />
          </template>
        </base-field>
        <base-field
          v-if="step === 2"
          v-model="confirmCode"
          class="content__action"
          :placeholder="$t('modals.codeFromSMSField')"
          mode="icon"
          rules="required|alpha_num"
          :name="$t('modals.codeFromSMS')"
        >
          <template
            v-slot:left
            class="content__picture"
          >
            <span class="icon-Lock content__icon" />
          </template>
        </base-field>
        <div
          v-if="step === 2"
          class="content__bottom"
        >
          {{ $t('modals.haventSMS') }}
          <button
            class="content__resend"
            @click="confirmPhone()"
          >
            {{ $t('meta.resendSMS') }}
          </button>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            v-if="step === 1"
            class="buttons__button"
            @click="handleSubmit(nextStep)"
          >
            {{ $t('meta.next') }}
          </base-btn>
          <base-btn
            v-if="step === 2"
            class="buttons__button"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(success)"
          >
            {{ $t('meta.confirm') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'CtmModalSmsVerification',
  data() {
    return {
      confirmCode: '',
      step: 1,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      secondNumber: 'user/getUserSecondMobileNumber',
      currentConfirmCode: 'user/getVerificationCode',
    }),
  },
  async beforeMount() {
    await this.$store.dispatch('user/getUserData');
    this.confirmCode = this.currentConfirmCode;
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async confirmPhone() {
      try {
        const payload = {
          confirmCode: this.confirmCode,
        };
        await this.$store.dispatch('user/confirmPhone', payload);
      } catch (e) {
        console.log(e);
      }
    },
    success() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/success.svg'),
        title: this.$t('modals.success'),
        subtitle: this.$t('modals.SMSVerConnected'),
      });
      this.confirmPhone();
    },
    async getCodeFromSms() {
      try {
        const payload = { phoneNumber: this.secondNumber };
        await this.$store.dispatch('user/sendPhone', payload);
      } catch (e) {
        console.log(e);
      }
    },
    async nextStep() {
      if (this.secondNumber) {
        await this.getCodeFromSms();
        this.step += 1;
      }
      if (!this.userData.tempPhone) this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.verification {
  max-width: 382px !important;
  &__content {
    padding: 0 28px 30px 28px !important;
  }
}
.content {
  &__picture {
    margin-top: 5px;
    margin-left: auto;
    margin-right: auto;
  }
  &__subtitle {
    @include text-simple;
    font-weight: 400;
    color: $black400;
    font-size: 16px;
    margin-top: 10px;
    &_error {
      margin: 10px auto;
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
  &__top {
    margin: 25px 0 4px 0;
    display: flex;
    justify-self: flex-start;
  }
  &__action {
    width: 100%;
  }
  &__icon:before {
    font-size: 25px !important;
    color: $blue;
  }
  &__bottom {
    margin-top: 15px;
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 23px;

  }
  &__buttons {
    margin: 2px 0 0 0;
    width: 100%;
  }
  &__resend {
    border: 0;
    background: transparent;
    color: $blue;
    font-size: 14px;
    margin: 0 0 0 5px;
  }
}

</style>
