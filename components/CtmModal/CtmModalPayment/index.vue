<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.payment')"
  >
    <div class="ctm-modal__content">
      <validation-observer>
        <div class="step__container">
          <div class="ctm-modal__content-field">
            <base-field
              v-model="cardNumberInput"
              placeholder="1234 1234 1234 1234"
              data-selector="CARD-NUMBER"
              :is-hide-error="true"
              :label="$tc('modals.numberOfCard')"
            />
          </div>
          <div class="ctm-modal__content-field">
            <base-field
              v-model="cardNumberInput"
              placeholder="1234 1234 1234 1234"
              data-selector="CARDHOLDER-NAME"
              :is-hide-error="true"
              :label="$tc('modals.cardHolder')"
            />
          </div>
          <div class="grid__2col">
            <div class="ctm-modal__content-field">
              <base-field
                v-model="dateInput"
                placeholder="02/24"
                data-selector="CARD-DATE"
                :is-hide-error="true"
                :label="$tc('modals.date')"
              />
            </div>
            <div class="ctm-modal__content-field">
              <base-field
                v-model="cvvInput"
                placeholder="242"
                data-selector="CARD-CVV"
                :is-hide-error="true"
                :label="$tc('modals.cvv')"
              />
            </div>
          </div>
        </div>
        <div class="btn__container">
          <div class="btn__wrapper">
            <span class="step__container">
              <base-btn
                class="message__action"
                data-selector="SUBMIT"
                @click="showModalLevelRaised()"
              >
                {{ $t('meta.btns.submit') }}
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
      balanceInput: '',
      cardNumberInput: '',
      dateInput: '',
      cvvInput: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
    showModalLevelRaised() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.yourLevelHasBeenRaised'),
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
