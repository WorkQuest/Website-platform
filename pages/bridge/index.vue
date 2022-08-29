<template>
  <div class="bridge-page">
    <div class="bridge-page__container">
      <div class="bridge-page__header header">
        <div class="header__left">
          <div class="title">
            {{ $t('bridge.pageName') }}
          </div>
          <div class="title_sub">
            {{ $t('bridge.pageAbout') }}
          </div>
        </div>
        <div class="header__right">
          <base-btn
            mode="light"
            class="header__btn"
            :disabled="connectionType !== $options.ConnectionTypes.WEB3"
            :data-selector="!isConnected ? 'CONNECT-WALLET' : 'DISCONNECT-FROM-WALLET'"
            @click="toggleConnection"
          >
            {{ connectionButtonText }}
          </base-btn>
          <p
            v-if="!isWeb3Connection || isConnected"
            class="header__address"
          >
            {{ $t('info.yourWallet') }}
            <span>
              {{ CutTxn(account.address, 5, 5) }}
            </span>
          </p>
        </div>
      </div>

      <wallet-switcher />

      <div class="bridge-page__content">
        <div class="info-block">
          <div class="info-block__swap-cont">
            <div>
              <div class="info-block__name_bold">
                {{ $t("bridge.sourceBlockchain") }}
              </div>
              <div class="contract-data">
                <div class="contract-data__title">
                  {{ $t('bridge.blockchain') }}
                </div>
                <base-dd
                  v-model="sourceAddressInd"
                  type="border"
                  :is-icon="true"
                  :items="addresses"
                  data-selector="SOURCE_ADDRESS"
                />
              </div>
            </div>
            <img
              alt="Swap"
              width="34"
              height="38"
              class="swap-icon"
              src="~assets/img/ui/swap.png"
              @click="toggleBlockchain"
            >
            <div>
              <div class="info-block__name_bold">
                {{ $t("bridge.targetBlockchain") }}
              </div>
              <div class="contract-data">
                <div class="contract-data__title">
                  {{ $t('bridge.blockchain') }}
                </div>
                <base-dd
                  v-model="targetAddressInd"
                  type="border"
                  :is-icon="true"
                  :items="addresses"
                  data-selector="TARGET_ADDRESS"
                />
              </div>
            </div>
          </div>
          <div class="info-block__btns-cont">
            <base-btn
              data-selector="SHOW-SWAP-MODAL"
              :disabled="isWeb3Connection && (metamaskStatus === 'notInstalled' || !isConnected)"
              @click="showSwapModal"
            >
              {{ $t('bridge.createSwap') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block info-block_overflow">
          <div class="info-block__name">
            {{ $t('bridge.mySwaps') }}
          </div>
          <div class="bridge-page__table">
            <b-table
              :items="swaps"
              :fields="tableFields"
              show-empty
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(direction)="el">
                <div class="table__direction">
                  <img
                    :src="el.item.direction[0]"
                    alt="Blockchain from"
                  >
                  <img
                    class="arrow-img"
                    src="~/assets/img/ui/arrow-down.svg"
                    alt="Arrow"
                  >
                  <img
                    :src="el.item.direction[1]"
                    alt="Blockchain to"
                  >
                </div>
              </template>
              <template #cell(recipient)="el">
                <div class="table__value">
                  {{ convertedRecipientTable(el) }}
                </div>
              </template>
              <template #cell(transactionHash)="el">
                <div class="table__value">
                  {{ CutTxn(el.item.transactionHash) }}
                  <button-copy
                    :copy-value="el.item.transactionHash"
                  />
                </div>
              </template>
              <template #cell(amount)="el">
                <div class="table__value">
                  {{ `${ToFixedDecimals(el.item.amount)} ${el.item.symbol}` }}
                </div>
              </template>
              <template #cell(created)="el">
                <div class="table__value table__value_blue">
                  {{ $moment(new Date(el.item.created * 1000)).locale($i18n.locale).format('MMMM Do YYYY, hh:mm a') }}
                </div>
              </template>
              <template #cell(redeem)="el">
                <div class="table__value table__value_blue">
                  <base-btn
                    :data-selector="`REDEEM-${el.item.nonce}`"
                    class="btn__redeem"
                    :class="!el.item.status ? 'btn__redeem_disabled' : ''"
                    mode="outline"
                    :disabled="!el.item.status || (!isConnected && isWeb3Connection)"
                    @click="redeemAction(el.item)"
                  >
                    {{ el.item.status ? $t('meta.redeem') : $t('meta.redeemed') }}
                  </base-btn>
                </div>
              </template>
              <template
                v-if="!swapsCount"
                slot="empty"
              >
                <div class="bridge-page__empty-info">
                  <empty-data :description="$tc('meta.listIsEmpty')" />
                </div>
              </template>
            </b-table>
          </div>
        </div>
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          :total-pages="totalPages"
          class="bridge-page__pages"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import {
  Chains, ConnectionTypes, Layout, Path, TokenSymbols,
} from '~/utils/enums';
import {
  BlockchainByIndex, BlockchainIndex, BridgeAddresses, SwapAddresses,
} from '~/utils/сonstants/bridge';
import {
  getChainIdByChain, getEstimateGas, getTransactionCount, GetWeb3Provider,
} from '~/utils/web3';
import { images } from '~/utils/images';
import { LoaderStatusLocales } from '~/utils/loader';
import WalletSwitcher from '~/components/app/WalletSwitcher';
import { GetWalletProvider } from '~/utils/wallet';
import walletOperations from '~/plugins/mixins/walletOperations';
import { WQBridge } from '~/abi';

export default {
  name: 'Bridge',
  components: { WalletSwitcher },
  mixins: [walletOperations],
  ConnectionTypes,
  layout({ $cookies }) {
    return $cookies.get('access') ? Layout.DEFAULT : Layout.GUEST;
  },
  data() {
    return {
      metamaskStatus: localStorage.getItem('metamaskStatus'),
      sourceAddressInd: 0,
      targetAddressInd: 1,
      updateInterval: null,
      query: {
        limit: 10,
        offset: 0,
      },
      page: 1,
    };
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      token: 'user/accessToken',

      isConnected: 'web3/isConnected',

      swaps: 'bridge/getSwaps',
      swapsCount: 'bridge/getSwapsCount',

      connections: 'main/notificationsConnectionStatus',

      balanceData: 'wallet/getBalanceData',
      web3Account: 'web3/getAccount',
      userWalletAddress: 'user/getUserWalletAddress',
      connectionType: 'web3/getConnectionType',
    }),
    isWeb3Connection() {
      return this.connectionType === ConnectionTypes.WEB3;
    },
    connectionButtonText() {
      if (this.connectionType === ConnectionTypes.WQ_WALLET) return this.$t('meta.connected');
      return !this.isConnected ? this.$t('mining.connectWallet') : this.$t('meta.disconnect');
    },
    getProviderByConnection() {
      if (this.isWeb3Connection) return GetWeb3Provider;
      return GetWalletProvider;
    },
    account() {
      if (this.isWeb3Connection) return this.web3Account;
      return { address: this.userWalletAddress };
    },
    tableFields() {
      const cellStyle = {
        thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
        tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
      };
      return [
        {
          key: 'direction',
          label: this.$t('bridge.tableHead.direction'),
          thStyle: { padding: '0 0 0 23px', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px' },
        },
        {
          key: 'recipient',
          label: this.$t('bridge.tableHead.recipient'),
          ...cellStyle,
        },
        {
          key: 'transactionHash',
          label: this.$t('bridge.tableHead.tx'),
          ...cellStyle,
        },
        {
          key: 'amount',
          label: this.$t('modals.amount'),
          ...cellStyle,
        },
        {
          key: 'created',
          label: this.$t('bridge.tableHead.created'),
          ...cellStyle,
        },
        {
          key: 'redeem',
          label: '',
          thStyle: cellStyle.thStyle,
          tdAttr: { style: 'display: flex; align-items: center; height: 64px; line-height: 64px' },
        },
      ];
    },
    addresses() {
      return [
        SwapAddresses.get(Chains.ETHEREUM),
        SwapAddresses.get(Chains.BINANCE),
        SwapAddresses.get(Chains.WORKNET),
      ];
    },
    totalPages() {
      return Math.ceil(this.swapsCount / this.query.limit);
    },
  },
  watch: {
    connectionType() {
      this.handlerDisconnect();
      this.toggleConnection();
    },
    sourceAddressInd(newIdx, oldIdx) {
      if (this.targetAddressInd === newIdx) this.targetAddressInd = oldIdx;
    },
    targetAddressInd(newIdx, oldIdx) {
      if (this.sourceAddressInd === newIdx) this.sourceAddressInd = oldIdx;
    },
    async page() {
      this.query.offset = (this.page - 1) * this.query.limit;
      await this.swapsTableData();
    },
  },
  async mounted() {
    const connect = async () => {
      if ((this.connectionType === ConnectionTypes.WEB3 && !this.isConnected) || !this.swapsCount) {
        await this.toggleConnection();
      }
    };
    if (!this.token) {
      this.ShowModal({
        key: modals.areYouSure,
        title: this.$t('modals.defiWalletNote.title'),
        text: this.$t('modals.defiWalletNote.subtitle'),
        okBtnTitle: this.$t('modals.defiWalletNote.useWalletWQ'),
        closeBtnTitle: this.$t('meta.skip'),
        cancelBtnFunc: async () => {
          this.CloseModal();
          await connect();
        },
        okBtnFunc: () => {
          this.$router.push(Path.SIGN_UP);
        },
      });
    } else {
      await connect();
    }
  },
  async beforeDestroy() {
    await this.$store.dispatch('wallet/connectToProvider', Chains.WORKNET);
    const preventDisconnect = sessionStorage.getItem('preventDisconnectWeb3');
    sessionStorage.removeItem('preventDisconnectWeb3');
    if (preventDisconnect) return;

    this.$store.commit('bridge/resetToken');
    await this.unsubscribe(this.account.address);
    await this.handlerDisconnect();
  },
  methods: {
    ...mapActions({
      fetchSwaps: 'bridge/fetchMySwaps',
      resetSwaps: 'bridge/resetMySwaps',
      redeem: 'bridge/redeemSwap',
      swap: 'bridge/swap',
      subscribe: 'bridge/subscribeWS',
      unsubscribe: 'bridge/unsubscribeWS',

      goToChain: 'web3/goToChain',
      connectWallet: 'web3/connect',
      disconnectWallet: 'web3/disconnect',
    }),
    convertedRecipientTable(el) {
      const { chainTo, recipient } = el.item;
      const { CutTxn, convertToBech32 } = this;
      if (chainTo === 1) return CutTxn(convertToBech32('wq', recipient));
      return CutTxn(recipient);
    },
    async toggleConnection() {
      const {
        isWeb3Connection, isConnected, addresses, sourceAddressInd,
      } = this;
      if (isWeb3Connection && isConnected) await this.handlerDisconnect();
      else {
        const { chain } = addresses[sourceAddressInd];
        if (isWeb3Connection) await this.connectWallet({ chain });
        else if (this.token) {
          await this.$store.dispatch('wallet/checkWalletConnected', {
            nuxt: this.$nuxt,
            needConfirm: this.isAuth,
          });
        }
        await Promise.all([
          this.subscribe(this.account.address),
          this.swapsTableData(),
        ]);
      }
    },
    async handlerDisconnect() {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      await Promise.all([
        this.unsubscribe(this.account.address),
        this.resetSwaps(),
        this.disconnectWallet(), // web3
      ]);
    },
    async swapsTableData() {
      if (this.isWeb3Connection && !this.isConnected) return;
      const { account, query } = this;
      await this.fetchSwaps({
        recipientAddress: account.address,
        query,
      });
    },
    toggleBlockchain() {
      const currentSource = this.sourceAddressInd;
      this.sourceAddressInd = this.targetAddressInd;
      this.targetAddressInd = currentSource;
    },
    async checkNetwork(chain) {
      if (!this.isConnected) {
        await this.connectWallet({ chain });
        if (!this.isConnected) return false;
        return await this.checkNetwork(chain);
      }

      const isMetaMask = localStorage.getItem('isMetaMask') === 'true';
      const isCorrectNetwork = +getChainIdByChain(chain) === +this.account.netId;
      if (!isCorrectNetwork && isMetaMask) {
        const { ok } = await this.goToChain({ chain });
        return ok;
      }
      if (!isCorrectNetwork && !isMetaMask) {
        this.ShowModalFail({ title: this.$t('modals.errors.errorNetwork', { network: chain }) });
        return false;
      }
      return true;
    },
    async redeemAction({
      chain, signData, chainFrom, chainTo, transactionHash,
    }) {
      const makeRedeem = async () => {
        this.SetLoader({
          isLoading: true,
          statusText: this.isWeb3Connection ? LoaderStatusLocales.waitingForTxExternalApp : LoaderStatusLocales.pleaseWaitTx,
        });
        const res = await this.redeem({
          signData, chainTo, provider: this.getProviderByConnection(), accountAddress: this.account.address,
        });
        this.SetLoader(false);
        if (res.ok) {
          this.$store.commit('bridge/setRedeemed', transactionHash);
          const link = `${SwapAddresses.get(chain).explorer}/tx/${res.result.transactionHash}`;
          this.ShowModalSuccess({ title: this.$t('modals.redeem.success'), link });
        } else {
          this.ShowModalFail({ title: this.$t('modals.redeem.fail'), subtitle: res.msg });
        }
      };

      if (this.isWeb3Connection) {
        if (await this.checkNetwork(chain)) await makeRedeem();
        return;
      }

      this.SetLoader(true);
      await this.$store.dispatch('wallet/connectToProvider', chain);
      const [feeRes] = await Promise.all([
        this.$store.dispatch('wallet/getContractFeeData', {
          method: 'redeem',
          abi: WQBridge,
          contractAddress: BridgeAddresses[BlockchainByIndex[chainTo]],
          data: signData,
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      this.SetLoader(false);
      if (!feeRes.ok) {
        this.ShowToast(feeRes.msg);
        return;
      }
      const nativeTokenSymbol = SwapAddresses.get(chain).nativeSymbol;

      const tokenSymbol = signData[7];

      let { decimals } = this.balanceData[tokenSymbol].decimals;
      if ([TokenSymbols.USDT, TokenSymbols.USDC].includes(tokenSymbol)) {
        if (+chainTo === BlockchainIndex[Chains.BINANCE]) {
          decimals = 18;
        } else {
          decimals = 6;
        }
      }

      const toRedeem = new BigNumber(signData[2]).shiftedBy(-decimals || -18).toString();

      this.ShowModal({
        key: modals.transactionReceipt,
        title: 'Redeem',
        fields: {
          chain: { name: this.$t('modals.bridge'), value: chain },
          toRedeem: { name: this.$t('modals.amount'), value: toRedeem, symbol: tokenSymbol },
          fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: nativeTokenSymbol },
        },
        submitMethod: async () => await makeRedeem(),
      });
    },

    async showSwapModal() {
      const {
        isWeb3Connection, addresses, sourceAddressInd, targetAddressInd,
      } = this;
      const { chain } = addresses[sourceAddressInd];
      if (isWeb3Connection) {
        if (!await this.checkNetwork(chain)) return;
      } else {
        this.SetLoader(true);
        await this.$store.dispatch('wallet/connectToProvider', chain);
        this.SetLoader(false);
      }

      const from = addresses[sourceAddressInd];
      const to = addresses[targetAddressInd];

      this.ShowModal({
        key: modals.swap,
        from,
        to,
        submit: async ({
          amount, symbol, isNative, decimals,
        }) => {
          if (this.isWeb3Connection) await this.swapWeb3(from, to, amount, symbol, isNative, decimals);
          else await this.swapWQWallet(from, to, amount, symbol, isNative, decimals);
        },
      });
    },

    // Swap for work quest wallet
    async swapWQWallet(from, to, amount, symbol, isNative, decimals) {
      const nativeTokenSymbol = SwapAddresses.get(from.chain).nativeSymbol;
      this.ShowModal({
        key: modals.transactionReceipt,
        fields: {
          bridge: { name: this.$t('modals.bridge'), value: `${from.chain} > ${to.chain}` },
          swapValue: { name: this.$t('modals.amount'), value: amount, symbol },
          sender: { name: this.$t('modals.senderAddress'), value: this.account.address },
          recipient: { name: this.$t('modals.recipientAddress'), value: this.account.address },
        },
        submitMethod: async () => {
          const swap = async () => {
            const provider = this.getProviderByConnection();
            const nonce = await getTransactionCount(this.account.address.toString(), provider);
            const value = new BigNumber(amount).shiftedBy(decimals).toString();
            const data = [nonce, to.index, value, this.account.address, symbol];
            const inst = new provider.eth.Contract(WQBridge, BridgeAddresses[from.chain]);
            const [gasPrice, estimateGas] = await Promise.all([
              provider.eth.getGasPrice(),
              getEstimateGas(null, null, inst, 'swap', data, isNative ? value : null),
              this.$store.dispatch('wallet/getBalance'),
            ]);

            if (!gasPrice || !estimateGas) {
              this.ShowToast('', 'Swap error');
              return;
            }

            this.ShowModal({
              key: modals.transactionReceipt,
              title: 'Swap',
              fields: {
                sender: { name: this.$t('modals.senderAddress'), value: this.account.address },
                recipient: { name: this.$t('modals.recipientAddress'), value: this.account.address },
                swapValue: { name: this.$t('modals.amount'), value: amount, symbol },
                fee: {
                  name: this.$t('wallet.table.trxFee'),
                  value: new BigNumber(gasPrice).multipliedBy(estimateGas).shiftedBy(-18).toString(),
                  symbol: nativeTokenSymbol,
                },
              },
              submitMethod: async () => await this.handleSwap(from, to, amount, symbol, isNative, decimals),
            });
          };

          if (isNative) {
            await swap();
            return;
          }

          await this.MakeApprove({
            contractAddress: BridgeAddresses[from.chain],
            tokenAddress: from.tokenAddress[symbol],
            amount,
            symbol,
            nativeTokenSymbol,
          }).then(async () => {
            await swap();
          }).catch((err) => {
            console.error(err);
            this.ShowToast(err.msg, 'Swap error');
          }).finally(() => {
            this.SetLoader(false);
          });
        },
      });
    },
    // Swap for metamask
    async swapWeb3(from, to, amount, symbol, isNative, decimals) {
      this.ShowModal({
        key: modals.swapInfo,
        amount,
        symbol,
        from,
        chain: from.chain,
        recipient: this.account.address,
        networks: `${from.chain} > ${to.chain}`,
        fromNetwork: from.chain,
        toNetwork: to.chain,
        submit: async () => {
          this.CloseModal();
          if (!this.account?.netId) {
            this.ShowToast(this.$t('meta.disconnect'));
            return;
          }
          await this.handleSwap(from, to, amount, symbol, isNative, decimals);
        },
      });
    },

    // sending swap transaction
    async handleSwap(from, to, amount, symbol, isNative, decimals) {
      this.SetLoader({
        isLoading: true,
        statusText: this.isWeb3Connection ? LoaderStatusLocales.waitingForTxExternalApp : LoaderStatusLocales.pleaseWaitTx,
      });
      const { ok, result, msg } = await this.swap({
        amount,
        symbol,
        decimals,
        isNative,
        toChainIndex: to.index,
        tokenAddress: from.tokenAddress[symbol],
        bridgeAddress: BridgeAddresses[from.chain],
        provider: this.getProviderByConnection(),
        accountAddress: this.account.address,
      });
      if (ok) {
        this.page = 1;
      }
      this.SetLoader(false);
      this.ShowModal({
        key: modals.status,
        img: !ok ? images.WARNING : images.SUCCESS,
        title: !ok ? this.$t('modals.transactionFail') : this.$t('modals.transactionSent'),
        link: !ok ? '' : `${from.explorer}/tx/${result?.transactionHash}`,
        text: ok ? '' : msg,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-copy {
  color: $blue;
}

.swap-icon {
  transition: .3s ease-in-out;

  &:hover {
    filter: drop-shadow(0 0 3px rgba(72, 72, 72, 0.5));
    cursor: pointer;
  }
}

.bridge-page {
  &__empty-info {
    .absence {
      background: white;
    }
  }

  &__container {
    width: 100%;
  }

  &__pages {
    margin-top: 20px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: flex-end;

    .header {
      &__btn {
        width: 200px;
        margin-bottom: 10px;
      }

      &__address {
        color: $black200;
        font-weight: 400;
        font-size: 16px;
        line-height: 130%;
        text-align: right;
        span {
          font-weight: 600;
          color: $black0;
        }
      }
    }

    .title {
      font-weight: 500;
      color: #FFF;
      max-width: 530px;
      font-size: 45px;
      line-height: 110%;
      margin: 0 0 24px;

      &_sub {
        @extend .title;
        font-size: 16px;
        line-height: 100%;
        opacity: 0.5;
      }
    }
  }

  &__content {
    width: 100%;

    .btn {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      color: #0083C7;
      border: 1px solid #0083C71A;
      border-radius: 6px;
      transition: .3s;
      height: 35px;
      margin-top: 3px;

      &:hover {
        background-color: #0083C71A;
        border: 0;
      }

      &_bl {
        @extend .btn;
        background-color: #0083C7;
        border: unset;
        color: #fff;

        &:hover {
          background-color: #103d7c;
        }
      }

      &__redeem {
        &_disabled {
          color: #D8DFE3 !important;
        }
      }
    }

    .info-block {
      background-color: #fff;
      border-radius: 6px;
      margin-top: 20px;

      &_overflow {
        overflow: auto;
      }

      &__swap-cont {
        display: grid;
        grid-template-columns: 1fr 34px 1fr;
        gap: 20px;
        align-items: end;
        padding: 20px;

        img {
          display: flex;
          align-self: flex-end;
          margin-bottom: 5px;
        }

        .contract-data {
          display: grid;
          grid-template-rows: repeat(1, 1fr);
          gap: 5px;
          margin-top: 20px;

          &__title {
            font-weight: 400;
            font-size: 16px;
            margin-bottom: 5px;
          }

          &__link {
            border: 1px solid $black0;
            border-radius: 6px;
            padding: 0 20px;
            display: grid;
            grid-template-columns: 1fr 23px;
            gap: 10px;
            height: 46px;
            align-items: center;

            button {
              margin-top: 3px;
            }

            .address {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 16px;
              color: #1D2127;

              &__icon {
                font-size: 24px;

                &::before {
                  color: $blue;
                }
              }
            }
          }

          &__balance {
            border: 1px solid $black0;
            border-radius: 6px;
            padding: 0 20px;
            height: 46px;
            box-sizing: border-box;
            display: grid;

            .title {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 46px;
            }
          }
        }
      }

      &__btns-cont {
        padding: 0 20px 20px 20px;
        display: grid;

        .base-btn {
          grid-column: 7;
        }
      }

      &__title {
        color: #0083C7;
        font-weight: 700;
        font-size: 25px;
      }

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 20px 20px 10px 20px;
        font-weight: 400;

        &_bold {
          font-weight: 500;
          font-size: 25px;
          color: #103D7C;
          line-height: 1;
        }
      }
    }
  }

  &__table {
    .table {
      min-width: 1180px;

      &__value {
        font-weight: 400;
        font-size: 16px;
        color: #1D2127;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;

        &_blue {
          color: #0083C7;
        }
      }

      &__direction {
        display: grid;
        grid-template-columns: 25px 14px 25px;
        height: 100%;
        align-items: center;
        gap: 5px;

        .arrow-img {
          transform: rotate(-90deg);
        }
      }
    }
  }

  @include _767 {
    &__header {
      .title {
        font-size: 38px;
        margin-bottom: 15px;
        width: 100%;

        &_sub {
          font-size: 16px;
          max-width: 400px;
        }
      }
    }
  }

  @include _575 {
    .header {
      flex-direction: column;
      &__address {
        text-align: left;
      }

      &__right {
        width: 100%;
      }

      &__btn {
        width: 100%;
      }
    }
    &__content {
      .info-block {
        &__swap-cont {
          grid-template-columns: 1fr 34px 1fr;
          grid-template-rows: repeat(3, auto);

          .swap-icon {
            grid-column: 2;
            grid-row: 2;
          }

          > div {
            grid-column: 1/4;
          }
        }

        &__btns-cont {
          .base-btn {
            grid-column: 2;
          }
        }
      }

      .btn {
        &__doc {
          border: 0;
          width: 23px;
          font-size: 0;
        }
      }
    }
  }

  @include _480 {
    &__content {
      .info-block {
        &__btns-cont {
          .base-btn {
            grid-column: 1;
          }
        }
      }
    }
  }
}
</style>
