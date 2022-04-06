import BigNumber from 'bignumber.js';
import {
  connectWallet,
  disconnect,
  getBalance, getContractFeeData,
  getIsWalletConnected,
  getStyledAmount, getWalletAddress, getTransferFeeData,
  transfer, transferToken, GetWalletProvider, stake, sendWalletTransaction, setTokenPrice, setTokenPrices,
} from '~/utils/wallet';
import {
  fetchContractData, success, error, sendTransaction,
} from '~/utils/web3';
import * as abi from '~/abi/abi';
import { PensionHistoryMethods, StakingTypes, TokenSymbols } from '~/utils/enums';

export default {
  async getFunds({ commit }) {
    const res = await fetchContractData(
      'getFunds',
      abi.WQBorrowing,
      process.env.BORROWING,
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
      process.env.BORROWING,
      [address],
      GetWalletProvider(),
    );
    commit('setCreditData', res);
  },
  async sendBorrow({ commit }, payload) {
    payload.address = process.env.BORROWING;
    payload.abi = abi.WQBorrowing;
    try {
      await sendWalletTransaction('borrow', payload);
      return true;
    } catch (err) {
      console.log('sendBorrow error:', err);
      return false;
    }
  },
  async getWalletsData({ commit }) {
    const address = await getWalletAddress();
    const res = await fetchContractData(
      'wallets',
      abi.WQLending,
      process.env.LENDING,
      [address],
      GetWalletProvider(),
    );
    commit('setWalletsData', res);
  },
  async sendClaim({ commit }, payload) {
    payload.value = new BigNumber(payload.value).shiftedBy(18).toString();
    payload.address = process.env.LENDING;
    payload.abi = abi.WQLending;
    try {
      await sendWalletTransaction('claim', payload);
      return true;
    } catch (err) {
      console.log('sendClaim error:', err);
      return false;
    }
  },
  async setTokenPrice({ dispatch, rootGetters }, payload) {
    try {
      await setTokenPrice(payload[0], payload[1]);
      return { ok: true };
    } catch (e) {
      console.log('can not refresh prices');
      return { ok: false };
    }
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
      process.env.LENDING,
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
      process.env.BORROWING,
      [address],
      GetWalletProvider(),
    );
    commit('setCurrentFee', res);
  },
  async sendMethod({ commit }, payload) {
    const payloadSend = {
      address: payload.type === 'borrowing' ? process.env.BORROWING : process.env.LENDING,
      abi: payload.type === 'borrowing' ? abi.WQBorrowing : abi.WQLending,
      data: payload.data,
    };
    switch (payload.method) {
      case 'refund':
        payloadSend.value = payload.value;
        break;
      case 'deposit':
        payloadSend.value = new BigNumber(payload.value).shiftedBy(18).toString();
        break;
      default:
        console.log('another method:', payload.method);
        break;
    }
    try {
      console.log('sendMethod:', payload, payloadSend);
      await sendWalletTransaction(payload.method, payloadSend);
      return success();
    } catch (err) {
      console.log('sendMethod:', payload.method, err);
      return error();
    }
  },
};
