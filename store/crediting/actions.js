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
    const value = new BigNumber(payload.value).shiftedBy(18).toString();
    try {
      await sendWalletTransaction('refund', {
        address: process.env.BORROWING,
        abi: abi.WQBorrowing,
        value,
        data: [payload.data[0], value],
      });
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
    payload.value = new BigNumber(payload.value).shiftedBy(18).toString();
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
    const value = new BigNumber(payload.value).shiftedBy(18).toString();
    payload.address = process.env.LENDING;
    payload.abi = abi.WQLending;
    try {
      await sendWalletTransaction('withdraw', {
        address: process.env.LENDING,
        abi: abi.WQLending,
        value,
        data: [value],
      });
      return true;
    } catch (err) {
      console.log('sendWithdraw error:', err);
      return false;
    }
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
  async sendMethod({ commit }, payload) {
    const value = new BigNumber(payload.value).shiftedBy(18).toString();
    try {
      await sendWalletTransaction(payload.method, {
        address: payload.type === 'borrowing' ? process.env.BORROWING : process.env.LENDING,
        abi: payload.type === 'borrowing' ? abi.WQBorrowing : abi.WQLending,
        value,
        data: payload.data,
      });
      return success();
    } catch (err) {
      console.log('sendClaim error:', err);
      return error();
    }
  },
};
