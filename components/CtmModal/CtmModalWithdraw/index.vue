<template>
  <ctm-modal-box
    class="withdrawal"
    :title="$tc('modals.titles.withdrawCard')"
  >
    <div class="ctm-modal__content">
      <validation-observer v-slot="{ handleSubmit, validated, passed, invalid }">
        <div class="grid__3col">
          <div class="ctm-modal__content-field">
            <base-field
              id="amount_input"
              v-model="amount"
              data-selector="AMOUNT-WUSD"
              :label="$tc('modals.amount')"
              placeholder="0 WUSD"
              rules="min_value:0|required"
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
            v-model="cardNumber"
            data-selector="CARD-NUMBER"
            :label="$tc('modals.numberOfCard')"
            placeholder="1234 1234 1234 1234"
            rules="required|numberOfCard"
            name="Card number"
          />
        </div>
        <div class="ctm-modal__content-field_couple">
          <div>
            <base-field
              id="date_input"
              v-model="date"
              :label="$tc('modals.cardDate')"
              data-selector="CARD-DATE"
              placeholder="02/24"
              name="date"
              rules="required"
            />
          </div>
          <div>
            <base-field
              id="cvv_input"
              v-model="cvv"
              :label="$tc('modals.cvv')"
              data-selector="CARD-CVV"
              placeholder="242"
              rules="required|cvv"
              name="CVV"
            />
          </div>
        </div>
        <div class="checkbox">
          <base-checkbox
            v-model="isSavedCard"
            name="map"
            :label="$tc('modals.saveCardForNextPayment')"
          />
        </div>
        <div class="ctm-modal__content-btns">
          <div class="btn-group">
            <base-btn
              class="btn"
              data-selector="CANCEL"
              @click="CloseModal"
            >
              {{ $t('meta.btns.cancel') }}
            </base-btn>
            <base-btn
              class="btn_bl"
              data-selector="CONFIRM"
              :disabled="!validated || !passed || invalid"
              @click="handleSubmit(showTransactionSendModal)"
            >
              {{ $t('meta.btns.confirm') }}
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
  name: 'ModalWithdraw',
  data() {
    return {
      amount: '',
      date: '',
      balance: '',
      cardNumber: '',
      cvv: '',
      isSavedCard: false,
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
  },
};
</script>

<style lang="scss" scoped>

.withdrawal {
  max-width: 615px !important;
}

.ctm-modal {
  @include modalKit;

  &__equal {
    margin: 0 auto 35px;
  }

  .grid {
    &__3col {
      display: grid;
      grid-template-columns: 47% 6% 47%;
      justify-content: space-between;
      align-items: flex-end;
    }
  }

  .addLiquidity {
    max-width: 945px !important;
  }

  &__content-field {
    margin: 0 0 0 0;

    &_couple {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }

  &__gray-zone {
    background-color: $black0;
    border-radius: 5px;
    margin-top: 15px;
    padding: 0 20px 20px 20px;
  }

  &__grid-cont {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  &__content-btns {
    .btn-group{
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 10px));
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;

      .btn {
        box-sizing: border-box;
        font-weight: 400;
        font-size: 16px;
        color: #0083C7;
        border: 1px solid #0083C71A;
        border-radius: 6px;
        transition: .3s;
        background-color: #fff;

        &:hover {
          background-color: #0083C71A;
          border: 0;
        }

        &_bl {
          @extend .btn;
          background-color: #0083C7;
          border: unset;
          color: #fff;

          &:hover {
            background-color: #103d7c;
          }
        }
      }
    }
  }

  &__label {
    margin-bottom: 5px;
  }

  &__content {
    padding-top: 0 !important;
    margin-top: 15px;
  }

  &__title-head {
    font-size: 16px;
    font-weight: 400;
    margin-top: 20px;
  }

  &__subtitle {
    color: #7C838D;
    font-weight: 400;
    font-size: 16px;

    &_small {
      color: #7C838D;
      font-weight: 500;
      font-size: 14px;
    }
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

.base-btn {
  &_disabled {
    background: #D1D1CF !important;
  }
}

.input {
  &_grey {
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    border: 0;
    background-color: $black0;
    resize: none;
    margin-top: 10px;

    &::placeholder {
      color: $black200;
    }
  }
}

</style>
