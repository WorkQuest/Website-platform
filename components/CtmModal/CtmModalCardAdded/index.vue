<template>
  <ctm-modal-box
    class="cardAdded"
    :is-header="false"
  >
    <div class="cardAdded__content">
      <img
        src="~assets/img/ui/cardHasBeenAdded.svg"
        alt="RequestSend"
        class="cardAdded__picture"
      >
      <div class="cardAdded__title">
        {{ $t('modals.cardHasBeenAdded') }}
      </div>
      <div class="cardAdded__desc">
        {{ $t('modals.cardAddedText') }}
      </div>
      <base-btn
        class="cardAdded__action"
        @click="showDepositOptions"
      >
        {{ $t('meta.ok') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ModalCardAdded',
  methods: {
    showDepositOptions() {
      this.ShowModal({
        key: modals.depositOptions,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.cardAdded {
  max-width: 337px!important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
    padding: 30px;
  }
  &__action {
    margin-top: 10px;
  }
  &__title{
    font-size: 23px;
    font-weight: 500;
    line-height: 130%;
    margin-top: 10px;
  }
  &__desc{
    text-align: center;
    color: #4C5767;
    font-size: 16px;
    line-height: 130%;
  }
}
</style>
