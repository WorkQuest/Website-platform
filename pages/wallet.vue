<template>
  <div class="wallet">
    <div class="wallet__container">
      <div class="wallet__body">
        <div class="wallet__nav">
          <span class="wallet__title">{{ $t('wallet.wallet') }}</span>
          <div class="wallet__address">
            <span class="user__wallet">{{ CutTxn(userAddress, 8, 8) }}</span>
            <button
              v-clipboard:copy="userAddress"
              v-clipboard:success="ClipboardSuccessHandler"
              v-clipboard:error="ClipboardErrorHandler"
              type="button"
            >
              <span class="icon-copy wallet__icon" />
            </button>
          </div>
        </div>
        <div
          class="wallet__info"
          :class="{'wallet__info_full' : cardClosed }"
        >
          <div class="wallet__balance balance">
            <div class="balance__top">
              <span class="balance__title">{{ $t('wallet.balance') }}</span>
              <span class="balance__currency">
                <span class="balance__currency-text">
                  {{ balance[selectedToken].balance + ' ' + selectedToken }}
                </span>
                <span class="balance__usd_mobile">
                  <span v-if="selectedToken === tokenSymbols.WUSD">
                    {{ `$ ${balance[tokenSymbols.WUSD].balance}` }}
                  </span>
                </span>
                <base-dd
                  v-model="ddValue"
                  class="balance__token"
                  :items="tokenSymbolsDd"
                />
              </span>
              <span class="balance__usd">
                <span v-if="selectedToken === tokenSymbols.WUSD">
                  {{ `$ ${balance[tokenSymbols.WUSD].balance}` }}
                </span>
              </span>
            </div>
            <div class="balance__bottom">
              <base-btn
                :disabled="true"
                mode="outline"
                class="balance__btn"
                @click="showDepositModal()"
              >
                {{ $t('wallet.deposit') }}
              </base-btn>
              <base-btn
                :disabled="true"
                mode="outline"
                class="balance__btn"
                @click="showWithdrawModal()"
              >
                {{ $t('wallet.withdraw') }}
              </base-btn>
              <base-btn
                class="balance__btn"
                @click=" showTransferModal()"
              >
                {{ $t('modals.transfer') }}
              </base-btn>
            </div>
          </div>
          <div
            v-if="!cardClosed"
            class="wallet__card card"
          >
            <span class="card__title">{{ $t('wallet.addCardProposal') }}</span>
            <span
              class="icon-close_big card__icon"
              @click="closeCard()"
            />
            <base-btn
              :disabled="true"
              class="card__btn"
              mode="outline"
              @click="showAddCardModal()"
            >
              {{ $t('wallet.addCard') }}
            </base-btn>
          </div>
        </div>
        <div class="wallet__table table">
          <base-table
            class="table__txs"
            :title="$t('wallet.table.trx')"
            :items="styledTransactions"
            :fields="walletTableFields"
          />
          <empty-data
            v-if="!totalPages"
            :description="$t('wallet.table.empty')"
            class="table__empty"
          />
        </div>
        <base-pager
          v-if="totalPages > 1"
          v-model="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { TokenSymbols } from '~/utils/enums';
import { getStyledAmount } from '~/utils/wallet';
import EmptyData from '~/components/app/info/emptyData';

