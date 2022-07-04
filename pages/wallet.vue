<template>
  <div class="wallet">
    <div class="wallet__container">
      <div class="wallet__body">
        <div class="buy-wqt">
          <div class="buy-wqt__title">
            {{ $t('wallet.buyWQT.title') }}
          </div>
          <div class="buy-wqt__sub">
            <div>
              <div class="buy-wqt__sub_text">
                {{ $t('wallet.buyWQT.sub') }}
              </div>
              <div class="buy-wqt__sub_text">
                {{ $t('wallet.buyWQT.networks') }}
              </div>
            </div>
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
              <div class="wallet__switch-network switch-network">
                <base-dd
                  :value="selectedNetworkIndex"
                  data-selector="NETWORK"
                  type="border"
                  class="switch-network__dropdown"
                  :items="networkList"
                  is-icon
                  @input="handleSwitchNetwork"
                />
              </div>
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
                  class="balance__frozen-mobile"
                >
                  <span class="balance__frozen-mobile_blue">
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
                  class="balance__frozen balance__frozen_blue"
                >
                  <span class="balance__frozen">
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
        <a
          v-if="selectedNetwork !== $options.Chains.WORKNET"
          :href="selectedNetworkExplorer.url"
          target="_blank"
          class="wallet__explorer-ref"
        >
          <img
            :src="selectedNetworkExplorer.icon"
            :alt="selectedNetwork"
          >
          {{ selectedNetwork }} explorer
        </a>
        <div
          v-else
          class="wallet__table-wrapper"
        >
          <div class="wallet__switch-table">
            <base-btn
              data-selector="SWITCH-ALL"
              :mode="getSwitchButtonMode(walletTables.TXS)"
              @click="selectedWalletTable = walletTables.TXS"
            >
              {{ $t('meta.allTransactions') }}
            </base-btn>
            <!-- TODO del v-show, this plug for release -->
            <base-btn
              v-show="!$options.IS_PLUG"
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
          <!-- TODO del v-if, remove this plug for release -->
          <div
            v-if="selectedWalletTable === walletTables.COLLATERAL && !$options.IS_PLUG"
            class="wallet__txs"
          >
            <CollateralTable />
          </div>
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
  TokenSymbolByContract,
  TokenSymbols,
  WalletTables,
  Chains,
  WalletTokensData,
} from '~/utils/enums';
import { getStyledAmount } from '~/utils/wallet';
import EmptyData from '~/components/app/info/emptyData';
import CollateralTable from '~/components/app/pages/wallet/CollateralTable';
import { error, success } from '~/utils/web3';
import { BuyWQTTokensData } from '~/utils/сonstants/bridge';
import { IS_PLUG } from '~/utils/locker-data';

