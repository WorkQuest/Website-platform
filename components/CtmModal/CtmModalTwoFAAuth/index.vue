<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.twoFAAuth')"
  >
    <div class="ctm-modal__content">
      <validation-observer>
        <div
          class="step-panel"
        >
          <div
            class="step-panel__step"
            :class="[
              {'step-panel__step_active': step === 1 || step === 2 || step === 3 || step === 4},
            ]"
          >
            <span
              :class="[
                {'hide': step === 2 || step === 3 || step === 4},
              ]"
            >{{ $t('modals.step') }}</span>
            <span
              :class="[
                {'step__number': step === 2 || step === 3 || step === 4},
              ]"
            >1</span>
          </div>
          <div
            class="line"
            :class="[
              {'line__active': step === 2 || step === 3 || step === 4},
            ]"
          />
          <div
            class="step-panel__step"
            :class="[
              {'step-panel__step_active': step === 2 || step === 3 || step === 4},
            ]"
          >
            <span
              :class="[
                {'hide': step === 3 || step === 4},
              ]"
            >{{ $t('modals.step') }}</span>
            <span
              :class="[
                {'step__number': step === 3 || step === 4},
              ]"
            >2</span>
          </div>
          <div
            class="line"
            :class="[
              {'line__active': step === 3 || step === 4},
            ]"
          />
          <div
            class="step-panel__step"
            :class="[
              {'step-panel__step_active': step === 3 || step === 4},
            ]"
          >
            <span
              :class="[
                {'hide': step === 4},
              ]"
            >{{ $t('modals.step') }}</span>
            <span
              :class="[
                {'step__number': step === 2 || step === 3 || step === 4},
              ]"
            >3</span>
          </div>
          <div
            class="line"
            :class="[
              {'line__active': step === 4}
            ]"
          />
          <div
            class="step-panel__step"
            :class="[{'step-panel__step_active': step === 4}]"
          >
            <span> {{ $t('modals.step') }}</span>
            <span>4</span>
          </div>
        </div>
        <!-- Steps -->
        <div
          v-if="step === 1"
          class="step__container"
        >
          <div
            class="ctm-modal__content-field"
          >
            <div>
              <span class="content__text">{{ $t('modals.installGoogleAuth') }}</span>
            </div>
            <div class="btn__container">
              <div class="btn__wrapper">
                <div>
                  <base-btn
                    mode="black"
                    @click="goToAppleStore"
                  >
                    {{ $t('modals.appleStore') }}
                    <template v-slot:left>
                      <img
                        :alt="$t('modals.appleStore')"
                        src="~/assets/img/ui/apple-icon.svg"
                      >
                    </template>
                  </base-btn>
                </div>
              </div>
              <div class="btn__wrapper">
                <div>
                  <base-btn
                    mode="black"
                    @click="goToGooglePlay"
                  >
                    {{ $t('modals.googlePlay') }}
                    <template v-slot:left>
                      <img
                        :alt="$t('modals.googlePlay')"
                        src="~/assets/img/ui/google-play-icon.svg"
                      >
                    </template>
                  </base-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="step === 2"
          class="step__container"
        >
          <div class="ctm-modal__content-field">
            <span class="content__text">{{ $t('modals.useYourGoogleAuth') }}</span>
            <div class="qr__container">
              <qrcode
                :value="code || 1"
                :options="{ width: 200 }"
              />
            </div>
            <span class="content__text">{{ $t('modals.ifYouCantScanBarcode') }}</span>
            <div class="code__input">
              <base-field
                v-model="code"
                :placeholder="code"
              />
              <div>
                <button
                  v-clipboard:copy="code"
                  v-clipboard:success="ClipboardSuccessHandler"
                  v-clipboard:error="ClipboardErrorHandler"
                  class="btn__copy"
                  type="button"
                >
                  <span class="icon-copy" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="step === 3"
          class="step__container"
        >
          <div class="ctm-modal__content-field">
            <span class="content__text">{{ $t('modals.pleaseSaveThisKey') }}</span>
            <div class="code__input">
              <base-field
                v-model="code"
                :placeholder="code"
              />
              <div>
                <button
                  v-clipboard:success="ClipboardSuccessHandler"
                  v-clipboard:error="ClipboardErrorHandler"
                  v-clipboard:copy="code"
                  class="btn__copy"
                  type="button"
                >
                  <span class="icon-copy" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="step === 4"
          class="step__container"
        >
          <div class="ctm-modal__content-field">
            <div class="content__text">
              {{ $t('modals.switchOnGoogleAuth') }}
            </div>
            <div class="content__text_grey">
              {{ $t('modals.toYourEmail') }} {{ userData.email }} {{ $t('modals.codeHasBeenSent') }}
            </div>
          </div>
          <div class="ctm-modal__content-field">
            <base-field
              id="confirmEmailCode"
              v-model="confirmEmailCode"
              :is-hide-error="true"
              :label="$t('modals.conformationCodeFromMail')"
              :placeholder="$t('modals.conformationCodeFromMail')"
            />
          </div>
          <div class="ctm-modal__content-field">
            <base-field
              id="twoFACode"
              v-model="twoFACode"
              :is-hide-error="true"
              :label="$t('modals.twoFAConfirmationCode')"
              :placeholder="$t('modals.twoFAConfirmationCode')"
            />
          </div>
        </div>
        <!-- Steps btns -->
        <div class="btn__container">
          <div
            v-if="step !== 2 && step !== 3 && step !== 4"
            class="btn__onebtn"
          >
            <span
              v-if="step === 1"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="nextStep()"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
          </div>
          <div
            v-if="step !==1"
            class="btn__wrapper"
          >
            <span
              v-if="step === 2"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="nextStep()"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
            <span
              v-if="step === 3"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="nextStep()"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
            <span
              v-if="step === 4"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="hide()"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
          </div>
          <div
            v-if="step !==1"
            class="btn__wrapper"
          >
            <base-btn
              :mode="'outline'"
              class="message__action"
              @click="previousStep()"
            >
              {{ $t('meta.back') }}
            </base-btn>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ModalDeposit',
  data() {
    return {
      step: 1,
      confirmEmailCode: '',
      twoFACode: '',
      code: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
    // ...mapActions({
    //   enable2FA: 'user/enable2FA',
    // }),
  },
  methods: {
    goToGooglePlay(to, from, next) {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';
    },
    goToAppleStore(to, from, next) {
      window.location.href = 'https://apps.apple.com/ru/app/google-authenticator/id388497605';
    },
    hide() {
      this.CloseModal();
    },
    previousStep() {
      // eslint-disable-next-line no-plusplus
      this.step--;
    },
    nextStep() {
      // eslint-disable-next-line no-plusplus
      this.step++;
    },
  },
};
</script>

