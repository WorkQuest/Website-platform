import { buyWUSD, setTokenPrice } from '~/utils/wallet';

export default {
  async setTokenPrice({ dispatch, rootGetters }, { payload, setTokenPriceData }) {
    await setTokenPrice(payload, setTokenPriceData);
    return { ok: true };
  },
  async buyWUSD(ctx, { payload, buyWUSDData }) {
    await buyWUSD(payload, buyWUSDData);
    return { ok: true };
  },
};
