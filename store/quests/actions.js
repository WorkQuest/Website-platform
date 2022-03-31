import {
  InfoModeEmployer, InfoModeWorker, QuestStatuses, ResponsesType, UserRole,
} from '~/utils/enums';

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
  async employeeList({ commit }, { query, specFilter }) {
    try {
      if (query.q === '') delete query.q;
      const { ok, result } = await this.$axios.$get('/v1/profile/workers', {
        params: { ...query, ...specFilter },
      });
      commit('setEmployeeList', result);
      return { ok };
    } catch (e) {
      console.log('quests/employeeList');
      return false;
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
  async questCreate({ commit }, payload) {
    try {
      return await this.$axios.$post('/v1/quest/create', payload);
    } catch (e) {
      return console.log(e);
    }
  },
  async getAllQuests({ commit }, { query, specFilter }) {
    try {
      if (query.q === '') delete query.q;
      const { ok, result } = await this.$axios.$get('/v1/quests', {
        params: { ...query, ...specFilter },
      });
      commit('setAllQuests', result);
      return { ok };
    } catch (e) {
      console.log('quests/getAllQuests');
      return false;
    }
  },
  async getQuest({ commit, rootState }, payload) {
    try {
      console.log('getQuest');
      const { result } = await this.$axios.$get(`/v1/quest/${payload}`);
      const { role } = rootState.user.userData;
      let currStat = 0;
      const { status, response } = result;

      const questStatuses = Object.entries(QuestStatuses);

      if (role === UserRole.EMPLOYER) {
        questStatuses.some(([key, val]) => {
          if (val === status) {
            currStat = InfoModeEmployer[key];
            return true;
          }
          return false;
        });
      } else if (role === UserRole.WORKER) {
        questStatuses.some(([key, val]) => {
          if (val === status) {
            if (val === QuestStatuses.Created && response) key = response.type ? 'Invited' : 'Responded';
            currStat = InfoModeWorker[key];
            return true;
          }
          return false;
        });
      }

      commit('setInfoDataMode', currStat);
      commit('setQuest', result);
      return result;
    } catch (e) {
      return false;
    }
  },
  async getUserQuests({ commit }, { userId, role, query }) {
    try {
      const response = await this.$axios.$get(`/v1/${role}/${userId}/quests`, {
        params: { ...query },
      });
      commit('setAllQuests', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async editQuest({ commit }, { payload, questId }) {
    try {
      const response = await this.$axios.$put(`/v1/quest/${questId}`, payload);
      commit('setQuestData', response.result);
      return response;
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
  async startQuest({ commit }, { questId, config }) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/start`, config);
      commit('setInfoDataMode', 4);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async completeWorkOnQuest({ commit }, questId) {
    try {
      const { ok } = await this.$axios.$post(`/v1/quest/${questId}/complete-work`, questId);
      return ok;
    } catch (e) {
      return console.log(e);
    }
  },
  async rejectWorkOnQuest({ commit }, questId) {
    try {
      const { ok } = await this.$axios.$post(`/v1/quest/${questId}/reject-work`, questId);
      return ok;
    } catch (e) {
      return console.log(e);
    }
  },
  async acceptCompletedWorkOnQuest({ commit }, questId) {
    try {
      const { ok } = await this.$axios.$post(`/v1/quest/${questId}/accept-completed-work`, questId);
      return ok;
    } catch (e) {
      return console.log(e);
    }
  },
  async acceptWorkOnQuest({ commit }, questId) {
    try {
      const { ok } = await this.$axios.$post(`/v1/quest/${questId}/accept-work`);
      return ok;
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
      const { result } = await this.$axios.$get(`/v1/quest/${questId}/responses`);
      const responded = result.responses.filter((response) => response.status === 0 && response.type === ResponsesType.Responded) || [];
      const invited = result.responses.filter((response) => response.status >= 0 && response.type === ResponsesType.Invited) || [];
      commit('setResponses', { result, responded, invited });
      return result;
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
      return response;
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
      const { ok } = await this.$axios.$post(`/v1/quest/response/${responseId}/reject`);
      return ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  async rejectTheAnswerToTheQuest({ commit }, responseId) {
    try {
      const { ok } = await this.$axios.$post(`/v1/quest/employer/${responseId}/reject`);
      return ok;
    } catch (e) {
      console.log(e);
      return false;
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
  async getAvailableQuests({ commit }, data) {
    try {
      const response = await this.$axios.$get(`/v1/worker/${data}/available-quests?limit=100`);
      commit('setAvailableQuests', response.result.quests);
      return response.ok;
    } catch (e) {
      console.log('Error: getAvailableQuests');
      return false;
    }
  },
};
