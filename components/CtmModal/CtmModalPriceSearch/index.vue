<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.price')"
  >
    <div class="ctm-modal__content">
      <div>{{ $t('modals.enterPriceRange') }}</div>
      <div class="ctm-modal__content-field">
        <base-field
          id="from"
          v-model="to"
          :label="$t('modals.toAddress')"
          placeholder="0 WUSD"
        />
        <base-field
          id="to"
          v-model="from"
          :label="$t('modals.fromAddress')"
          placeholder="10 000 000 WUSD"
        />
      </div>
      <div class="btn btn__container">
        <div class="btn__wrapper">
          <base-btn
            :mode="'outline'"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
        </div>
        <div class="btn__wrapper">
          <base-btn
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
  name: 'ModalTransfer',
  data() {
    return {
      to: '',
      from: '',
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    margin: 15px 0 0 0;
  }
}

.ctm-modal {
  @include modalKit;
}

.btn {
  padding: 0;
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    margin: 15px 0 0 0;
  }
  &__wrapper {
    width: 100%;
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
}

</style>
