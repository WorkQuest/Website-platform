import {
  error,
  success,
} from '~/utils/web3';

/**
 * @property $axiosLiquidator
 */
export default {
  async fetchLots({ commit }, { address, params }) {
    try {
      if (params.q === '') delete params.q;
      const { ok, result } = await this.$axiosLiquidator.$get(`/user/collateral/${address}`, { params });
      commit('setLost', result);
      return success();
    } catch (e) {
      console.error('auction/fetchLots', e);
      return error();
    }
  },
};
