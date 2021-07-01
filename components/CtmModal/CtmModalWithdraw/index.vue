<template>
  <ctm-modal-box
    class="withdrawal"
    :title="$t('modals.withdraw')"
  >
    <div class="ctm-modal__content">
      <div class="grid__3col">
        <div class="ctm-modal__content-field">
          <label for="amount_input">{{ $t('modals.amount') }}</label>
          <base-field
            id="amount_input"
            :is-hide-error="true"
            :placeholder="'0 WDX'"
          />
        </div>
        <div class="ctm-modal__equal">
          =
        </div>
        <div class="ctm-modal__content-field">
          <base-field
            :is-hide-error="true"
            mode="white"
            :placeholder="'$ 0'"
          />
        </div>
      </div>
      <div class="ctm-modal__content-field">
        <label for="cardNumber_input">{{ $t('modals.numberOfCard') }}</label>
        <base-field
          id="cardNumber_input"
          v-model="cardNumber_input"
          :placeholder="'1234 1234 1234 1234'"
        />
      </div>
      <div class="ctm-modal__content-field_couple">
        <div>
          <label for="date_input">{{ $t('modals.date') }}</label>
          <base-field
            id="date_input"
            v-model="date_input"
            :placeholder="'02/24'"
          />
        </div>
        <div>
          <label for="cvv_input">{{ $t('modals.cvv') }}</label>
          <base-field
            id="cvv_input"
            v-model="cvv_input"
            :placeholder="'242'"
          />
        </div>
      </div>
      <div class="checkbox">
        <base-checkbox
          v-model="isShowMap"
          name="map"
          :label="$t('modals.saveCardForNextPayment')"
        />
      </div>
      <div class="ctm-modal__content-btns">
        <div class="btn-group">
          <base-btn
            class="btn"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="btn_bl"
            @click="showTransactionSendModal()"
          >
            {{ $t('meta.submit') }}
          </base-btn>
        </div>
      </div>
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
      date_input: '',
      balance_input: '',
      cardNumber_input: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
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

.withdrawal {
  max-width: 615px !important;
}

.ctm-modal {
  @include modalKit;

  &__equal {
    margin: 0 0 12px 12px;
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
    margin: 15px 0 0 0;

    &_couple {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }

  &__gray-zone {
    background-color: #F7F8FA;
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
          border: 0px;
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
