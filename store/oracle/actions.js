import { error } from '~/utils/web3';
import {
  getGasPrice, setTokenPrice, setTokenPrices,
} from '~/utils/wallet';
import { WQOracle } from '~/abi';

export default {
  async getCurrentPrices({ commit }) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const { data } = await apiOracle.get('/oracle/sign-price/tokens');
      commit('setCurrentPrices', data.result);
      return data.result;
    } catch (e) {
      return error();
    }
  },
  async getSecurityRatio({ commit }) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const { data } = await apiOracle.get('/oracle/security-ratio/percent');
      commit('setSecurityRatio', data.result);
      return data.result;
    } catch (e) {
      return error();
    }
  },
  async setDesiredSecurityRatio({ commit }, payload) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const response = await apiOracle.post('/oracle/risk-ratio/status', payload);
      commit('setDesiredSecurityRatio', response.result);
      return response.result;
    } catch (e) {
      return error();
    }
  },
  async setCurrentPriceToken({ dispatch }, payload) {
    const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
    const { data: { result } } = await apiOracle.get(`/oracle/${payload.symbol}/price`);
    const res = await dispatch('getCurrentPrices');
    const params = {
      timestamp: res.nonce,
      price: result,
      v: res.v,
      r: res.r,
      s: res.s,
    };
    const arrParams = [params.timestamp, params.price, params.v, params.r, params.s, payload.symbol];
    console.log(arrParams, 'arrP');
    const { gas, gasPrice } = await getGasPrice(WQOracle, process.env.WORKNET_ORACLE, 'setTokenPriceUSD', arrParams);
    if (gas && gasPrice) {
      await setTokenPrice({ currency: payload.symbol }, { gasPrice, gas, ...params });
    }
  },
  async setCurrentPriceTokens() {
    const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
    const { data: { result } } = await apiOracle.get('/oracle/sign-price/tokens');
    const arrParams = [result.nonce, result.v, result.r, result.s, result.prices, result.symbols];
    const { gas, gasPrice } = await getGasPrice(WQOracle, process.env.WORKNET_ORACLE, 'setTokenPricesUSD', arrParams);
    if (gas && gasPrice) {
      await setTokenPrices({
        gasPrice,
        gas,
        timestamp: result.nonce,
        prices: result.prices,
        v: result.v,
        r: result.r,
        s: result.s,
        symbols: result.symbols,
      });
    }
  },
};