<style lang="scss" scoped>

.flex {
  &__two-cols {
    display: flex;
    justify-content: space-between;
  }
}

.content {
  &__text {
    @include text-simple;
    margin: 20px 0;
    font-weight: 400;
    color: $black700;
    font-size: 18px;
    &_grey {
      @extend .content__text;
      font-size: 16px;
      color: $black400;
    }
  }
}

.icon {
  &-copy:before {
    content: "\e996";
    color: $blue;
    font-size: 20px;
  }
}

.qr {
  &__container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}

.code {
  &__input {
    padding: 10px 0 0 0;
    display: grid;
    grid-template-columns: 6fr 1fr;
    grid-gap: 10px;
  }
  &__container {
    display: flex;
    border: 1px solid $black0;
    border-radius: 6px;
    justify-content: space-between;
    padding: 12px;
    margin: 33px 10px 0 0;
    width: 100%;
  }
  &__text {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
}

.hide {
  display: none;
}

.grid {
  &__2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
    align-items: flex-end;
    grid-gap: 10px;
  }
  &__3col {
    display: grid;
    grid-template-columns: 6fr 1fr 6fr;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.step {
  &__number {
    padding: 10px;
  }
  &__container {
    &_grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.step-panel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  &__step {
    @include text-simple;
    background: rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    padding: 10px;
    &_active {
      @extend .step-panel__step;
      color: $white;
      background: $blue;
    }
  }
}
.line {
  display: block;
  height: 1px;
  border-top: 1px solid rgba(0, 131, 199, 0.1);
  margin: auto 0;
  padding: 0;
  width: 33px;
  &__active {
    @extend .line;
    border-top: 1px solid $blue;
  }
}
.ctm-modal {
  &__content-field {
    margin: 15px 0 0 0;
  }
  &__equal {
    margin: 0 0 35px 10px;
  }
}

.ctm-modal {
  @include modalKit;
}

.input {
  &_white {
    border-radius: 6px;
    border: 1px solid $black0;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    background-color: $white;
    resize: none;
    &::placeholder {
      color: $black800;
    }
  }
}
.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }
  &__wrapper {
    width: 45%;
  }
  &__onebtn {
    width: 100%;
  }
  &__copy {
    background: $white;
    border: 1px solid $black0;
    padding: 11px;
    border-radius: 6px;
  }
}

.messageSend {
  max-width: 430px !important;
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
