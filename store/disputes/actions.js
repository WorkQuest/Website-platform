import disputes from '~/pages/disputes';

export default {
  async createDispute({ commit }, { reason, problemDescription, questId }) {
    try {
      return await this.$axios.$post(`/v1/quest/${questId}/open-dispute`, { reason, problemDescription });
    } catch (e) {
      return console.log(e);
    }
  },
  async getDispute({ commit }, disputeId) {
    try {
      const { result } = await this.$axios.$get(`/v1/quest/dispute/${disputeId}`);
      await commit('setDispute', result);
      return result.ok;
    } catch (e) {
      return console.log(e);
    }
  },
  async getUserDisputes({ commit }) {
    try {
      const { result } = await this.$axios.$get('v1/user/me/quest/disputes');
      commit('setUserDisputes', result);
      return result.ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
