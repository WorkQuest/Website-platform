<template>
  <div class="collateral">
    <div class="collateral__title">
      {{ $t('wallet.collateral.balance') }}
    </div>
    <div class="collateral__header table_grid">
      <div>{{ $t('wallet.collateral.coin') }}</div>
      <div>{{ $t('wallet.collateral.attentionQuotient') }}</div>
      <div>{{ $t('wallet.collateral.sum') }}</div>
      <div>{{ $t('wallet.collateral.amountInDollars') }}</div>
      <div>{{ $t('wallet.collateral.amountInDollars') }}</div>
    </div>
    <div
      v-for="(i) of 5"
      :key="i"
      class="table_grid item"
    >
      <div class="item__coin">
        <img
          src="/img/app/tokens/Ethereum.svg"
          alt="Logo"
        >
        ETH
      </div>
      <div>000000</div>
      <div>000000</div>
      <div>000000</div>
      <div>000000</div>
      <div class="item__actions">
        <base-btn
          selector="ADD"
          @click="handleAdd"
        >
          {{ $t('modals.add') }}
        </base-btn>
        <base-btn
          selector="TAKE"
          @click="handleTake"
        >
          {{ $t('modals.take') }}
        </base-btn>
      </div>
    </div>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'CollateralTable',
  methods: {
    handleAdd() {
      this.ShowModal({
        key: modals.collateralTransaction,
        mode: 'take',
      });
    },
    handleTake() {
      this.ShowModal({
        key: modals.collateralTransaction,
        mode: 'add',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.collateral {
  &__title {
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
    color: $black700;
  }

  &__header {
    background: rgba(0, 131, 199, 0.1);
    color: $blue;
    border-radius: 6px;
    height: 27px;
  }

}
.table {
  &_grid {
    background: red !important;
    position: relative;
    min-width: 1500px;
    overflow-x: auto;

    display: grid;
    grid-template-columns: 160px repeat(4, 1fr) 260px;
    align-items: center;
    padding: 0 12px;
    margin-top: 12px;
  }
}

.item {
  height: 72px;
  background: white;
  border-radius: 6px;

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  &__coin {
    display: grid;
    grid-template-columns: 36px 1fr;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
    line-height: 130%;
    color: $black600;
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 6px;
    & > div {
      max-height: 43px !important;
    }
  }
}
</style>
