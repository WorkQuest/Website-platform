import BigNumber from 'bignumber.js';
import { getPoolTokensAmountBSC } from '~/utils/web3';

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

  async getTableDataForWqtWbnbPool({ commit }, { limit = 10, offset = 0 }) {
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

  async getTableDataForWqtWethPool({ commit }, { limit = 10, offset = 0 }) {
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

  async getChartDataForWqtWethPool({ commit }) {
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

  async getChartDataForWqtWbnbPool({ commit }) {
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

};
