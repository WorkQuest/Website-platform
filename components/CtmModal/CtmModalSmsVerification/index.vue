<template>
  <ctm-modal-box
    :title="!phone ? $tc('modals.errors.errorSmsVer') : $t('modals.titles.smsVerification')"
    class="verification"
  >
    <div class="verification__content content">
      <div
        v-if="!phone"
        class="content__verified"
      >
        <img
          src="~assets/img/ui/warning.svg"
          alt="Please fill phone number!"
          class="content__picture"
        >
        <div class="content__subtitle content__subtitle_error">
          {{ $t('modals.fillNumber') }}
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            data-selector="CONFIRM-1"
            @click="CloseModal"
          >
            {{ $t('meta.btns.confirm') }}
          </base-btn>
        </div>
      </div>
      <validation-observer
        v-if="phone"
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__subtitle">
          {{ step === 1 ? $t('modals.enterPhone') : $t('modals.enterSMSCode') }}
        </div>
        <span class="content__top">
          {{ step === 1 ? $t('modals.phoneNumber') : $t('meta.codeFromSMS') }}
        </span>
        <base-field
          v-if="step === 1"
          v-model="phone"
          data-selector="PHONE-NUMBER"
          class="content__action"
          :placeholder="$t('modals.phoneNumber')"
          mode="icon"
          :disabled="true"
          :name="$tc('modals.phoneNumberField')"
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
          data-selector="CODE-FROM-SMS"
          :placeholder="$t('meta.codeFromSMS')"
          mode="icon"
          rules="required|alpha_num"
          :name="$tc('modals.codeFromSMS')"
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
            data-selector="RESEND-SMS"
            @click="getCodeFromSms()"
          >
            {{ $t('meta.btns.resendSMS') }}
          </button>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            v-if="step === 1"
            data-selector="NEXT-STEP"
            class="buttons__button"
            @click="handleSubmit(nextStep)"
          >
            {{ $t('meta.btns.next') }}
          </base-btn>
          <base-btn
            v-if="step === 2"
            class="buttons__button"
            data-selector="CONFIRM-2"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(success)"
          >
            {{ $t('meta.btns.confirm') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { UserRole } from '~/utils/enums';

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
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      currentConfirmCode: 'user/getVerificationCode',
    }),
    UserRole() {
      return UserRole;
    },
    phone() {
      return this.userData?.tempPhone?.fullPhone;
    },
  },
  async beforeMount() {
    this.confirmCode = this.currentConfirmCode;
  },
  methods: {
    async confirmPhone() {
      return await this.$store.dispatch('user/confirmPhone', { confirmCode: this.confirmCode });
    },
    async success() {
      const phoneResult = await this.confirmPhone();
      if (phoneResult) {
        await this.$store.dispatch('user/getUserData');
        this.ShowModalSuccess({
          title: this.$t('meta.success'),
          subtitle: this.$t('modals.SMSVerConnected'),
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/error.svg'),
          title: this.$t('modals.error'),
          subtitle: this.$t('errors.incorrectPass'),
        });
      }
    },
    async getCodeFromSms() {
      if (this.phone) await this.$store.dispatch('user/sendPhone');
    },
    async nextStep() {
      if (this.phone) {
        await this.getCodeFromSms();
        this.step += 1;
      }
      if (!this.userData.tempPhone) this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.verification {
  max-width: 382px !important;
  &__content {
    padding: 0 28px 30px 28px;
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
    font-size: 25px;
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
