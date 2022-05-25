<template>
  <div class="wallet">
    <div class="wallet__container">
      <div class="wallet__body">
        <div class="buy-wqt">
          <div class="buy-wqt__title">
            {{ $t('wallet.buyWQT.title') }}
          </div>
          <div class="buy-wqt__sub">
            <div>{{ $t('wallet.buyWQT.sub') }}</div>
            <base-btn
              mode="outline"
              @click="showBuyWQTModal"
            >
              {{ $t('wallet.buyWQT.buyButton') }}
            </base-btn>
          </div>
        </div>
        <div class="wallet__nav">
          <span class="wallet__title">{{ $t('meta.wallet') }}</span>
          <div class="wallet__address">
            <span class="user__wallet">{{ shortWqAddress }}</span>
            <button
              v-clipboard:copy="wqAddress"
              v-clipboard:success="ClipboardSuccessHandler"
              v-clipboard:error="ClipboardErrorHandler"
              type="button"
              data-selector="COPY"
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
              <span class="balance__title">{{ $t('meta.balance') }}</span>
              <span class="balance__currency">
                <span
                  class="balance__currency-text"
                  :class="{'balance__currency-text_light': isFetchingBalance}"
                >
                  {{ selectedTokenBalanceInfo }}
                </span>
                <span
                  v-if="selectedToken === $options.TokenSymbols.WQT"
                  class="balance__usd-mobile"
                >
                  <span class="balance__usd-mobile_blue">
                    {{ $t('wallet.frozen') }}
                  </span>
                  {{ $t('meta.coins.count.WQTCount', {count: Floor(frozenBalance)}) }}
                </span>
                <base-dd
                  v-model="ddValue"
                  class="balance__token"
                  :items="tokenSymbolsDd"
                  :placeholder="$options.TokenSymbols.WQT"
                  data-selector="TOKENS"
                  type="border"
                />
              </span>
              <span :class="[{'balance__currency__margin-bottom' : selectedToken !== $options.TokenSymbols.WQT}]">
                <span
                  v-if="selectedToken === $options.TokenSymbols.WQT"
                  class="balance__usd balance__usd_blue"
                >
                  <span class="balance__usd">
                    {{ $t('wallet.frozen') }}
                  </span>
                  {{ $t('meta.coins.count.WQTCount', {count: Floor(frozenBalance)}) }}
                </span>
              </span>
            </div>
            <div class="balance__bottom">
              <base-btn
                data-selector="SHOW-DEPOSIT-MODAL"
                mode="outline"
                class="balance__btn"
                :disabled="true"
                @click="showModal({key: 'deposit'})"
              >
                {{ $t('wallet.receive') }}
              </base-btn>
              <base-btn
                data-selector="SHOW-WITHDRAW-MODAL"
                mode="outline"
                class="balance__btn"
                :disabled="true"
                @click="showModal({key: 'withdraw', branchText: 'withdraw' })"
              >
                {{ $t('meta.withdraw') }}
              </base-btn>
              <base-btn
                data-selector="SHOW-TRANSFER-MODAL"
                class="balance__btn"
                @click="showTransferModal()"
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
              data-selector="SHOW-ADD-CARD-MODAL"
              class="card__btn"
              mode="outline"
              :disabled="true"
              @click="showModal({key: 'addCard', branchText: 'adding' })"
            >
              {{ $t('wallet.addCard') }}
            </base-btn>
          </div>
        </div>
        <div class="wallet__switch-table">
          <base-btn
            data-selector="SWITCH-ALL"
            :mode="getSwitchButtonMode(walletTables.TXS)"
            @click="selectedWalletTable = walletTables.TXS"
          >
            {{ $t('meta.allTransactions') }}
          </base-btn>
          <base-btn
            data-selector="SWITCH-COLLATERAL"
            :mode="getSwitchButtonMode(walletTables.COLLATERAL)"
            @click="selectedWalletTable = walletTables.COLLATERAL"
          >
            {{ $t('meta.collateralTransactions') }}
          </base-btn>
        </div>
        <div
          v-if="selectedWalletTable === walletTables.TXS"
          class="wallet__txs"
        >
          <div class="wallet__table table">
            <base-table
              class="table__txs"
              :title="$tc('wallet.table.trx')"
              :items="styledTransactions"
              :fields="walletTableFields"
            />
            <empty-data
              v-if="!totalPages"
              :description="$tc('wallet.table.empty')"
              class="table__empty"
            />
          </div>
          <base-pager
            v-if="totalPages > 1"
            v-model="currentPage"
            :total-pages="totalPages"
          />
        </div>
        <div
          v-else
          class="wallet__txs"
        >
          <CollateralTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { ERC20 } from '~/abi/index';
