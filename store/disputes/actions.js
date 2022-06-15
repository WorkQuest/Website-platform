import { success } from '~/utils/web3';

export default {
  async createDispute({ commit }, { reason, problemDescription, questId }) {
    try {
      const { result } = await this.$axios.$post(`/v1/quest/${questId}/dispute`, { reason, problemDescription });
      return success(result);
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
  async getUserDisputes({ commit }, params) {
    try {
      const { result } = await this.$axios.$get('v1/user/me/quest/disputes', { params });
      commit('setUserDisputes', result);
      return result.ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
