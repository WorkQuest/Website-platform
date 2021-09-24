export default {
  showToast({ dispatch }, { title, text, variant }) {
    dispatch('main/showToast', {
      title,
      text,
      variant,
    }, { root: true });
  },

  async wqtWbnbBurns({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/burns');
    commit('setWqtWbnbBurns', response.result);
    return response;
  },
  async wqtWbnbMints({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/mints');
    commit('setWqtWbnbMints', response.result);
    return response;
  },
  async wqtWbnbSwaps({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/swaps');
    commit('setWqtWbnbSwaps', response.result);
    return response;
  },
  async wqtWbnbTokenDay({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-wbnb/tokenDay?${query || ''}`);
    commit('setWqtWbnbTokenDay', response.result);
    return response;
  },

  async wqtWbnbTokenDayLast({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-wbnb/tokenDay?${query}`);
    commit('setWqtWbnbTokenDayLast', response.result);
    console.log(response);
    return response;
  },

  async wqtWethBurns({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/burns');
    commit('setWqtWethBurns', response.result);
    return response;
  },
  async wqtWethMints({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/mints');
    commit('setWqtWethMints', response.result);
    return response;
  },
  async wqtWethSwaps({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/swaps');
    commit('setWqtWethSwaps', response.result);
    return response;
  },
  async wqtWethTokenDay({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-weth/tokenDay?${query || ''}`);
    commit('setWqtWethTokenDay', response.result);
    return response;
  },
  async wqtWethTokenDayLast({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-weth/tokenDay?${query}`);
    commit('setWqtWethTokenDayLast', response.result);
    console.log(response);
    return response;
  },

  async swapsTest({ commit }, payload) {
    const response = await this.$axios.$get('/v1/swaps/take');
    return response;
  },
};
