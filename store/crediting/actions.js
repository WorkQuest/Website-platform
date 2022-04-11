import BigNumber from 'bignumber.js';
import {
  getWalletAddress,
  GetWalletProvider,
  sendWalletTransaction,
  setTokenPrice,
  setTokenPrices,
} from '~/utils/wallet';
import {
  fetchContractData,
  success,
  error,
} from '~/utils/web3';
import * as abi from '~/abi/abi';

export default {
  async getFunds({ commit }) {
    const res = await fetchContractData(
      'getFunds',
      abi.WQBorrowing,
      process.env.WORKNET_BORROWING,
      [],
      GetWalletProvider(),
    );
    commit('setFunds', res);
  },
  async getCreditData({ commit }) {
    const address = await getWalletAddress();
    const res = await fetchContractData(
      'borrowers',
      abi.WQBorrowing,
      process.env.WORKNET_BORROWING,
      [address],
      GetWalletProvider(),
    );
    commit('setCreditData', res);
  },
  async getWalletsData({ commit }) {
    const address = await getWalletAddress();
    const res = await fetchContractData(
      'wallets',
      abi.WQLending,
      process.env.WORKNET_LENDING,
      [address],
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
    const address = await getWalletAddress();
    const res = await fetchContractData(
      'getRewards',
      abi.WQLending,
      process.env.WORKNET_LENDING,
      [address],
      GetWalletProvider(),
    );
    commit('setRewards', res);
  },
  async getCurrentFee({ commit }) {
    const address = await getWalletAddress();
    const res = await fetchContractData(
      'getCurrentFee',
      abi.WQBorrowing,
      process.env.WORKNET_BORROWING,
      [address],
      GetWalletProvider(),
    );
    commit('setCurrentFee', res);
    return res;
  },
  async sendMethod({ commit }, payload) {
    console.log('payload:', payload);
    const payloadSend = {
      address: payload.type === 'borrowing' ? process.env.WORKNET_BORROWING : process.env.WORKNET_LENDING,
      abi: payload.type === 'borrowing' ? abi.WQBorrowing : abi.WQLending,
      data: payload.data,
      value: payload.value,
    };
    console.log('payloadSend:', payloadSend);
    try {
      await sendWalletTransaction(payload.method, payloadSend);
      return success();
    } catch (err) {
      console.log('sendMethod:', payload.method, err);
      return error();
    }
  },
};
