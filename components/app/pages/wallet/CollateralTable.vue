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
        <div>{{ $t('wallet.collateral.generatedAmount') }}</div>
        <div>{{ $t('meta.price') }}</div>
        <div>{{ $t('wallet.collateral.ratio') }}</div>
        <div>{{ $t('wallet.table.index') }}</div>
      </div>
      <div
        v-for="(item, i) of collaterals"
        :key="i"
        class="collateral__item item"
        :class="{item_full: i === idxHistory}"
      >
        <div
          class="item__wrapper table_grid"
          @click.stop="toggleHistory(i, item)"
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
          <div>{{ item.wusdGenerated }}</div>
          <div>{{ item._price }}</div>
          <div>{{ item.colRatio }}</div>
          <div>{{ item.index }}</div>
          <div
            class="item__caret"
            @click.stop="toggleHistory(i, item)"
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
              :disabled="!isAvailableToClaim"
              @click.stop="handleGenerate(item)"
            >
              {{ $t('meta.btns.generate') }}
            </base-btn>
            <base-btn
              class="item__btn"
              data-selector="DEPOSIT"
              :disabled="!isAvailableToDeposit"
              @click.stop="handleDeposit(item)"
            >
              {{ $t('meta.deposit') }}
            </base-btn>
            <base-btn
              class="item__btn"
              data-selector="REVERT"
              :disabled="!isAvailableToRemove"
              @click.stop="handleCollateralAction(item, 'removeCollateral')"
            >
              {{ $t('meta.btns.remove') }}
            </base-btn>
          </div>
          <div class="history__wrapper">
            <div class="history__header history__table">
              <div>{{ $t('meta.type') }}</div>
              <div>{{ $t('wallet.collateral.lockedAmount') }}</div>
              <div>{{ $t('wallet.collateral.generatedAmount') }}</div>
              <div>{{ $t('meta.price') }}</div>
              <div>{{ $t('wallet.table.txHash') }}</div>
              <div>{{ $t('wallet.collateral.generationTime') }}</div>
            </div>
            <div
              v-for="(row, j) of history"
              :key="`row-${j}`"
              class="history__row history__table"
            >
              <div>{{ movedEventStatus[row.status] }}</div>
              <div>{{ row.lockedAmount }}</div>
              <div>{{ row.wusdGenerated }}</div>
              <div>{{ row._price }}</div>
              <a
                class="item__hash"
                :href="`${$options.ExplorerUrl}/tx/${row.transactionHash}`"
                target="_blank"
              >
                {{ CutTxn( row.transactionHash) }}
              </a>
              <div>{{ $moment(row.timestamp * 1000).format('MMMM Do YYYY, hh:mm a') }}</div>
            </div>
            <!--            <base-pager-->
            <!--              v-if="totalHistoryPages > 1"-->
            <!--              :value="historyParams.page"-->
            <!--              :total-pages="totalHistoryPages"-->
            <!--              class="history__pages"-->
            <!--            />-->
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
      v-model="page"
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
import { TokenSymbols, ExplorerUrl } from '~/utils/enums';

const LIMIT = 10;
const HISTORY_LIMIT = 5;

