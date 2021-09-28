<template>
  <div class="mining-page">
    <div class="mining-page__container">
      <div class="mining-page__header">
        <base-btn
          class="btn"
          @click="handleBackToMainMining()"
        >
          <template v-slot:left>
            <span class="icon-chevron_left" />
          </template>
          {{ $t('mining.back') }}
        </base-btn>
        <base-btn
          v-if="!isConnected"
          mode="light"
          class="mining-page__connect"
          :disabled="statusBusy"
          @click="checkMetamaskStatus()"
        >
          {{ $t('mining.connectWallet') }}
        </base-btn>
        <base-btn
          v-else
          mode="light"
          class="mining-page__connect"
          :disabled="statusBusy"
          @click="disconnectFromMetamask"
        >
          {{ $t('meta.disconnect') }}
        </base-btn>
      </div>
      <div class="mining-page__content">
        <div
          class="info-block__grid"
          :class="commonBtnContainerWidth()"
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
              {{ $t(`mining.${miningPoolId === 'BNB' ? 'wusdBnbPool' : 'wusdEthPool'}`) }}
            </div>
          </div>
          <div
            class="info-block__btns"
            :class="buttonContainerStyles()"
          >
            <base-btn
              v-if="miningPoolId === 'BNB'"
              class="btn_bl"
              mode="outline"
              :disabled="statusBusy || metamaskStatus === 'notInstalled'"
              @click="openSwapTokens()"
            >
              {{ $t('mining.swapTokens.title') }}
            </base-btn>
            <base-btn
              v-if="miningPoolId === 'ETH'"
              :link="'https://app.uniswap.org/#/add/v2/0x06677dc4fe12d3ba3c7ccfd0df8cd45e4d4095bf/ETH'"
              class="btn_bl"
              :disabled="statusBusy"
            >
              {{ $t('mining.addLiquidity') }}
            </base-btn>
            <base-btn
              v-if="miningPoolId === 'BNB'"
              :link="'https://pancakeswap.finance/add/0x06677dc4fe12d3ba3c7ccfd0df8cd45e4d4095bf/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'"
              class="btn_bl"
              :disabled="statusBusy"
            >
              {{ $t('mining.addLiquidity') }}
            </base-btn>
          </div>
        </div>
        <div class="info-block__double">
          <div
            class="info-block__third"
          >
            <div class="info-block third">
              <div class="third__wrapper">
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{ $tc('mining.dollarsCount', totalLiquidityUSD) }}
                  </div>
                  <div class="info-block__title_small">
                    {{ $t('mining.totalLiquidity') }}
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
                class="btn_bl"
                :disabled="!isConnected || statusBusy"
                @click="openModalClaimRewards()"
              >
                {{ $t('mining.stake') }}
              </base-btn>
              <base-btn
                class="btn_bl"
                mode="outline"
                :disabled="!isConnected || statusBusy"
                @click="openModalUnstaking()"
              >
                {{ $t('mining.unstake') }}
              </base-btn>
              <base-btn
                :mode="'outline'"
                class="bnt__claim"
                :disabled="!isConnected || statusBusy"
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
          <chart
            :class="miningPoolId === 'ETH' ? 'hide' : ''"
            :special-chart-data="wqtWbnbData"
          />
          <chart
            :class="miningPoolId === 'BNB' ? 'hide' : ''"
            :special-chart-data="wqtWethData"
          />
        </div>
        <div class="info-block">
          <div class="info-block__name">
            {{ $t('mining.transactions') }}
          </div>
          <div class="mining-page__table">
            <b-table
              :items="items"
              :fields="testFields"
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
                  v-if="miningPoolId === 'ETH'"
                  class="user__value_green"
                  :href="`https://etherscan.io/address/${el.item.account}`"
                  target="_blank"
                >
                  {{ el.item.accountView }}
                </a>
                <a
                  v-if="miningPoolId === 'BNB'"
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
        <div
          class="pager__block"
        >
          <base-pager
            v-if="totalPagesValue > 1"
            v-model="page"
            :total-pages="totalPagesValue"
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

