export default {
  async questListForInvitation({ commit }, userId) {
    try {
      const response = await this.$axios.$get(`/v1/employer/${userId}/quests`);
      commit('setQuestListForInvitation', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async workersList({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/profile/workers');
      commit('setWorkersList', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async setCurrentWorker({ commit }, data) {
    commit('setCurrentWorker', data);
    return data;
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
  async startQuest({ commit }, { questId, data }) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/start`, data);
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
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },

  // Testing
  // employer

  async respondOnQuest({ commit }, { data, questId }) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/response`, data);
      return response.result;
      // TODO: Изменить запрос для бэка
    } catch (e) {
      return console.log(e);
    }
  },

  // worker
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
  }, // согласие на приглашение на квест

  async rejectQuestInvitation({ commit }, responseId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/employer/${responseId}/reject`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  }, // отказ на приглашение на квест
};
