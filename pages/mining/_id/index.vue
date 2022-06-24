<template>
  <div class="mining-page">
    <div class="mining-page__container">
      <div class="mining-page__header">
        <base-btn
          class="btn"
          data-selector="PREVIOUS-STEP"
          @click="$router.push($options.Path.MINING)"
        >
          <template v-slot:left>
            <span class="icon-chevron_left" />
          </template>
          {{ $t('meta.btns.back') }}
        </base-btn>
        <base-btn
          class="mining-page__connect"
          mode="light"
          :data-selector="!isConnected ? 'CONNECT-WALLET' : 'DISCONNECT-FROM-WALLET'"
          @click="toggleConnection"
        >
          {{ !isConnected ? $t('mining.connectWallet') : $t('meta.disconnect') }}
        </base-btn>
      </div>
      <div class="mining-page__content">
        <div
          class="info-block__grid"
          :class="{'info-block__grid_double': chain === $options.Chains.BINANCE}"
        >
          <div class="info-block__icons">
            <div
              v-for="(item, i) in icons"
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
              {{ $t(`mining.${chain === $options.Chains.BINANCE ? 'wusdBnbPool' : 'wusdEthPool'}`) }}
            </div>
          </div>
          <div
            class="info-block__btns"
            :class="{'info-block__btns_double': chain === $options.Chains.BINANCE}"
          >
            <base-btn
              v-for="(btn, idx) in poolButtons"
              :key="idx"
              class="btn_bl"
              :data-selector="btn.dataSelector"
              :mode="btn.mode"
              :link="btn.link "
              :disabled="btn.disabled"
              @click="btn.action"
            >
              {{ $t(btn.title) }}
            </base-btn>
          </div>
        </div>
        <div class="info-block__double">
          <div class="info-block__third">
            <div class="info-block third">
              <div class="third__wrapper">
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{
                      $tc('meta.coins.count.dollarsCount', !totalLiquidityUSD
                        ? $t('mining.loading')
                        : Floor(totalLiquidityUSD))
                    }}
                  </div>
                  <div class="info-block__title_small">
                    {{ $t('mining.totalLiquidity') }}
                  </div>
                </div>
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{
                      isUpdatingData
                        ? $t('mining.loading')
                        : $tc('meta.coins.count.WQTCount', Floor(profit))
                    }}
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
                    {{ $tc('meta.coins.count.LPCount', Floor(staked)) }}
                  </div>
                  <div class="info-block__title_small">
                    {{ $t('meta.btns.stake') }}
                  </div>
                </div>
                <div class="third__container">
                  <div class="third info-block__title_big info-block__title_blue">
                    {{ $tc('meta.coins.count.WQTCount', Floor(claim)) }}
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
                data-selector="STAKE"
                class="btn_bl"
                :disabled="!isConnected"
                @click="openModalStaking()"
              >
                {{ $t('meta.btns.stake') }}
              </base-btn>
              <base-btn
                data-selector="UNSTAKE"
                class="btn_bl"
                mode="outline"
                :disabled="!isConnected"
                @click="openModalUnstaking()"
              >
                {{ $t('meta.btns.unstake') }}
              </base-btn>
              <base-btn
                data-selector="CLAIM-REWARDS"
                mode="outline"
                class="bnt__claim"
                :disabled="!isConnected"
                @click="claimRewards()"
              >
                {{ $t('meta.claimRewards') }}
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
                  {{ `${Floor(el.item.totalValue, 2)} $` }}
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
                  v-if="chain === $options.Chains.ETHEREUM"
                  class="user__value_green"
                  :href="`https://etherscan.io/address/${el.item.account}`"
                  target="_blank"
                >
                  {{ CutTxn(el.item.account) }}
                </a>
                <a
                  v-if="chain === $options.Chains.BINANCE"
                  class="user__value_green"
                  :href="`https://bscscan.com/address/${el.item.account}`"
                  target="_blank"
                >
                  {{ CutTxn(el.item.account) }}
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
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          :total-pages="totalPages"
          class="mining-page__pager"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import {
  Path, TokenSymbols, Chains,
} from '~/utils/enums';
import { getChainIdByChain } from '~/utils/web3';
import { Pool, PoolURL } from '~/utils/сonstants/mining';
import { images } from '~/utils/images';

