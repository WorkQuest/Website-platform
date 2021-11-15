export default {
  // TODO: Интегрировать методы
  async getDiscussions({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/discussions');
      commit('setDiscussions', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async createDiscussion({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/discussion/create', payload);
      // TODO: Дописать payload {
      //   "title": "New post",
      //   "description": "Hello World!",
      //   "medias": [
      //     "fa0e2e4e-c53f-4af7-8906-1649daa0cce3"
      //   ]
      // }
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
};
