import BigNumber from 'bignumber.js';

import {
  getPensionDefaultData,
  getPensionWallet, getWalletAddress,
  pensionContribute, pensionExtendLockTime,
  pensionsWithdraw,
  pensionUpdateFee,
} from '~/utils/wallet';
import { PensionHistoryMethods } from '~/utils/enums';

export default {
  async getPensionTransactions({ commit, getters }, { method, limit, offset }) {
    try {
      const path = method === PensionHistoryMethods.Update ? 'wallet-update' : method.toLowerCase();
      const res = await this.$axios.get(`/v1/pension-fund/${path}`, {
        params: {
          userAddress: getWalletAddress(),
          limit,
          offset,
        },
      });
      commit('setPensionHistoryData', { method, txs: res.data.result.events, count: res.data.result.count });
    } catch (e) {
      console.error('retirement/getPensionTransactions');
    }
  },
  async pensionGetDefaultData() {
    return await getPensionDefaultData();
  },
  async pensionGetWalletInfo({ commit }) {
    const res = await getPensionWallet();
    if (res.ok === false) {
      commit('setPensionWallet', null);
      return;
    }
    commit('setPensionWallet', res.result);
  },
  async pensionUpdateFee({ commit }, fee) {
    return await pensionUpdateFee(fee);
  },
  async pensionContribute({ commit }, amount) {
    return await pensionContribute(amount);
  },
  async pensionWithdraw({ commit }, amount) {
    return await pensionsWithdraw(amount);
  },
  async pensionStartProgram({ commit }, payload) {
    const { firstDeposit, fee, defaultFee } = payload;
    let feeOk = true;
    let depositOk = false;
    const equalsFee = new BigNumber(defaultFee).shiftedBy(-18).isEqualTo(new BigNumber(fee).shiftedBy(-18));
    if (!firstDeposit || !equalsFee) {
      feeOk = await pensionUpdateFee(fee);
    }
    if (firstDeposit) depositOk = await pensionContribute(firstDeposit);
    else return feeOk;
    return depositOk && feeOk;
  },
  async pensionExtendLockTime() {
    return await pensionExtendLockTime();
  },
  async subscribeWS({ commit, getters }, userAddress) {
    try {
      await this.$wsNotifs.subscribe(`/notifications/pensionFund/${userAddress}`, async (msg) => {
        console.log(msg.data);
      });
    } catch (err) {
      console.error('subscribeWS err', err);
    }
  },
  async unsubscribeWS(_, userAddress) {
    try {
      await this.$wsNotifs.unsubscribe(`/notifications/pensionFund/${userAddress}`);
    } catch (err) {
      console.error('unsubscribeWS err', err);
    }
  },
};
