<template>
  <ctm-modal-box
    class="buy-auction"
    :title="$t('modals.buyAuction')"
  >
    <div class="buy-auction__content">
      <div class="buy-auction__info">
        <div class="buy-auction__info-unit">
          <h4 class="buy-auction__info-header">
            {{ $t('modals.recipient') }}
          </h4>
          <p class="buy-auction__info-value">
            {{ options.auction.recipient }}
          </p>
        </div>
        <div class="buy-auction__info-unit">
          <h4 class="buy-auction__info-header">
            {{ $t('modals.amount') }}
          </h4>
          <p class="buy-auction__info-value">
            {{ options.auction.price }} {{ options.auction.currency }}
          </p>
        </div>
        <div class="buy-auction__info-unit">
          <h4 class="buy-auction__info-header">
            {{ $t('modals.totalFee') }}
          </h4>
          <p class="buy-auction__info-value">
            0.15$
          </p>
        </div>
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          mode="outline"
          :is-submit="false"
          @click="hide"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          @click="confirmBuy"
        >
          {{ $t('meta.confirm') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalBuyAuction',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    confirmBuy() {
      console.log('buy');
    },
  },
};
</script>

<style lang="scss" scoped>
.buy-auction {
  max-width: 620px !important;
  &__content {
    padding: 28px;
  }
  &__info {
    background-color: $black0;
    padding: 15px;
    border-radius: 6px;
    &-unit {
      margin: 20px 0;
      &:first-of-type, &:last-of-type {
        margin: 0;
      }
    }
    &-value {
      font-weight: 500;
      font-size: 18px;
      line-height: 130%;
      opacity: 0.3;
    }
    &-header {
      font-weight: 500;
      font-size: 24px;
      line-height: 130%;
      color: $black800;
      margin-bottom: 15px;
    }
  }
}
.buttons{
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 40px;
}
</style>
