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
        <!--        <div class="item__actions">-->
        <!--          <base-btn-->
        <!--            data-selector="ADD"-->
        <!--            @click="handleAdd"-->
        <!--          >-->
        <!--            {{ $t('meta.btns.add') }}-->
        <!--          </base-btn>-->
        <!--          <base-btn-->
        <!--            data-selector="TAKE"-->
        <!--            @click="handleTake"-->
        <!--          >-->
        <!--            {{ $t('meta.btns.take') }}-->
        <!--          </base-btn>-->
        <!--        </div>-->
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
      if (TokenSymbols.USDT === symbol) return images.USDT;
      if (TokenSymbols.ETH === symbol) return images.ETH_BLACK;
      if (TokenSymbols.BNB === symbol) return images.BNB;
      return images.EMPTY_LOGO;
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
    height: 27px;
  }

}
.table {
  &_grid {
    min-width: 1180px;
    display: grid;
    grid-template-columns: 160px repeat(5, 1fr);
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
