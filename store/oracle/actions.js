import { error } from '~/utils/web3';

export default {
  async getCurrentPrices({ commit }) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const { data } = await apiOracle.get('/oracle/sign-price/tokens');
      commit('setCurrentPrices', data.result);
      return data.result;
    } catch (e) {
      return error();
    }
  },
  async getSecurityRatio({ commit }) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const { data } = await apiOracle.get('/oracle/security-ratio/percent');
      commit('setSecurityRatio', data.result);
      return data.result;
    } catch (e) {
      return error();
    }
  },
  async setDesiredSecurityRatio({ commit }, payload) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const response = await apiOracle.post('/oracle/risk-ratio/status', payload);
      commit('setDesiredSecurityRatio', response.result);
      return response.result;
    } catch (e) {
      return error();
    }
  },
};
