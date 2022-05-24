<template>
  <ctm-modal-box
    class="twoFA"
    :title="$tc('modals.titles.2FA.auth')"
  >
    <validation-observer
      v-slot="{handleSubmit, validated, passed, invalid}"
      ref="twoFA"
      tag="div"
      class="twoFA__content"
    >
      <div class="twoFA__step-panels step-panel">
        <template v-for="(item, i) in stepPanel">
          <div
            :key="`text-${i}`"
            class="step-panel__step"
            :class="[{'step-panel__step_active': item.stepActive.includes(step)}]"
          >
            <span class="step-panel__block">
              <span :class="[{'step__text_hide': item.hideStepWord.includes(step)}]">{{ $t('modals.step') }}</span>
              <span :class="[{'step__number': item.stepNumber.includes(step)}]">{{ item.step }}</span>
            </span>
          </div>
          <div
            v-if="item.step !== 4"
            :key="`line-${i}`"
            class="step-panel__line"
            :class="[{'step-panel__line_active': item.line.includes(step)}]"
          />
        </template>
      </div>
      <!-- Steps -->
      <div
        v-if="step === 1"
        class="twoFA__container"
      >
        <div class="container__content-field">
          <div class="content-field_text">
            {{ $t('modals.installGoogleAuth') }}
          </div>
          <div class="content-field__btns btns">
            <div
              v-for="(item, i) in shopBtns"
              :key="i"
              class="content-field__btn-store"
            >
              <base-btn
                mode="black"
                :data-selector="item.text"
                @click="item.click"
              >
                {{ item.text }}
                <template v-slot:left>
                  <img
                    :alt="item.text"
                    :src="item.img"
                  >
                </template>
              </base-btn>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="step === 2"
        class="twoFA__container twoFA__container_without-bottom"
      >
        <div class="container__content-field">
          <span class="content-field__text">{{ $t('modals.useYourGoogleAuth') }}</span>
          <div class="content-field__qr">
            <qrcode
              v-if="qrLink"
              :value="qrLink"
              :options="{ width: 200 }"
            />
          </div>
          <span class="content-field__text">{{ $t('modals.ifYouCantScanBarcode') }}</span>
          <div class="content-field__input">
            <base-field
              v-model="twoFACode"
              data-selector="2FA-CODE"
              :placeholder="twoFACode"
            />
            <button
              v-clipboard:copy="twoFACode"
              v-clipboard:success="ClipboardSuccessHandler"
              v-clipboard:error="ClipboardErrorHandler"
              class="content-field__btn-copy"
              data-selector="COPY-BTN"
              type="button"
            >
              <span class="icon-copy" />
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="step === 3"
        class="twoFA__container twoFA__container_without-bottom"
      >
        <div class="container__content-field">
          <span class="content-field__text">{{ $t('modals.pleaseSaveThisKey') }}</span>
          <div class="content-field__input">
            <base-field
              v-model="twoFACode"
              data-selector="2FA-CODE"
              :placeholder="twoFACode"
            />
            <button
              v-clipboard:success="ClipboardSuccessHandler"
              v-clipboard:error="ClipboardErrorHandler"
              v-clipboard:copy="twoFACode"
              class="content-field__btn-copy"
              data-selector="COPY-BTN"
              type="button"
            >
              <span class="icon-copy" />
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="step === 4"
        class="twoFA__container twoFA__container_without-bottom"
      >
        <div class="container__content-field container__content-field_big">
          <div class="content-field__text">
            {{ $t('modals.switchOnGoogleAuth') }}
          </div>
          <div class="content-field__text content-field__text_grey">
            {{ $t('modals.toYourEmail') }} {{ userData.email }} {{ $t('modals.codeHasBeenSent') }}
          </div>
        </div>
        <base-field
          v-for="(item, i) in inputs"
          :id="item.id"
          :key="i"
          v-model="models[item.model]"
          :vid="item.id"
          :label="item.label"
          :data-selector="item.label.toUpperCase()"
          :placeholder="item.placeholder"
          :rules="item.rules"
          :name="item.name"
        />
      </div>
      <!-- Steps btns -->
      <div class="twoFA__btns-block">
        <base-btn
          v-if="step === 1"
          data-selector="NEXT-STEP-WITH-ENABLE-2FA"
          @click="nextStepWithEnable2FA()"
        >
          {{ $t('meta.btns.next') }}
        </base-btn>

        <div
          v-if="step > 1"
          class="btns-block__wrapper"
        >
          <base-btn
            mode="outline"
            data-selector="PREVIOUS-STEP"
            @click="previousStep()"
          >
            {{ $t('meta.btns.back') }}
          </base-btn>
        </div>
        <div
          v-if="step > 1"
          class="btns-block__wrapper"
        >
          <div
            v-for="(item, i) in stepBtns"
            :key="i"
            class="btns-block__container"
          >
            <base-btn
              v-if="item.step.includes(step)"
              :data-selector="`${item.text}-${i}`"
              @click="item.click"
            >
              {{ item.text }}
            </base-btn>
          </div>
          <span
            v-if="step === 4"
            class="btns-block__container"
          >
            <base-btn
              data-selector="CONFIRM-ENABLE-2FA"
              :disabled="!validated || !passed || invalid"
              @click="handleSubmit(confirmEnable2FA)"
            >
              {{ $t('meta.btns.next') }}
            </base-btn>
          </span>
        </div>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalDeposit',
  data() {
    return {
      step: 1,
      models: {
        confirmCode: '',
        totp: '',
      },
      qrLink: '',
      shopBtns: [
        {
          click: this.goToAppleStore,
          text: this.$t('meta.stores.appleStore'),
          img: require('~/assets/img/ui/apple-icon.svg'),
        },
        {
          click: this.goToGooglePlay,
          text: this.$t('meta.stores.googlePlay'),
          img: require('~/assets/img/ui/google-play-icon.svg'),
        },
      ],
      stepBtns: [{ step: [2, 3], click: this.nextStep, text: this.$t('meta.btns.next') }],
      inputs: [
        {
          id: 'confirmCode',
          model: 'confirmCode',
          label: this.$t('modals.emailVerificationCode'),
          placeholder: this.$t('modals.emailPlaceholder'),
          rules: 'required|alpha_num',
          name: this.$t('modals.emailVerificationCodeField'),
        },
        {
          id: 'totp',
          model: 'totp',
          label: this.$t('modals.googleVerificationCode'),
          placeholder: this.$t('modals.codePlaceholder'),
          rules: 'required|alpha_num',
          name: this.$t('securityCheck.confCodeField'),
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
      twoFACode: 'user/getTwoFACode',
    }),
    stepPanel() {
      return [
        {
          stepActive: [1, 2, 3, 4], hideStepWord: [2, 3, 4], stepNumber: [2, 3, 4], line: [2, 3, 4], step: 1,
        },
        {
          stepActive: [2, 3, 4], hideStepWord: [3, 4], stepNumber: [3, 4], line: [3, 4], step: 2,
        },
        {
          stepActive: [3, 4], hideStepWord: [4], stepNumber: [4], line: [4], step: 3,
        },
        {
          stepActive: [4], hideStepWord: [], stepNumber: [], line: [], step: 4,
        },
      ];
    },
  },
  async beforeMount() {
    await this.$store.dispatch('user/getUserData');
  },
  methods: {
    goToGooglePlay() {
      window.open('https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2');
    },
    goToAppleStore() {
      window.open('https://apps.apple.com/ru/app/google-authenticator/id388497605');
    },
    async enable2FA() {
      const response = await this.$store.dispatch('user/enable2FA');
      if (response.ok) {
        this.qrLink = `otpauth://totp/${this.userData.email}?secret=${this.twoFACode}&issuer=WorkQuest.co`;
      }
    },
    async confirmEnable2FA() {
      const response = await this.$store.dispatch('user/confirmEnable2FA', {
        confirmCode: this.models.confirmCode,
        totp: this.models.totp,
      });
      if (response.ok) {
        this.hide();
        this.showModalSuccess();
      } else this.validationErrorFields(response.data);
    },
    showModalSuccess() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.2FA.status'),
        subtitle: this.$t('modals.2FA.enabled'),
      });
    },
    validationErrorFields(data) {
      data.forEach(async (obj) => {
        const { field } = obj;
        const { name } = this.inputs.find((input) => input.id === field);
        const err = {
          [field]: [this.$t('messages.excluded', { _field_: name })],
        };
        await this.$refs.twoFA.setErrors(err);
      });
    },
    hide() {
      this.CloseModal();
    },
    previousStep() {
      this.step -= 1;
    },
    nextStep() {
      this.step += 1;
    },
    nextStepWithEnable2FA() {
      this.enable2FA();
      this.step += 1;
    },
  },
};
</script>

