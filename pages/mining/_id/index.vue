<template>
  <div class="mining-page">
    <div class="mining-page__container">
      <div class="mining-page__header">
        <base-btn
          class="btn"
          selector="PREVIOUS-STEP"
          @click="handleBackToMainMining()"
        >
          <template v-slot:left>
            <span class="icon-chevron_left" />
          </template>
          {{ $t('meta.back') }}
        </base-btn>
        <base-btn
          v-if="!isConnected"
          selector="CONNECT-WALLET"
          mode="light"
          class="mining-page__connect"
          :disabled="statusBusy"
          @click="checkWalletStatus()"
        >
          {{ $t('mining.connectWallet') }}
        </base-btn>
        <base-btn
          v-else
          mode="light"
          selector="DISCONNECT-FROM-WALLET"
          class="mining-page__connect"
          :disabled="statusBusy"
          @click="disconnectFromWallet"
        >
          {{ $t('meta.disconnect') }}
        </base-btn>
      </div>
      <div class="mining-page__content">
        <div
          class="info-block__grid"
          :class="{'info-block__grid_double': currentPool === 'BNB'}"
        >
          <div class="info-block__icons">
            <div
              v-for="(item, i) in iconUrls()"
              :key="i"
              class="icon-cont"
            >
              <img
                class="icon-cont__img"
                :src="item"
                alt=""
              >
            </div>
          </div>
          <div class="info-block__about">
            <div class="info-block__title_black info-block__title_big">
              {{ $t(`mining.${currentPool === 'BNB' ? 'wusdBnbPool' : 'wusdEthPool'}`) }}
            </div>
          </div>
          <div
            class="info-block__btns"
            :class="{'info-block__btns_double': currentPool === 'BNB'}"
          >
            <base-btn
              v-if="currentPool === 'BNB'"
              :selector="`OPEN-SWAP-TOKENS-${$t('mining.swapTokens.title')}`"
              class="btn_bl"
              mode="outline"
              :disabled="statusBusy || metamaskStatus === 'notInstalled' || !isConnected"
              @click="openSwapTokens()"
            >
              {{ $t('mining.swapTokens.title') }}
            </base-btn>
            <base-btn
              v-if="currentPool === 'ETH'"
              selector="ADD-LIQUIDITY-ETH"
              :link="'https://app.uniswap.org/#/add/v2/0x06677dc4fe12d3ba3c7ccfd0df8cd45e4d4095bf/ETH'"
              class="btn_bl"
              :disabled="statusBusy"
            >
              {{ $t('mining.addLiquidity') }}
            </base-btn>
            <base-btn
              v-if="currentPool === 'BNB'"
              selector="ADD-LIQUIDITY-BNB"
              :link="'https://pancakeswap.finance/add/BNB/0xe89508D74579A06A65B907c91F697CF4F8D9Fac7'"
              class="btn_bl"
              :disabled="statusBusy"
            >
              {{ $t('mining.addLiquidity') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block__double">
          <div class="info-block__third">
            <div class="info-block third">
              <div class="third__wrapper">
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{ $tc('mining.dollarsCount', !totalLiquidityUSD ? $t('mining.loading') : Floor(totalLiquidityUSD)) }}
                  </div>
                  <div class="info-block__title_small">
                    {{ $t('mining.totalLiquidity') }}
                  </div>
                </div>
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{ isLoadingAPY ? $t('mining.loading') : $tc('mining.wqtCount', profitWQT) }}
                  </div>
                  <div class="info-block__title_small">
                    {{ $t('mining.APY') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-block__third">
            <div class="info-block third">
              <div class="third__wrapper">
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{ $tc('mining.lpCount', stakedAmount) }}
                  </div>
                  <div class="info-block__title_small">
                    {{ $t('mining.stake') }}
                  </div>
                </div>
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{ $tc('mining.wqtCount', rewardAmount) }}
                  </div>
                  <div class="info-block__title_small">
                    {{ $t('mining.reward') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info-block__third">
          <div class="info-block third">
            <div class="third__triple">
              <base-btn
                selector="STAKE"
                class="btn_bl"
                :disabled="!isConnected || statusBusy || disabled"
                @click="openModalStaking()"
              >
                {{ $t('mining.stake') }}
              </base-btn>
              <base-btn
                selector="UNSTAKE"
                class="btn_bl"
                mode="outline"
                :disabled="!isConnected || statusBusy || disabled"
                @click="openModalUnstaking()"
              >
                {{ $t('mining.unstake') }}
              </base-btn>
              <base-btn
                selector="CLAIM-REWARDS"
                mode="outline"
                class="bnt__claim"
                :disabled="!isConnected || statusBusy || disabled"
                @click="claimRewards()"
              >
                {{ $t('mining.claimReward') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name_bold">
            {{ $t('mining.liquidityPoolProviders') }}
          </div>
          <div class="info-block__title_small info-block__title_pad">
            {{ $t('mining.liquidityProvidersEarn') }}
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('mining.liquidity') }}
          </div>
          <chart :special-chart-data="miningChartData" />
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('mining.transactions') }}
          </div>
          <div class="mining-page__table">
            <b-table
              :items="tableData"
              :fields="tableHeaders"
              borderless
              caption-top
              thead-class="table__header"
              tbody-tr-class="table__row"
            >
              <template #cell(poolAddress)="el">
                <div class="user__info">
                  <div class="user__name">
                    {{ el.item.poolAddress }}
                  </div>
                </div>
              </template>
              <template #cell(totalValue)="el">
                <div class="user__value_gray">
                  {{ el.item.totalValue }}
                </div>
              </template>
              <template #cell(tokenAmount0)="el">
                <div class="user__value_gray">
                  {{ el.item.tokenAmount0 }}
                </div>
              </template>
              <template #cell(tokenAmount1)="el">
                <div class="user__value_gray">
                  {{ el.item.tokenAmount1 }}
                </div>
              </template>
              <template #cell(account)="el">
                <a
                  v-if="currentPool === 'ETH'"
                  class="user__value_green"
                  :href="`https://etherscan.io/address/${el.item.account}`"
                  target="_blank"
                >
                  {{ el.item.accountView }}
                </a>
                <a
                  v-if="currentPool === 'BNB'"
                  class="user__value_green"
                  :href="`https://bscscan.com/address/${el.item.account}`"
                  target="_blank"
                >
                  {{ el.item.accountView }}
                </a>
              </template>
              <template #cell(time)="el">
                <div class="user__value_green">
                  {{ el.item.time }}
                </div>
              </template>
            </b-table>
          </div>
        </div>
        <div class="pager__block">
          <base-pager
            v-if="totalPages > 1"
            v-model="page"
            :total-pages="totalPages"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import modals from '~/store/modals/modals';
