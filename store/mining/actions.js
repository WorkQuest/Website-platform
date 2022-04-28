import {
  Pair as PairUniswap,
  Token as TokenUniswap,
  TokenAmount as TokenAmountUniswap,
} from '@uniswap/sdk';

import BigNumber from 'bignumber.js';
import { Path, Chains } from '~/utils/enums';
import { Pool } from '~/utils/сonstants/mining';

import {
  error,
  success,
  showToast,
  getGasPrice,
  makeApprove,
  getAllowance,
  createInstance,
  getEstimateGas,
  fetchContractData,
  getAccountAddress,
  initStackingContract,
  getPoolTotalSupplyBSC,
  getPoolTokensAmountBSC,
} from '~/utils/web3';

import { ERC20, WQTExchange } from '~/abi';

BigNumber.config({ EXPONENTIAL_AT: 60 });

const pools = {
  [Chains.BINANCE]: 'wqt-wbnb',
  [Chains.ETHEREUM]: 'wqt-weth',
};

export default {

  async fetchChartData({ commit }, pool) {
    try {
      const { ok, result: { data } } = await this.$axios.$get(`/v1/pool-liquidity/${pools[pool]}/token-day?limit=10`);
      commit('setTotalLiquidityUSD', data[0].reserveUSD);
      commit('setChartData', data.reverse().map((item) => ({
        ...item,
        date: this.$moment(item.date * 1000).utc(false),
      })));
      return ok;
    } catch (e) {
      console.error('mining/fetchETHChart');
      return false;
    }
  },

  async fetchSwaps({ commit }, { pool, params }) {
    try {
      const { ok, result: { data } } = await this.$axios.$get(`/v1/pool-liquidity/${pools[pool]}/swaps`, {
        params,
      });

      /**
       * @property swap.amount0In - token came to pool
       * @property swap.amount0Out - token go out from pool
       * @property swap.amount1In - wqt came to pool
       * @property swap.amount1Out - wqt go out from pool
       * @property swap.amountUSD
       */
      commit('setSwaps', data.map((swap) => {
        const isOut = swap.amount0In === '0';
        return {
          isOut,
          ...swap,
          account: swap.to,
          timestamp: swap.timestamp,
          totalValue: swap.amountUSD,
          amount0: new BigNumber(isOut ? swap.amount0Out : swap.amount0In).shiftedBy(-18).decimalPlaces(3).toString(),
          amount1: new BigNumber(isOut ? swap.amount1In : swap.amount1Out).shiftedBy(-18).decimalPlaces(3).toString(),
        };
      }));
      return ok;
    } catch (e) {
      console.error('mining/fetchSwaps');
      return false;
    }
  },

  async subscribeWS({ commit, getters }) {
    try {
      await this.$wsNotifs.subscribe(`${Path.NOTIFICATIONS}/dailyLiquidity`, async (event) => {
        const { reserveUSD } = event.data;
        commit('setTotalLiquidityUSD', reserveUSD);

        const chartData = JSON.parse(JSON.stringify(getters.getChartData));
        chartData[chartData.length - 1].reserveUSD = reserveUSD;
        commit('setChartData', chartData);
      });
    } catch (e) {
      console.error('mining/subscribeWS', e);
    }
  },

  async unsubscribeWS({ _ }) {
    try {
      await this.$wsNotifs.unsubscribe(`${Path.NOTIFICATIONS}/dailyLiquidity`);
    } catch (e) {
      console.error('mining/unsubscribeWS', e);
    }
  },

  async fetchPoolData({ commit }, { chain }) {
    try {
      const { stakingAddress, stakingAbi } = Pool.get(chain);
      const { _balance, staked_, claim_ } = await fetchContractData(
        'getInfoByAddress',
        stakingAbi,
        stakingAddress,
        [getAccountAddress()],
      );

      commit('setPoolData', {
        balance: new BigNumber(_balance).shiftedBy(-18).toString(),
        staked: new BigNumber(staked_).shiftedBy(-18).toString(),
        claim: new BigNumber(claim_).shiftedBy(-18).toString(),
      });
      return success();
    } catch (e) {
      console.error('Error mining/fetchPoolData for pool:', chain, e);
      return error();
    }
  },

  /**
   * @property totalSupply
   * @property pairDayDatas
   * @property stakingInfoEvent.rewardTotal
   * @property stakingInfoEvent.totalStaked
   * @property market_data.current_price
   * @param commit
   * @param payload
   * @return {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchAPY({ commit }, payload) {
    let totalSupply;
    let reserveUSD;
    if (payload.chain === Chains.ETHEREUM) {
      const ethereum_wqt_token = process.env.PROD === 'false'
        ? '0x06677Dc4fE12d3ba3C7CCfD0dF8Cd45e4D4095bF'
        : process.env.ETHEREUM_WQT_TOKEN;

      const token0 = new TokenUniswap(
        1,
        ethereum_wqt_token,
        18,
        'WQT',
        'Work Quest Token',
      );
      const token1 = new TokenUniswap(
        1,
        process.env.WETH_TOKEN,
        18,
        'WETH',
        'Wrapped Ether',
      );
      const pair = new PairUniswap(
        new TokenAmountUniswap(token0, 2000000000000000000),
        new TokenAmountUniswap(token1, 1000000000000000000),
      );
      const uniswapApi = this.$axios.create({
        baseURL: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      });
      const result = await uniswapApi.post('', {
        query: `{
        pairDayDatas (first: 1, skip: 0,
        orderBy:date, orderDirection: desc,
        where: {pairAddress: "${pair.liquidityToken.address.toLowerCase()}"})
        { totalSupply reserveUSD }}`,
      });
      totalSupply = result.data.data.pairDayDatas[0].totalSupply;
      reserveUSD = result.data.data.pairDayDatas[0].reserveUSD;
    } else {
      const [supply, tokensAmount] = await Promise.all([
        getPoolTotalSupplyBSC(),
        getPoolTokensAmountBSC(),
      ]);
      totalSupply = supply;
      reserveUSD = new BigNumber(tokensAmount.wqtAmount).multipliedBy(tokensAmount.wbnbAmount).sqrt().toNumber();
    }
    try {
      const apiCoingecko = this.$axios.create({ baseURL: 'https://api.coingecko.com/api/v3/coins/work-quest' });
      const [coingeckoResult, stakingInfoEvent] = await Promise.all([
        apiCoingecko.get(''),
        initStackingContract(payload.chain),
      ]);
      const priceWQT = coingeckoResult.data.market_data.current_price.usd;
      const totalStaked = new BigNumber(stakingInfoEvent.totalStaked).shiftedBy(-18).toNumber();
      const rewardTotal = new BigNumber(stakingInfoEvent.rewardTotal).shiftedBy(-18).toNumber();

      const priceLP = new BigNumber(reserveUSD).dividedBy(totalSupply).toNumber();
      const a = new BigNumber(rewardTotal).multipliedBy(12).multipliedBy(priceWQT).toNumber();
      const b = new BigNumber(totalStaked).multipliedBy(priceLP).toNumber();

      const APY = new BigNumber(a).dividedBy(b).toNumber();
      const profit = new BigNumber(payload.stakedAmount)
        .multipliedBy(priceLP)
        .multipliedBy(APY)
        .dividedBy(priceWQT)
        .toNumber();
      commit('setAPY', profit);
      return success(profit);
    } catch (err) {
      console.error('Error in mining/fetchAPY:', err);
      return error(err);
    }
  },

  async resetPoolData({ commit }) {
    commit('setPoolData', {
      balance: null,
      staked: null,
      claim: null,
    });
    commit('setAPY', 0);
  },

  async fetchTokenInfo({ dispatch }, tokenAddress) {
    const { ok, result } = await dispatch('web3/fetchTokenInfo', tokenAddress, { root: true });
    return ok ? result : { balance: 0, decimals: 0, symbol: '' };
  },

  async swapOldTokens({ _ }, { amount, decimals }) {
    try {
      const tokenInstance = await createInstance(ERC20, process.env.BSC_OLD_WQT_TOKEN);
      const exchangeInstance = await createInstance(WQTExchange, process.env.BSC_WQT_EXCHANGE);

      const value = new BigNumber(amount).shiftedBy(+decimals).toString();
      const allowance = await getAllowance(getAccountAddress(), process.env.BSC_WQT_EXCHANGE, tokenInstance);
      if (new BigNumber(allowance).isLessThan(value)) {
        showToast('Swapping', 'Approving...', 'success');
        await makeApprove(process.env.BSC_WQT_EXCHANGE, value, tokenInstance);
        showToast('Swapping', 'Approving done', 'success');
      }

      showToast('Swapping', 'Swapping...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, exchangeInstance, 'swap', [value]),
      ]);
      const result = await exchangeInstance.methods.swap(value).send({
        from: getAccountAddress(),
        gasPrice,
        gas,
      });
      showToast('Swapping', 'Swapping done', 'success');

      return success(result);
    } catch (e) {
      console.error('Error in mining/swapOldTokens:', e);
      showToast('Swapping error', `${e.message}`, 'danger');
      return error(500, 'Swap error', e);
    }
  },

  async stake({ _ }, { amount, chain }) {
    try {
      const { stakingAbi, stakingAddress, stakingToken } = Pool.get(chain);
      const instanceStake = await createInstance(stakingAbi, stakingAddress);
      const instanceToken = await createInstance(ERC20, stakingToken);

      const value = new BigNumber(amount).shiftedBy(18).toString();
      const allowance = await getAllowance(getAccountAddress(), stakingAddress, instanceToken);
      if (new BigNumber(allowance).isLessThan(value)) {
        showToast('Swapping', 'Approving...', 'success');
        await makeApprove(stakingAddress, value, instanceToken);
        showToast('Swapping', 'Approving done', 'success');
      }

      showToast('Staking', 'Staking...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, instanceStake, 'stake', [value]),
      ]);
      const result = await instanceStake.methods.stake(value).send({
        from: getAccountAddress(),
        gasPrice,
        gas,
      });
      showToast('Staking', 'Staking done', 'success');

      return success(result);
    } catch (e) {
      console.error('Error in mining/stake:', e);
      showToast('Staking error', `${e.message}`, 'danger');
      return error(e.code, 'Stake error', e);
    }
  },

  /**
   * @property unstake
   * @param amount
   * @param chain
   * @return {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async unStake({ _ }, { amount, chain }) {
    try {
      const { stakingAbi, stakingAddress } = Pool.get(chain);
      const inst = await createInstance(stakingAbi, stakingAddress);

      const value = new BigNumber(amount).shiftedBy(18).toString();
      showToast('Unstaking', 'Unstaking...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, inst, 'unstake', [value]),
      ]);
      const result = await inst.methods.unstake(value).send({
        from: getAccountAddress(),
        gasPrice,
        gas,
      });
      showToast('Unstaking', 'Unstaking done', 'success');

      return success(result);
    } catch (e) {
      console.error('Error in mining/unStake:', e);
      showToast('Unstaking error', `${e.message}`, 'danger');
      return error(e.code, 'Stake error', e);
    }
  },

  async claim({ _ }, { chain }) {
    try {
      const { stakingAbi, stakingAddress } = Pool.get(chain);
      const inst = await createInstance(stakingAbi, stakingAddress);

      showToast('Claiming', 'Claiming...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, inst, 'claim', []),
      ]);
      const result = await inst.methods.claim().send({
        from: getAccountAddress(),
        gasPrice,
        gas,
      });
      showToast('Claiming', 'Claiming done', 'success');

      return success(result);
    } catch (e) {
      console.error('Error in mining/claim:', e);
      showToast('Claim error', `${e.message}`, 'danger');
      return error(e.code, 'Error with claim', e);
    }
  },

};