<style lang="scss" scoped>

.twoFA {
  @include modalKit;
  font-size: 16px;
  white-space: normal;
  word-break: break-word;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  text-align: left;
  background: #FFFFFF;
  border-radius: 6px;
  max-width: 430px !important;
  height: max-content !important;
  &__content {
    padding: 25px 28px 0;
  }
  &__equal {
    margin: 0 0 35px 10px;
  }
  &__step-panels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  &__container {
    display: grid;
    margin: 15px 0;
    &_without-bottom {
      margin: 15px 0 0;
    }
    &_big {
      grid-gap: 10px;
    }
  }
  &__btns-block {
    display: flex;
    justify-content: space-between;
  }
}

.container {
  &__content-field {
    display: grid;
    grid-gap: 10px;
    &_big {
      margin-bottom: 15px;
    }
  }
}

.step-panel {
  &__line {
    display: block;
    height: 1px;
    border-top: 1px solid rgba(0, 131, 199, 0.1);
    margin: auto 0;
    padding: 0;
    width: 100%;
    &_active {
      @extend .step-panel__line;
      border-top: 1px solid $blue;
    }
  }
  &__block {
    white-space: nowrap;
  }
  &__step {
    @include text-simple;
    background: rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    padding: 10px;
    text-align: center;

    &_active {
      @extend .step-panel__step;
      color: $white;
      background: $blue;
    }
    &__btns {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
    }
  }
}

.content-field {
  &__btns {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  &__qr {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &__input {
    padding: 10px 0 0 0;
    display: grid;
    grid-template-columns: 6fr 1fr;
    grid-gap: 10px;
  }
  &__btn-store {
    width: 47%;
  }
  &__btn-copy {
    background: $white;
    border: 1px solid $black0;
    padding: 11px;
    border-radius: 6px;
    height: 46px;
  }
  &__text {
    @include text-simple;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    color: $black700;
    font-size: 18px;
    &_grey {
      @extend .content-field__text;
      font-size: 16px;
      color: $black400;
    }
  }
}

.btns-block {
  &__wrapper {
    width: 45%;
  }
}

.icon-copy {
  color: $blue;
  font-size: 20px;
}

</style>
