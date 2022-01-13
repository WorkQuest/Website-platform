export default {
  async createDisput({ commit }, questId) {
    try {
      return await this.$axios.$post(`/v1/dispute/${questId}/create`);
    } catch (e) {
      return console.log(e);
    }
  },
  async getDisput({ commit }, disputId) {
    try {
      const { result } = await this.$axios.$get(`/v1/${disputId}/getDispute`);
      commit('setDisput', result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getUserDisputs({ commit }, userId) {
    try {
      const { result } = await this.$axios.$get(`v1/disputes/${userId}`);
      commit('setUserDisputs', result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
};
