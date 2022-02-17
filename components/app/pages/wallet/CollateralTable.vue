<template>
  <div class="collateral">
    <div class="collateral__title">
      Collateral balance
    </div>
    <div class="collateral__header table_grid">
      <div>coin</div>
      <div>attention quotient</div>
      <div>sum</div>
      <div>amount in dollars</div>
      <div>amount in dollars</div>
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
          selector=""
          @click="handleAdd"
        >
          Add
        </base-btn>
        <base-btn
          selector=""
          @click="handleTake"
        >
          Take
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
      });
    },
    handleTake() {
      this.ShowModal({
        key: modals.collateralTransaction,
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
