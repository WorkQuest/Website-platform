export default {
  async getReviewsFromApi({ commit }, payload) {
    commit('setReviews', payload);
  },
};
