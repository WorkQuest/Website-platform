import { error } from '~/utils/web3';
import {
  getGasPrice, setTokenPrice, setTokenPrices,
} from '~/utils/wallet';
import { WQOracle } from '~/abi';

export default {
  async getCurrentPrices({ commit }) {
    try {
      const { result } = await this.$axiosOracle.$get('/oracle/sign-price/tokens');
      commit('setCurrentPrices', result);
      return result;
    } catch (e) {
      return error();
    }
  },
  async getSecurityRatio({ commit }) {
    try {
      const { result } = await this.$axiosOracle.$get('/oracle/security-ratio/percent');
      commit('setSecurityRatio', result);
      return result;
    } catch (e) {
      return error();
    }
  },
  async setDesiredSecurityRatio({ commit }, payload) {
    try {
      const { result } = await this.$axiosOracle.post('/oracle/risk-ratio/status', payload);
      commit('setDesiredSecurityRatio', result);
      return result;
    } catch (e) {
      return error();
    }
  },
  async setCurrentPriceToken({ dispatch }, { symbol }) {
    const { result: price } = await this.$axiosOracle.$get(`/oracle/${symbol}/price`);
    const res = await dispatch('getCurrentPrices');
    const params = {
      timestamp: res.nonce,
      price,
      v: res.v,
      r: res.r,
      s: res.s,
    };
    const { gas, gasPrice } = await getGasPrice(WQOracle, this.ENV.WORKNET_ORACLE, 'setTokenPriceUSD', [...Object.values(params), symbol]);
    if (gas && gasPrice) {
      await setTokenPrice({ currency: symbol }, { gasPrice, gas, ...params });
    }
  },
  async setCurrentPriceTokens() {
    const {
      result: {
        nonce: timestamp, v, r, s, prices, symbols,
      },
    } = await this.$axiosOracle.$get('/oracle/sign-price/tokens');

    const params = {
      timestamp, v, r, s, prices, symbols,
    };

    const { gas, gasPrice } = await getGasPrice(WQOracle, this.ENV.WORKNET_ORACLE, 'setTokenPricesUSD', Object.values(params));
    if (gas && gasPrice) {
      await setTokenPrices({
        gasPrice,
        gas,
        ...params,
      });
    }
  },
};
