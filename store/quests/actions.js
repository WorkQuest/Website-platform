import BigNumber from 'bignumber.js';
import { ResponsesType } from '~/utils/enums';

import {
  QuestMethods,
  QuestStatuses,
} from '~/utils/сonstants/quests';

import { WQFactory, WorkQuest, WQPromotion } from '~/abi/index';

import {
  hashText,
  getProvider,
  createInstance,
  getWalletAddress,
  getContractFeeData,
  sendWalletTransaction,
} from '~/utils/wallet';

import { error, success } from '~/utils/web3';

import ENV from '~/utils/adresses/index';

export default {
  async getWorkerData({ commit }, userId) {
    try {
      const response = await this.$axios.$get(`/v1/profile/${userId}`);
      commit('setCurrentWorker', response.result);
      return response;
    } catch (e) {
      console.error('quests/getWorkerData');
      return error();
    }
  },

  async employeeList({ commit }, { query, specFilter }) {
    try {
      if (query.q === '') delete query.q;
      const specializations = specFilter ? Object.values(specFilter) : [];
      const { ok, result } = await this.$axios.$post('/v1/profile/get-workers', { specializations }, {
        params: { ...query },
      });
      commit('setEmployeeList', result);
      return { ok };
    } catch (e) {
      console.error('quests/employeeList');
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
      console.error('quests/questCreate');
      return error();
    }
  },
  async getAllQuests({ commit }, { query, specFilter }) {
    try {
      if (query.q === '') delete query.q;
      const specializations = specFilter ? Object.values(specFilter) : [];
      const { result } = await this.$axios.$post('/v1/get-quests', { specializations }, {
        params: { ...query },
      });
      commit('setAllQuests', result);
      return success();
    } catch (e) {
      console.error('quests/getAllQuests');
      return false;
    }
  },
  async getQuest({ commit, rootState }, payload) {
    try {
      const { result } = await this.$axios.$get(`/v1/quest/${payload}`);
      let currStat = 0;
      const { status, response } = result;

      const questStatuses = Object.entries(QuestStatuses);
      questStatuses.some(([key, val]) => {
        if (val === status) {
          if (val === QuestStatuses.Created && response) {
            key = response.type ? 'Invited' : 'Responded';
          }
          currStat = QuestStatuses[key];
          return true;
        }
        return false;
      });

      commit('setInfoDataMode', currStat);
      commit('setQuest', result);
      return result;
    } catch (e) {
      return false;
    }
  },
  async getUserQuests({ commit, rootGetters }, { role, query, userId }) {
    try {
      const specializations = query.specializations || [];
      if (query.specializations) delete query.specializations;
      // Fetch my quests or quests for special user
      const url = userId === rootGetters['user/getUserData'].id
        ? `/v1/me/${role}/get-quests`
        : `/v1/${role}/${userId}/get-quests`;
      const response = await this.$axios.$post(url, { specializations }, {
        params: { ...query },
      });
      commit('setAllQuests', response.result);
      return response.result;
    } catch (e) {
      console.error('quests/getUserQuests');
      return error();
    }
  },
  async editQuest({ commit }, { payload, questId }) {
    try {
      const response = await this.$axios.$put(`/v1/quest/${questId}/edit`, payload);
      commit('setQuestData', response.result);
      return response;
    } catch (e) {
      console.error('quests/editQuest');
      return error();
    }
  },
  async responsesToQuest({ commit }, questId) {
    try {
      const { result } = await this.$axios.$get(`/v1/quest/${questId}/responses`);
      const responded = result.responses.filter((response) => response.status === 0 && response.type === ResponsesType.Responded) || [];
      const invited = result.responses.filter((response) => response.status >= 0 && response.type === ResponsesType.Invited) || [];
      commit('setResponses', { responded, invited });
      return result;
    } catch (e) {
      console.error('quests/responsesToQuest');
      return error();
    }
  },
  async setResponseToQuest({ commit }, { data: response }) {
    const responded = response.status === 0 && response.type === ResponsesType.Responded ? response : '';
    const invited = response.status >= 0 && response.type === ResponsesType.Invited ? response : '';
    commit('setResponseToQuest', { responded, invited });
  },
  async inviteOnQuest({ commit }, { questId, payload }) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/invite`, payload);
      const { questChat } = response.result;
      commit('setChatInviteOnQuest', questChat);
      return response.result;
    } catch (e) {
      console.error('quests/inviteOnQuest');
      return error();
    }
  },
  async respondOnQuest({ commit }, { data, questId }) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${questId}/response`, data);
      commit('setRespondOnQuest', data);
      return success(response);
    } catch (e) {
      console.error('quests/respondOnQuest');
      return error();
    }
  },
  async setStarOnQuest({ commit }, id) {
    try {
      const response = await this.$axios.$post(`/v1/quest/${id}/star`);
      return response.result;
    } catch (e) {
      console.error('quests/setStarOnQuest');
      return error();
    }
  },
  async takeAwayStarOnQuest({ commit }, id) {
    try {
      const response = await this.$axios.$delete(`/v1/quest/${id}/star`);
      return response.result;
    } catch (e) {
      console.error('quests/takeAwayStarOnQuest');
      return error();
    }
  },
  async getResponsesToQuestForAuthUser({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/quest/responses/my');
      commit('setResponsesMy', response.result);
      return response.result;
    } catch (e) {
      console.error('quests/getResponsesToQuestForAuthUser');
      return error();
    }
  },

  async acceptQuestInvitation({ commit }, responseId) {
    try {
      const response = await this.$axios.$post(`/v1/quest/response/${responseId}/accept`);
      return response.result;
    } catch (e) {
      console.error('quests/acceptQuestInvitation');
      return error();
    }
  },
  async rejectQuestInvitation({ commit }, responseId) {
    try {
      const { ok } = await this.$axios.$post(`/v1/quest/response/${responseId}/reject`);
      return ok;
    } catch (e) {
      console.error('quests/rejectQuestInvitation');
      return false;
    }
  },

  async rejectTheAnswerToTheQuest({ commit }, responseId) {
    try {
      const { ok } = await this.$axios.$post(`/v1/quest/employer/${responseId}/reject`);
      return ok;
    } catch (e) {
      console.error('quests/rejectTheAnswerToTheQuest');
      return false;
    }
  },

  async getFilters({ commit }) {
    try {
      const { result } = await this.$axios.$get('/v1/skill-filters');
      commit('setFilters', result);
    } catch (e) {
      console.error('quests/getFilters');
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
      return response.result;
    } catch (e) {
      console.error('quests/getAvailableQuests');
      return false;
    }
  },

  /** Work Quest Factory */
  async createQuest({ commit }, {
    cost, description, nonce,
  }) {
    try {
      const address = ENV.WORKNET_WQ_FACTORY;
      const walletAddress = getWalletAddress();
      const hash = hashText(description);
      cost = new BigNumber(cost).shiftedBy(18).toString();
      const data = [hash, cost, 0, nonce];
      const inst = createInstance(WQFactory, address);
      const sendData = inst.methods.newWorkQuest.apply(null, data).encodeABI();
      const [gasPrice, gasEstimate] = await Promise.all([
        getProvider().eth.getGasPrice(),
        inst.methods.newWorkQuest.apply(null, data).estimateGas({ from: walletAddress }),
      ]);
      const res = await getProvider().eth.sendTransaction({
        to: address,
        from: walletAddress,
        data: sendData,
        gasPrice,
        gas: gasEstimate,
      });
      return success(res);
    } catch (e) {
      console.error('quests/createQuest');
      return error(9000, e.message, e);
    }
  },
  /**
   * Get create quest tx fee
   * @param commit
   * @param cost - price for a quest
   * @param depositAmount - deposit = cost * 1% (create quests fee)
   * @param description
   * @param nonce
   * @returns success|error
   */
  async getCreateQuestFeeData({ commit }, {
    cost, description, nonce,
  }) {
    try {
      const hash = hashText(description);
      const address = ENV.WORKNET_WQ_FACTORY;
      cost = new BigNumber(cost).shiftedBy(18).toString();
      return await getContractFeeData(
        'newWorkQuest',
        WQFactory,
        address,
        [hash, cost, 0, nonce],
        address,
      );
    } catch (e) {
      return error();
    }
  },
  async editQuestOnContract({ dispatch }, {
    contractAddress, cost,
  }) {
    try {
      cost = new BigNumber(cost).shiftedBy(18).toString();
      return await dispatch('sendQuestTransaction', {
        contractAddress,
        method: QuestMethods.EditJob,
        params: [cost],
      });
    } catch (e) {
      return error(9000, e.message, e);
    }
  },

  /** Work Quest */
  async getFeeDataJobMethod({ commit }, {
    method, abi, contractAddress, data,
  }) {
    return await getContractFeeData(method, abi, contractAddress, data);
  },
  async sendQuestTransaction({ commit }, {
    contractAddress, method, params = [], value,
  }) {
    try {
      const payload = {
        abi: WorkQuest,
        address: contractAddress,
        data: params,
      };
      if (value) payload.value = value;
      const res = await sendWalletTransaction(method, payload);
      return success(res);
    } catch (e) {
      console.error('quests/sendQuestTransaction');
      return error(500, e.message, e);
    }
  },
  async cancelJob({ dispatch }, contractAddress) {
    return await dispatch('sendQuestTransaction', { contractAddress, method: QuestMethods.CancelJob });
  },
  // Пригласить воркера на квест
  async assignJob({ dispatch }, { contractAddress, workerAddress }) {
    return await dispatch('sendQuestTransaction', {
      contractAddress,
      method: QuestMethods.AssignJob,
      params: [workerAddress],
    });
  },
  // Принять результат работы воркера
  async acceptJobResult({ dispatch }, contractAddress) {
    return await dispatch('sendQuestTransaction', { contractAddress, method: QuestMethods.AcceptJobResult });
  },
  // employer отменил (reject) результат работы или прошло 3 дня с момента начала verification
  async arbitration({ dispatch }, { contractAddress, value }) {
    return await dispatch('sendQuestTransaction', { contractAddress, method: QuestMethods.Arbitration, value });
  },

  /** WORKER */
  // Принять и начать квест
  async acceptJob({ dispatch }, contractAddress) {
    return await dispatch('sendQuestTransaction', { contractAddress, method: QuestMethods.AcceptJob });
  },
  // Отправить результат работы на проверку employer'у
  async verificationJob({ dispatch }, contractAddress) {
    return await dispatch('sendQuestTransaction', { contractAddress, method: QuestMethods.VerificationJob });
  },

  /** RAISE VIEWS */
  /**
   * Raise view quest
   * @param _
   * @param method
   * @param data - from promoteQuest abi
   */
  async promote(_, { method, data }) {
    try {
      const res = await sendWalletTransaction(method, {
        address: ENV.WORKNET_PROMOTION,
        abi: WQPromotion,
        data,
      });
      return success(res);
    } catch (e) {
      console.error('quests/promoteQuest', e);
      return error(-1, e.msg, e);
    }
  },
};
