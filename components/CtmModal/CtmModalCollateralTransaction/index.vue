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
        {{ options.symbol }}
      </div>
      <base-field
        data-selector="COLLATERAL-SYMBOL"
        disabled
        :value="options.lockedAmount"
      />
      <div class="content__label">
        {{ $t('wallet.collateral.availableAmount') }}
      </div>
      <base-field
        data-selector="WUSD"
        placeholder="10"
        disabled
        :value="options.availableAmount"
      />
      <base-btn
        class="content__actions"
        @click="handleSubmit"
      >
        {{ submitText }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CollateralTransaction',
  data() {
    return {
      currentDeposit: null,
      selectedMethod: null,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    isGenerate() {
      return this.options.mode === 'claimExtraDebt';
    },
    modalTitle() {
      return this.isGenerate ? this.$t('meta.btns.generate') : this.$t('meta.deposit');
    },
    submitText() {
      return this.isGenerate ? this.$t('meta.btns.generate') : this.$t('meta.deposit');
    },
  },
  mounted() {
    this.selectedMethod = this.options.mode;
  },
  methods: {
    handleSubmit() {
      const { submit } = this.options;
      this.CloseModal();
      submit(this.selectedMethod);
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
    display: flex;
    max-width: 250px;
    margin: 0 auto;
  }
}
</style>
