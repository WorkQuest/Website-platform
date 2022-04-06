import * as abi from '~/abi/abi';
import { sendWalletTransaction } from '~/utils/wallet';

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
};