import {
  TokenMap, TokenSymbolByContract, TokenSymbols, WalletTables, WorknetTokenAddresses, Chains,
} from '~/utils/enums';
import { getStyledAmount } from '~/utils/wallet';
import EmptyData from '~/components/app/info/emptyData';
import CollateralTable from '~/components/app/pages/wallet/CollateralTable';
import { error, success } from '~/utils/web3';

export default {
  name: 'Wallet',
  middleware: 'auth',
  components: { EmptyData, CollateralTable },
  TokenSymbols,
  data() {
    return {
      cardClosed: false,
      ddValue: 0,
      txsPerPage: 10,
      currentPage: 1,
      selectedWalletTable: WalletTables.TXS,
      tokenSymbolsDd: [],
      isFetchingBalance: false,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userWalletAddress: 'user/getUserWalletAddress',
      balance: 'wallet/getBalanceData',
      transactions: 'wallet/getTransactions',
      selectedToken: 'wallet/getSelectedToken',
      frozenBalance: 'wallet/getFrozenBalance',
      transactionsCount: 'wallet/getTransactionsCount',
      isWalletConnected: 'wallet/getIsWalletConnected',

      // buy wqt logic
      isMetamaskConnected: 'web3/isConnected',
    }),
    selectedTokenData() {
      return this.balance[this.selectedToken];
    },
    selectedTokenBalanceInfo() {
      if (!this.selectedTokenData) return this.selectedToken;
      return `${this.selectedTokenData?.balance || '0'} ${this.selectedToken}`;
    },
    wqAddress() {
      return this.convertToBech32('wq', this.userWalletAddress);
    },
    shortWqAddress() {
      return this.CutTxn(this.wqAddress, 8, 8);
    },
    walletTables() {
      return WalletTables;
    },
    totalPages() {
      if (!this.transactionsCount) return 0;
      return Math.ceil(this.transactionsCount / this.txsPerPage);
    },
    styledTransactions() {
      return this.transactions.map((t) => {
        const symbol = TokenSymbolByContract[t.to_address_hash.hex] || TokenSymbols.WQT;
        const decimals = this.balance[symbol].decimals || 18;
        return {
          tx_hash: t.hash,
          block: t.block_number,
          timestamp: this.$moment(t.block.timestamp).format('lll'),
          status: !!t.status,
          value: `${getStyledAmount(t.tokenTransfers[0]?.amount || t.value, false, decimals)} ${symbol}`,
          transaction_fee: t.transaction_fee || new BigNumber(t.gas_price).multipliedBy(t.gas_used),
          from_address: t.from_address_hash.hex,
          to_address: t.to_address_hash.hex,
        };
      });
    },
    tokenAddresses() {
      return WorknetTokenAddresses;
    },
    walletTableFields() {
      return [
        { key: 'tx_hash', label: this.$t('wallet.table.txHash'), sortable: true },
        { key: 'status', label: this.$t('wallet.table.status'), sortable: true },
        { key: 'block', label: this.$t('wallet.table.block'), sortable: false },
        { key: 'timestamp', label: this.$t('wallet.table.timestamp'), sortable: true },
        { key: 'from_address', label: this.$t('meta.fromBig'), sortable: true },
        { key: 'to_address', label: this.$t('meta.toBig'), sortable: true },
        { key: 'value', label: this.$t('wallet.table.transferred'), sortable: true },
        { key: 'transaction_fee', label: this.$t('wallet.table.trxFee'), sortable: false },
      ];
    },
  },
  watch: {
    balance() {
      this.tokenSymbolsDd = Object.keys(this.balance);
    },
    ddValue(newVal) {
      this.$store.dispatch('wallet/setSelectedToken', this.tokenSymbolsDd[newVal]);
    },
    async selectedToken() {
      const i = this.tokenSymbolsDd.indexOf(this.selectedToken);
      this.ddValue = i >= 0 && i < this.tokenSymbolsDd.length ? i : 1;
      await this.loadData();
    },
    currentPage() {
      this.getTransactions();
    },
  },
  beforeMount() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.$cookies.get('isWalletAppShowed')) {
      this.ShowModal({
        key: modals.downloadApp,
        title: this.$tc('modals.titles.downloadWallet'),
        subtitle: this.$t('modals.downWalletOnSmartphone'),
        app: 'isWalletAppShowed',
      });
    }
    if (!this.isWalletConnected) return;

    await this.$store.dispatch('wallet/subscribeWS', {
      hexAddress: this.userWalletAddress,
      timestamp: this.$moment(),
      updateWalletData: this.loadData,
    });
    await this.loadData();
  },
  async beforeDestroy() {
    await this.$store.dispatch('wallet/unsubscribeWS');
  },
  methods: {
    async showBuyWQTModal() {
      if (!this.isMetamaskConnected) {
        if (await this.$store.dispatch('web3/connect', { chain: Chains.ETHEREUM }) === false) {
          return;
        }
      }
      this.ShowModal({ key: modals.buyWQT });
    },
    getSwitchButtonMode(btn) {
      if (btn === this.selectedWalletTable) return '';
      return 'outline';
    },
    async getTransactions() {
      await this.$store.dispatch('wallet/getTransactions', {
        limit: this.txsPerPage,
        offset: this.txsPerPage * (this.currentPage - 1),
      });
    },
    async loadData() {
      this.isFetchingBalance = true;
      const { selectedToken, userWalletAddress } = this;
      if (selectedToken === TokenSymbols.WQT) {
        await Promise.all([
          this.$store.dispatch('wallet/getBalance'),
          this.$store.dispatch('wallet/updateFrozenBalance'),
        ]);
      } else {
        const payload = { address: userWalletAddress, abi: ERC20 };
        await this.$store.dispatch('wallet/fetchWalletData', {
          method: 'balanceOf', ...payload, token: this.tokenAddresses[this.tokenSymbolsDd.indexOf(selectedToken) - 1], symbol: selectedToken,
        });
      }
      await this.getTransactions();
      this.isFetchingBalance = false;
    },
    closeCard() {
      this.cardClosed = true;
    },
    showModal({ key, branch }) {
      this.ShowModal({
        key: modals[key],
        branch,
      });
    },
    showTransferModal() {
      if (this.isFetchingBalance) return;
      this.ShowModal({
        key: modals.giveTransfer,
        submit: async ({ recipient, amount, selectedToken }) => {
          const { wqAddress, convertToHex, convertToBech32 } = this;
          recipient = convertToHex('wq', recipient);
          const value = new BigNumber(amount).shiftedBy(Number(this.selectedTokenData.decimals)).toString();
          let feeRes;
          if (selectedToken === TokenSymbols.WQT) {
            feeRes = await this.$store.dispatch('wallet/getTransferFeeData', {
              recipient,
              value: amount,
            });
          } else {
            feeRes = await this.$store.dispatch('wallet/getContractFeeData', {
              method: 'transfer',
              abi: ERC20,
              contractAddress: TokenMap[selectedToken],
              data: [recipient, value],
            });
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            fields: {
              from: { name: this.$t('modals.fromAddress'), value: wqAddress },
              to: { name: this.$t('modals.toAddress'), value: convertToBech32('wq', recipient) },
              amount: {
                name: this.$t('modals.amount'),
                value: amount,
                symbol: selectedToken, // REQUIRED!
              },
              fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WQT },
            },
            submitMethod: async () => {
              this.CloseModal();
              this.SetLoader(true);
              const action = selectedToken === TokenSymbols.WQT ? 'transfer' : 'transferToken';
              const payload = selectedToken === TokenSymbols.WQT
                ? { recipient, value: amount }
                : {
                  abi: ERC20,
                  address: TokenMap[selectedToken],
                  data: [recipient, value],
                };
              const res = await this.$store.dispatch(`wallet/${action}`, payload);
              this.SetLoader(false);
              if (res.ok) {
                await this.ShowModal({ key: 'transactionSend' });
                await this.loadData();
                return success();
              }
              await this.ShowModal({ key: 'transactionSend', mode: 'error' });
              return error();
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.buy-wqt {
  margin-top: 20px;
  border-radius: 6px;
  padding: 20px;
  background: $blue;
  color: $white100;
  &__title {
    font-size: 22px;
    font-weight: 500;
  }
  &__sub {
    display: grid;
    grid-template-columns: 80% 1fr;
  }
}

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

  &__switch-table {
    display: grid;
    grid-template-columns: repeat(2, 210px);
    grid-gap: 10px;
    margin-bottom: 20px;
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

    &__margin-bottom {
      margin-bottom: 25px;
    }

    @include _767 {
      font-size: 26px;
    }

    &-text {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 1000px;
      padding-right: 20px;
      &_light {
        color: $black500;
      }
    }
  }

  &__token {
    height: 49px;
    box-sizing: border-box;
  }

  &__usd {
    @include text-simple;
    height: 24px;
    color: $black800;

    &_blue {
      color: $blue;
    }

    &-mobile {
      display: none;
      height: 33px;
      color: $black800;
      font-size: 18px;
      font-weight: normal;

      &_blue {
        color: $blue;
      }
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
    justify-self: self-end;
    height: 20px;
    width: 20px;
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
  .buy-wqt__sub {
    grid-template-columns: 1fr;
    grid-gap: 10px
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
  .wallet__switch-table {
    grid-template-columns: 1fr;
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