export default {
  layout: 'guest',
  components: {
    chart,
  },
  data() {
    return {
      miningPoolId: localStorage.getItem('miningPoolId'),
      metamaskStatus: localStorage.getItem('metamaskStatus'),
      items: [],
      testFields: [
        {
          key: 'poolAddress',
          label: this.$t('mining.tableHead.swaps'),
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
          key: 'totalValue',
          label: this.$t('mining.tableHead.totalValue'),
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
          key: 'tokenAmount0',
          label: this.$t('mining.tableHead.tokenAmount'),
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
          key: 'tokenAmount1',
          label: this.$t('mining.tableHead.tokenAmount'),
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
          key: 'account',
          label: this.$t('mining.tableHead.account'),
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
          key: 'time',
          label: this.$t('mining.tableHead.time'),
          thStyle: {
            padding: '0',
            height: '27px',
            lineHeight: '27px',
          },
          tdAttr: {
            style: 'padding: 0; height: 64px; line-height: 64px',
          },
        },
      ],
      totalLiquidityUSD: '',
      page: 1,
      perPager: 10,
      totalPagesValue: 1,
      rewardAmount: 0,
      stakedAmount: 0,
      wqtWbnbData: [],
      wqtWethData: [],
    };
  },
  computed: {
    ...mapGetters({
      wqtWbnbBurns: 'defi/getWqtWbnbBurns',
      wqtWbnbMints: 'defi/getWqtWbnbMints',
      wqtWbnbSwaps: 'defi/getWqtWbnbSwaps',
      wqtWbnbTokenDay: 'defi/getWqtWbnbTokenDay',
      wqtWbnbTokenDayLast: 'defi/getWqtWbnbTokenDayLast',
      wqtWethBurns: 'defi/getWqtWethBurns',
      wqtWethMints: 'defi/getWqtWethMints',
      wqtWethSwaps: 'defi/getWqtWethSwaps',
      wqtWethTokenDay: 'defi/getWqtWethTokenDay',
      wqtWethTokenDayLast: 'defi/getWqtWethTokenDayLast',
      isConnected: 'web3/isConnected',
      accountData: 'web3/getAccountData',
      tokensData: 'web3/getTokensAmount',
      tokenLP: 'web3/getLPTokenPrice',
      statusBusy: 'web3/getStatusBusy',
    }),
    totalPages() {
      if (this.wqtWbnbSwaps) {
        return Math.ceil(30 / this.perPager);
      }
      if (this.wqtWethSwaps) {
        return Math.ceil(30 / this.perPager);
      }
      return 0;
    },
  },
  watch: {
    isConnected() {
      const newInterval = setInterval(() => this.tokensDataUpdate(), 15000);
      if (!this.isConnected) {
        clearInterval(newInterval);
      }
    },
    // async page() {
    //   // TODO: FIX
    //   if (this.miningPoolId === 'BNB') {
    //     await this.getWqtWbnbTokenDay(`limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}`);
    //     await this.initTableData();
    //   } else if (this.miningPoolId === 'ETH') {
    //     await this.getWqtWethTokenDay(`limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}`);
    //     await this.initTableData();
    //   }
    // },
  },
  async mounted() {
    this.SetLoader(true);
    await this.checkMetamaskStatus();
    await this.getWqtWbnbTokenDay();
    await this.getWqtWethTokenDay();
    await this.getWqtWbnbTokenDayLast();
    await this.getWqtWethTokenDayLast();
    await this.getWqtWbnbBurns();
    await this.getWqtWbnbMints();
    await this.getWqtWethBurns();
    await this.getWqtWethMints();
    await this.getWqtWethSwaps();
    await this.getWqtWbnbSwaps();
    await this.initTokenDays();
    await this.initGraphData();
    await this.initTableData(this.wqtWbnbSwaps, this.wqtWethSwaps);
    this.SetLoader(false);
  },

  methods: {
    async checkMetamaskStatus() {
      if (typeof window.ethereum === 'undefined') {
        localStorage.setItem('metamaskStatus', 'notInstalled');
        this.ShowModal({
          key: modals.status,
          img: '~assets/img/ui/cardHasBeenAdded.svg',
          title: 'Please install Metamask!',
          subtitle: 'Please click install...',
          button: 'Install',
          type: 'installMetamask',
        });
      } else {
        await this.connectToMetamask();
        localStorage.setItem('metamaskStatus', 'installed');
        await this.$store.dispatch('web3/goToChain', { chain: this.miningPoolId });
      }
    },
    async initTokenDays() {
      const totalLiquidity = this.miningPoolId === 'BNB' ? this.wqtWbnbTokenDay[0].reserveUSD : this.wqtWethTokenDay[0].reserveUSD;
      this.totalLiquidityUSD = Math.floor(await totalLiquidity);
    },
    async initGraphData() {
      this.wqtWbnbData = await this.wqtWbnbTokenDay;
      this.wqtWethData = await this.wqtWethTokenDay;
    },
    async initTableData(wqtWbnbSwaps, wqtWethSwaps) {
      let tableArr = [];
      if (this.miningPoolId === 'BNB') {
        tableArr = wqtWbnbSwaps;
      } if (this.miningPoolId === 'ETH') {
        tableArr = wqtWethSwaps;
      }
      tableArr.forEach((data) => {
        let poolAddress = '';
        let tokenAmount0 = '';
        let tokenAmount1 = '';
        if (this.miningPoolId === 'BNB') {
          if (data.amount0Out > 0) {
            poolAddress = 'Swap WQT for WBNB';
            tokenAmount0 = `${(parseInt((data.amount0Out) * 1000, 10)) / 1000} WQT`;
            tokenAmount1 = `${(parseInt((data.amount1In) * 1000, 10)) / 1000} WBNB`;
          } else {
            poolAddress = 'Swap WBNB for WQT';
            tokenAmount0 = `${(parseInt((data.amount1Out) * 1000, 10)) / 1000} WBNB`;
            tokenAmount1 = `${(parseInt((data.amount0In) * 1000, 10)) / 1000} WQT`;
          }
        } if (this.miningPoolId === 'ETH') {
          if (data.amount0Out > 0) {
            poolAddress = 'Swap WQT for WETH';
            tokenAmount0 = `${(parseInt((data.amount0Out) * 1000, 10)) / 1000} WQT`;
            tokenAmount1 = `${(parseInt((data.amount1In) * 1000, 10)) / 1000} WETH`;
          } else {
            poolAddress = 'Swap WETH for WQT';
            tokenAmount0 = `${(parseInt((data.amount1Out) * 1000, 10)) / 1000} WETH`;
            tokenAmount1 = `${(parseInt((data.amount0In) * 1000, 10)) / 1000} WQT`;
          }
        }
        const totalValue = `${Math.round(data.amountUSD)} $`;
        const account = data.to;
        const accountView = this.cropTxt(data.to);
        const date = new Date(data.transaction.timestamp * 1000);
        const time = moment(date).startOf('hour').fromNow();
        this.items.push({
          poolAddress,
          totalValue,
          tokenAmount0,
          tokenAmount1,
          account,
          accountView,
          time,
        });
      });
      this.totalPagesValue = this.totalPages;
    },

    async getWqtWbnbBurns() {
      await this.$store.dispatch('defi/wqtWbnbBurns');
    },
    async getWqtWbnbMints() {
      await this.$store.dispatch('defi/wqtWbnbMints');
    },
    async getWqtWbnbSwaps() {
      await this.$store.dispatch('defi/wqtWbnbSwaps');
    },
    async getWqtWbnbTokenDay(query) {
      await this.$store.dispatch('defi/wqtWbnbTokenDay', query);
    },
    async getWqtWbnbTokenDayLast() {
      const query = 'limit=1';
      await this.$store.dispatch('defi/wqtWbnbTokenDayLast', query);
    },

    async getWqtWethBurns() {
      await this.$store.dispatch('defi/wqtWethBurns');
    },
    async getWqtWethMints() {
      await this.$store.dispatch('defi/wqtWethMints');
    },
    async getWqtWethSwaps() {
      await this.$store.dispatch('defi/wqtWethSwaps');
    },
    async getWqtWethTokenDay(query) {
      await this.$store.dispatch('defi/wqtWethTokenDay', query);
    },
    async getWqtWethTokenDayLast() {
      const query = 'limit=1';
      await this.$store.dispatch('defi/wqtWethTokenDayLast', query);
    },

    commonBtnContainerWidth() {
      let style;
      if (this.miningPoolId === 'BNB') {
        style = 'info-block__grid_double';
      }
      return style;
    },
    buttonContainerStyles() {
      let style;
      if (this.miningPoolId === 'BNB') {
        style = 'info-block__btns_double';
      }
      return style;
    },
    async tokensDataUpdate() {
      const action = this.miningPoolId === 'ETH' ? 'web3/getTokensData' : 'web3/getTokensDataBSC';
      const tokensData = await this.$store.dispatch(action, { stakeDecimal: this.accountData.decimals.stakeDecimal, rewardDecimal: this.accountData.decimals.rewardDecimal });
      this.rewardAmount = this.Floor(tokensData.rewardTokenAmount);
      this.stakedAmount = this.Floor(tokensData.stakeTokenAmount);
    },
    async disconnectFromMetamask() {
      await this.$store.dispatch('web3/disconnect');
    },
    async claimRewards() {
      this.SetLoader(true);
      const action = this.miningPoolId === 'ETH' ? 'web3/claimRewards' : 'web3/claimRewardsBSC';
      await this.$store.dispatch(action);
      await this.tokensDataUpdate();
      this.SetLoader(false);
    },
    async connectToMetamask() {
      if (!this.isConnected) {
        let action;
        action = 'web3/connect';
        await this.$store.dispatch(action);
        action = this.miningPoolId === 'ETH' ? 'web3/initContract' : 'web3/initContractBSC';
        await this.$store.dispatch(action);
        await this.tokensDataUpdate();
      }
    },
    cropTxt(str) {
      if (str.length > 40) str = `${str.slice(0, 10)}...${str.slice(-10)}`;
      return str;
    },
    openSwapTokens() {
      if (!this.isConnected) {
        this.connectToMetamask();
      }
      this.ShowModal({
        key: modals.swapTokens,
      });
    },
    openModalUnstaking() {
      this.ShowModal({
        key: modals.claimRewards,
        type: 2,
      });
    },
    openModalClaimRewards() {
      this.ShowModal({
        key: modals.claimRewards,
        type: 1,
      });
    },
    handleBackToMainMining() {
      this.$router.push('/mining');
    },
    iconUrls() {
      return [
        require('~/assets/img/ui/wqt-logo.svg'),
        require(`~/assets/img/ui/${this.miningPoolId === 'BNB' ? 'bnb' : 'hromb'}-logo.svg`),
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
    width: auto;
  }
}
</style>