export default {
  name: 'Wallet',
  middleware: 'auth',
  IS_PLUG,
  components: { EmptyData, CollateralTable },
  TokenSymbols,
  Chains,
  data() {
    return {
      cardClosed: false,
      ddValue: 0,
      txsPerPage: 10,
      currentPage: 1,
      selectedWalletTable: WalletTables.TXS,
      tokenSymbolsDd: [],
      isFetchingBalance: false,
      shortWqAddress: '',
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
      selectedNetwork: 'wallet/getSelectedNetwork',
    }),
    networkList() {
      return [
        BuyWQTTokensData.get(Chains.WORKNET),
        BuyWQTTokensData.get(Chains.ETHEREUM),
        BuyWQTTokensData.get(Chains.BINANCE),
        BuyWQTTokensData.get(Chains.POLYGON),
      ];
    },
    selectedNetworkIndex() {
      for (let i = 0; i < this.networkList.length; i += 1) {
        if (this.networkList[i].chain === this.selectedNetwork) return i;
      }
      console.error('Error on: selectedNetworkIndex', this.selectedNetwork);
      return 0;
    },
    selectedNetworkExplorer() {
      const net = WalletTokensData[this.selectedNetwork];
      return {
        url: `${net.explorer}/address/${this.userWalletAddress}`,
        icon: net.explorerIcon,
      };
    },
    nativeTokenSymbol() {
      return WalletTokensData[this.selectedNetwork].tokenList[0];
    },
    selectedTokenAddress() {
      return this.tokenAddresses[this.tokenSymbolsDd.indexOf(this.selectedToken) - 1];
    },
    tokenAddresses() {
      return WalletTokensData[this.selectedNetwork].tokenAddresses;
    },
    selectedTokenData() {
      return this.balance[this.selectedToken];
    },
    selectedTokenBalanceInfo() {
      if (!this.selectedTokenData) return this.selectedToken;
      return `${this.selectedTokenData?.balance || '0'} ${this.selectedToken}`;
    },
    wqAddress() {
      if (this.selectedNetwork === Chains.WORKNET) return this.convertToBech32('wq', this.userWalletAddress);
      return this.userWalletAddress;
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
        /**
         * @property gas_used
         * @property gas_price
         * @property tokenTransfers
         */
        const symbol = TokenSymbolByContract[t.to_address_hash?.hex] || TokenSymbols.WQT;
        const amount = t.tokenTransfers?.length ? t.tokenTransfers[0]?.amount : t.value;
        const txFee = t.transaction_fee || new BigNumber(t.gas_price).multipliedBy(t.gas_used).toString();
        return {
          tx_hash: t.hash,
          block: t.block_number,
          timestamp: this.$moment(t.block.timestamp).format('lll'),
          status: !!t.status,
          value: `${getStyledAmount(amount, false, this.balance[symbol].decimals || 18)} ${symbol}`,
          transaction_fee: `${getStyledAmount(txFee, false, this.balance[TokenSymbols.WQT].decimals || 18)} ${TokenSymbols.WQT}`,
          from_address: t.from_address_hash.hex,
          to_address: t.to_address_hash?.hex || '',
        };
      });
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
    selectedNetwork() {
      this.tokenSymbolsDd = WalletTokensData[this.selectedNetwork].tokenList;
      this.updateWQAddress();
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

    this.updateWQAddress();
    window.addEventListener('resize', this.updateWQAddress);

    this.tokenSymbolsDd = WalletTokensData[this.selectedNetwork].tokenList;

    await this.$store.dispatch('wallet/setCallbackWS', this.loadData);
    await this.loadData();
  },
  async beforeDestroy() {
    await this.$store.dispatch('wallet/connectToProvider', Chains.WORKNET);
    await this.$store.dispatch('wallet/setCallbackWS', null);

    window.removeEventListener('resize', this.updateWQAddress);
  },
  methods: {
    updateWQAddress() {
      const w = window.innerWidth;
      if (w > 600) this.shortWqAddress = this.wqAddress;
      else this.shortWqAddress = this.CutTxn(this.wqAddress, 8, 8);
    },
    async handleSwitchNetwork(index) {
      if (this.selectedNetworkIndex === index) return;
      this.isFetchingBalance = true;
      await this.$store.dispatch('wallet/connectToProvider', this.networkList[index].chain);
      this.isFetchingBalance = false;
    },
    async showBuyWQTModal() {
      if (this.selectedNetwork === Chains.WORKNET) {
        this.SetLoader(true);
        const res = await this.$store.dispatch('wallet/connectToProvider', Chains.ETHEREUM);
        this.SetLoader(false);
        if (!res.ok) {
          this.ShowModal(res.msg);
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

      // 0 token is always native token for current network!
      if (this.nativeTokenSymbol === selectedToken) {
        const toFetch = [this.$store.dispatch('wallet/getBalance')];
        if (this.selectedNetwork === Chains.WORKNET) {
          toFetch.push(this.$store.dispatch('wallet/updateFrozenBalance'));
        }
        await Promise.all(toFetch);
      } else {
        const payload = { address: userWalletAddress, abi: ERC20 };
        await this.$store.dispatch('wallet/fetchWalletData', {
          method: 'balanceOf',
          ...payload,
          token: this.tokenAddresses[this.tokenSymbolsDd.indexOf(selectedToken) - 1],
          symbol: selectedToken,
        });
      }
      this.isFetchingBalance = false;
      await this.getTransactions();
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
          const {
            wqAddress, convertToHex, nativeTokenSymbol,
          } = this;
          recipient = convertToHex('wq', recipient);
          const value = new BigNumber(amount).shiftedBy(Number(this.selectedTokenData.decimals)).toString();
          let feeRes;
          if (nativeTokenSymbol === selectedToken) {
            feeRes = await this.$store.dispatch('wallet/getTransferFeeData', {
              recipient,
              value: amount,
            });
          } else {
            feeRes = await this.$store.dispatch('wallet/getContractFeeData', {
              method: 'transfer',
              abi: ERC20,
              contractAddress: this.selectedTokenAddress,
              data: [recipient, value],
            });
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            fields: {
              from: { name: this.$t('meta.fromBig'), value: wqAddress },
              to: { name: this.$t('meta.toBig'), value: recipient },
              amount: {
                name: this.$t('modals.amount'),
                value: amount,
                symbol: selectedToken, // REQUIRED!
              },
              fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: nativeTokenSymbol },
            },
            submitMethod: async () => {
              this.CloseModal();
              const action = selectedToken === nativeTokenSymbol ? 'transfer' : 'transferToken';
              const payload = selectedToken === nativeTokenSymbol
                ? { recipient, value: amount }
                : {
                  abi: ERC20,
                  address: this.selectedTokenAddress,
                  data: [recipient, value],
                };
              const res = await this.$store.dispatch(`wallet/${action}`, payload);
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

  &__explorer-ref {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 5px 15px;
    background: $white;
    border-radius: 6px;
    border: 1px solid $black100;
    text-decoration: none;
    font-size: 20px;
    line-height: 20px;
    color: $black800;

    & img {
      margin-right: 5px;
      border: 1px solid $black100;
      border-radius: 50%;
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
      max-width: 1000px;
      padding-right: 20px;
      word-break: break-word;
      height: fit-content;
      &_light {
        color: $black500;
      }
    }
  }

  &__token {
    height: 49px;
    box-sizing: border-box;
  }

  &__frozen {
    @include text-simple;
    height: 24px;
    color: $black800;

    &_blue {
      color: $blue;
    }

    &-mobile {
      display: none;
      color: $black800;
      font-size: 18px;
      font-weight: normal;

      height: fit-content;
      word-break: break-word;

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

.switch-network {
  &__dropdown {
    margin-bottom: 10px;
    width: 200px;
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
  .balance__frozen {
    display: none;

    &-mobile {
      display: block;
    }
  }
  .wallet__switch-table {
    grid-template-columns: 1fr;
  }
  .balance__bottom {
    display: grid !important;
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
