import ENV from '~/utils/adresses/index';
// eslint-disable-next-line
export default function ({ $axios, store }, inject) {
  const axiosOracle = $axios.create({ baseURL: ENV.WQ_ORACLE_URL });

  axiosOracle.onError(async (error) => {
    console.error(error);
    throw error;
  });
  inject('axiosOracle', axiosOracle);
}
