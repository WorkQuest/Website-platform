import BigNumber from 'bignumber.js';
import {
  getGasPrice,
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
        collaterals: collateral.map((item) => ({
          ...item,
          _price: Number(new BigNumber(item.price).shiftedBy(-18).toFixed(4, 1)),
          lockedAmount: Number(new BigNumber(item.collateral).shiftedBy(-6).toFixed(4, 1)),
          colRatio: new BigNumber(item.deposit).shiftedBy(-18).multipliedBy(100).toString(),
          wusdGenerated: Number(new BigNumber(item.debt).shiftedBy(-18).toFixed(4, 1)),
        })),
        count,
      });
      return success();
    } catch (e) {
      console.error('collateral/fetchCollaterals', e);
      return error();
    }
  },

  /**
   * @property removed - revert WUSD or add collateral token
   * @property moved - generate additional WUSD
   * @property produced - produced collateral
   * @param commit
   * @param getters
   * @param address
   * @param collateralId
   * @param params
   * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchCollateralInfo({ commit, getters }, { address, collateralId, params }) {
    try {
      const {
        ok, result: {
          id, collateral, debt, deposit, price, produced, removed, moved,
        },
      } = await this.$axiosLiquidator.$get(`/user/collateral/${address}/${collateralId}`, { params });
      // TODO когда появится timestamp сортировать от нового к старому
      const rows = [...produced, ...removed, ...moved];
      commit('setHistoryCollateral', {
        rows: rows.map((row, i) => {
          // TODO need add type of action
          // TODO by status of deposit need add border color

          const _price = Number(new BigNumber(row.price).shiftedBy(-18).toFixed(4, 1));
          // TODO decimal need use by symbol
          const lockedAmount = Number(new BigNumber(row.collateral).shiftedBy(-6).toFixed(4, 1));
          const wusdGenerated = Number(new BigNumber(row.debt).shiftedBy(-18).toFixed(4, 1));
          return {
            ...row,
            _price,
            lockedAmount,
            wusdGenerated,
          };
        }),
        count: rows.length,
      });

      const collaterals = JSON.parse(JSON.stringify(getters.getCollaterals));
      collaterals.some((col) => {
        if (col.id === id) {
          col.price = price;
          col._price = Number(new BigNumber(price).shiftedBy(-18).toFixed(4, 1));

          col.collateral = collateral;
          col.lockedAmount = Number(new BigNumber(collateral).shiftedBy(-6).toFixed(4, 1));

          col.deposit = deposit;
          col.colRatio = new BigNumber(deposit).shiftedBy(-18).multipliedBy(100).toString();

          col.debt = debt;
          col.wusdGenerated = Number(new BigNumber(debt).shiftedBy(-18).toFixed(4, 1));
          return true;
        }
        return false;
      });
      commit('updateCollaterals', collaterals);

      return success();
    } catch (e) {
      console.error('collateral/fetchCollateralInfo', e);
      return error();
    }
  },

  async collateralAction({ dispatch }, { index, symbol, method }) {
    try {
      await dispatch('oracle/setCurrentPriceTokens', null, { root: true });
      const inst = await createInstance(WQRouter, ENV.WORKNET_ROUTER);

      const { gasPrice, gas } = await getGasPrice(
        WQRouter,
        ENV.WORKNET_ROUTER,
        method,
        [index, symbol],
      );

      if (!gasPrice || !gas) {
        // TODO нужно будет как то выделить время и выяснить причину
        console.log(`Something wrong with calc fee for ${method}`);
        return error();
      }

      await inst.methods[method](index, symbol).send({
        from: getWalletAddress(),
        gasPrice,
        gas,
      });

      return success();
    } catch (e) {
      console.error(`collateral/${method}`, e);
      return error();
    }
  },

};
