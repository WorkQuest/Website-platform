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
        class="collateral__item item"
        :class="{item_full: i === idxHistory}"
        @click.stop="toggleHistory(i, item.id)"
      >
        <div class="item__wrapper table_grid">
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
            @click.stop="toggleHistory(i, item.id)"
          >
            <span :class="{'icon-caret_down': i !== idxHistory, 'icon-caret_up': i === idxHistory}" />
          </div>
        </div>
        <div
          v-show="i === idxHistory"
          class="item__history"
        >
          <div class="item__actions">
            <base-btn
              class="item__btn"
              data-selector="GENERATE"
              @click.stop="handleCollateralAction(item, 'generate')"
            >
              {{ $t('meta.btns.generate') }}
            </base-btn>
            <base-btn
              class="item__btn"
              data-selector="DEPOSIT"
              @click.stop="handleCollateralAction(item, 'deposit')"
            >
              {{ $t('meta.deposit') }}
            </base-btn>
            <base-btn
              class="item__btn"
              data-selector="REVERT"
              @click.stop="handleCollateralAction(item, 'remove')"
            >
              {{ $t('meta.btns.remove') }}
            </base-btn>
          </div>
          <div class="history__wrapper">
            <div class="history__header history__table">
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
            </div>
            <div class="history__rows history__table">
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
            </div>
            <base-pager
              v-if="totalHistoryPages > 1"
              :value="historyParams.page"
              :total-pages="totalHistoryPages"
              class="history__pages"
            />
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
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';
import { TokenSymbols } from '~/utils/enums';

const LIMIT = 10;
const HISTORY_LIMIT = 5;

export default {
  name: 'CollateralTable',
  images,
  data() {
    return {
      idxHistory: null,
      historyParams: {
        page: 1,
        limit: HISTORY_LIMIT,
        offset: 0,
        count: 5,
      },
      page: 1,
    };
  },
  computed: {
    ...mapGetters({
      prices: 'oracle/getPrices',
      symbols: 'oracle/getSymbols',

      collaterals: 'collateral/getCollaterals',
      collateralsCount: 'collateral/getCollateralsCount',

      walletAddress: 'user/getUserWalletAddress',
    }),
    totalPages() {
      return Math.ceil(this.collateralsCount / LIMIT) || 0;
    },
    totalHistoryPages() {
      return Math.ceil(this.historyParams.count / HISTORY_LIMIT) || 0;
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
      collateralAction: 'collateral/collateralAction',
      fetchCollaterals: 'collateral/fetchCollaterals',
      fetchCollateralInfo: 'collateral/fetchCollateralInfo',

      updatePrices: 'oracle/getCurrentTokensPrices',
    }),
    getCollateralIcon(symbol) {
      if (TokenSymbols.ETH === symbol) return images.ETH_BLACK;
      return images[symbol] || images.EMPTY_LOGO;
    },
    async toggleHistory(idx, id) {
      if (this.idxHistory === idx) this.idxHistory = null;
      else {
        this.idxHistory = idx;
        await this.fetchCollateralInfo({
          address: this.walletAddress,
          collateralId: id,
          params: {},
        });
      }
    },

    async handleCollateralAction({
      index, symbol, price, collateral, deposit,
    }, mode) {
      // (price - priceOracle) * collateral(USDT + 12 decimals) / deposit
      await this.updatePrices();
      const indexOfSymbol = this.symbols.indexOf(symbol);

      if (symbol === TokenSymbols.USDT) collateral = new BigNumber(collateral).shiftedBy(12).toString();

      const availableToClaim = new BigNumber(price)
        .minus(this.prices[indexOfSymbol])
        .multipliedBy(collateral)
        .dividedBy(deposit)
        .toString();
      console.log(availableToClaim);

      this.ShowModal({
        key: modals.collateralTransaction,
        mode,
        submit: async (method) => {
          this.SetLoader(true);
          const { ok } = await this.collateralAction({
            method,
            symbol,
            index,
          });
          this.SetLoader(false);

          if (ok) this.ShowModalSuccess({});
          else this.ShowModalFail({});
        },
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

  &__wrapper {
    height: 72px;
  }

  &_full {
    max-height: 350px;
    height: auto;
  }

  &:hover {
    box-shadow: -1px 1px 8px 0px $black100;
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
    display: flex;
    padding: 0 12px;
  }

  &__btn {
    width: 150px;
    margin-right: 20px;
  }

}

.history {
  &__wrapper {
    display: grid;
    grid-template-rows: auto auto;

    margin-top: 12px;
  }

  &__table {
    min-width: 1180px;
    display: grid;
    align-content: center;
    align-items: center;
    justify-items: center;
    grid-template-columns: 115px repeat(3, 0.9fr) 1fr 1fr 36px;

    text-align: center;

    padding: 0 12px;
  }

  &__header {
    background: rgba(0, 131, 199, 0.1);
    color: $blue;
    height: max-content;
    padding: 3px 12px;
  }
}
</style>
