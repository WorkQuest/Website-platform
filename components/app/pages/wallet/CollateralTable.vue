<template>
  <div class="collateral">
    <div class="collateral__title">
      {{ $t('wallet.collateral.balance') }}
    </div>
    <div
      v-if="collateralsCount"
      class="collateral__content"
    >
      <div class="collateral__header table_grid">
        <div>{{ $t('wallet.collateral.collateralToken') }}</div>
        <div>{{ $t('wallet.collateral.lockedAmount') }}</div>
        <div>{{ $t('wallet.collateral.colRatio') }}</div>
        <div>{{ $t('wallet.collateral.generatedAmount') }}</div>
        <div>{{ $t('wallet.table.txHash') }}</div>
        <div>{{ $t('wallet.collateral.generationTime') }}</div>
      </div>
      <div
        v-for="(item, i) of collaterals"
        :key="i"
        class="collateral__table table_grid item"
        @click.stop="toggleHistory(i)"
      >
        <div class="item__coin">
          <img
            :src="getCollateralIcon(item.symbol)"
            alt=""
            class="item__coin-icon"
          >
          {{ item.symbol }}
        </div>
        <div>{{ item.lockedAmount }}</div>
        <div>{{ item.collateralizationRatio }}</div>
        <div>{{ item.wusdGenerated }}</div>
        <div>{{ CutTxn(item.txHash || '0xdcfe0996e2f645809e011136aa6b77b353d67f66b543e7a503067f2d07b53645') }}</div>
        <div>{{ item.time || $moment().format('MMMM Do YYYY, hh:mm a') }}</div>
        <div
          class="item__caret"
          @click.stop="toggleHistory(i)"
        >
          <span :class="{'icon-caret_down': i !== idxHistory, 'icon-caret_up': i === idxHistory}" />
        </div>
        <div
          v-show="i === idxHistory"
          class="item__history"
        >
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
    </div>
    <empty-data
      v-else
      :description="$tc('meta.listIsEmpty')"
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
import { mapActions, mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';
import { TokenSymbols } from '~/utils/enums';

const LIMIT = 5;

export default {
  name: 'CollateralTable',
  images,
  data() {
    return {
      idxHistory: null,
      page: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    ...mapGetters({
      collaterals: 'collateral/getCollaterals',
      collateralsCount: 'collateral/getCollateralsCount',

      walletAddress: 'user/getUserWalletAddress',
    }),
    totalPages() {
      return Math.ceil(this.collateralsCount / LIMIT) || 0;
    },
  },
  async mounted() {
    await this.fetchCollaterals({
      address: this.walletAddress,
      params: { limit: LIMIT, offset: 0 },
    });
  },
  methods: {
    ...mapActions({
      fetchCollaterals: 'collateral/fetchCollaterals',
    }),
    getCollateralIcon(symbol) {
      if (TokenSymbols.ETH === symbol) return images.ETH_BLACK;
      return images[symbol] || images.EMPTY_LOGO;
    },
    toggleHistory(idx) {
      this.idxHistory = this.idxHistory === idx ? null : idx;
    },

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
    height: max-content;
    padding: 8px 12px !important;
  }

}
.table {
  &_grid {
    min-width: 1180px;
    display: grid;
    align-content: center;
    align-items: center;
    justify-items: center;
    grid-template-columns: 115px repeat(3, 0.9fr) 1fr 1fr 36px;

    text-align: center;

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
  cursor: pointer;

  &:hover {
    border: 1px solid $black100
  }

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

  &__caret {
    padding-left: 12px;
    & span {
      font-size: 24px;
      color: $blue;
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
