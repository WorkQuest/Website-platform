import { error } from '~/utils/web3';
import {
  getGasPrice, setTokenPrices,
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
  async setCurrentPriceTokens() {
    const {
      result: {
        nonce: timestamp, v, r, s, prices, symbols,
      },
    } = await this.$axiosOracle.$get('/oracle/sign-price/tokens');

    const params = {
      timestamp, v, r, s, prices, symbols,
    };

    const { gas, gasPrice } = await getGasPrice(WQOracle, process.env.WORKNET_ORACLE, 'setTokenPricesUSD', Object.values(params));
    if (gas && gasPrice) {
      await setTokenPrices({
        gasPrice,
        gas,
        ...params,
      });
    }
  },
};
