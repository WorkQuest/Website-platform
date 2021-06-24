<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.withdraw')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__content-field">
        <label for="date_input">{{ $t('modals.address') }}</label>
        <base-field
          id="date_input"
          v-model="date_input"
          :placeholder="'0 WUSD'"
        />
      </div>
      <label for="value_dd">{{ $t('modals.value') }}</label>
      <base-dd
        id="value_dd"
        type="gray"
        :items="items"
      />
      <div class="ctm-modal__content-field">
        <label for="cardNumber_input">{{ $t('modals.amount') }}</label>
        <base-field
          id="cardNumber_input"
          v-model="cardNumber_input"
          :placeholder="'1234 1234 1234 1234'"
        />
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
  name: 'ModalTransfer',
  data() {
    return {
      date_input: '',
      balance_input: '',
      cardNumber_input: '',
      items: ['1234 1234 1234 1234'],
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

.ctm-field {
  &__err {
    display: none;
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
