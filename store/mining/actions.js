import BigNumber from 'bignumber.js';

import {
  Pair as PairUniswap,
  Token as TokenUniswap,
  TokenAmount as TokenAmountUniswap,
} from '@uniswap/sdk';

import {
  Path, Chains,
} from '~/utils/enums';

import { Pool } from '~/utils/Constants/mining';

import {
  error,
  fetchContractData,
  getAccountAddress,
  getPoolTokensAmountBSC,
  getPoolTotalSupplyBSC,
  initStackingContract,
  success,
} from '~/utils/web3';

BigNumber.config({ EXPONENTIAL_AT: 60 });

/**
 * Returns prepared data for swaps table on liquidity mining page.
 * @param {Array} swaps - array of swaps from back
 * @returns {Array.<{
 * isOut: boolean,
 * totalValue: string,
 * amount0: string,
 * amount1: string,
 * account: string,
 * timestamp: string,
 * }>}
 * amount0 - have to WQT!
 * amount1 - pool's token
 */
function prepareDataForSwapsTable(swaps) {
  const arr = [];
  swaps.forEach((swap) => {
    const isOut = swap.amount0In === '0';
    arr.push({
      isOut,
      totalValue: swap.amountUSD,
      amount0: isOut ? swap.amount0Out : swap.amount0In,
      amount1: isOut ? swap.amount1In : swap.amount1Out,
      account: swap.to,
      timestamp: swap.timestamp || swap.transaction.timestamp,
    });
  });
  return arr;
}

export default {

  async fetchChartData({ dispatch }, pool) {
    switch (pool) {
      case Chains.BINANCE:
        await dispatch('fetchBNBChart');
        break;
      case Chains.ETHEREUM:
        await dispatch('fetchETHChart');
        break;
      default:
        console.error('Unknown pool:', pool);
        break;
    }
  },

  async fetchSwaps({ dispatch }, { pool, params }) {
    switch (pool) {
      case Chains.BINANCE:
        await dispatch('fetchBNBSwaps', params);
        break;
      case Chains.ETHEREUM:
        await dispatch('fetchETHSwaps', params);
        break;
      default:
        console.error('Unknown pool:', pool);
        break;
    }
  },

  async fetchBNBSwaps({ commit }, { limit = 10, offset = 0 }) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/swaps', {
        params: {
          limit,
          offset,
        },
      });
      // amount0 - это WQT
      // amount1 - это WBNB
      const swaps = result.swaps.map((swap) => ({
        ...swap,
        amount0In: new BigNumber(swap.amount0In).shiftedBy(-18).decimalPlaces(3).toString(),
        amount0Out: new BigNumber(swap.amount0Out).shiftedBy(-18).decimalPlaces(3).toString(),
        amount1In: new BigNumber(swap.amount1In).shiftedBy(-18).decimalPlaces(3).toString(),
        amount1Out: new BigNumber(swap.amount1Out).shiftedBy(-18).decimalPlaces(3).toString(),
      }));
      commit('setTableData', prepareDataForSwapsTable(swaps));
      return ok;
    } catch (e) {
      console.error('error in getTableDataForWqtWbnbPool', e);
      return false;
    }
  },

  async fetchETHSwaps({ commit }, { limit = 10, offset = 0 }) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/swaps', {
        params: {
          limit,
          offset,
        },
      });
      // amount0 - это WETH
      // amount1 - это WQT
      const swaps = result.map((swap) => ({
        ...swap,
        amount1In: swap.amount0In,
        amount1Out: swap.amount0Out,
        amount0In: swap.amount1In,
        amount0Out: swap.amount1Out,
      }));
      commit('setTableData', prepareDataForSwapsTable(swaps));
      return ok;
    } catch (e) {
      console.error('error in getTableDataForWqtWethPool', e);
      return false;
    }
  },

  async fetchBNBChart({ commit }) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/tokenDay?limit=10');
      commit('setTotalLiquidityUSD', result[0].reserveUSD);
      commit('setChartData', result.reverse());
      return ok;
    } catch (e) {
      console.error('getChartDataForWqtWethPool');
      return false;
    }
  },

  async fetchETHChart({ commit }) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/tokenDay?limit=10');
      const totalLiquidity = result.infoPer10Days[0].reserveUSD;
      commit('setTotalLiquidityUSD', totalLiquidity);
      commit('setChartData', result.infoPer10Days.reverse());
      return ok;
    } catch (e) {
      console.error('getChartDataForWqtWbnbPool');
      return false;
    }
  },

  async initWS({ commit }) {
    console.log('initWS');
    try {
      await this.$wsNotifs.subscribe(`${Path.NOTIFICATIONS}${Path.MINING}`, async (event) => {
        console.log(event);
      });
    } catch (e) {
      console.error(e);
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
      console.error('Error fetchPoolData for pool:', chain, e);
      return error();
    }
  },

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
      console.error('Error in fetchAPY:', err);
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

};
