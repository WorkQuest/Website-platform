<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.widthraw')"
  >
    <div class="ctm-modal__content">
      <div class="grid__3col">
        <div class="ctm-modal__content-field">
          <label for="amount_input">{{ $t('modals.amount') }}</label>
          <base-field
            id="amount_input"
            v-model="amount_input"
            :placeholder="'02/24'"
          />
        </div>
        <div class="ctm-modal__equal">
          =
        </div>
        <div class="ctm-modal__content-field">
          <base-field
            v-model="balance_input"
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
      <div
        class="ctm-modal__content-field"
        :class="{'hide': isShowCardInputs}"
      >
        <span
          v-if="!isShowCardInputs"
          class="link"
          @click="showCardInputs()"
        >
          {{ $t('modals.addAnotherCard') }}
        </span>
      </div>
      <div
        v-if="isShowCardInputs"
        class="grid__2col"
      >
        <div
          class="ctm-modal__content-field"
        >
          <label for="date_input">{{ $t('modals.date') }}</label>
          <base-field
            id="date_input"
            v-model="date_input"
            :placeholder="'02/24'"
          />
        </div>
        <div class="ctm-modal__content-field">
          <label for="cvv_input">{{ $t('modals.cvv') }}</label>
          <base-field
            id="cvv_input"
            v-model="cvv_input"
            :placeholder="'242'"
          />
        </div>
      </div>
      <div class="btn__container">
        <div class="btn__wrapper">
          <base-btn
            class="message__action"
            @click="showTransactionSendModal()"
          >
            {{ $t('meta.submit') }}
          </base-btn>
        </div>
        <div class="btn__wrapper">
          <base-btn
            :mode="'outline'"
            class="message__action"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
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
  name: 'ModalWidthraw',
  data() {
    return {
      cvv_input: '',
      amount_input: '',
      date_input: '',
      balance_input: '',
      cardNumber_input: '',
      isShowCardInputs: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    showCardInputs() {
      this.isShowCardInputs = !this.isShowCardInputs;
    },
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

.hide {
  display: none;
}

.link {
  justify-content: flex-end;
  text-decoration: underline;
  color: $blue;
  display: flex;
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
.grid {
  &__2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
    align-items: flex-end;
    grid-gap: 10px;
  }
}
.grid {
  &__3col {
    display: grid;
    grid-template-columns: 6fr 1fr 6fr;
    justify-content: space-between;
    align-items: flex-end;
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
