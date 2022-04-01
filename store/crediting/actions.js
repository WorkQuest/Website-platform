import BigNumber from 'bignumber.js';
import {
  connectWallet,
  disconnect,
  getBalance, getContractFeeData,
  getIsWalletConnected,
  getStyledAmount, getWalletAddress, getTransferFeeData,
  transfer, transferToken, GetWalletProvider, stake, sendWalletTransaction, setTokenPrice,
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
  async sendRefund({ commit }, payload) {
    payload.address = process.env.BORROWING;
    payload.abi = abi.WQBorrowing;
    try {
      await sendWalletTransaction('refund', payload);
      return true;
    } catch (err) {
      console.log('sendRefund error:', err);
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
  async sendLoan({ commit }, payload) {
    payload.address = process.env.LENDING;
    payload.abi = abi.WQLending;
    try {
      await sendWalletTransaction('deposit', payload);
      return true;
    } catch (err) {
      console.log('sendLoan error:', err);
      return false;
    }
  },
  async sendWithdraw({ commit }, payload) {
    payload.address = process.env.LENDING;
    payload.abi = abi.WQLending;
    try {
      await sendWalletTransaction('withdraw', payload);
      return true;
    } catch (err) {
      console.log('sendWithdraw error:', err);
      return false;
    }
  },
  async setTokenPrice({ dispatch, rootGetters }, { payload, setTokenPriceData }) {
    try {
      await setTokenPrice(payload, setTokenPriceData);
      return { ok: true };
    } catch (e) {
      console.log('can not refresh prices');
      return { ok: false };
    }
  },
};
