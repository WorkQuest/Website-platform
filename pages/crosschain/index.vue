<template>
  <div class="crosschain-page">
    <div class="crosschain-page__container">
      <div class="crosschain-page__header header">
        <div class="header__left">
          <div class="title">
            {{ $t('crosschain.pageName') }}
          </div>
          <div class="title_sub">
            {{ $t('crosschain.pageAbout') }}
          </div>
        </div>
        <div class="header__right">
          <base-btn
            v-if="!isConnected"
            mode="light"
            class="header__btn header__btn_connect"
            :disabled="statusBusy"
            @click="checkMetamaskStatus()"
          >
            {{ $t('mining.connectWallet') }}
          </base-btn>
          <base-btn
            v-else
            mode="light"
            class="header__btn header__btn_disconnect"
            :disabled="statusBusy"
            @click="disconnectFromMetamask"
          >
            {{ $t('meta.disconnect') }}
          </base-btn>
        </div>
      </div>

      <div class="crosschain-page__content">
        <div class="info-block">
          <div class="info-block__swap-cont">
            <div>
              <div class="info-block__name_bold">
                {{ $t("crosschain.sourceBlockchain") }}
              </div>
              <div class="contract-data">
                <div>
                  <div class="contract-data__title">
                    {{ $t('crosschain.blockchain') }}
                  </div>
                  <base-dd
                    v-model="sourceAddressInd"
                    type="border"
                    :items="addresses"
                    :is-icon="true"
                    @input="handleChangeSource"
                  />
                </div>
              </div>
            </div>
            <img
              src="~assets/img/ui/swap.png"
              alt=""
              class="swap-icon"
              @click="togglePools()"
            >
            <div>
              <div class="info-block__name_bold">
                {{ $t("crosschain.targetBlockchain") }}
              </div>
              <div class="contract-data">
                <div>
                  <div class="contract-data__title">
                    {{ $t('crosschain.blockchain') }}
                  </div>
                  <base-dd
                    v-model="targetAddressInd"
                    type="border"
                    :items="addresses"
                    :is-icon="true"
                    @input="handleChangeTarget"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="info-block__btns-cont">
            <base-btn
              :disabled="metamaskStatus === 'notInstalled' || !isConnected"
              @click="showSwapModal"
            >
              <!--            <base-btn-->
              <!--              :disabled="true"-->
              <!--              @click="showSwapModal"-->
              <!--            >-->
              {{ $t('crosschain.createSwap') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('crosschain.mySwaps') }}
          </div>
          <div class="crosschain-page__table">
            <b-table
              :items="crosschainTableData"
              :fields="testFields"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(direction)="el">
                <div class="table__direction">
                  <img
                    :src="el.item.direction[0]"
                    alt=""
                  >
                  <img
                    class="arrow-img"
                    src="~/assets/img/ui/arrow-down.svg"
                    alt=""
                  >
                  <img
                    :src="el.item.direction[1]"
                    alt=""
                  >
                </div>
              </template>
              <template #cell(recipient)="el">
                <div class="table__value">
                  {{ el.item.recipient }}
                </div>
              </template>
              <template #cell(tx)="el">
                <div class="table__value">
                  {{ el.item.tx }}
                  <button
                    v-clipboard:copy="el.item.txFull"
                    v-clipboard:success="ClipboardSuccessHandler"
                    v-clipboard:error="ClipboardErrorHandler"
                    type="button"
                    @click="doCopy"
                  >
                    <span class="icon-copy link-cont__icon" />
                  </button>
                </div>
              </template>
              <template #cell(created)="el">
                <div class="table__value table__value_blue">
                  {{ el.item.created }}
                </div>
              </template>
              <template #cell(redeem)="el">
                <div class="table__value table__value_blue">
                  <base-btn
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
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  layout: 'guest',
  data() {
    return {
      miningPoolId: localStorage.getItem('miningPoolId'),
      metamaskStatus: localStorage.getItem('metamaskStatus'),
      referLink: '0xnf8o2…9b74thb3',
      sourceAddressInd: 0,
      targetAddressInd: 1,
      tableItems: {},
      items: [],
    };
  },
  computed: {
    ...mapGetters({
      tokens: 'web3/getTokens',
      account: 'web3/getAccount',
      purseData: 'web3/getPurseData',
      userData: 'user/getUserData',
      isConnected: 'web3/isConnected',
      crosschainTableData: 'defi/getCrosschainTokensData',
      statusBusy: 'web3/getStatusBusy',
    }),
    testFields() {
      return [
        {
          key: 'direction',
          label: this.$t('crosschain.tableHead.direction'),
          thStyle: {
            padding: '0 0 0 23px',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'recipient',
          label: this.$t('crosschain.tableHead.recipient'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'tx',
          label: this.$t('crosschain.tableHead.tx'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'created',
          label: this.$t('crosschain.tableHead.created'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
        {
          key: 'redeem',
          label: '',
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'display: flex; align-items: center; height: 64px; line-height: 64px',
          },
        },
      ];
    },
    addresses() {
      return [
        {
          icon: require('~/assets/img/ui/ethereum.svg'),
          title: this.$t('crosschain.eth'),
        },
        {
          icon: require('~/assets/img/ui/bnb_yellow.svg'),
          title: this.$t('crosschain.bsc'),
        },
      ];
    },
  },
  watch: {
    async purseData() {
      let newInterval;
      if (this.purseData) {
        await this.swapsTableData(this.purseData);
        newInterval = setInterval(() => this.swapsTableData(this.purseData), 5000);
        if (this.$route.name !== 'crosschain') {
          clearInterval(newInterval);
        }
      }
    },
  },
  async mounted() {
    this.SetLoader(false);
    // this.SetLoader(true);
    // await this.swapsTableData(this.purseData);
    // await this.checkMetamaskStatus();
    // await this.checkMiningPoolId();
    // this.SetLoader(false);
  },
  methods: {
    doCopy() {
      this.ShowModal({
        key: modals.copiedSuccess,
      });
    },
    async disconnectFromMetamask() {
      await this.$store.dispatch('web3/disconnect');
    },
    async checkMetamaskStatus() {
      if (typeof window.ethereum === 'undefined') {
        localStorage.setItem('metamaskStatus', 'notInstalled');
        this.ShowModal({
          key: modals.status,
          title: 'Please install Metamask!',
          subtitle: 'Please click install...',
          button: 'Install',
          type: 'installMetamask',
        });
      } else {
        localStorage.setItem('metamaskStatus', 'installed');
        await this.connectToMetamask();
      }
    },
    async redeemAction(data) {
      this.SetLoader(true);
      let redeemObj;
      let payload;
      const switchChainStatus = await this.$store.dispatch('web3/goToChain', { chain: data.chain });
      // await this.connectToMetamask();
      if (switchChainStatus.ok) {
        payload = {
          signData: data.clearData,
          chainId: data.chainId,
        };
        redeemObj = await this.$store.dispatch('web3/redeemSwap', payload);
      } else {
        redeemObj = { code: 500 };
      }
      this.ShowModal({
        key: modals.status,
        img: redeemObj.code === 500 ? require('~/assets/img/ui/warning.svg') : require('~/assets/img/ui/success.svg'),
        title: redeemObj.code === 500 ? this.$t('modals.redeemFail') : this.$t('modals.redeemSuccess'),
        subtitle: '',
      });
      this.SetLoader(false);
    },
    showToast(title, text, variant) {
      this.$store.dispatch('defi/showToast', { title, text, variant });
    },
    async connectToMetamask() {
      if (!this.isConnected) {
        console.log(this.miningPoolId);
        await this.$store.dispatch('web3/connect');
      }
    },
    async checkMiningPoolId() {
      this.miningPoolId = this.sourceAddressInd === 0 ? 'ETH' : 'BNB';
      localStorage.setItem('miningPoolId', this.miningPoolId);
      return await this.$store.dispatch('web3/goToChain', { chain: this.miningPoolId });
    },
    async swapsTableData(recipientAddress) {
      const payload = {
        recipientAddress,
        query: '&offset=0&limit=10',
      };
      await this.$store.dispatch('defi/swapsForCrosschain', payload);
    },
    togglePools(selInd) {
      if (this.sourceAddressInd === 0) {
        this.sourceAddressInd = selInd ? 0 : 1;
        this.targetAddressInd = selInd ? 1 : 0;
      } else if (this.sourceAddressInd === 1) {
        this.sourceAddressInd = selInd ? 1 : 0;
        this.targetAddressInd = selInd ? 0 : 1;
      }
    },
    handleChangeTarget(selInd) {
      if (selInd === this.sourceAddressInd) {
        this.sourceAddressInd = selInd ? 0 : 1;
      }
      this.targetAddressInd = selInd;
    },
    handleChangeSource(selInd) {
      if (selInd === this.targetAddressInd) {
        this.targetAddressInd = selInd ? 0 : 1;
      }
      this.sourceAddressInd = selInd;
    },
    async showSwapModal() {
      this.SetLoader(true);
      const switchChainStatus = await this.checkMiningPoolId();
      // await this.checkMetamaskStatus();
      if (switchChainStatus.ok) {
        await this.$store.dispatch('web3/getCrosschainTokensData');
        await this.swapsTableData();
        this.ShowModal({
          key: modals.swap,
          crosschainId: this.targetAddressInd,
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.transactionFail'),
          recipient: '',
          txHash: '',
          subtitle: '',
        });
      }
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.swap-icon {
  transition: .3s ease-in-out;
  &:hover {
    filter: drop-shadow(0 0 3px rgba(72, 72, 72, 0.5));
    cursor: pointer;
  }
}
.crosschain-page {
  background: linear-gradient(to bottom, #103D7C 420px, #f6f8fa 420px);
  display: flex;
  justify-content: center;

  &__container {
    display: grid;
    grid-template-rows: 190px max-content;
    max-width: 1180px;
    grid-row-gap: 20px;
    width: 100%;
    padding: 10px;
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
        align-items: center;
        padding: 20px;

        img {
          display: flex;
          align-self: flex-end;
          margin-bottom: 5px;
        }

        .contract-data {
          display: grid;
          grid-template-rows: repeat(1, 1fr);
          gap: 15px;
          margin-top: 20px;

          &__title {
            font-weight: 400;
            font-size: 16px;
            margin-bottom: 5px;
          }

          &__link {
            border: 1px solid #F7F8FA;
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
            border: 1px solid #F7F8FA;
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
      margin: 0;
      border-radius: 0 !important;

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

  @include _991 {
    &__table {
      overflow: auto;
      width: calc(100vw - 20px);

      .table {
        width: 1180px;
      }
    }
  }

  @include _767 {
    &__container {
      grid-template-rows: auto auto;
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

      .info-block {
        &__swap-cont {
          grid-template-columns: 1fr 24px 1fr;
        }
      }
    }
  }

  @include _575 {
    .header {
      flex-direction: column;
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

          >div {
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
