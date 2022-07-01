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
            :data-selector="!isConnected ? 'CONNECT-WALLET' : 'DISCONNECT-FROM-WALLET'"
            @click="toggleConnection"
          >
            {{ !isConnected ? $t('mining.connectWallet') : $t('meta.disconnect') }}
          </base-btn>
          <p
            v-if="isConnected"
            class="header__address"
          >
            {{ $t('info.yourWallet') }}
            <span>
              {{ CutTxn(account.address, 5, 5) }}
            </span>
          </p>
        </div>
      </div>

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
              :disabled="metamaskStatus === 'notInstalled' || !isConnected"
              @click="showSwapModal"
            >
              {{ $t('bridge.createSwap') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block">
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
                  <button
                    v-clipboard:copy="el.item.transactionHash"
                    v-clipboard:success="ClipboardSuccessHandler"
                    v-clipboard:error="ClipboardErrorHandler"
                    type="button"
                    data-selector="COPY-BTN"
                  >
                    <span class="icon-copy" />
                  </button>
                </div>
              </template>
              <template #cell(amount)="el">
                <div class="table__value">
                  {{ `${Floor(el.item.amount)} ${el.item.symbol}` }}
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
                    :disabled="!el.item.status || !isConnected"
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
          class="table__pages"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import modals from '~/store/modals/modals';
import { Chains, Layout } from '~/utils/enums';
import { BridgeAddresses, SwapAddresses } from '~/utils/сonstants/bridge';
import { getChainIdByChain } from '~/utils/web3';
import { images } from '~/utils/images';
import { LoaderStatusLocales } from '~/utils/loader';

export default {
  name: 'Bridge',
  layout({ store }) {
    return store.getters['user/isAuth'] ? Layout.DEFAULT : Layout.GUEST;
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

      account: 'web3/getAccount',
      isConnected: 'web3/isConnected',

      swaps: 'bridge/getSwaps',
      swapsCount: 'bridge/getSwapsCount',

      connections: 'main/notificationsConnectionStatus',
    }),
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
    sourceAddressInd(newIdx, oldIdx) {
      if (this.targetAddressInd === newIdx) this.targetAddressInd = oldIdx;
    },
    targetAddressInd(newIdx, oldIdx) {
      if (this.sourceAddressInd === newIdx) this.sourceAddressInd = oldIdx;
    },
    async isConnected() {
      if (typeof this.account.address === 'string') {
        await this.swapsTableData(this.account.address, this.isConnected);
      }
    },
    async page() {
      this.query.offset = (this.page - 1) * this.query.limit;
      await this.swapsTableData();
    },
  },
  async beforeDestroy() {
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
      const { isConnected, addresses, sourceAddressInd } = this;
      if (isConnected) await this.handlerDisconnect();
      else {
        const { chain } = addresses[sourceAddressInd];
        await this.connectWallet({ chain });
        await this.subscribe(this.account.address);
      }
    },
    async handlerDisconnect() {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      await this.unsubscribe(this.account.address);
      await this.disconnectWallet();
      await this.resetSwaps();
    },
    async swapsTableData() {
      if (!this.isConnected) return;
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
    async redeemAction({ chain, signData, chainTo }) {
      this.SetLoader({ isLoading: true, statusText: LoaderStatusLocales.waitingForTxExternalApp });
      if (await this.checkNetwork(chain)) {
        const { ok } = await this.redeem({ signData, chainTo });

        if (ok) this.ShowModalSuccess({ title: this.$t('modals.redeem.success') });
        else this.ShowModalFail({ title: this.$t('modals.redeem.fail') });
      }
      this.SetLoader(false);
    },

    async showSwapModal() {
      const { addresses, sourceAddressInd, targetAddressInd } = this;
      const { chain } = addresses[sourceAddressInd];
      if (await this.checkNetwork(chain)) {
        const from = addresses[sourceAddressInd];
        const to = addresses[targetAddressInd];
        this.ShowModal({
          key: modals.swap,
          from,
          to,
          submit: async ({ amount, symbol, isNative }) => {
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
                this.SetLoader({ isLoading: true, statusText: LoaderStatusLocales.waitingForTxExternalApp });
                this.page = 1;
                const { ok, result } = await this.swap({
                  amount,
                  symbol,
                  isNative,
                  toChainIndex: to.index,
                  tokenAddress: from.tokenAddress[symbol],
                  bridgeAddress: BridgeAddresses[from.chain],
                });
                this.SetLoader(false);

                this.ShowModal({
                  key: modals.status,
                  img: !ok ? images.WARNING : images.SUCCESS,
                  title: !ok ? this.$t('modals.transactionFail') : this.$t('modals.transactionSent'),
                  link: !ok ? '' : `${from.explorer}/tx/${result?.transactionHash}`,
                });
              },
            });
          },
        });
      }
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
  background: linear-gradient(to bottom, #103D7C 420px, #f6f8fa 420px);
  display: flex;
  justify-content: center;

  &__empty-info {
    .absence {
      background: white;
    }
  }

  &__container {
    display: grid;
    grid-template-rows: 190px max-content;
    max-width: 1180px;
    grid-row-gap: 20px;
    width: 100%;
    box-sizing: border-box;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: flex-end;

    .header {
      &__btn {
        width: 200px;
      }

      &__address {
        color: $black200;
        margin-top: 10px;
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
    display: grid;
    grid-row-gap: 30px;
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

  @include _1199 {
    .bridge-page__container {
      padding: 0 30px !important;
    }
  }

  @include _991 {
    .bridge-page__table {
      overflow: auto;
    }
    &__table {
      width: calc(100vw - 80px);

      .table {
        width: 1180px;
      }
    }
  }

  @include _767 {
    &__container {
      grid-template-rows: 170px auto;
      gap: 24px;
    }
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
    &__content {
      grid-template-rows: auto;
    }
  }

  @include _575 {
    &__container {
      grid-template-rows: max-content auto;
    }
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
