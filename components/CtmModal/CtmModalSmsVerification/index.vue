<template>
  <ctm-modal-box
    :title="$t('modals.smsVerification')"
    class="verification"
  >
    <div class="verification__content content">
      <div class="content__subtitle">
        <span v-if="step === 1">{{ $t('modals.enterPhone') }}</span>
        <span v-if="step === 2">{{ $t('modals.enterSMSCode') }}</span>
      </div>
      <span
        v-if="step === 1"
        class="content__top"
      >
        {{ $t('modals.phoneNumber') }}
      </span>
      <span
        v-if="step === 2"
        class="content__top"
      >
        {{ $t('modals.codeFromSMS') }}
      </span>
      <base-field
        v-if="step === 1"
        v-model="phoneNumber"
        class="content__action"
        :placeholder="$t('modals.phoneNumber')"
        :is-hide-error="true"
        mode="icon"
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
        :placeholder="$t('modals.codeFromSMS')"
        :is-hide-error="true"
        mode="icon"
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
        <button class="content__resend">
          {{ $t('meta.resendSMS') }}
        </button>
      </div>
      <div class="content__buttons buttons">
        <base-btn
          v-if="step === 1"
          class="buttons__button"
          @click="nextStep()"
        >
          {{ $t('meta.next') }}
        </base-btn>
        <base-btn
          v-if="step === 2"
          class="buttons__button"
          @click="success()"
        >
          {{ $t('meta.confirm') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'CtmModalSmsVerification',
  data() {
    return {
      confirmCode: '',
      phoneNumber: '',
      step: 1,
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async sendPhoneNumber() {
      try {
        const payload = {
          phoneNumber: this.phoneNumber,
        };
        const response = await this.$store.dispatch('data/sendPhone', payload);
        if (response?.ok) {
          console.log(response);
        }
      } catch (e) {
        console.log(e);
      }
    },

    async confirmPhone() {
      try {
        const payload = {
          confirmCode: this.confirmCode,
        };
        const response = await this.$store.dispatch('data/confirmPhone', payload);
        if (response?.ok) {
          console.log('Phone confirmed');
        }
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
    nextStep() {
      this.sendPhoneNumber();
      // eslint-disable-next-line no-plusplus
      this.step++;
    },
  },
};
</script>

<style lang="scss" scoped>
.verification {
  max-width: 382px !important;
  &__content {
    padding: 0 28px 30px 28px!important;
  }
}
.content{
  &__subtitle {
    @include text-simple;
    font-weight: 400;
    color: $black400;
    font-size: 16px;
    margin-top: 10px;
  }
  &__top {
    margin: 25px 0 4px 0;
    display: flex;
    justify-self: flex-start;
  }
  &__action {
    width: 100%;
  }
  &__icon:before{
    font-size: 25px!important;
    color: $blue;
  }
  &__bottom {
    margin-top: 15px;
    font-weight: 400;
    font-size: 14px;
  }
  &__buttons {
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
}

</style>
