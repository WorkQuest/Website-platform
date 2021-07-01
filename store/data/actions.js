export default {
  async getReviewsFromApi({ commit }, payload) {
    commit('setReviews', payload);
  },
  async questCreate({ commit }, payload) {
    const response = await this.$axios.$post('/v1/quest/create', payload);
    return response;
  },
  async getAllQuests({ commit }) {
    const { data } = await this.$axios.get('/v1/quests');
    commit('setAllQuests', data.result);
    return data.result;
  },
  async getUserQuests({ commit }, payload) {
    const { data } = await this.$axios.get(`/v1/employer/${payload}/quests`);
    commit('setUserQuests', data.result);
    return data.result;
  },
};
