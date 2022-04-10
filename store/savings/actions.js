import BigNumber from 'bignumber.js';
import * as abi from '~/abi/abi';
import { sendWalletTransaction } from '~/utils/wallet';
import { error, success } from '~/utils/web3';

export default {
  async sendDeposit({ commit }, payload) {
    payload.address = process.env.SAVING_PRODUCT;
    payload.abi = abi.WQSavingProduct;
    try {
      await sendWalletTransaction('deposit', payload);
      return true;
    } catch (err) {
      console.log('sendDeposit error:', err);
      return false;
    }
  },
  async sendMethod({ commit }, payload) {
    try {
      await sendWalletTransaction(payload.method, {
        address: process.env.SAVING_PRODUCT,
        abi: abi.WQSavingProduct,
        data: payload.data,
        value: new BigNumber(payload.value).shiftedBy(18).toString(),
      });
      return success();
    } catch (err) {
      console.log('sendMethod:', payload.method, err);
      return error();
    }
  },
};