export default {
  name: 'Wallet',
  components: { EmptyData },
  data() {
    return {
      cardClosed: false,
      ddValue: 0,
      txsPerPage: 10,
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      userInfo: 'data/getUserInfo',
      transactions: 'wallet/getTransactions',
      transactionsCount: 'wallet/getTransactionsCount',
      isWalletConnected: 'wallet/getIsWalletConnected',
      userAddress: 'user/getUserWalletAddress',
      balance: 'wallet/getBalanceData',
      selectedToken: 'wallet/getSelectedToken',
    }),
    totalPages() {
      if (!this.transactionsCount) return 0;
      return Math.ceil(this.transactionsCount / this.txsPerPage);
    },
    styledTransactions() {
      const txs = this.transactions;
      const res = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const t of txs) {
        res.push({
          tx_hash: t.id,
          block: t.blockNumber,
          timestamp: this.$moment(t.timestamp).format('lll'),
          status: !!t.status,
          value: getStyledAmount(t.value),
          transaction_fee: new BigNumber(t.gasPrice).multipliedBy(t.gasUsed),
          from_address: t.fromAddress,
          to_address: t.toAddress,
        });
      }
      return res;
    },
    tokenSymbolsDd() {
      return Object.keys(TokenSymbols);
    },
    tokenSymbols() {
      return TokenSymbols;
    },
    walletTableFields() {
      return [
        { key: 'tx_hash', label: this.$t('wallet.table.txHash'), sortable: true },
        { key: 'status', label: this.$t('wallet.table.status'), sortable: true },
        { key: 'block', label: this.$t('wallet.table.block'), sortable: false },
        { key: 'timestamp', label: this.$t('wallet.table.timestamp'), sortable: true },
        { key: 'from_address', label: this.$t('modals.fromAddress'), sortable: true },
        { key: 'to_address', label: this.$t('modals.toAddress'), sortable: true },
        { key: 'value', label: this.$t('wallet.table.transferred'), sortable: true },
        { key: 'transaction_fee', label: this.$t('wallet.table.trxFee'), sortable: false },
      ];
    },
  },
  watch: {
    ddValue(val) {
      this.$store.dispatch('wallet/setSelectedToken', TokenSymbols[this.tokenSymbolsDd[val]]);
    },
    selectedToken() {
      const i = this.tokenSymbolsDd.indexOf(this.selectedToken);
      this.ddValue = i >= 0 && i < this.tokenSymbolsDd.length ? i : 1;
    },
    isConnected(newVal) {
      if (!newVal) this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
    },
    currentPage() {
      this.getTransactions();
    },
  },
  beforeMount() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    const i = this.tokenSymbolsDd.indexOf(this.selectedToken);
    this.ddValue = i >= 0 && i < this.tokenSymbolsDd.length ? i : 1;
    await this.loadData();
  },
  methods: {
    async getTransactions() {
      await this.$store.dispatch('wallet/getTransactions', {
        limit: this.txsPerPage,
        offset: this.txsPerPage * (this.currentPage - 1),
      });
    },
    async loadData() {
      this.SetLoader(true);
      await Promise.all([
        this.updateBalanceWQT(),
        this.updateBalanceWUSD(),
        this.getTransactions(),
      ]);
      this.SetLoader(false);
    },
    async updateBalanceWQT() {
      await this.$store.dispatch('wallet/getBalanceWQT', this.userAddress);
    },
    async updateBalanceWUSD() {
      await this.$store.dispatch('wallet/getBalance');
    },
    closeCard() {
      this.cardClosed = true;
    },
    showTransferModal() {
      this.ShowModal({
        key: modals.giveTransfer,
        callback: async () => await this.loadData(),
      });
    },
    showDepositModal() {
      this.ShowModal({
        key: modals.giveDeposit,
      });
    },
    showWithdrawModal() {
      this.ShowModal({
        key: modals.takeWithdraw,
        branch: 'withdraw',
      });
    },
    showAddCardModal() {
      this.ShowModal({
        key: modals.addingCard,
        branch: 'adding',
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.table {
  &__container {
    width: 100%;
  }
}

.status {
  &__title {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
  &__date {
    font-weight: 400;
    font-size: 14px;
    color: $black300;
  }
}

.btn {
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 16px 0 0 0;
    grid-gap: 20px;
  }
}

.wallet {
  &__container {
    display: flex;
    justify-content: center;
  }
  &__card {
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }
  &__balance {
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }
  &__body {
    max-width: 1180px;
    width: calc(100vw - 40px);
  }
  &__nav {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }
  &__address {
    @include text-simple;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
  }

  &__icon {
    margin-left: 22px;
    font-size: 24px;
    &::before {
      color: $blue;
    }
  }

  &__title {
    @include text-simple;
    font-size: 25px;
    font-weight: 500;
    margin-right: 10px;
  }

  &__info {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 479px;
    grid-gap: 20px;
    &_full {
      grid-template-columns: 1fr;
    }
  }
  &__table {
    position: relative;
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
    max-width: 100%;
    overflow-x: auto;
  }
}

.balance {
  display: flex;
  background: $white;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 6px;
  width: 100%;
  padding: 20px 20px 0 20px;
  margin: 0 0 20px 0;

  &__dollar {
    font-weight: 400;
    font-size: 14px;
    color: $black300;
  }
  &__number {
    font-weight: 700;
    font-size: 25px;
    color: $blue;
  }
  &__title {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }

  &__top {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__bottom {
    display: flex;
    grid-gap: 20px;
    padding: 20px 0 20px 0;
  }

  &__title {
    @include text-simple;
    color: #4C5767;
  }

  &__currency {
    @include text-simple;
    color: $black800;
    font-weight: 600;
    font-size: 35px;
    line-height: 130%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    @include _767 {
      font-size: 26px;
    }

    &-text {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 1000px;
      padding-right: 20px;
    }
  }

  &__token {
    height: 49px;
    border: 1px solid $black100;
    border-radius: 6px;
    box-sizing: border-box;
  }

  &__usd {
    @include text-simple;
    color: $blue;
    height: 24px;
    &_mobile {
      display: none;
      height: 33px;
      color: $blue;
      font-size: 18px;
      font-weight: normal;
    }
  }
}

.card {
  margin: 0 0 20px 0;
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-rows: auto 43px;
  grid-gap: 10px;
  grid-template-columns: 230px 1fr;
  @include text-simple;
  background: $blue url('/img/app/card.svg') no-repeat right center;
  background-size: cover;
  color: $white;
  position: relative;
  overflow: hidden;
  border: none !important;

  &__title {
    @include text-simple;
    color: $white;
    font-weight: 500;
    font-size: 20px;
    line-height: 130%;
  }

  &__btn {
    grid-column-start: 2;
    z-index: 2;
  }

  &__img {
    position: absolute;
    left: 144px;
    top: -43px;
    width: 355px;
    height: 250px;
    z-index: 1;
    object-fit: cover;
  }

  &__icon {
    display: flex;
    justify-content: flex-end;
    z-index: 2;
    &:before {
      cursor: pointer;
      font-size: 20px;
      color: $white;
    }
  }
}

.table {
  background: #FFFFFF;
  &__txs {
    margin: 0 !important;
    border-radius: 6px !important;
  }
  &__empty {
    background: #FFFFFF !important;
    margin: 10px 0 !important;
  }
}

@include _1199 {
  .wallet {
    &__info {
      display: flex;
      flex-direction: column-reverse;
    }
  }
  .card {
    margin: 0;
    grid-template-columns: 2fr 1fr;
    height: 240px;
  }
}
@include _991 {
  .wallet {
    &__table {
      overflow: auto;
      width: calc(100vw - 40px);
    }
  }
  .table {
    width: 1180px;
  }
}
@include _767 {
  .card {
    grid-template-columns: repeat(2, 1fr);
  }
  .balance__bottom {
    gap: 10px;
  }
}
@include _480 {
  .balance {
    &__currency {
      display: flex;
      flex-direction: column;
      align-items: unset;
    }
    &__token {
      margin-top: 5px;
    }
  }
  .balance__usd {
    display: none;
    &_mobile {
      display: block;
    }
  }
}
@include _350 {
  .wallet {
    &__nav {
      flex-direction: column;
    }
  }
}
</style>
