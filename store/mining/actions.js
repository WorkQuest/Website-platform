export default {

  async getTableDataForWqtWbnbPool({ commit }, { limit = 10, offset = 0 }) {
    try {
      const response = await this.$axios.$get(`https://app.workquest.co/api/v1/pool-liquidity/wqt-wbnb/swaps?limit=${limit}&offset=${offset}`);
      commit('setTableData', response.result);
      return response;
    } catch (e) {
      console.error('error in getTableDataForWqtWbnbPool', e);
      return false;
    }
  },

  async getTableDataForWqtWethPool({ commit }, { limit = 10, offset = 0 }) {
    try {
      const response = await this.$axios.$get(`https://app.workquest.co/api/v1/pool-liquidity/wqt-weth/swaps?limit=${limit}&offset=${offset}`);
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
      commit('setChartData', response.result);
      commit('setTotalLiquidityUSD', response.result[0].reserveUSD);
      return response;
    } catch (e) {
      console.error('error in getChartDataForWqtWethPool', e);
      return false;
    }
  },

  async getChartDataForWqtWbnbPool({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/tokenDay?limit=10');
      commit('setChartData', response.result);
      commit('setTotalLiquidityUSD', response.result[0].reserveUSD);
      return response;
    } catch (e) {
      console.error('error in getChartDataForWqtWbnbPool', e);
      return false;
    }
  },

};
