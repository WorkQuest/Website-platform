import { error, success } from '~/utils/web3';

import {
  getGasPrice,
  createInstance,
  getWalletAddress,
} from '~/utils/wallet';

import { WQOracle } from '~/abi';

import ENV from '~/utils/adresses/index';

/**
 * @property $axiosOracle - axios instance of oracle
 */
export default {
  async getCurrentTokensPrices({ commit }) {
    try {
      const { result } = await this.$axiosOracle.$get('/oracle/sign-price/tokens');
      commit('setCurrentPrices', result);
      return success(result);
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

  async feeSetTokensPrices({ getters, dispatch }) {
    try {
      await dispatch('getCurrentTokensPrices');

      const {
        nonce: timestamp, v, r, s,
      } = getters.getCurrentPrices;
      const [prices, symbols] = [getters.getPrices, getters.getSymbols];

      const fee = await getGasPrice(
        WQOracle,
        ENV.WORKNET_ORACLE,
        'setTokenPricesUSD',
        [timestamp, v, r, s, prices, symbols],
      );
      return success(fee);
    } catch (e) {
      console.error('oracle/feeSetTokenPrices', e);
      return error();
    }
  },

  async setCurrentPriceTokens({ getters, dispatch }) {
    try {
      const { result: { gas, gasPrice } } = await dispatch('feeSetTokensPrices');
      await dispatch('getCurrentTokensPrices');

      const {
        nonce: timestamp, v, r, s,
      } = getters.getCurrentPrices;
      const [prices, symbols] = [getters.getPrices, getters.getSymbols];

      if (gas && gasPrice) {
        /**
         * @property setTokenPricesUSD - method of oracle
         */
        const inst = await createInstance(WQOracle, ENV.WORKNET_ORACLE);
        await inst.methods.setTokenPricesUSD(timestamp, v, r, s, prices, symbols).send({
          from: getWalletAddress(),
          gasPrice,
          gas,
        });
        return success();
      }

      // TODO add locales
      dispatch('main/showToast', {
        title: this.$t('error'),
        text: this.$t('noGas'),
      }, { root: true });
      return error();
    } catch (e) {
      console.error('oracle/setCurrentPriceTokens', e);
      return error();
    }
  },
};
