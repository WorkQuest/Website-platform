import { buyWUSD, setTokenPrice } from '~/utils/wallet';

export default {
  async setTokenPrice({ dispatch, rootGetters }, { payload, setTokenPriceData }) {
    try {
      await setTokenPrice(payload, setTokenPriceData);
      return { ok: true };
    } catch (e) {
      console.log('can not refresh prices');
      return { ok: false };
    }
  },
  async buyWUSD(ctx, { payload, buyWUSDData }) {
    try {
      await buyWUSD(payload, buyWUSDData);
      return { ok: true };
    } catch (e) {
      console.log('can not buy WUSD');
      return { ok: false };
    }
  },
};
