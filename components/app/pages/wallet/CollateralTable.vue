<template>
  <div class="collateral">
    <div class="collateral__content">
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
      <div class="table_grid item">
        <div class="item__coin">
          <img
            src="/img/app/tokens/Ethereum.svg"
            alt="Logo"
          >
          ETH
        </div>
        <div>0</div>
        <div>0</div>
        <div>0</div>
        <div>0</div>
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
        mode: 'add',
      });
    },
    handleTake() {
      this.ShowModal({
        key: modals.collateralTransaction,
        mode: 'take',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.collateral {
  overflow-x: auto;
  &__content {
    min-width: 1180px;
  }

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
