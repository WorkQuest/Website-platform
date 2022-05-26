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
      <div
        v-for="(item, i) of items"
        :key="i"
        class="table_grid item"
      >
        <div class="item__coin">
          <img
            :src="require('~/assets/img/ui/ethereum.svg')"
            alt=""
            class="item__coin-icon"
          >
          {{ item.coin }}
        </div>
        <div>{{ item.attentionQuotient }}</div>
        <div>{{ item.sum }}</div>
        <div>{{ item.amountInDollars1 }}</div>
        <div>{{ item.amountInDollars2 }}</div>
        <div class="item__actions">
          <base-btn
            data-selector="ADD"
            @click="handleAdd"
          >
            {{ $t('meta.btns.add') }}
          </base-btn>
          <base-btn
            data-selector="TAKE"
            @click="handleTake"
          >
            {{ $t('meta.btns.take') }}
          </base-btn>
        </div>
      </div>
    </div>
    <empty-data
      v-if="!items.length"
      :description="$t('meta.listIsEmpty')"
      class="table__empty"
    />
    <base-pager
      v-if="totalPages > 1"
      :value="page"
      :total-pages="totalPages"
      class="table__pages"
    />
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'CollateralTable',
  data() {
    return {
      page: 1,
      itemsPerPage: 10,
      items: [{
        coin: 'ETH',
        attentionQuotient: 0,
        sum: 0,
        amountInDollars1: 0,
        amountInDollars2: 0,
      }],
    };
  },
  computed: {
    totalPages() {
      const len = this.items.length;
      if (!len) return len;
      return Math.ceil(len / this.itemsPerPage);
    },
  },
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

  &__content {
    overflow-x: auto;
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
    min-width: 1180px;
    display: grid;
    grid-template-columns: 160px repeat(4, 1fr) 260px;
    align-items: center;
    padding: 0 12px;
    margin-top: 12px;
  }
  &__empty {
    margin-top: 20px;
  }
  &__pages {
    margin-top: 20px;
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
    &-icon {
      height: 30px;
      width: 30px;
    }
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
