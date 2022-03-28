import moment from 'moment';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { error, fetchContractData } from '~/utils/web3';
import {
  connectWithMnemonic, getGasPrice,
  createWeb3Instance, getWallet,
} from '~/utils/wallet';
import {
  NotificationAction, UserRole, Path, UserStatuses, QuestModeReview, RaiseViewTariffPeriods,
} from '~/utils/enums';
import * as abi from '~/abi/abi';

const { WORKNET_PROMOTION } = process.env;
const { WQPromotion } = abi;
const web3 = new Web3(process.env.WQ_PROVIDER);

export default {
  async changeRole({ commit }, { totp }) {
    try {
      return await this.$axios.$put('/v1/profile/change-role', { totp });
    } catch (e) {
      return e;
    }
  },
  async addEducation({ commit }, data) {
    commit('setEducations', data);
  },
  async addWorkExperiences({ commit }, data) {
    commit('setWorkExperiences', data);
  },
  async getStatistic({ commit }) {
    try {
      const { result } = await this.$axios.$get('/v1/profile/statistic/me');

      commit('setStatisticData', result);
    } catch (e) {
      console.log(e);
    }
  },
  async removeNotification({ dispatch, commit }, { config, notificationId }) {
    try {
      const { ok } = await this.$axios.$delete(`${process.env.NOTIFS_URL}notifications/delete/${notificationId}`);

      await commit('removeNotification', notificationId);
      await dispatch('getNotifications', config);

      return ok;
    } catch (e) {
      return false;
    }
  },
  async readNotifications({ commit }, payload) {
    try {
      const { ok } = await this.$axios.$put(`${process.env.NOTIFS_URL}notifications/mark-read`, payload);

      commit('setNotificationsAsRead', payload.notificationIds);
      return ok;
    } catch (e) {
      return false;
    }
  },
  async getNotifications({ commit, dispatch }, config) {
    try {
      const currConfig = config || { params: { limit: 2, offset: 0 } };
      const { data: { result, ok } } = await this.$axios.get(`${process.env.NOTIFS_URL}notifications`, currConfig);

      if (result.notifications.length) {
        result.notifications.map(async (notification) => await dispatch('setCurrNotificationObject', notification));
      }

      if (!config) {
        commit('setReducedNotifications', result.notifications);
        commit('setUnreadNotifsCount', result.unreadCount);
      }

      const needPush = config?.params.limit === 1;

      commit('setNotifications', { result, needPush });

      return ok;
    } catch (e) {
      return false;
    }
  },
  async addNotification({ commit, dispatch }, notification) {
    const newNotification = await dispatch('setCurrNotificationObject', notification);
    commit('addNotification', newNotification);
  },
  setCurrNotificationObject({ getters, rootGetters, dispatch }, notification) {
    const {
      action, data: {
        user, title, id, assignedWorker, worker, quest, employer, fromUser, message, toUserId,
        problemDescription,
      },
    } = notification.notification ? notification.notification : notification;

    // If we on quest id page
    const curQuestId = rootGetters['quests/getQuest']?.id;
    if (id === curQuestId) {
      dispatch('quests/getQuest', curQuestId, { root: true });
    }

    let currTitle = quest?.title || title;
    let keyName = 'notifications.';
    let path = `${Path.QUESTS}/${quest?.id || id}`;
    const userRole = getters.getUserRole;
    const isItAnWorker = userRole === UserRole.WORKER;

    switch (action) {
      case NotificationAction.QUEST_STARTED: {
        keyName += 'invitesYouToStartAQuest';
        break;
      }
      case NotificationAction.WORKER_REJECTED_QUEST: {
        keyName += 'rejectedTheQuest';
        break;
      }
      case NotificationAction.WORKER_ACCEPTED_QUEST: {
        keyName += 'acceptedTheQuest';
        break;
      }
      case NotificationAction.WORKER_COMPLETED_QUEST: {
        keyName += 'completedTheQuest';
        break;
      }
      case NotificationAction.EMPLOYER_ACCEPTED_COMPLETED_QUEST: {
        keyName += 'acceptedAJobOnAQuest';
        break;
      }
      case NotificationAction.WORKER_RESPONDED_TO_QUEST: {
        keyName += 'respondedToQuest';
        break;
      }
      case NotificationAction.EMPLOYER_INVITED_WORKER_TO_QUEST: {
        keyName += 'invitedYouToAQuest';
        break;
      }
      case NotificationAction.WORKER_ACCEPTED_INVITATION_TO_QUEST: {
        keyName += 'acceptedTheInvitationToTheQuest';
        break;
      }
      case NotificationAction.WORKER_REJECTED_INVITATION_TO_QUEST: {
        keyName += 'declinedTheInvitationToTheQuest';
        break;
      }
      case NotificationAction.EMPLOYER_REJECTED_WORKERS_RESPONSE: {
        keyName += 'declinedYourResponseToTheQuest';
        break;
      }
      case NotificationAction.WAIT_WORKER: {
        keyName += 'theQuestIsPending';
        break;
      }
      case NotificationAction.USER_LEFT_REVIEW_ABOUT_QUEST: {
        keyName += 'leftReviewAboutQuest';
        path = `${Path.PROFILE}/${toUserId}`;
        currTitle = message;
        break;
      }
      case NotificationAction.OPEN_DISPUTE: {
        keyName += 'openDispute';
        currTitle = problemDescription;
        break;
      }
      default: {
        keyName = '';
        break;
      }
    }

    notification.actionNameKey = keyName;
    notification.sender = fromUser || (isItAnWorker ? user || employer : assignedWorker || worker);
    if (currTitle) notification.params = { title: currTitle, path };
    notification.creatingDate = moment(new Date(notification.createdAt)).format('MMMM Do YYYY, HH:mm');
    return notification;
  },
  async getUserPortfolios({ commit }, { userId, query }) {
    try {
      const response = await this.$axios.$get(`/v1/user/${userId}/portfolio/cases`, {
        params: { ...query },
      });
      commit('setUserPortfolioCases', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async setCaseImage({ commit }, { url, formData, type }) {
    const response = await this.$axios.$put(url, formData, {
      headers: {
        'Content-Type': type,
        'x-amz-acl': 'public-read',
      },
    });
    commit('setCaseImage', response.result);
    return response;
  },
  async setCaseData({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/portfolio/add-case', payload);
      commit('setCaseData', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async editCaseData({ commit }, { payload, id }) {
    try {
      const response = await this.$axios.$put(`/v1/portfolio/${id}`, payload);
      commit('setCaseData', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async deletePortfolio({ commit }, id) {
    try {
      return await this.$axios.$delete(`/v1/portfolio/${id}`);
    } catch (e) {
      return console.log(e);
    }
  },

  async getAllUserReviews({ commit }, { userId, query }) {
    try {
      const response = await this.$axios.$get(`/v1/user/${userId}/reviews?${query}`);
      commit('setUserReviews', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async sendReviewForUser({ commit }, {
    questId, message, mark, questMode,
  }) {
    try {
      const { ok, result } = await this.$axios.$post('/v1/review/send', { questId, message, mark });
      if (questMode === QuestModeReview.QUEST_LIST) commit('quests/setMarkOnQuestInList', result, { root: true });
      if (questMode === QuestModeReview.QUEST_SINGLE) commit('quests/setMarkOnQuestSingle', result, { root: true });
      return ok;
    } catch (e) {
      console.log('user/sendReviewForUser');
      return false;
    }
  },
  async registerWallet({ commit }, payload) {
    try {
      return await this.$axios.$post('/v1/auth/register/wallet', payload);
    } catch (e) {
      return error(e.response.data.code, e.response.data.msg);
    }
  },
  async signIn({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/login', payload);
      commit('setTokens', response.result);
      if (response.result.userStatus === 1 && !response.result.totpIsActive) {
        await dispatch('getMainData');
      }
      return response;
    } catch (e) {
      return error();
    }
  },
  async signUp({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/register', payload);
      commit('setTokens', response.result);
      return response;
    } catch (e) {
      return error();
    }
  },
  async getMainData({ dispatch }) {
    await Promise.all([
      dispatch('getUserData'),
      dispatch('getStatistic'),
      dispatch('getNotifications'),
    ]);
  },
  async logout({ commit }) {
    commit('logOut');
  },
  async confirm({ commit }, payload) {
    try {
      commit('setTokens', {
        access: this.$cookies.get('access'),
        refresh: this.$cookies.get('refresh'),
        userStatus: UserStatuses.Confirmed,
      });
      this.$cookies.set('role', payload.role, { path: '/' });
      return await this.$axios.$post('/v1/auth/confirm-email', payload);
    } catch (e) {
      return false;
    }
  },
  async getUserData({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/profile/me');
      const { result } = response;
      commit('setUserData', result);
      if (result.wallet?.address) connectWithMnemonic(result.wallet.address);
      return response;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  async getAnotherUserData({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/profile/${payload}`);
    await commit('setAnotherUserData', response.result);
    return response.result;
  },
  clearAnotherUserData({ commit }) {
    commit('setAnotherUserData', {});
  },
  async setUserRole({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/set-role', payload);
      commit('setUserRole', response.result);
      return response;
    } catch (e) {
      return false;
    }
  },
  async editEmployerData({ commit }, payload) {
    try {
      const response = await this.$axios.$put('/v1/employer/profile/edit', payload);
      commit('setUserData', response.result);
      return response.ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async editWorkerData({ commit }, payload) {
    try {
      const response = await this.$axios.$put('/v1/worker/profile/edit', payload);
      commit('setUserData', response.result);
      return response.ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async refreshTokens({ commit }) {
    const response = await this.$axios.$post('/v1/auth/refresh-tokens');
    commit('setTokens', response.result);
    return response;
  },
  async setCurrentPosition({ commit }, payload) {
    commit('setCurrentUserPosition', payload);
  },
  async editUserPassword({ commit }, payload) {
    const response = await this.$axios.$put('/v1/profile/change-password', payload);
    commit('setUserPassword', response.result);
    return response;
  },
  async passwordSendCode({ commit }, payload) {
    const response = await this.$axios.$post('/v1/restore-password/send-code', payload);
    commit('setSendCode', response.result);
    return response;
  },
  async passwordChange({ commit }, payload) {
    const response = await this.$axios.$post('/v1/restore-password/set-password', payload);
    commit('setUserPassword', response.result);
    return response;
  },

  async imageType({ commit }, payload) {
    const response = await this.$axios.$post('/v1/storage/get-upload-link', payload);
    commit('setImageType', response.result);
    return response;
  },
  async setImage({ commit }, { url, formData, type }) {
    const response = await this.$axios.$put(url, formData, {
      headers: {
        'Content-Type': type,
        'x-amz-acl': 'public-read',
      },
    });
    return response;
  },
  async getUploadFileLink({ commit }, config) {
    try {
      const { result } = await this.$axios.$post('/v1/storage/get-upload-link', config);
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async uploadFile({ commit }, payload) {
    try {
      await this.$axios.$put(payload.url, payload.data, {
        headers: {
          'Content-Type': payload.contentType,
          'x-amz-acl': 'public-read',
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  async disable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/disable', payload);
      commit('setDisable2FA', response.result);
      commit('setTwoFAStatus', false);
      return response;
    } catch (e) {
      const response = {
        ok: e.response.data.ok,
        code: e.response.data.code,
        msg: e.response.data.msg,
        data: e.response.data.data,
      };
      return response;
    }
  },
  async enable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/enable', payload);
      commit('setTwoFACode', response.result);
      return response;
    } catch (e) {
      const response = {
        ok: e.response.data.ok,
        code: e.response.data.code,
        msg: e.response.data.msg,
        data: e.response.data.data,
      };
      return response;
    }
  },
  async confirmEnable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/confirm', payload);
      commit('setEnable2FA', response.result);
      commit('setTwoFAStatus', true);
      return response;
    } catch (e) {
      const response = {
        ok: e.response.data.ok,
        code: e.response.data.code,
        msg: e.response.data.msg,
        data: e.response.data.data,
      };
      return response;
    }
  },

  async sendPhone({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/phone/send-code', payload);
      commit('setVerificationCode', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async confirmPhone({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/phone/confirm', payload);
      return response.ok;
    } catch (e) {
      console.log('user/confirmPhone');
      return false;
    }
  },
  async validateTOTP({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/validate-totp', payload);
      return response.result.isValid;
    } catch (e) {
      console.log('user/validateTOTP');
      return false;
    }
  },
  async payUserRaisedView({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/worker/me/raise-view/pay', payload);
      return response.ok;
    } catch (e) {
      console.log('profile/worker/me/raise-view/pay');
      return false;
    }
  },
  async getRaiseViewPrice({ commit }, payload) {
    try {
      const periods = RaiseViewTariffPeriods[payload.type];
      const tariffs = ['1', '2', '3', '4'];
      const price = {};
      for (let i = 0; i < tariffs.length; i += 1) {
        price[tariffs[i]] = {};
        for (let j = 0; j < periods.length; j += 1) {
          const data = [tariffs[i], periods[j]];
          /* eslint-disable no-await-in-loop */
          const cost = await fetchContractData(
            payload.type, WQPromotion, WORKNET_PROMOTION, data, web3,
          );
          price[tariffs[i]][periods[j]] = new BigNumber(cost).shiftedBy(-18).toString();
        }
      }
      return price;
    } catch (e) {
      console.log('getRaiseViewPrice');
      return false;
    }
  },
  async buyRaiseView({ commit }, payload) {
    try {
      const inst = new web3.eth.Contract(WQPromotion, WORKNET_PROMOTION);
      const value = new BigNumber(payload.cost).shiftedBy(18).toString();
      const attr = [payload.tariff, payload.period];
      const wallet = getWallet();
      const { gas, gasPrice } = await getGasPrice(WQPromotion, WORKNET_PROMOTION, 'promoteUser', attr, value);
      const params = {
        from: wallet, gasPrice, gas, value,
      };
      await inst.methods.promoteUser(payload.tariff, payload.period).send(params);
      return true;
    } catch (e) {
      console.log('buyRaiseView');
      return false;
    }
  },
};
