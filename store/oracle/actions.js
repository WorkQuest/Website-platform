export default {
  async getCurrentPrice({ commit }) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const { data } = await apiOracle.get('/v1/oracle/sign-price/tokens');
      commit('setCurrentPrice', data.result);
      return data.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getSecurityRatio({ commit }) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const { data } = await apiOracle.get('/v1/oracle/security-ratio/percent');
      commit('setSecurityRatio', data.result);
      return data.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async setDesiredSecurityRatio({ commit }, payload) {
    try {
      const apiOracle = this.$axios.create({ baseURL: process.env.WQ_ORACLE_URL });
      const response = await apiOracle.post('/v1/oracle/risk-ratio/status', payload);
      console.log('setDesiredSecurityRatio:', response);
      commit('setDesiredSecurityRatio', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
};
