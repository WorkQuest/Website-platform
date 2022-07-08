<template>
  <ctm-modal-box
    class="transaction"
    :is-header="false"
  >
    <div class="transaction__content">
      <img
        :src="options.mode ==='error' ? require('assets/img/ui/warning.svg') : require('assets/img/ui/transactionSend.svg')"
        alt="Transaction send"
        class="transaction__image"
      >
      <div class="transaction__title">
        {{ options.mode ==='error' ? $t('modals.transactionError') : $t('modals.transactionSent') }}
      </div>
      <a
        v-if="options.txUrl"
        :href="options.txUrl"
        target="_blank"
      >
        {{ $t('modals.transactionCheck') }}
      </a>
      <base-btn
        class="transaction__action"
        data-selector="OK"
        @click="CloseModal"
      >
        {{ $t('meta.btns.ok') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'ModalTransactionSend',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.transaction {
  max-width: 337px !important;
  &__content {
    padding: 30px;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
  &__title{
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
    color: #1D2127;
    margin-top: 10px;
  }
  &__desc{
    font-size: 16px;
    line-height: 130%;
    color: #4C5767;
    text-align: center;
  }
}
</style>
