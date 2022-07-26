import ENV from '~/utils/addresses/index';
// eslint-disable-next-line
export default function ({ $axios, store }, inject) {
  const axios = $axios.create({ baseURL: ENV.WQ_LIQUIDATOR_URL });

  axios.onError(async (error) => {
    console.error(error);
    throw error;
  });
  inject('axiosLiquidator', axios);
}
