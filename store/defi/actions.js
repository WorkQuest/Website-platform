export default {
  async getTokensData({ commit }) {
    const response = await this.$axios.$get('/v1/liquidity/tokenDay');
    commit('setTokensData', response.result);
    return response;
  },
};
