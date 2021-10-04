export default {
  async getCurrentStepCreateQuest({ commit }, data) {
    commit('setCurrentStepCreateQuest', data);
  },
  async getCurrentStepEditQuest({ commit }, data) {
    commit('setCurrentStepEditQuest', data);
  },
  async questCreate({ commit }, payload) {
    return await this.$axios.$post('/v1/quest/create', payload);
  },
  async getAllQuests({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/quests?${payload}`);
    commit('setAllQuests', response.result);
    return response.result;
  },
  async getQuest({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/quest/${payload}`);
    commit('setQuest', response.result);
    return response.result;
  },
  async getUserQuests({ commit }, { userId, query = undefined }) {
    const response = await this.$axios.$get(`/v1/employer/${userId}/quests?${query || ''}`);
    commit('setUserQuests', response.result);
    return response.result;
  },

  async getQuestsOnMap({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/quests/map/list-points?${payload}`);
    commit('setAllQuests', response.result);
    return response.result;
  },

  async getQuestsLocation({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/quests/map/points?${payload}`);
    commit('setQuestsLocation', response.result);
    return response.result;
  },

  async editQuest({ commit }, { payload, questId }) {
    const response = await this.$axios.$put(`/v1/quest/${questId}`, payload);
    commit('setQuestData', response.result);
    return response.result;
  },

  async deleteQuest({ commit }, { questId }) {
    const response = await this.$axios.$delete(`/v1/quest/${questId}`);
    return response.result;
  },

  async acceptCompletedWorkOnQuest(id) {
    return await this.$axios.$post(`/v1/quest/${id}/accept-completed-work`, id);
  },

  async acceptWorkOnQuest(id) {
    return await this.$axios.$post(`/v1/quest/${id}/accept-work`, id);
  },

  async closeQuest(id) {
    return await this.$axios.$post(`/v1/quest/${id}/close`, id);
  },

  async completeWorkOnQuest(id) {
    return await this.$axios.$post(`/v1/quest/${id}/complete-work`, id);
  },

  async rejectCompletedWorkOnQuest(id) {
    return await this.$axios.$post(`/v1/quest/${id}/reject-completed-work`, id);
  },

  async rejectWorkOnQuest(id) {
    return await this.$axios.$post(`/v1/quest/${id}/reject-work`, id);
  },

  async setStarOnQuest({ commit }, id) {
    // Needed to add quest id;
    return await this.$axios.$post(`/v1/quest/${id}/star`);
  },

  async takeAwayStarOnQuest(id) {
    return await this.$axios.$delete(`/v1/quest/${id}/star`, id);
  },

  async startQuest(id) {
    return await this.$axios.$post(`/v1/quest/${id}/start`, id);
  },

  async getStarredQuests({ commit }) {
    const { data } = await this.$axios.$get('/v1/quests/starred');
    commit('setStarredQuests', data.result);
    return data.result;
  },

  async inviteOnQuest({ commit }, payload, id) {
    return await this.$axios.$post(`/v1/quest/${id}/invite`, payload);
  },

  async respondOnQuest({ commit }, { data, questId }) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/response`, data);
    return response.result;
  },

  async getResponsesToQuest({ commit }, id) {
    const { data } = await this.$axios.$get(`/v1/quest/${id}/responses`);
    commit('setResponses', data.result);
    return data.result;
  },

  async acceptQuestInvitation(id) {
    return await this.$axios.$post(`/v1/quest/response/${id}/accept`, id);
  },

  async rejectQuestInvitation(id) {
    return await this.$axios.$post(`/v1/quest/response/${id}/reject`, id);
  },

  async getResponsesToQuestForAuthorizedUser({ commit }) {
    const { data } = await this.$axios.$get('/v1/quest/responses/my');
    commit('setResponsesMy', data.result);
    return data.result;
  },

  setMapBounds({ commit }, payload) {
    commit('setMapBounds', payload);
  },
  setMapCenter({ commit }, payload) {
    commit('setMapCenter', payload);
  },
};