export default {
  name: 'CollateralTable',
  images,
  ExplorerUrl,
  data() {
    return {
      idxHistory: null,
      availableToClaim: null,
      isAvailableToClaim: false,
      availableToDepositWUSD: null,
      isAvailableToDeposit: false,
      availableToAddCollateral: null,
      isAvailableToAddCollateral: false,
      isAvailableToRemove: true,
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
      history: 'collateral/getHistoryCollateral',
      historyCount: 'collateral/getHistoryCollateralCount',

      walletAddress: 'user/getUserWalletAddress',
    }),
    movedEventStatus() {
      return {
        '-1': 'Removed',
        0: 'Generated',
        1: 'Burn',
        2: 'Deposit',
        3: 'LotLiquid',
        4: 'Produced',
      };
    },
    totalPages() {
      return Math.ceil(this.collateralsCount / LIMIT) || 0;
    },
    totalHistoryPages() {
      return Math.ceil(this.historyCount / HISTORY_LIMIT) || 0;
    },
  },
  watch: {
    async page() {
      this.idxHistory = null;
      await this.fetchCollaterals({
        address: this.walletAddress,
        params: { limit: LIMIT, offset: (this.page - 1) * LIMIT },
      });
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
    async toggleHistory(idx, item) {
      if (this.idxHistory === idx) {
        this.idxHistory = null;
        this.$store.commit('collateral/setHistoryCollateral', { rows: [], count: null });
      } else {
        this.idxHistory = idx;
        await this.checkActionsPossibilities(item);
        await this.fetchCollateralInfo({
          address: this.walletAddress,
          collateralId: item.id,
          params: {},
        });
      }
    },

    async checkActionsPossibilities({
      symbol, collateral, price, deposit, lockedAmount,
    }) {
      if (new BigNumber(lockedAmount).isEqualTo(0)) {
        this.isAvailableToClaim = false;
        this.isAvailableToDeposit = false;
        this.isAvailableToRemove = false;
        return;
      }

      await this.updatePrices();
      const oraclePrice = this.prices[this.symbols.indexOf(symbol)];
      if ([TokenSymbols.USDT, TokenSymbols.USDC].includes(symbol)) {
        collateral = new BigNumber(collateral).shiftedBy(12).toString();
      }

      // available for claimExtraDebt
      this.availableToClaim = new BigNumber(oraclePrice).minus(price)
        .multipliedBy(collateral)
        .dividedBy(deposit)
        .shiftedBy(-18)
        .toNumber();
      this.isAvailableToClaim = new BigNumber(this.availableToClaim).isGreaterThan(0);

      // available for disposeDebt
      this.availableToDepositWUSD = new BigNumber(price).minus(oraclePrice)
        .multipliedBy(collateral)
        .dividedBy(deposit)
        .shiftedBy(-18)
        .toNumber();
      this.isAvailableToDepositWUSD = new BigNumber(this.availableToDepositWUSD).isGreaterThan(0);

      // available for addCollateral
      this.availableToAddCollateral = new BigNumber(price)
        .multipliedBy(collateral)
        .dividedBy(oraclePrice)
        .minus(collateral)
        .shiftedBy(-18)
        .toNumber();
      this.isAvailableToAddCollateral = new BigNumber(this.availableToAddCollateral).isGreaterThan(0);
      this.isAvailableToDeposit = this.isAvailableToDepositWUSD || this.isAvailableToAddCollateral;

      this.isAvailableToRemove = true;
    },

    async handleGenerate(item) {
      if (!this.isAvailableToClaim) return;

      this.ShowModal({
        key: modals.status,
        title: this.$t('meta.btns.generate'),
        subtitle: this.$t('wallet.collateral.attentionInfoRise'),
        isNotClose: true,
        submitMethod: async () => await this.handleCollateralAction(item, 'claimExtraDebt'),
      });
    },

    async handleDeposit(item) {
      if (!this.isAvailableToDeposit) return;
      const mode = this.isAvailableToDepositWUSD ? 'disposeDebt' : 'addCollateral';

      this.ShowModal({
        key: modals.status,
        title: this.$t('meta.attention'),
        subtitle: this.$t('wallet.collateral.attentionInfoFalling'),
        isNotClose: true,
        submitMethod: async () => await this.handleCollateralAction(item, mode),
      });
    },

    async handleCollateralAction({
      index, symbol, lockedAmount, debt,
    }, mode) {
      if (!this.isAvailableToRemove) return;

      this.ShowModal({
        key: modals.collateralTransaction,
        mode,
        symbol,
        lockedAmount,
        availableToClaim: this.availableToClaim,
        availableToDepositWUSD: this.availableToDepositWUSD,
        availableToDepositCollateral: this.availableToAddCollateral,
        amountToRemoveCollateral: new BigNumber(debt).shiftedBy(-18).toString(),
        submit: async (method, currency) => {
          this.SetLoader(true);

          const payload = [index, currency];
          if (method === 'removeCollateral') {
            payload.splice(1, 0, debt);
          }

          const { ok } = await this.collateralAction({ method, payload });
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
    grid-template-columns: repeat(6, 1fr) 36px;

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

  &__wrapper {
    height: 72px;
    cursor: pointer;
  }

  &_full {
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

  &__hash {
    text-decoration-line: none;
    color: $blue;
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
    grid-template-columns: repeat(4, 0.7fr) repeat(2, 1fr);

    text-align: center;

    padding: 0 12px;
  }

  &__header {
    background: rgba(0, 131, 199, 0.1);
    color: $blue;
    height: max-content;
    padding: 3px 12px;
  }

  &__row {
    padding: 12px;
  }
}
</style>
