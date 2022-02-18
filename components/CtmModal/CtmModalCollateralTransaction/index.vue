<template>
  <ctm-modal-box
    class="collateral"
    :title="modalTitle"
  >
    <div class="collateral__content content">
      <div class="content__header">
        Информация об eth или другом кошельке. Сколько это в %
      </div>
      <div class="content__label">
        {{ $t('modals.eth') }}
      </div>
      <base-field placeholder="10" />
      <div class="content__label">
        {{ $t('modals.wusd') }}
      </div>
      <base-field placeholder="10" />
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
      return this.options.mode === 'add' ? this.$t('wallet.collateral.addTitle') : this.$t('wallet.collateral.takeTitle');
    },
    submitText() {
      return this.options.mode === 'add' ? this.$t('modals.add') : this.$t('modals.take');
    },
  },
  methods: {
    handleSubmit() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.collateral {
}
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
