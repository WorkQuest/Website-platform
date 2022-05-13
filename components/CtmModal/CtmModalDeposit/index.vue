<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.deposit')"
  >
    <div class="ctm-modal__content">
      <validation-observer v-slot="{ handleSubmit, validated, passed, invalid }">
        <!--        TODO: Зарефакторить-->
        <div
          class="step-panel"
          :class="{'hide': step === 3}"
        >
          <div
            class="step-panel__step"
            :class="[{'step-panel__step_active': step === 1}, {'hide': step === 3}]"
          >
            {{ $t('wallet.WUSD') }}
          </div>
          <div
            class="step-panel__step"
            :class="[{'step-panel__step_active': step === 2}, {'hide': step === 3}]"
          >
            {{ $t('meta.bankCard') }}
          </div>
        </div>
        <div
          v-if="step === 1"
          class="step__container"
        >
          <div class="ctm-modal__content-field">
            <base-field
              v-model="amountInput"
              placeholder="0 WUSD"
              data-selector="AMOUNT1"
              :label="$tc('modals.amount')"
              rules="min_value:0|numeric|required"
              name="Amount"
            />
          </div>
        </div>
        <div
          v-if="step === 2"
          class="step__container"
        >
          <div class="grid__3col">
            <div class="ctm-modal__content-field">
              <base-field
                v-model="amountInput"
                placeholder="0 WUSD"
                data-selector="AMOUNT2"
                :label="$tc('modals.amount')"
                rules="min_value:0|numeric|required"
                name="Amount"
              />
            </div>
            <div class="ctm-modal__equal">
              =
            </div>
            <div class="ctm-modal__content-field">
              <div class="ctm-modal__fake-input">
                $ 0
              </div>
            </div>
          </div>
          <div class="ctm-modal__content-field">
            <base-field
              id="cardNumber_input"
              v-model="cardNumberInput"
              placeholder="0000 0000 0000 0000"
              data-selector="CARD-NUMBER"
              :label="$tc('modals.numberOfCard')"
              rules="required|numberOfCard"
              name="Card number"
            />
          </div>
          <div class="grid__2col">
            <div class="ctm-modal__content-field">
              <base-field
                v-model="dateInput"
                placeholder="02/24"
                data-selector="CARD-DATE"
                :label="$tc('modals.date')"
                rules="required"
                name="Date"
              />
            </div>
            <div class="ctm-modal__content-field">
              <base-field
                v-model="cvvInput"
                placeholder="242"
                data-selector="CARD-CVV"
                :label="$tc('modals.cvv')"
                rules="required|cvv"
                name="CVV"
              />
            </div>
          </div>
        </div>
        <div
          v-if="step === 3"
          class="step__container"
          :class="{'step__container_grid': step === 3}"
        >
          <div>
            <img
              alt=""
              src="~/assets/img/temp/qr.svg"
            >
          </div>
          <div>
            <span class="step-three__text">{{ $t('wallet.send') }}</span>
            <span class="step-three__text_blue">0.2 $</span>
            <div class="step-three__text">
              {{ $t('wallet.toThisAddress') }}
            </div>
            <div class="code__container">
              <span class="code__text">{{ code }}</span>
              <button
                v-clipboard:copy="code"
                v-clipboard:success="ClipboardSuccessHandler"
                v-clipboard:error="ClipboardErrorHandler"
                type="button"
                @click="showSuccessCopied()"
              >
                <span class="icon-copy" />
              </button>
            </div>
          </div>
        </div>
        <div class="btn__container">
          <div class="btn__wrapper">
            <span
              v-if="step === 1"
              class="step__container"
            >
              <base-btn
                class="message__action"
                data-selector="NEXT-STEP"
                :disabled="!validated || !passed || invalid"
                @click="handleSubmit(nextStep)"
              >
                {{ $t('meta.btns.next') }}
              </base-btn>
            </span>
            <span
              v-if="step === 2"
              class="step__container"
            >
              <base-btn
                data-selector="CONFIRM"
                class="message__action"
                :disabled="invalid"
                @click="handleSubmit(nextStep)"
              >
                {{ $t('meta.btns.confirm') }}
              </base-btn>
            </span>
            <span
              v-if="step === 3"
              class="step__container"
            >
              <base-btn
                class="message__action"
                data-selector="BUY"
                @click="CloseModal"
              >
                {{ $t('meta.buyWUSD') }}
              </base-btn>
            </span>
          </div>
          <div class="btn__wrapper">
            <base-btn
              mode="outline"
              data-selector="CANCEL"
              class="message__action"
              @click="CloseModal"
            >
              {{ $t('meta.btns.cancel') }}
            </base-btn>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalDeposit',
  data() {
    return {
      amountInput: '',
      cardNumberInput: '',
      dateInput: '',
      cvvInput: '',
      step: 1,
      code: '0xf376g...G7f3g8b',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    nextStep() {
      this.step += 1;
    },
    // TODO: Зарефакторить!
    showSuccessCopied() {
      this.ShowModal({
        key: modals.status,
        img: require('assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.textCopy'),
      });
    },
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.icon {
  &-copy:before {
    content: "\e996";
    color: $blue;
    font-size: 20px;
  }
}

.code {
  &__container {
    display: flex;
    border: 1px solid $black0;
    border-radius: 6px;
    justify-content: space-between;
    padding: 12px;
    margin: 33px 0 0 0;
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
  &-three {
    &__text {
      @include text-simple;
      font-weight: 400;
      font-size: 16px;
      color: $black500;
      &_blue {
        @extend .step-three__text;
        color: $blue;
      }
    }
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
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 10px 0 0;
    &_active {
      color: $black800;
      border-bottom: 1px solid $blue;
      padding: 0 0 12px 0;
    }
  }
}

.ctm-modal {
  &__content-field {
    margin: 15px 0 0 0;
  }
  &__equal {
    margin: 0 0 35px 10px;
  }
  &__fake-input {
    font: inherit;
    height: 46px;
    padding: 10px 20px;
    width: 100%;
    color: #B1B3B8;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid $black0;
    margin-bottom: 23px;
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
}

.messageSend {
  max-width: 495px !important;
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
