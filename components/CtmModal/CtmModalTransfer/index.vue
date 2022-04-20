<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.sendTo')"
  >
    <!--    TODO: Зарефакторить-->
    <div class="ctm-modal__content">
      <div class="ctm-modal__content-field">
        <base-field
          id="from"
          v-model="date"
          data-selector="FROM"
          :label="$tc('meta.fromBig')"
          :placeholder="$t('meta.addressBig')"
        />
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          id="to"
          v-model="date"
          data-selector="TO"
          :label="$tc('meta.toBig')"
          :placeholder="$t('meta.addressBig')"
        />
      </div>
      <base-dd
        id="value_dd"
        type="gray"
        data-selector="AMOUNT"
        :label="$tc('modals.amount')"
        :items="items"
      />
      <div class="ctm-modal__content-field">
        <base-field
          id="cardNumber"
          v-model="cardNumber"
          :label="$tc('modals.amount')"
          data-selector="CARD-NUMBER"
          placeholder="0000 0000 0000 0000"
        />
      </div>
      <div class="btn__container">
        <div class="btn__wrapper">
          <base-btn
            class="message__action"
            data-selector="CONFIRM"
            @click="showTransactionSendModal()"
          >
            {{ $t('meta.btns.confirm') }}
          </base-btn>
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
      date: '',
      balance: '',
      cardNumber: '',
      items: ['0000 0000 0000 0000'],
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
