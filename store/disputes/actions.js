export default {
  async createDispute({ commit }, payload) {
    try {
      const { reason, problemDescription, questId } = payload;
      return await this.$axios.$post(`/v1/quest/${questId}/open-dispute`, { reason, problemDescription });
    } catch (e) {
      return console.log(e);
    }
  },
  async getDispute({ commit }, disputeId) {
    try {
      const { result } = await this.$axios.$get(`/v1/${disputeId}/getDispute`);
      commit('setDispute', result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getUserDisputes({ commit }) {
    try {
      const { result } = await this.$axios.$get('v1/user/me/quest/disputes');
      commit('setUserDisputes', result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
};
