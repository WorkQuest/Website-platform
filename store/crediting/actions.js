import {
  getWalletAddress,
  GetWalletProvider,
  sendWalletTransaction,
  setTokenPrices,
  getContractFeeData,
} from '~/utils/wallet';
import {
  fetchContractData,
  success,
  error,
} from '~/utils/web3';
import { WQBorrowing, WQLending } from '~/abi/index';
import ENV from '~/utils/adresses/index';

export default {
  async getCreditData({ commit }) {
    const res = await fetchContractData(
      'borrowers',
      WQBorrowing,
      ENV.WORKNET_BORROWING,
      [getWalletAddress()],
      GetWalletProvider(),
    );
    commit('setCreditData', res);
  },
  async getWalletsData({ commit }) {
    const res = await fetchContractData(
      'wallets',
      WQLending,
      ENV.WORKNET_LENDING,
      [getWalletAddress()],
      GetWalletProvider(),
    );
    commit('setWalletsData', res);
  },
  async setTokenPrices({ dispatch, rootGetters }, payload) {
    try {
      await setTokenPrices(payload);
      return { ok: true };
    } catch (e) {
      console.log('can not refresh prices');
      return { ok: false };
    }
  },
  async getRewards({ commit }) {
    const res = await fetchContractData(
      'getRewards',
      WQLending,
      ENV.WORKNET_LENDING,
      [getWalletAddress()],
      GetWalletProvider(),
    );
    commit('setRewards', res);
  },
  async getCurrentFee({ commit }) {
    const res = await fetchContractData(
      'getCurrentFee',
      WQBorrowing,
      ENV.WORKNET_BORROWING,
      [getWalletAddress()],
      GetWalletProvider(),
    );
    commit('setCurrentFee', res);
    return res;
  },
  async sendMethod({ commit }, {
    method, address, abi, data, value,
  }) {
    const result = await sendWalletTransaction(method, {
      address,
      abi,
      data,
      value,
    });
    // TODO fix it, sendWalletTransaction have to return object with keys ok and result
    if (result.ok === false) return error(result);
    return success(result);
  },
  async getMethodFee({ commit }, {
    method, abi, address, data,
  }) {
    return await getContractFeeData(method, abi, address, data);
  },
};
