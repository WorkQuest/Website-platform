import BigNumber from 'bignumber.js';
import {
  getGasPrice,
  createInstance,
  getWalletAddress,
} from '~/utils/wallet';

import { success, error } from '~/utils/web3';
import { WQRouter } from '~/abi';
import ENV from '~/utils/addresses';
import { Path } from '~/utils/enums';

const CollateralEvents = {
  PRICE_UPDATED: 'DeterminationPriceUpdated',
};

export default {
  async fetchCollateralsCommonInfo({ commit }) {
    try {
      const { result: { pullAmount, ratio, symbols } } = await this.$axiosLiquidator.$get('collateral/information');
      commit('setTotalSupply', pullAmount);
      commit('setMaxRatio', Math.max(...ratio));
      commit('setAvailableAssets', symbols);
      return success();
    } catch (e) {
      console.error('collateral/fetchCollateralsCommonInfo', e);
      return error();
    }
  },

  async sendProduceWUSD(_, {
    collateral, ratio, currency, fee: { gas, gasPrice },
  }) {
    try {
      /**
       * @property produceWUSD - method of router
       */
      const inst = createInstance(WQRouter, ENV.WORKNET_ROUTER);
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
   * @param rootGetters
   * @property $axiosLiquidator - axios instance for liquidator
   * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchCollaterals({ commit, rootGetters }, { address, params }) {
    try {
      const { result: { collateral, count } } = await this.$axiosLiquidator.$get(`/user/collateral/${address}`, { params });
      const balanceData = rootGetters['wallet/getBalanceData'];
      commit('setCollaterals', {
        collaterals: collateral.map((item) => {
          const symbolDecimals = balanceData[item.symbol].decimals;
          return {
            ...item,
            _price: Number(new BigNumber(item.price).shiftedBy(-18).toFixed(4, 1)),
            lockedAmount: Number(new BigNumber(item.collateral).shiftedBy(-symbolDecimals).toFixed(4, 1)),
            colRatio: Number(new BigNumber(item.deposit).shiftedBy(-18).multipliedBy(100).toFixed(4, 1)),
            wusdGenerated: Number(new BigNumber(item.debt).shiftedBy(-18).toFixed(4, 1)),
          };
        }),
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
   * @param rootGetters
   * @param address
   * @param collateralId
   * @param params
   * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchCollateralInfo({ commit, getters, rootGetters }, { address, collateralId, params }) {
    try {
      const {
        result: {
          id, collateral, debt, deposit, price, produced, removed, moved,
        },
      } = await this.$axiosLiquidator.$get(`/user/collateral/${address}/${collateralId}`, { params });

      if (produced.length) produced[0].status = 4;
      if (removed.length) removed.forEach((item) => { item.status = -1; });
      const rows = [...removed, ...moved, ...produced];
      rows.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

      const balanceData = rootGetters['wallet/getBalanceData'];
      commit('setHistoryCollateral', {
        rows: rows.map((row) => {
          // TODO by status of deposit need add border color
          const _price = Number(new BigNumber(row.price).shiftedBy(-18).toFixed(4, 1));
          const symbolDecimals = balanceData[row.symbol].decimals;
          const lockedAmount = Number(new BigNumber(row.collateral).shiftedBy(-symbolDecimals).toFixed(4, 1));
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

          const symbolDecimals = balanceData[col.symbol].decimals;
          col.collateral = collateral;
          col.lockedAmount = Number(new BigNumber(collateral).shiftedBy(-symbolDecimals).toFixed(4, 1));

          col.deposit = deposit;
          col.colRatio = Number(new BigNumber(deposit).shiftedBy(-18).multipliedBy(100).toFixed(4, 1));

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

  async collateralAction({ dispatch }, { payload, method }) {
    try {
      const { gasPrice, gas } = await getGasPrice(
        WQRouter,
        ENV.WORKNET_ROUTER,
        method,
        [...payload],
      );

      if (!gasPrice || !gas) {
        console.log(`Something wrong with calc fee for ${method}`);
        return error();
      }

      const inst = createInstance(WQRouter, ENV.WORKNET_ROUTER);
      const res = await inst.methods[method](...payload).send({
        from: getWalletAddress(),
        gasPrice,
        gas,
      });

      return success(res);
    } catch (e) {
      console.error(`collateral/${method}`, e);
      return error(-1, e.message, e);
    }
  },

  async subscribeCollateralCommonInfo({ commit }) {
    try {
      await this.$wsNotifs.subscribe(`${Path.NOTIFICATIONS}/oracle-prices`, async ({ action, data }) => {
        if (action === CollateralEvents.PRICE_UPDATED) {
          console.log('UPDATED COLLATERAL INFO');
          const { pullAmount, ratio, symbols } = data;
          commit('setTotalSupply', pullAmount);
          commit('setMaxRatio', Math.max(...ratio));
          commit('setAvailableAssets', symbols);
        }
      });
    } catch (err) {
      console.error('collateral/subscribeCollateralCommonInfo', err);
    }
  },

  async unsubscribeCollateralCommonInfo(_) {
    try {
      console.log(`unsubscribe from ${Path.NOTIFICATIONS}/oracle-prices`);
      await this.$wsNotifs.unsubscribe(`${Path.NOTIFICATIONS}/oracle-prices`);
    } catch (err) {
      console.error('collateral/unsubscribeCollateralCommonInfo', err);
    }
  },
};
