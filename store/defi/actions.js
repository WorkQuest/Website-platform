export default {
  async getTokensData({ commit }, query) {
    const response = await this.$axios.$get(`/v1/liquidity/tokenDay?${query || ''}`);
    commit('setTokensData', response.result);
    return response;
  },
  async getSwapsData({ commit }, query) {
    const response = await this.$axios.$get(`/v1/liquidity/swaps?${query || ''}`);
    commit('setSwapsData', response.result);
    return response;
  },
};
