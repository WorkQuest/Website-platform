import BigNumber from 'bignumber.js';
import {
  error,
  success,
} from '~/utils/web3';

/**
 * @property $axiosLiquidator
 */
export default {
  async fetchLots({ commit }, { params }) {
    try {
      if (!params.q) delete params.q;
      const { result: { count, auction } } = await this.$axiosLiquidator.$get('/auction/getLots', { params });
      commit('setLost', {
        count,
        lots: auction.map((item) => ({
          ...item,
          _collateral: Number(new BigNumber(item.collateral).shiftedBy(-12)),
          _liquidityValue: Number(new BigNumber(item.liquidityValue).shiftedBy(-18).toFixed(4, 1)),
          _price: Number(new BigNumber(item.price).shiftedBy(-18).toFixed(4, 1)),
        })),
      });
      return success();
    } catch (e) {
      console.error('auction/fetchLots', e);
      return error();
    }
  },
};
