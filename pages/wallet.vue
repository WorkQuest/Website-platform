<template>
  <div class="wallet">
    <div class="wallet__container">
      <div class="wallet__body">
        <div class="wallet__nav">
          <span class="wallet__title">{{ $t('wallet.wallet') }}</span>
          <div class="wallet__address">
            <span class="user__wallet">{{ userAddress }}</span>
            <button
              v-clipboard:copy="userAddress"
              v-clipboard:success="ClipboardSuccessHandler"
              v-clipboard:error="ClipboardErrorHandler"
              type="button"
              @click="showSuccessCopied()"
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
              <span class="balance__currency">{{ `${balance} ${userInfo.currency}` }}</span>
              <span class="balance__usd">{{ `$ ${balance}` }}</span>
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
        <!--        TODO: вернуть позже как добавится на бэке -->
        <!--        <div class="wallet__table">-->
        <!--          <base-table-->
        <!--            class="wallet__table"-->
        <!--            :title="$t('wallet.table.trx')"-->
        <!--            :items="transactionsData"-->
        <!--            :fields="walletTableFields"-->
        <!--          />-->
        <!--        </div>-->
        <!--      </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Wallet',
  data() {
    return {
      cardClosed: false,
      balance: '',
      fullBalance: '',
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      userInfo: 'data/getUserInfo',
      transactions: 'data/getTransactions',
      transactionsData: 'data/getTransactionsData',
      isWalletConnected: 'wallet/isWalletConnected',
      userAddress: 'wallet/userAddress',
    }),
    walletTableFields() {
      return [
        {
          key: 'tx_hash', label: this.$t('wallet.table.txHash'), sortable: false,
        },
        {
          key: 'status', label: this.$t('wallet.table.status'), sortable: false,
        },
        {
          key: 'block', label: this.$t('wallet.table.block'), sortable: false,
        },
        {
          key: 'timestamp', label: this.$t('wallet.table.timestamp'), sortable: false,
        },
        {
          key: 'transferred', label: this.$t('wallet.table.transferred'), sortable: false,
        },
        {
          key: 'value', label: this.$t('wallet.table.value'), sortable: false,
        },
        {
          key: 'transaction_fee', label: this.$t('wallet.table.trxFee'), sortable: false,
        },
      ];
    },
  },
  beforeMount() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.SetLoader(true);
      const res = await this.$store.dispatch('wallet/getBalance');
      if (res.ok) {
        this.balance = res.result.balance;
        this.fullBalance = res.result.fullBalance;
      }
      this.SetLoader(false);
    },
    closeCard() {
      this.cardClosed = true;
    },
    showTransferModal() {
      this.ShowModal({
        key: modals.giveTransfer,
        balance: this.fullBalance,
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
    showSuccessCopied() {
      this.ShowModal({
        key: modals.copiedSuccess,
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
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
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
  }

  &__usd {
    @include text-simple;
    color: $blue;
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

@include _1199 {
  .wallet {
    margin: 0 20px 0 20px;
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
}
@include _480 {
  .user {
    &__wallet {
      font-size: 13px;
    }
  }
}
@include _480 {
  .user {
    &__wallet {
      font-size: 12px;
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
