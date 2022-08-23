import ENV from '~/utils/addresses/index';
// eslint-disable-next-line
export default function ({ $axios, store }, inject) {
  const etherscanAPI = $axios.create({ baseURL: process.env.ETHERSCAN_API_KEY });

  etherscanAPI.onError(async (error) => {
    console.error(error);
    throw error?.response?.data;
  });

  inject('etherscanAPI', etherscanAPI);
}
