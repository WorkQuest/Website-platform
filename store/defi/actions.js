export default {
  showToast({ dispatch }, { title, text, variant }) {
    dispatch('main/showToast', {
      title,
      text,
      variant,
    }, { root: true });
  },
  async getTokensDayData({ commit }, query) {
    const response = await this.$axios.$get(`/v1/liquidity/tokenDay?${query || ''}`);
    commit('setTokensDayData', response.result);
    return response;
  },
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
  async swapsTest({ commit }, payload) {
    const response = await this.$axios.$get('/v1/swaps/take');
    console.log(response);
    return response;
  },
};
