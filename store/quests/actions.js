export default {
  async setInfoDataMode({ commit }, mode) {
    commit('setInfoDataMode', mode);
  },
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
    const response = await this.$axios.$get(`/v1/quests?${payload || ''}`);
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
  async startQuest({ commit }, { questId, data }) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/start`, data);
    return response.result;
  },
  setMapBounds({ commit }, payload) {
    commit('setMapBounds', payload);
  },
  setMapCenter({ commit }, payload) {
    commit('setMapCenter', payload);
  },
  async completeWorkOnQuest({ commit }, questId) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/complete-work`, questId);
    return response.result; // Сдать квест на проверку Работодателю
  },
  async rejectWorkOnQuest({ commit }, questId) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/reject-work`, questId);
    return response.result;
  },
  async acceptCompletedWorkOnQuest({ commit }, questId) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/accept-completed-work`, questId);
    return response.result;
  },
  async acceptWorkOnQuest({ commit }, questId) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/accept-work`);
    return response.result;
  },
  async rejectCompletedWorkOnQuest({ commit }, questId) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/reject-completed-work`, questId);
    return response.result;
  },
  async closeQuest({ commit }, questId) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/close`, questId);
    return response.result; // Закрыть квест status = 0, 5
  },

  // Testing
  // employer

  async inviteOnQuest({ commit }, payload, id) {
    return await this.$axios.$post(`/v1/quest/${id}/invite`, payload);
  }, // Нужен список Воркеров

  async respondOnQuest({ commit }, { data, questId }) {
    const response = await this.$axios.$post(`/v1/quest/${questId}/response`, data);
    return response.result;
  },
  async responsesToQuest({ commit }, questId) {
    const response = await this.$axios.$get(`/v1/quest/${questId}/responses`);
    commit('setResponses', response.result);
    return response.result;
  },

  // worker
  async setStarOnQuest({ commit }, id) {
    return await this.$axios.$post(`/v1/quest/${id}/star`);
  },
  async takeAwayStarOnQuest(id) {
    return await this.$axios.$delete(`/v1/quest/${id}/star`, id);
  },
  async getStarredQuests({ commit }) {
    const { data } = await this.$axios.$get('/v1/quests/starred');
    commit('setStarredQuests', data.result);
    return data.result;
  }, // unused
  async getResponsesToQuestForAuthUser({ commit }) {
    const response = await this.$axios.$get('/v1/quest/responses/my');
    commit('setResponsesMy', response.result);
    return response.result;
  },

  async acceptQuestInvitation({ commit }, responseId) {
    const response = await this.$axios.$post(`/v1/quest/response/${responseId}/accept`);
    return response.result;
  }, // согласие на приглашение на квест

  async rejectQuestInvitation({ commit }, responseId) {
    const response = await this.$axios.$post(`/v1/quest/employer/${responseId}/reject`);
    return response.result;
  }, // отказ на приглашение на квест
};
