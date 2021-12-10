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
      const wqt_token = process.env.PROD === 'false'
        ? '0xe89508d74579a06a65b907c91f697cf4f8d9fac7'
        : process.env.BSC_WQT_TOKEN;
      const wbnb_token = process.env.WBNB_TOKEN;

      const apiWbnb = this.$axios.create({
        baseURL: `https://api.pancakeswap.info/api/v2/tokens/${wbnb_token}`,
      });
      const apiWqt = this.$axios.create({
        baseURL: `https://api.pancakeswap.info/api/v2/tokens/${wqt_token}`,
      });
      const wbnbRes = await apiWbnb.$get('');
      const wqtRes = await apiWqt.$get('');

      const wqtPrice = wqtRes.data.price;
      const wbnbPrice = wbnbRes.data.price;
      const wbnbTokens = 80.04;
      const wqtTokens = 818670;
      // 0.04779122  ///  572.73 - цена верная приходит
      console.log(wqtPrice, wbnbPrice);

      commit('setTotalLiquidityUSD', wqtTokens * wqtPrice + wbnbTokens * wbnbPrice);

      // https://api.coingecko.com/api/v3/coins/wbnb - "market_data":{"current_price": - price - usd
      // https://api.coingecko.com/api/v3/coins/work-quest

      // 0xe89508d74579a06a65b907c91f697cf4f8d9fac7 - bsc wqt
      // 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c - WBNB

      // const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/tokenDay?limit=10');
      // commit('setChartData', response.result);
      // commit('setTotalLiquidityUSD', response.result[0].reserveUSD);

      return response;
    } catch (e) {
      console.error('error in getChartDataForWqtWbnbPool', e);
      return false;
    }
  },

};
