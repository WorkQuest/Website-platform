<template>
  <ctm-modal-box
    class="collateral"
    :title="modalTitle"
  >
    <div class="collateral__content content">
      <div class="content__header">
        {{ $t('wallet.collateral.generationSubTitle') }}
      </div>
      <div class="content__header">
        {{ $t('wallet.collateral.tokenQuantity') }}
      </div>
      <div class="content__label">
        {{ $t(`meta.coins.${options.symbol}`) }}
      </div>
      <base-field
        data-selector="COLLATERAL-SYMBOL"
        disabled
        :value="options.collateral"
      />
      <div class="content__label">
        {{ $t('wallet.collateral.availableAmount') }}
      </div>
      <base-field
        data-selector="WUSD"
        placeholder="10"
        disabled
        :value="options.availableWUSD"
      />
      <div class="content__actions">
        <base-btn @click="handleSubmit">
          {{ submitText }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CollateralTransaction',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    modalTitle() {
      return this.options.mode === 'generate' ? this.$t('meta.btns.generate') : this.$t('meta.deposit');
    },
    submitText() {
      return this.options.mode === 'generate' ? this.$t('meta.btns.generate') : this.$t('meta.deposit');
    },
  },
  methods: {
    handleSubmit() {
      const { submit } = this.options;
      this.CloseModal();
      submit();
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 28px 30px;
  &__header {
    margin-bottom: 25px;
  }
  &__label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 10px;
  }
  &__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }
}
</style>
