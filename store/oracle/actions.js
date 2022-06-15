import BigNumber from 'bignumber.js';
import {
  error,
  success,
  fetchContractData,
} from '~/utils/web3';

import {
  getGasPrice,
  getProvider,
  createInstance,
  getWalletAddress,
} from '~/utils/wallet';

import { WQOracle, WQRouter } from '~/abi';

import ENV from '~/utils/addresses/index';

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
      console.error('oracle/getSecurityRatio', e);
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

      dispatch('main/showToast', {
        title: $nuxt.$t('toasts.error'),
        text: $nuxt.$t('toasts.errorGetFee'),
      }, { root: true });
      return error();
    } catch (e) {
      console.error('oracle/setCurrentPriceTokens', e);
      return error();
    }
  },
  async getCurrencyInfo({ commit }, { currency }) {
    try {
      const { minRatio } = await fetchContractData(
        'tokens',
        WQRouter,
        ENV.WORKNET_ROUTER,
        [currency],
        getProvider(),
      );
      commit('setMinRatio', new BigNumber(minRatio).shiftedBy(-18).multipliedBy(100).toNumber());
    } catch (e) {
      console.error('collateral/getCollateralInfo', e);
    }
  },
};
