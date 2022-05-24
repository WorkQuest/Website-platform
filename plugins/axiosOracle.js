// eslint-disable-next-line
export default function ({ $axios, store }, inject) {
  const axiosOracle = $axios.create({ baseURL: process.env.WQ_ORACLE_URL });

  // axiosFile.onRequest(() => {});

  axiosOracle.onError(async (error) => {
    console.error(error);
    throw error;
  });
  inject('axiosOracle', axiosOracle);
}