import chart from './graphics_data';
import { StakingTypes } from '~/utils/enums';

export default {
  name: 'Pool',
  layout: 'guest',
  middleware: 'mining',
  components: {
    chart,
  },
  data() {
    return {
      updateInterval: null,
      disabled: false,
      metamaskStatus: localStorage.getItem('metamaskStatus'),
      page: 1,
      perPager: 10,
      rewardAmount: 0,
      fullRewardAmount: 0,
      stakedAmount: 0,
      availableBalanceForStake: null,
      profitWQT: 0,
      isLoadingAPY: false,
    };
  },
  computed: {
    ...mapGetters({
      miningSwaps: 'mining/getTableData',
      miningChartData: 'mining/getChartData',
      totalLiquidityUSD: 'mining/getTotalLiquidityUSD',

      isConnected: 'web3/isConnected',
      accountData: 'web3/getAccountData',
      tokensData: 'web3/getTokensAmount',
      statusBusy: 'web3/getStatusBusy',

      userData: 'user/getUserData',
    }),
    currentPool() {
      return this.$route.params.id;
    },
    tableHeaders() {
      return [
        {
          key: 'poolAddress',
          label: this.$t('mining.tableHead.swaps'),
          thStyle: { padding: '0 0 0 23px', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0 0 0 23px; height: 64px; line-height: 64px' },
        },
        {
          key: 'totalValue',
          label: this.$t('mining.tableHead.totalValue'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'tokenAmount0',
          label: this.$t('mining.tableHead.tokenAmount'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'tokenAmount1',
          label: this.$t('mining.tableHead.tokenAmount'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'account',
          label: this.$t('mining.tableHead.account'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
        {
          key: 'time',
          label: this.$t('mining.tableHead.time'),
          thStyle: { padding: '0', height: '27px', lineHeight: '27px' },
          tdAttr: { style: 'padding: 0; height: 64px; line-height: 64px' },
        },
      ];
    },
    tableData() {
      const arr = [];
      this.miningSwaps.forEach((data) => {
        arr.push({
          totalValue: `${this.Floor(data.totalValue, 2)} $`,
          account: data.account,
          accountView: this.CutTxn(data.account),
          time: moment(new Date(data.timestamp * 1000)).startOf('hour').fromNow(),
          ...this.getTokensAmount(data),
        });
      });
      return arr;
    },
    totalPages() {
      if (this.miningSwaps.length) return Math.ceil(100 / this.perPager);
      return 0;
    },
  },
  watch: {
    async isConnected(newValue) {
      const rightChain = await this.$store.dispatch('web3/chainIsCompareToCurrent', this.currentPool);
      if (newValue && rightChain) {
        await this.$store.dispatch('web3/initContract');
        await this.tokensDataUpdate();
        this.updateInterval = setInterval(() => this.tokensDataUpdate(), 60000);
      } else {
        this.fullRewardAmount = 0;
        this.rewardAmount = 0;
        this.stakedAmount = 0;
        this.profitWQT = 0;
        clearInterval(this.updateInterval);
      }
    },
    async page() {
      await this.$store.dispatch(`mining/getTableDataForWqtW${this.currentPool.toLowerCase()}Pool`, {
        limit: this.perPager,
        offset: (this.page - 1) * this.perPager,
      });
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.$nuxt.setLayout(this.userData.id ? 'default' : 'guest');
    localStorage.setItem('miningPoolId', this.currentPool);
    const currentPool = this.currentPool.toLowerCase();
    await this.$store.dispatch(`mining/getChartDataForWqtW${currentPool}Pool`);
    await this.$store.dispatch(`mining/getTableDataForWqtW${currentPool}Pool`, {});
    this.SetLoader(false);
  },
  async beforeDestroy() {
    clearInterval(this.updateInterval);
    await this.disconnectFromWallet();
    await Promise.all([
      this.$store.commit('mining/setChartData', []),
      this.$store.commit('mining/setTableData', []),
      this.$store.commit('mining/setTotalLiquidityUSD', null),
    ]);
  },
  methods: {
    getTokensAmount(data) {
      const pools = {
        ETH: {
          tokenIn: data.isOut ? 'WQT' : 'WETH',
          tokenOut: data.isOut ? 'WETH' : 'WQT',
        },
        BNB: {
          tokenIn: data.isOut ? 'WQT' : 'WBNB',
          tokenOut: data.isOut ? 'WBNB' : 'WQT',
        },
      };

      const amount0 = this.Floor(data.isOut ? data.amount1 : data.amount0, 3);
      const amount1 = this.Floor(data.isOut ? data.amount0 : data.amount1, 3);

      const { currentPool } = this;
      return {
        poolAddress: `Swap ${pools[currentPool].tokenIn} for ${pools[currentPool].tokenOut}`,
        tokenAmount0: `${amount0} ${pools[currentPool].tokenIn}`,
        tokenAmount1: `${amount1} ${pools[currentPool].tokenOut}`,
      };
    },

    async checkWalletStatus() {
      if (this.isConnected) return;
      let incorrectChain = false;
      const { currentPool } = this;
      this.SetLoader(true);
      await this.connectToWallet();
      if (localStorage.getItem('isMetaMask') === 'true') {
        const switchStatus = await this.$store.dispatch('web3/goToChain', { chain: currentPool });
        if (!switchStatus.ok) await this.disconnectFromWallet();
      } else {
        const walletConnectData = JSON.parse(localStorage.getItem('walletconnect'));
        switch (walletConnectData.chainId) {
          case 1:
            incorrectChain = this.currentPool !== 'ETH';
            break;
          case 56:
            incorrectChain = this.currentPool !== 'BNB';
            break;
          default:
            incorrectChain = false;
            break;
        }
        if (incorrectChain) {
          this.ShowModal({
            key: modals.status,
            img: require('~/assets/img/ui/warning.svg'),
            title: this.$t('modals.connectError'),
            recipient: '',
            subtitle: this.$t('modals.incorrectChain'),
          });
          await this.disconnectFromWallet();
        }
      }
      this.SetLoader(false);
    },
    async connectToWallet() {
      await this.$store.dispatch('web3/connect', { chain: this.currentPool });
    },

    async tokensDataUpdate() {
      this.isLoadingAPY = true;
      const { balanceTokenAmount, rewardTokenAmount, stakeTokenAmount } = await this.$store.dispatch('web3/getTokensData');
      this.fullRewardAmount = rewardTokenAmount;
      this.rewardAmount = this.Floor(rewardTokenAmount);
      this.stakedAmount = this.Floor(stakeTokenAmount);
      this.availableBalanceForStake = balanceTokenAmount;

      if (+stakeTokenAmount > 0) {
        const payload = {
          chain: this.currentPool,
          stakedAmount: stakeTokenAmount,
        };
        const profit = await this.$store.dispatch('web3/getAPY', payload);
        this.profitWQT = this.Floor(profit);
      }

      this.isLoadingAPY = false;
    },
    async claimRewards() {
      this.SetLoader(true);
      if (this.fullRewardAmount > 0) {
        await this.tokensDataUpdate();
        await this.$store.dispatch('web3/claimRewards', { stakingType: StakingTypes.MINING });
        await this.tokensDataUpdate();
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.transactionFail'),
          recipient: '',
          subtitle: this.$t('modals.nothingToClaim'),
        });
      }
      this.SetLoader(false);
    },
    openSwapTokens() {
      if (!this.isConnected) {
        this.connectToWallet();
      }
      this.ShowModal({
        key: modals.swapTokens,
      });
    },
    async openModalUnstaking() {
      await this.checkWalletStatus();
      if (this.stakedAmount > 0) {
        this.ShowModal({
          key: modals.claimRewards,
          type: 2,
          decimals: this.accountData.decimals.stakeDecimal,
          stakingType: StakingTypes.MINING,
          updateMethod: this.tokensDataUpdate,
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.transactionFail'),
          recipient: '',
          subtitle: this.$t('modals.incorrectAmount'),
        });
      }
    },
    async openModalStaking() {
      await this.checkWalletStatus();
      if (this.availableBalanceForStake > 0) {
        this.ShowModal({
          key: modals.claimRewards,
          type: 1,
          stakingType: StakingTypes.MINING,
          decimals: this.accountData.decimals.stakeDecimal,
          updateMethod: this.tokensDataUpdate,
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.transactionFail'),
          recipient: '',
          subtitle: this.$t('modals.incorrectAmount'),
        });
      }
    },

    async handleBackToMainMining() {
      await this.$router.push('/mining');
    },
    async disconnectFromWallet() {
      await this.$store.dispatch('web3/disconnect');
    },
    iconUrls() {
      return [
        require(`~/assets/img/ui/${this.currentPool === 'BNB' ? 'bnb_yellow' : 'eth_white'}.svg`),
        require('~/assets/img/ui/wqt-logo.svg'),
      ];
    },
  },
};
</script>

<style lang="scss" scoped>

.hide {
  display: none;
}

.mining-page {
  background: linear-gradient(to bottom, #103D7C 325px, #f6f8fa 325px);
  display: flex;
  justify-content: center;

  &__pager {
    margin-top: 25px;
  }

  &__connect {
    width: 150px;
  }

  &__container {
    display: grid;
    grid-template-rows: 65px max-content;
    max-width: 1180px;
    grid-row-gap: 50px;
    width: 100%;
    gap: 20px;
    padding: 10px;
    box-sizing: border-box;
  }

  &__header {
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn {
      background-color: unset;
      color: #fff;
      max-width: 100px;
      padding: 0;
      gap: 5px;
      font-size: 18px;

      .icon-chevron_left {
        font-size: 26px;
        &:before {
          color: #fff;
        }
      }
    }
  }

  &__content {
    display: grid;
    grid-row-gap: 30px;
    width: 100%;

    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &__chart {
        width: 100%;
      }

      &__title {
        font-size: 20px;
        font-weight: 600;
        color: #1D2127;
        opacity: 0.5;

        &_black {
          color: #1D2127;
        }

        &_big {
          font-size: 25px;
          font-weight: 500;
        }

        &_blue {
          color: #0083C7;
          font-weight: 700;
        }

        &_small {
          font-size: 16px;
          font-weight: 400;
          color: #7C838D;
        }

        &_pad {
          padding: 0 0 20px 20px;
          width: 50%;
        }
      }

      &__btns {
        display: grid;
        gap: 10px;
        align-content: center;
        &_double {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      &__about {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }

      &__icons {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        height: 67px;
        align-self: center;
      }

      .icon-cont {
        width: 41px;

        &__img {
          position: absolute;
          height: 67px;
          width: 67px;
        }
      }

      &__grid {
        @extend .info-block;
        display: grid;
        grid-template-columns: 1fr 5fr 2fr;
        gap: 20px;
        padding: 20px;
        position: relative;
        &_double {
          grid-template-columns: 1fr 5fr 4fr;
        }
      }

      &__double {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      &__third {
        @extend .info-block;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 10px;
      }

      &__name {
        font-size: 16px;
        color: #1D2127;
        padding: 20px 20px 10px 20px;
        font-weight: 400;

        &_bold {
          font-weight: 700;
          font-size: 20px;
          color: #0083C7;
          line-height: 1;
          padding: 20px;
        }
      }
    }

    .ava {
      height: 33px;
      width: 33px;
      border-radius: 50%;
      background-color: #fff;
      flex: none;
    }

    .user {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      width: calc(100% - 40px);
      margin: 0 0 0 20px;
      line-height: 33px;

      &__info {
        display: grid;
        align-items: center;
        gap: 10px;
      }

      &__name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
      }

      &__value {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;

        &_green {
          @extend .user__value;
          color: #00AA5B;
        }

        &_gray {
          @extend .user__value;
          color: #7C838D;
          font-weight: 400;
        }
      }
    }
  }

  &__table {
    .table {
      margin: 0;
      border-radius: 0 !important;
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
      gap: 15px;
    }
    &__header {
      .btn {
        justify-content: left;
      }
    }
    &__content {
      .info-block {
        &__grid {
          grid-template-columns: 105px auto;

          .info-block__btns {
            display: grid;
            grid-column-start: 2;
            grid-column-end: 3;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: unset;
          }
        }
        &__title {
          &_pad {
            width: 80%;
          }
        }
      }
    }
  }

  @include _575 {
    &__content {
      .info-block {
        &__grid {
          .info-block__btns {
            grid-column-start: 1;
          }
        }
        &__double {
          grid-template-columns: repeat(2, 1fr);
        }
        &__title {
          &_pad {
            width: 100%;
            padding-right: 20px;
          }
        }
      }
    }
  }
}
.btn {
  &_bl {
    text-decoration: none;
  }
}
.third {
  width: 100%;
  align-self: center;
  @include _575 {
    &__container {
      text-align: center;
      margin-bottom: 10px;
    }
  }
  &__triple {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    @include _575 {
      grid-template-columns: auto;
    }
  }
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    @include _575 {
      grid-template-columns: auto;
    }
  }
}
.pager {
  &__block {
    margin-top: 25px;
    width: auto;
  }
}
</style>
