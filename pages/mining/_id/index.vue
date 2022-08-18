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
        <div class="mining-page__wallet">
          <base-btn
            class="mining-page__connect"
            mode="light"
            :data-selector="!isConnected ? 'CONNECT-WALLET' : 'DISCONNECT-FROM-WALLET'"
            :disabled="connectionType !== $options.ConnectionTypes.WEB3 || isConnectingWeb3"
            @click="toggleConnection"
          >
            {{ connectionButtonText }}
          </base-btn>
        </div>
      </div>
      <p class="mining-page__address">
        <template v-if="styledWalletAddress">
          {{ $t('info.yourWallet') }} {{ styledWalletAddress }}
        </template>
      </p>
      <wallet-switcher class="mining-page__switcher" />
      <div class="mining-page__content">
        <div
          class="info-block__grid info-block_space-top-mini"
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
                :disabled="isDisableButtons"
                @click="openModalStaking"
              >
                {{ $t('meta.btns.stake') }}
              </base-btn>
              <base-btn
                data-selector="UNSTAKE"
                class="btn_bl"
                mode="outline"
                :disabled="isDisableButtons"
                @click="openModalUnstaking"
              >
                {{ $t('meta.btns.unstake') }}
              </base-btn>
              <base-btn
                data-selector="CLAIM-REWARDS"
                mode="outline"
                class="bnt__claim"
                :disabled="isDisableButtons"
                @click="claimRewards"
              >
                {{ $t('meta.claimRewards') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div class="info-block info-block_space-top">
          <div class="info-block__name_bold">
            {{ $t('mining.liquidityPoolProviders') }}
          </div>
          <div class="info-block__title_small info-block__title_pad">
            {{ $t('mining.liquidityProvidersEarn') }}
          </div>
        </div>
        <div class="info-block info-block_space-top">
          <div class="info-block__name">
            {{ $t('mining.liquidity') }}
          </div>
          <chart :special-chart-data="miningChartData" />
        </div>
        <div class="info-block info-block_space-top">
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
import BigNumber from 'bignumber.js';
import WalletSwitcher from '~/components/app/WalletSwitcher';
import modals from '~/store/modals/modals';
import {
  Path,
  Chains,
  Layout,
  TokenSymbols, ConnectionTypes,
} from '~/utils/enums';
import {
  fetchContractData,
  getChainIdByChain, GetWeb3Provider, success,
} from '~/utils/web3';
import { Pool, PoolURL } from '~/utils/сonstants/mining';
import { images } from '~/utils/images';
import { LoaderStatusLocales } from '~/utils/loader';
import { GetWalletProvider } from '~/utils/wallet';
import { SwapAddresses } from '~/utils/сonstants/bridge';
import walletOperations from '~/plugins/mixins/walletOperations';
import { ERC20, WQTExchange } from '~/abi';
import ENV from '~/utils/addresses';

export default {
  name: 'Pool',
  layout({ store }) {
    return store.getters['user/isAuth'] ? Layout.DEFAULT : Layout.GUEST;
  },
  components: {
    WalletSwitcher,
    chart: () => import('./graphics_data'),
  },
  mixins: [walletOperations],
  middleware: 'mining',
  Path,
  Chains,
  ConnectionTypes,
  data() {
    return {
      page: 1,
      limit: 10,
      isUpdatingData: false,
      chain: null,
      metamaskStatus: localStorage.getItem('metamaskStatus'),

      isConnectingWeb3: false,
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

      web3Account: 'web3/getAccount',
      isConnected: 'web3/isConnected',
      isShowModal: 'modals/getIsShow',

      connectionType: 'web3/getConnectionType',
      selectedNetwork: 'wallet/getSelectedNetwork',
      userWalletAddress: 'user/getUserWalletAddress',

      isAuth: 'user/isAuth',
    }),
    explorerUrl() {
      return SwapAddresses.get(this.selectedNetwork).explorer;
    },
    nativeTokenSymbol() {
      return SwapAddresses.get(this.selectedNetwork).nativeSymbol;
    },
    isDisableButtons() {
      if (this.connectionType === ConnectionTypes.WEB3) return !this.isConnected;
      return this.selectedNetwork !== this.chain;
    },
    connectionButtonText() {
      if (this.connectionType === ConnectionTypes.WQ_WALLET) return this.$t('meta.connected');
      return !this.isConnected ? this.$t('mining.connectWallet') : this.$t('meta.disconnect');
    },
    getProviderByConnection() {
      if (this.connectionType === ConnectionTypes.WEB3) return GetWeb3Provider;
      return GetWalletProvider;
    },
    account() {
      if (this.connectionType === ConnectionTypes.WEB3) return this.web3Account;
      return { address: this.userWalletAddress };
    },
    styledWalletAddress() {
      let buff = '';
      if (this.connectionType === ConnectionTypes.WQ_WALLET) {
        buff = this.userWalletAddress;
      } else if (this.isConnected && this.connectionType === ConnectionTypes.WEB3) {
        buff = this.account.address;
      }
      return this.CutTxn(buff, 5, 5);
    },
    isWrongChain() {
      if (this.connectionType === ConnectionTypes.WQ_WALLET) return false;
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
        images.WQ_PLATFORM_LOGO,
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
          disabled: this.isDisableButtons || (this.connectionType === ConnectionTypes.WEB3 && this.metamaskStatus === 'notInstalled'),
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
    loaderStatusText() {
      return this.connectionType === ConnectionTypes.WEB3
        ? LoaderStatusLocales.waitingForTxExternalApp
        : LoaderStatusLocales.pleaseWaitTx;
    },
  },
  watch: {
    async connectionType() {
      await this.resetPoolData();
      await this.connectWallet();
    },

    // Web3 wallet connection & chain handler
    async isConnected(status) {
      if (this.connectionType === ConnectionTypes.WQ_WALLET) return;
      if (!status) {
        await this.resetPoolData();
        this.disconnectWallet();
        if (this.isShowModal) this.CloseModal();
        return;
      }
      if (this.isWrongChain) {
        if (await this.checkNetwork(this.chain) === false) {
          return;
        }
      }
      await this.tokensDataUpdate();
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

    await this.connectWallet();
  },
  async beforeDestroy() {
    const preventDisconnect = sessionStorage.getItem('preventDisconnectWeb3');
    sessionStorage.removeItem('preventDisconnectWeb3');
    if (preventDisconnect) return;

    this.disconnectWallet();
    await Promise.all([
      this.$store.dispatch('wallet/connectToProvider', Chains.WORKNET),
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
      connectWeb3Wallet: 'web3/connect',
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
    async connectWallet() {
      if (this.connectionType === ConnectionTypes.WEB3 && !this.isConnected) {
        await this.connectWeb3Wallet({ isReconnection: this.isConnected, chain: this.chain });
      } else {
        this.disconnectWallet();
        if (this.connectionType === ConnectionTypes.WQ_WALLET) {
          await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
          await this.$store.dispatch('wallet/connectToProvider', this.chain);
          await this.tokensDataUpdate();
        }
      }
    },
    async toggleConnection() {
      if (this.isConnectingWeb3) return;
      this.isConnectingWeb3 = true;
      const { isConnected } = this;
      if (isConnected) this.disconnectWallet();
      else await this.connectWallet();
      this.isConnectingWeb3 = false;
    },
    checkChain() {
      if (!this.account?.netId) {
        this.CloseModal();
        this.ShowToast(this.$t('meta.disconnect'));
        return false;
      }
      return true;
    },

    /**
     * Check web3 connection and chain
     * @param chain
     * @returns {Promise<boolean>}
     */
    async checkNetwork(chain) {
      if (!this.isConnected) {
        await this.connectWallet();
        if (!this.isConnected) return false;
      }

      const isMetaMask = localStorage.getItem('isMetaMask') === 'true';
      const isCorrectNetwork = +getChainIdByChain(chain) === +this.account.netId;
      if (!isCorrectNetwork && isMetaMask) {
        this.ShowToast(this.$t('modals.errors.errorNetwork', { network: this.chain }), ' ');
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

    // Checking connection & chain by connectionType
    async checkConnection() {
      if (this.isDisableButtons) return false;
      if (this.connectionType === ConnectionTypes.WEB3) {
        if (this.isWrongChain) {
          await this.checkNetwork(this.chain);
          return false;
        }
      }
      return true;
    },

    async tokensDataUpdate() {
      if (this.connectionType === ConnectionTypes.WEB3 && !this.isConnected) return;
      if (this.connectionType === ConnectionTypes.WQ_WALLET && this.selectedNetwork !== this.chain) return;

      this.isUpdatingData = true;
      await this.fetchPoolData({
        chain: this.chain,
        web3Provider: this.getProviderByConnection(),
        accountAddress: this.account.address,
      });
      if (+this.staked > 0) await this.calcProfit();
      this.isUpdatingData = false;
    },

    async openSwapTokens() {
      if (await this.checkConnection() === false) return;

      const web3Provider = this.getProviderByConnection();
      const accountAddress = this.account.address;

      const swap = async (weiAmount) => {
        this.SetLoader({ isLoading: true, statusText: this.loaderStatusText });
        this.CloseModal();

        const { ok, msg, result } = await this.swapOldTokens({
          weiAmount,
          accountAddress,
          web3Provider,
        });
        if (ok) {
          this.ShowModalSuccess({
            link: `${this.explorerUrl}/tx/${result.transactionHash}`,
          });
        } else this.ShowModalFail({ subtitle: msg });

        this.SetLoader(false);
      };

      this.SetLoader(true);
      const token = ENV.BSC_OLD_WQT_TOKEN;
      const [oldBalance, oldDecimals, oldSymbol] = await Promise.all([
        fetchContractData('balanceOf', ERC20, token, [accountAddress], web3Provider),
        fetchContractData('decimals', ERC20, token, [], web3Provider),
        fetchContractData('symbol', ERC20, token, [], web3Provider),
      ]);
      const oldTokenData = {
        balance: oldBalance,
        decimals: oldDecimals,
        symbol: oldSymbol,
      };
      this.SetLoader(false);

      this.ShowModal({
        key: modals.swapTokens,
        oldTokenData,
        submit: async (amount, decimals) => {
          const weiAmount = new BigNumber(amount).shiftedBy(+decimals).toString();
          // Web3 swap old tokens
          if (this.connectionType === ConnectionTypes.WEB3) {
            if (!this.checkChain()) return;
            await swap(weiAmount);
            return;
          }

          // WQWallet swap old tokens
          await this.MakeApprove({
            tokenAddress: ENV.BSC_OLD_WQT_TOKEN,
            contractAddress: ENV.BSC_WQT_EXCHANGE,
            amount,
            decimals,
            symbol: TokenSymbols.WQT,
            nativeTokenSymbol: this.nativeTokenSymbol,
            isHexUserWalletAddress: true,
          }).then(async () => {
            this.SetLoader(true);

            const [feeRes] = await Promise.all([
              this.$store.dispatch('wallet/getContractFeeData', {
                method: 'swap',
                abi: WQTExchange,
                contractAddress: ENV.BSC_WQT_EXCHANGE,
                data: [weiAmount],
              }),
              this.$store.dispatch('wallet/getBalance'),
            ]);

            this.SetLoader(false);
            if (!feeRes.ok) {
              this.ShowToast(feeRes.msg);
              return;
            }

            this.ShowModal({
              key: modals.transactionReceipt,
              title: this.$t('modals.titles.swap'),
              fields: {
                from: { name: this.$t('meta.fromBig'), value: accountAddress },
                to: { name: this.$t('meta.toBig'), value: ENV.BSC_WQT_EXCHANGE },
                amountOfTokens: { name: this.$t('modals.amount'), value: amount, symbol: TokenSymbols.WQT },
                fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: this.nativeTokenSymbol },
              },
              submitMethod: async () => await swap(weiAmount),
            });
          });
        },
      });
    },

    async openModalStaking() {
      if (await this.checkConnection() === false) return;

      this.ShowModal({
        key: modals.valueSend,
        title: this.$t('modals.titles.stake'),
        maxValue: this.balance,
        submit: async (amount) => {
          const stake = async () => {
            this.SetLoader({ isLoading: true, statusText: this.loaderStatusText });
            const { ok, msg, result } = await this.stakeTokens({
              amount,
              chain: this.chain,
              accountAddress: this.account.address,
              web3Provider: this.getProviderByConnection(),
            });
            this.SetLoader(false);

            if (ok) {
              this.ShowModalSuccess({
                link: `${this.explorerUrl}/tx/${result.transactionHash}`,
              });
              await this.tokensDataUpdate();
            } else this.ShowModalFail({ subtitle: msg });
          };

          this.CloseModal();

          // Web3 staking
          if (this.connectionType === ConnectionTypes.WEB3) {
            if (!this.checkChain()) return;
            await stake();
            return;
          }

          // WQWallet staking
          this.SetLoader(true);
          const { stakingAbi, stakingAddress, stakingToken } = Pool.get(this.chain);

          this.MakeApprove({
            tokenAddress: stakingToken,
            contractAddress: stakingAddress,
            amount,
            symbol: 'LP',
            nativeTokenSymbol: this.nativeTokenSymbol,
          }).then(async () => {
            const [feeRes] = await Promise.all([
              this.$store.dispatch('wallet/getContractFeeData', {
                method: 'stake',
                abi: stakingAbi,
                contractAddress: stakingAddress,
                data: [new BigNumber(amount).shiftedBy(18).toString()],
              }),
              this.$store.dispatch('wallet/getBalance'),
            ]);
            this.SetLoader(false);
            if (!feeRes.ok) {
              this.ShowToast(feeRes.msg);
              return;
            }
            this.ShowModal({
              key: modals.transactionReceipt,
              title: this.$t('meta.btns.stake'),
              fields: {
                stake: { name: this.$t('modals.amount'), value: amount, symbol: 'LP' },
                fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: this.nativeTokenSymbol },
              },
              submitMethod: stake,
            });
          });
        },
      });
    },

    async openModalUnstaking() {
      if (await this.checkConnection() === false) return;

      this.ShowModal({
        key: modals.valueSend,
        title: this.$t('modals.titles.unstake'),
        maxValue: this.staked,
        submit: async (amount) => {
          const unstake = async () => {
            this.SetLoader({ isLoading: true, statusText: this.loaderStatusText });
            const { ok, msg, result } = await this.unStakeTokens({
              amount,
              chain: this.chain,
              accountAddress: this.account.address,
              web3Provider: this.getProviderByConnection(),
            });
            this.SetLoader(false);

            if (ok) {
              this.ShowModalSuccess({ link: `${this.explorerUrl}/tx/${result.transactionHash}` });
              await this.tokensDataUpdate();
            } else this.ShowModalFail({ subtitle: msg });
          };

          this.CloseModal();

          // Web3 unstake
          if (this.connectionType === ConnectionTypes.WEB3) {
            if (!this.checkChain()) return;
            await unstake();
            return;
          }

          // WQWallet unstake
          this.SetLoader(true);
          const { stakingAbi, stakingAddress } = Pool.get(this.chain);
          const [feeRes] = await Promise.all([
            this.$store.dispatch('wallet/getContractFeeData', {
              method: 'unstake',
              abi: stakingAbi,
              contractAddress: stakingAddress,
              data: [new BigNumber(amount).shiftedBy(18).toString()],
            }),
            this.$store.dispatch('wallet/getBalance'),
          ]);
          this.SetLoader(false);
          if (!feeRes.ok) {
            return;
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            title: this.$t('meta.btns.unstake'),
            fields: {
              amount: { name: this.$t('modals.amount'), value: amount, symbol: 'LP' },
              fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: this.nativeTokenSymbol },
            },
            submitMethod: unstake,
          });
        },
      });
    },

    async claimRewards() {
      if (await this.checkConnection() === false) return;

      if (+this.claim === 0) {
        this.ShowModalFail({
          title: this.$t('modals.transactionFail'),
          subtitle: this.$t('modals.nothingToClaim'),
        });
        return;
      }

      const { stakingAbi, stakingAddress } = Pool.get(this.chain);
      const claim = async () => {
        this.SetLoader({ isLoading: true, statusText: this.loaderStatusText });
        const { ok, msg, result } = await this.claimTokens({
          stakingAbi,
          stakingAddress,
          web3Provider: this.getProviderByConnection(),
          accountAddress: this.account.address,
        });
        this.SetLoader(false);

        if (ok) {
          this.ShowModalSuccess({
            link: `${this.explorerUrl}/tx/${result.transactionHash}`,
          });
          await this.tokensDataUpdate();
        } else this.ShowModalFail({ subtitle: msg });
      };

      // Web3 claiming
      if (this.connectionType === ConnectionTypes.WEB3) {
        await claim();
        return;
      }

      // WQWallet claiming
      this.SetLoader(true);
      const [feeRes] = await Promise.all([
        this.$store.dispatch('wallet/getContractFeeData', {
          method: 'claim',
          abi: stakingAbi,
          contractAddress: stakingAddress,
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      this.SetLoader(false);
      if (!feeRes.ok) {
        this.ShowToast(feeRes.msg, 'Claim error');
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('meta.claimRewards'),
        fields: {
          rewards: { name: this.$t('modals.amount'), value: this.claim, symbol: TokenSymbols.WQT },
          fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: this.nativeTokenSymbol },
        },
        submitMethod: claim,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.hide {
  display: none;
}

.mining-page {
  &__connect {
    margin-bottom: 10px;
    width: 150px;
  }

  &__container {
    width: 100%;
    box-sizing: border-box;
  }

  &__wallet {
    display: flex;
    & > div {
      margin-right: 20px;
    }
  }

  &__header {
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

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
    width: 100%;
    .info-block {
      background-color: #fff;
      border-radius: 6px;

      &_space-top {
        margin-top: 30px;
        &-mini {
          margin-top: 10px;
        }
      }

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
          margin-left: 5px;
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
        margin-top: 30px;
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

  &__address {
    height: 20px;
    color: $black200;
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
    text-align: right;
    margin-bottom: 10px;
    span {
      font-weight: 600;
      color: $black0;
    }
  }

  &__table {
    .table {
      margin: 0;
      border-radius: 0 !important;
    }
  }

  &__pager {
    margin-top: 30px;
    margin-left: auto;
  }

  @include _991 {
    &__table {
      overflow: auto;
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
            grid-column-start: 1;
            grid-column-end: 3;
            grid-template-columns: repeat(2, 1fr);
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
        &__double {
          grid-template-columns: auto;
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

  &__triple {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
  }

  &__wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@include _991 {
  .third {
    &__container {
      text-align: center;
      margin-bottom: 10px;
    }
    &__wrapper {
      grid-template-columns: auto;
    }
  }
}
@include _575 {
  .third__triple {
    grid-template-columns: auto;
  }
}
</style>