export default {
  name: 'Pool',
  layout: 'guest',
  middleware: 'mining',
  Path,
  Chains,
  components: {
    chart: () => import('./graphics_data'),
  },
  data() {
    return {
      page: 1,
      limit: 10,
      isUpdatingData: false,
      chain: null,
      metamaskStatus: localStorage.getItem('metamaskStatus'),
    };
  },
  computed: {
    ...mapGetters({
      claim: 'mining/getClaim',
      staked: 'mining/getStaked',
      profit: 'mining/getProfit',
      balance: 'mining/getBalance',
      miningSwaps: 'mining/getSwaps',
      miningChartData: 'mining/getChartData',
      totalLiquidityUSD: 'mining/getTotalLiquidityUSD',

      account: 'web3/getAccount',
      isConnected: 'web3/isConnected',
      isShowModal: 'modals/getIsShow',

      isAuth: 'user/isAuth',
    }),
    isWrongChain() {
      return this.account?.netId !== +getChainIdByChain(this.chain);
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
      this.$moment.locale(this.$i18n.locale);
      return this.miningSwaps.map((data) => ({
        ...data,
        time: this.$moment(new Date(data.timestamp * 1000)).startOf('hour').fromNow(),
        ...this.getTokensAmount(data),
      }));
    },
    totalPages() {
      return Math.ceil(100 / this.limit);
    },
    icons() {
      return [
        Pool.get(this.chain).icon,
        images.WQT,
      ];
    },
    poolButtons() {
      if (this.chain === Chains.ETHEREUM) {
        return [
          {
            dataSelector: 'ADD-LIQUIDITY-ETH',
            title: 'meta.addLiquidity',
            link: PoolURL.ETH,
            disabled: false,
            action: '',
            mode: '',
          },
        ];
      }
      return [
        {
          dataSelector: 'OPEN-SWAP-TOKENS-WQT',
          title: 'mining.swapTokens.title',
          link: '',
          disabled: this.metamaskStatus === 'notInstalled' || !this.isConnected,
          action: this.openSwapTokens,
          mode: 'outline',
        },
        {
          dataSelector: 'ADD-LIQUIDITY-BNB',
          title: 'meta.addLiquidity',
          link: PoolURL.BNB,
          disabled: false,
          action: '',
          mode: '',
        },
      ];
    },
  },
  watch: {
    async isConnected(status) {
      if (!status) await this.resetPoolData();
      else if (this.isShowModal && this.isWrongChain) {
        await this.CloseModal();
        this.ShowToast(this.$t('modals.incorrectChain'));
      } else if (await this.checkNetwork(this.chain)) await this.tokensDataUpdate();
    },
    async totalLiquidityUSD(newVal, oldVal) {
      if (this.page === 1 && oldVal) {
        const { limit, chain: pool } = this;
        await this.fetchSwaps({ pool, params: { limit, offset: 0 } });
      }
    },
    async page() {
      const { limit, chain: pool } = this;
      await this.fetchSwaps({
        pool,
        params: {
          limit,
          offset: (this.page - 1) * limit,
        },
      });
    },
  },
  beforeMount() {
    if (this.isAuth) this.$nuxt.setLayout('default');
  },
  created() {
    const symbol = this.$route.params.id;
    switch (symbol) {
      case TokenSymbols.ETH:
        this.chain = Chains.ETHEREUM;
        break;
      case TokenSymbols.BNB:
        this.chain = Chains.BINANCE;
        break;
      default:
        console.error('Unknown pool:', symbol);
        break;
    }
  },
  async mounted() {
    this.SetLoader(true);
    await this.subscribeWS();
    const { limit, chain: pool } = this;
    await this.fetchChartData(pool);
    await this.fetchSwaps({ pool, params: { limit, offset: 0 } });
    this.SetLoader(false);
  },
  async beforeDestroy() {
    await this.disconnectWallet();
    await Promise.all([
      this.resetPoolData(),
      this.unsubscribeWS(),
      this.$store.commit('mining/setSwaps', []),
      this.$store.commit('mining/setChartData', []),
      this.$store.commit('mining/setTotalLiquidityUSD', null),
    ]);
  },
  methods: {
    ...mapActions({
      goToChain: 'web3/goToChain',
      connectWallet: 'web3/connect',
      disconnectWallet: 'web3/disconnect',

      subscribeWS: 'mining/subscribeWS',
      unsubscribeWS: 'mining/unsubscribeWS',

      fetchSwaps: 'mining/fetchSwaps',
      calcProfit: 'mining/calcProfit',
      fetchPoolData: 'mining/fetchPoolData',
      resetPoolData: 'mining/resetPoolData',
      fetchChartData: 'mining/fetchChartData',

      claimTokens: 'mining/claim',
      stakeTokens: 'mining/stake',
      unStakeTokens: 'mining/unStake',
      swapOldTokens: 'mining/swapOldTokens',
    }),

    async toggleConnection() {
      const { isConnected, chain } = this;
      if (isConnected) await this.disconnectWallet();
      else await this.connectWallet({ chain });
    },

    checkChain() {
      if (!this.account?.netId) {
        this.CloseModal();
        this.ShowToast(this.$t('meta.disconnect'));
        return false;
      }
      return true;
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

    getTokensAmount({ isOut, amount0, amount1 }) {
      const pools = {
        [Chains.ETHEREUM]: {
          tokenIn: isOut ? TokenSymbols.WQT : TokenSymbols.WETH,
          tokenOut: isOut ? TokenSymbols.WETH : TokenSymbols.WQT,
        },
        [Chains.BINANCE]: {
          tokenIn: isOut ? TokenSymbols.WQT : TokenSymbols.WBNB,
          tokenOut: isOut ? TokenSymbols.WBNB : TokenSymbols.WQT,
        },
      };

      const _amount0 = this.Floor(isOut ? amount1 : amount0, 3);
      const _amount1 = this.Floor(isOut ? amount0 : amount1, 3);

      const { chain } = this;
      return {
        poolAddress: `Swap ${pools[chain].tokenIn} for ${pools[chain].tokenOut}`,
        tokenAmount0: `${_amount0} ${pools[chain].tokenIn}`,
        tokenAmount1: `${_amount1} ${pools[chain].tokenOut}`,
      };
    },

    async tokensDataUpdate() {
      this.isUpdatingData = true;
      await this.fetchPoolData({ chain: this.chain });
      if (+this.staked > 0) await this.calcProfit();
      this.isUpdatingData = false;
    },

    async openSwapTokens() {
      if (await this.checkNetwork(this.chain)) {
        this.ShowModal({
          key: modals.swapTokens,
          submit: async (amount, decimals) => {
            if (!this.checkChain()) return;
            this.SetLoader(true);
            this.CloseModal();

            const { ok } = await this.swapOldTokens({ amount, decimals });

            if (ok) this.ShowModalSuccess({});
            else this.ShowModalFail({});

            this.SetLoader(false);
          },
        });
      }
    },

    async openModalStaking() {
      if (await this.checkNetwork(this.chain)) {
        this.ShowModal({
          key: modals.valueSend,
          title: this.$t('modals.titles.stake'),
          maxValue: this.balance,
          submit: async (amount) => {
            if (!this.checkChain()) return;
            this.CloseModal();

            this.SetLoader(true);
            const { ok } = await this.stakeTokens({
              amount,
              chain: this.chain,
            });
            this.SetLoader(false);

            if (ok) {
              this.ShowModalSuccess({});
              await this.tokensDataUpdate();
            } else this.ShowModalFail({});
          },
        });
      }
    },

    async openModalUnstaking() {
      if (await this.checkNetwork(this.chain)) {
        this.ShowModal({
          key: modals.valueSend,
          title: this.$t('modals.titles.unstake'),
          maxValue: this.staked,
          submit: async (amount) => {
            if (!this.checkChain()) return;
            this.CloseModal();

            this.SetLoader(true);
            const { ok } = await this.unStakeTokens({
              amount,
              chain: this.chain,
            });
            this.SetLoader(false);

            if (ok) {
              this.ShowModalSuccess({});
              await this.tokensDataUpdate();
            } else this.ShowModalFail({});
          },
        });
      }
    },

    async claimRewards() {
      const { chain } = this;
      if (await this.checkNetwork(chain) === false) {
        return;
      }

      if (+this.claim === 0) {
        this.ShowModalFail({
          title: this.$t('modals.transactionFail'),
          subtitle: this.$t('modals.nothingToClaim'),
        });
        return;
      }

      this.SetLoader(true);
      const { ok } = await this.claimTokens({ chain });
      this.SetLoader(false);

      if (ok) {
        this.ShowModalSuccess({});
        await this.tokensDataUpdate();
      } else this.ShowModalFail({});
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

  &__pager {
    margin-left: auto;
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
</style>
