export default {
  async getWorkerData({ commit }, userId) {
    try {
      const response = await this.$axios.$get(`/v1/profile/${userId}`);
      commit('setCurrentWorker', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async questListForInvitation({ commit }, userId) {
    try {
      const response = await this.$axios.$get(`/v1/employer/${userId}/quests`);
      commit('setQuestListForInvitation', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async workersList({ commit }, payload) {
    try {
      const response = await this.$axios.$get(`/v1/profile/workers?${payload}`);
      commit('setWorkersList', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async setCurrentWorker({ commit }, worker) {
    commit('setCurrentWorker', worker);
    return worker;
  },
  async setInfoDataMode({ commit }, mode) {
    commit('setInfoDataMode', mode);
  },
  async getCurrentStepCreateQuest({ commit }, data) {
    commit('setCurrentStepCreateQuest', data);
  },
  async getCurrentStepEditQuest({ commit }, data) {
    commit('setCurrentStepEditQuest', data);
  },
  setMapBounds({ commit }, payload) {
    commit('setMapBounds', payload);
  },
  setMapCenter({ commit }, payload) {
    commit('setMapCenter', payload);
  },
  async questCreate({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/quest/create', payload);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getAllQuests({ commit }, payload) {
    try {
      const response = await this.$axios.$get(`/v1/quests?${payload || ''}`);
      commit('setAllQuests', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getQuest({ commit }, payload) {
    try {
      const response = await this.$axios.$get(`/v1/quest/${payload}`);
      commit('setQuest', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getUserQuests({ commit }, { userId, query = undefined }) {
    try {
      const response = await this.$axios.$get(`/v1/employer/${userId}/quests?${query || ''}`);
      commit('setUserQuests', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getQuestsOnMap({ commit }, payload) {
    try {
      const response = await this.$axios.$get(`/v1/quests/map/list-points?${payload}`);
      commit('setAllQuests', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getQuestsLocation({ commit }, payload) {
    try {
      const response = await this.$axios.$get(`/v1/quests/map/points?${payload}`);
      commit('setQuestsLocation', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async editQuest({ commit }, { payload, questId }) {
    try {
      const response = await this.$axios.$put(`/v1/quest/${questId}`, payload);
      commit('setQuestData', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async deleteQuest({ commit }, { questId }) {
    try {
      const response = await this.$axios.$delete(`/v1/quest/${questId}`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async startQuest({ commit }, { questId, payload }) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/start`, payload);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async completeWorkOnQuest({ commit }, questId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/complete-work`, questId);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async rejectWorkOnQuest({ commit }, questId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/reject-work`, questId);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async acceptCompletedWorkOnQuest({ commit }, questId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/accept-completed-work`, questId);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async acceptWorkOnQuest({ commit }, questId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/accept-work`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async rejectCompletedWorkOnQuest({ commit }, questId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/reject-completed-work`, questId);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async closeQuest({ commit }, questId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/close`, questId);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async responsesToQuest({ commit }, questId) {
    try {
      const response = await this.$axios.$get(`/v1/quest/${questId}/responses`);
      commit('setResponses', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async inviteOnQuest({ commit }, { questId, payload }) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/invite`, payload);
      const { chat } = response.result;
      commit('setChatInviteOnQuest', chat);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async respondOnQuest({ commit }, { data, questId }) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/response`, data);

      commit('setRespondOnQuest', data);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async setStarOnQuest({ commit }, id) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${id}/star`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async takeAwayStarOnQuest({ commit }, id) {
    try {
      const response = await this.$axios.$delete(`/v1/quest/${id}/star`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getStarredQuests({ commit }) {
    try {
      const { data } = await this.$axios.$get('/v1/quests/starred');
      commit('setStarredQuests', data.result);
      return data.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getResponsesToQuestForAuthUser({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/quest/responses/my');
      commit('setResponsesMy', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },

  async acceptQuestInvitation({ commit }, responseId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/response/${responseId}/accept`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },

  async rejectQuestInvitation({ commit }, responseId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/employer/${responseId}/reject`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },

  async getFilters({ commit }) {
    try {
      const { result } = await this.$axios.$get('/v1/skill-filters');
      commit('setFilters', result);
    } catch (e) {
      console.log(e);
    }
  },
  setSelectedSpecializationsFilters({ commit }, data) {
    commit('setSelectedSpecializationsFilters', data);
  },
  setSelectedPriceFilter({ commit }, data) {
    commit('setSelectedPriceFilter', data);
  },
};
