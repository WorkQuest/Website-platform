import ENV from '~/utils/addresses/index';
// eslint-disable-next-line
export default function ({ $axios, store }, inject) {
  const axiosOracle = $axios.create({ baseURL: ENV.WQ_ORACLE_URL });

  axiosOracle.onError(async (error) => {
    console.error(error);
    throw error?.response?.data;
  });
  inject('axiosOracle', axiosOracle);
}
