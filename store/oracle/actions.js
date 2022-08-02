import BigNumber from 'bignumber.js';
import {
  error,
  success,
  fetchContractData,
} from '~/utils/web3';

import {
  getGasPrice,
  createInstance,
  getWalletAddress,
  GetWalletProvider,
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
      commit('setMaxRatio', result.maxRatio);
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
        nonce, v, r, s,
      } = getters.getCurrentPrices;
      const [prices, symbols, maxRatio] = [getters.getPrices, getters.getSymbols, getters.getMaxRatio];

      const fee = await getGasPrice(
        WQOracle,
        ENV.WORKNET_ORACLE,
        'setTokenPricesUSD',
        [nonce, v, r, s, prices, maxRatio, symbols],
      );
      return success(fee);
    } catch (e) {
      console.error('oracle/feeSetTokenPrices', e);
      return error(e.code, e.message, e);
    }
  },

  async setCurrentPriceTokens({ getters, dispatch }) {
    try {
      const { result: { gas, gasPrice } } = await dispatch('feeSetTokensPrices');

      const {
        nonce, v, r, s,
      } = getters.getCurrentPrices;
      const [prices, symbols, maxRatio] = [getters.getPrices, getters.getSymbols, getters.getMaxRatio];

      if (!gas || !gasPrice) {
        dispatch('main/showToast', {
          title: $nuxt.$t('toasts.error'),
          text: $nuxt.$t('toasts.errorGetFee'),
        }, { root: true });
        return error();
      }

      /**
       * @property setTokenPricesUSD - method of oracle
       */
      const inst = await createInstance(WQOracle, ENV.WORKNET_ORACLE);
      const res = await inst.methods.setTokenPricesUSD(nonce, v, r, s, prices, maxRatio, symbols).send({
        from: getWalletAddress(),
        // because sometimes the wrong amount of gas is calculated
        gas: 300000,
        gasPrice,
      });
      return success(res);
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
        GetWalletProvider(),
      );
      commit('setMinRatio', new BigNumber(minRatio).shiftedBy(-18).multipliedBy(100).toNumber());
    } catch (e) {
      console.error('collateral/getCollateralInfo', e);
    }
  },
};
