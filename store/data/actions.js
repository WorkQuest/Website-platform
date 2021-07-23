export default {
  async getReviewsFromApi({ commit }, payload) {
    commit('setReviews', payload);
  },
  async questCreate({ commit }, payload) {
    const response = await this.$axios.$post('/v1/quest/create', payload);
    return response;
  },
  async disable2FA({ commit }, payload) {
    const response = await this.$axios.$post('/v1/totp/disable', payload);
    return response;
  },
  async enable2FA({ commit }, payload) {
    const response = await this.$axios.$post('/v1/totp/enable', payload);
    return response;
  },
  async confirmEnable2FA({ commit }, payload) {
    const response = await this.$axios.$post('/v1/totp/confirm', payload);
    return response;
  },
  async sendPhone({ commit }, payload) {
    const response = await this.$axios.$post('/v1/profile/phone/send-code', payload);
    return response;
  },
  async confirmPhone({ commit }, payload) {
    const response = await this.$axios.$post('/v1/profile/phone/confirm', payload);
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

// otpauth://totp/WorkQuest:${email}?secret=${secret}&issuer=WorkQuest.co
