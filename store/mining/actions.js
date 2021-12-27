import { getPoolTokensAmountBSC } from '~/utils/web3';

export default {

  async getTableDataForWqtWbnbPool({ commit }, { limit = 10, offset = 0 }) {
    try {
      const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-wbnb/swaps?limit=${limit}&offset=${offset}`);
      commit('setTableData', response.result);
      return response;
    } catch (e) {
      console.error('error in getTableDataForWqtWbnbPool', e);
      return false;
    }
  },

  async getTableDataForWqtWethPool({ commit }, { limit = 10, offset = 0 }) {
    try {
      const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-weth/swaps?limit=${limit}&offset=${offset}`);
      commit('setTableData', response.result);
      return response;
    } catch (e) {
      console.error('error in getTableDataForWqtWethPool', e);
      return false;
    }
  },

  async getChartDataForWqtWethPool({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/tokenDay?limit=10');
      commit('setTotalLiquidityUSD', response.result[0].reserveUSD);
      commit('setChartData', response.result.reverse());
      return response;
    } catch (e) {
      console.error('error in getChartDataForWqtWethPool', e);
      return false;
    }
  },

  async getChartDataForWqtWbnbPool({ commit }) {
    try {
      const wqt_token = process.env.PROD === 'false'
        ? '0xe89508d74579a06a65b907c91f697cf4f8d9fac7'
        : process.env.BSC_WQT_TOKEN;
      const wbnb_token = process.env.WBNB_TOKEN;

      const apiWbnb = this.$axios.create({ baseURL: `https://api.pancakeswap.info/api/v2/tokens/${wbnb_token}` });
      const apiWqt = this.$axios.create({ baseURL: `https://api.pancakeswap.info/api/v2/tokens/${wqt_token}` });

      const [wbnbRes, wqtRes, tokensAmount, responseChartData] = await Promise.all([
        apiWbnb.$get(''),
        apiWqt.$get(''),
        getPoolTokensAmountBSC(),
        this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/tokenDay?limit=10'),
      ]);
      const totalLiquidity = tokensAmount.wqtAmount * wbnbRes.data.price + tokensAmount.wbnbAmount * wqtRes.data.price;
      commit('setTotalLiquidityUSD', totalLiquidity);
      const { count, infoPer10Days } = responseChartData.result;
      if (count) infoPer10Days[0].reserveUSD = totalLiquidity;
      commit('setChartData', infoPer10Days.reverse());
      return responseChartData;
    } catch (e) {
      console.error('error in getChartDataForWqtWbnbPool', e);
      return false;
    }
  },

};
