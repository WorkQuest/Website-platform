import BigNumber from 'bignumber.js';
import {
  createInstance,
  getWalletAddress,
} from '~/utils/wallet';

import { success, error } from '~/utils/web3';
import { WQRouter } from '~/abi';
import ENV from '~/utils/addresses';

export default {
  async sendProduceWUSD(_, {
    collateral, ratio, currency, fee: { gas, gasPrice },
  }) {
    try {
      /**
       * @property produceWUSD - method of router
       */
      const inst = await createInstance(WQRouter, ENV.WORKNET_ROUTER);
      await inst.methods.produceWUSD(collateral, ratio, currency).send({
        from: getWalletAddress(),
        gasPrice,
        gas,
      });

      return success();
    } catch (e) {
      console.error('collateral/sendProduceWUSD', e);
      return error();
    }
  },

  /**
   * Get collaterals by user address
   * @param commit
   * @param address
   * @param params
   * @property $axiosLiquidator - axios instance for liquidator
   * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */

  async fetchCollaterals({ commit }, { address, params }) {
    try {
      const { ok, result: { collateral, count } } = await this.$axiosLiquidator.$get(`/user/collateral/${address}`, { params });
      // TODO get decimals by symbol
      commit('setCollaterals', {
        collateral: collateral.map((item) => ({
          ...item,
          lockedAmount: Number(new BigNumber(item.collateral).shiftedBy(-6).toFixed(3, 1)),
          collateralizationRatio: new BigNumber(item.deposit).shiftedBy(-18).multipliedBy(100).toString(),
          wusdGenerated: Number(new BigNumber(item.debt).shiftedBy(-18).toFixed(3, 1)),
        })),
        count,
      });
      return success();
    } catch (e) {
      console.error('collateral/fetchCollaterals', e);
      return error();
    }
  },
};
