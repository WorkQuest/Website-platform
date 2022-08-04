import BigNumber from 'bignumber.js';
import {
  error,
  success,
} from '~/utils/web3';

/**
 * @property $axiosLiquidator
 */
export default {
  /**
   *
   * @param commit
   * @param getters
   * @param params
   * @property liquidityValue - amount for liquidation
   * @property priceValue - lot price
   * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchLots({ commit, rootGetters }, { params }) {
    try {
      if (!params.q) delete params.q;
      const { result: { count, auction } } = await this.$axiosLiquidator.$get('/auction/getLots', { params });

      const balanceData = rootGetters['wallet/getBalanceData'];
      // TODO added logic for status 2, look at lotBuyed property, if length more then 1, add new item for this lot in array
      commit('setLost', {
        count,
        lots: auction.map((item) => {
          let symbolDecimals = balanceData[item.symbol].decimals;
          if (symbolDecimals === 6) symbolDecimals += symbolDecimals;
          return {
            ...item,
            _collateral: Number(new BigNumber(item.collateral).shiftedBy(-symbolDecimals)),
            _liquidityValue: Number(new BigNumber(item.liquidityValue).shiftedBy(-18).toFixed(4, 1)),
            _price: Number(new BigNumber(item.priceValue).shiftedBy(-18).toFixed(4, 1)),
          };
        }),
      });
      return success();
    } catch (e) {
      console.error('auction/fetchLots', e);
      return error();
    }
  },
};
