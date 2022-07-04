import BigNumber from 'bignumber.js';
import * as abi from '~/abi/abi';
import { getWalletAddress, GetWalletProvider, sendWalletTransaction } from '~/utils/wallet';
import { error, fetchContractData, success } from '~/utils/web3';

export default {
  async sendMethod({ commit }, payload) {
    const payloadSend = {
      address: process.env.SAVING_PRODUCT,
      abi: abi.WQSavingProduct,
      data: payload.data,
    };
    if (payload.value) {
      payloadSend.value = new BigNumber(payload.value).shiftedBy(18).toString();
    }
    try {
      await sendWalletTransaction(payload.method, payloadSend);
      return success();
    } catch (err) {
      console.log('sendMethod:', payload.method, err);
      return error();
    }
  },
  async getWalletsData({ commit }) {
    const address = await getWalletAddress();
    const res = await fetchContractData(
      'wallets',
      abi.WQSavingProduct,
      process.env.WORKNET_SAVING_PRODUCT,
      [address],
      GetWalletProvider(),
    );
    commit('setWalletsData', res);
  },
  async getRewards({ commit }) {
    const address = await getWalletAddress();
    const res = await fetchContractData(
      'getRewards',
      abi.WQSavingProduct,
      process.env.WORKNET_SAVING_PRODUCT,
      [address],
      GetWalletProvider(),
    );
    commit('setRewardsData', res);
  },
  async getAPY({ commit }) {
    const res = await fetchContractData(
      'apys',
      abi.WQSavingProduct,
      process.env.WORKNET_SAVING_PRODUCT,
      [7],
      GetWalletProvider(),
    );
    commit('setAPY', res);
  },
};
