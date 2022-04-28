import moment from 'moment';
import BigNumber from 'bignumber.js';
import {
  error,
  success,
  showToast,
  fetchContractData,
} from '~/utils/web3';

import {
  getGasPrice,
  createInstance,
  getWalletAddress,
  GetWalletProvider,
  connectWithMnemonic,
} from '~/utils/wallet';

import {
  Path,
  DaoUrl,
  PathDAO,
  UserRole,
  UserStatuses,
  QuestModeReview,
  NotificationAction,
  RaiseViewTariffPeriods,
  notificationCommonFilterAction2,
  notificationCommonFilterActions,
  notificationEmployerFilterActions,
} from '~/utils/enums';

import { WQPromotion } from '~/abi/index';

const { WORKNET_PROMOTION } = process.env;

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
    const newNotification = await dispatch('setCurrNotificationObject', { notification });
    commit('addNotification', newNotification);
  },
  async setCurrNotificationObject({ getters, rootGetters, dispatch }, notification) {
    const { isAuth, getUserData } = getters;
    const { action, data } = notification.notification;
    const {
      id, title, quest, user, worker, comment, employer, fromUser, rootComment,
      assignedWorker, message, toUserId, discussion, problemDescription,
    } = data;
    const currentUserId = getUserData.id;
    const userRole = getters.getUserRole;
    const currentPath = this.$router.history.current.path;
    if (!isAuth) {
      // TODO: Не удалять!!! Разобраться в проблеме!
      console.log('!!!!!!!!!getters.getUserData.id!!!!!!!!!', currentUserId);
      console.log('!!!!!!!!!getters.getUserRole!!!!!!!!!!!!', userRole);
      await dispatch('getUserData');
    }

    async function setSender() {
      if (!notification.sender) {
        /** Worker && Employer */
        if (fromUser && action === NotificationAction.USER_LEFT_REVIEW_ABOUT_QUEST) notification.sender = fromUser;
        if (comment?.author && action === NotificationAction.COMMENT_LIKED) notification.sender = comment.author;
        if (rootComment?.author && action === NotificationAction.NEW_COMMENT_IN_DISCUSSION) notification.sender = rootComment.author;
        if (quest?.user && notificationCommonFilterActions.includes(action)) notification.sender = quest.user;
        /** Worker */
        if (userRole === UserRole.WORKER && notificationCommonFilterAction2.includes(action)) notification.sender = user;
        /** Employer */
        if (userRole === UserRole.EMPLOYER) {
          if (assignedWorker && notificationEmployerFilterActions.includes(action)) notification.sender = assignedWorker;
          if (worker && notificationEmployerFilterActions.includes(action)) notification.sender = worker;
          if (employer && notificationCommonFilterAction2.includes(action)) notification.sender = employer;
        }
      }
    }

    async function updateQuests() {
      /* For update quest lists */
      const questListPathArray = [
        Path.MY_QUESTS,
        Path.QUESTS,
        `${Path.PROFILE}/${currentUserId}`,
      ];
      if (questListPathArray.includes(currentPath) && currentUserId && userRole) {
        const query = {
          limit: 10,
          offset: 0,
          starred: false,
          'sort[createdAt]': 'desc',
        };
        await dispatch('quests/getUserQuests', {
          role: userRole,
          query,
        }, { root: true });
      } else if (currentPath === `${Path.QUESTS}/${quest?.id || id}`) {
        const params = quest?.id || id;
        await dispatch('quests/getQuest', params, { root: true });
        if (userRole === UserRole.EMPLOYER && currentUserId && quest?.user?.id === currentUserId) {
          await dispatch('quests/responsesToQuest', params, { root: true });
          await dispatch('quests/questListForInvitation', currentUserId, { root: true });
        }
      }
    }

    async function updateProfile() {
      /* For update user profile */
      if (currentPath === `${Path.PROFILE}/${currentUserId}`) {
        const query = {
          limit: 8,
          offset: 0,
        };
        await dispatch('getAllUserReviews', { userId: currentUserId, query });
      }
    }

    async function setAllNotificationsParams(currTitle, path, isExternalLink, externalBase) {
      notification.actionNameKey = `notifications.${action}`;
      notification.creatingDate = moment(notification.createdAt).format('MMMM Do YYYY, hh:mm a');
      notification.params = {
        title: currTitle, path, isExternalLink, externalBase,
      };
      await setSender();
    }

    switch (action) {
      /** WORK-QUEST */
      case NotificationAction.QUEST_STARTED:
      case NotificationAction.WORKER_REJECTED_QUEST:
      case NotificationAction.WORKER_ACCEPTED_QUEST:
      case NotificationAction.WORKER_COMPLETED_QUEST:
      case NotificationAction.EMPLOYER_ACCEPTED_COMPLETED_QUEST:
      case NotificationAction.EMPLOYER_REJECTED_COMPLETED_QUEST:
      case NotificationAction.WORKER_RESPONDED_TO_QUEST:
      case NotificationAction.EMPLOYER_INVITED_WORKER_TO_QUEST:
      case NotificationAction.WORKER_ACCEPTED_INVITATION_TO_QUEST:
      case NotificationAction.WORKER_REJECTED_INVITATION_TO_QUEST:
      case NotificationAction.EMPLOYER_REJECTED_WORKERS_RESPONSE:
      case NotificationAction.WAIT_WORKER:
      case NotificationAction.QUEST_EDITED:
      case NotificationAction.QUEST_END_SOON: {
        await setAllNotificationsParams(quest?.title || title, `${Path.QUESTS}/${quest?.id || id}`, false, '');
        await updateQuests();
        break;
      }

      case NotificationAction.OPEN_DISPUTE:
      case NotificationAction.DISPUTE_DECISION: {
        await setAllNotificationsParams(problemDescription, `${Path.QUESTS}/${quest?.id || id}`, false, '');
        await updateQuests();
        break;
      }

      case NotificationAction.USER_LEFT_REVIEW_ABOUT_QUEST: {
        await setAllNotificationsParams(message, `${Path.PROFILE}/${toUserId}`, false, '');
        await updateProfile();
        break;
      }
      /** DAO */
      case NotificationAction.NEW_COMMENT_IN_DISCUSSION:
      case NotificationAction.NEW_DISCUSSION_LIKE: {
        await setAllNotificationsParams(discussion.title, `${PathDAO.DISCUSSIONS}/${discussion.id}`, true, DaoUrl);
        break;
      }

      case NotificationAction.COMMENT_LIKED: {
        await setAllNotificationsParams(comment?.text, `${PathDAO.DISCUSSIONS}/${comment.discussionId}`, true, DaoUrl);
        break;
      }
      default: {
        // Не удалять! Для ловли неизвестных ивентов
        console.error('Unknown event = ', action);
        break;
      }
    }
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
  async signIn({ commit, dispatch, state }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/login', payload);
      commit('setTokens', {
        access: response.result.access,
        refresh: state.isRememberMeChecked ? response.result.refresh : '',
      });
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
    await this.$wsChatActions.disconnect();
    await this.$wsNotifs.disconnect();
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
  // TODO delete, waiting when backend will be catch all this events
  async payUserRaisedView({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/worker/me/raise-view/pay', payload);
      return response.ok;
    } catch (e) {
      console.log('profile/worker/me/raise-view/pay');
      return false;
    }
  },
  async getRaiseViewPrice({ commit }, { type }) {
    try {
      const periods = RaiseViewTariffPeriods[type];
      const tariffs = ['1', '2', '3', '4'];
      const price = {};
      for (let i = 0; i < tariffs.length; i += 1) {
        price[tariffs[i]] = {};
        for (let j = 0; j < periods.length; j += 1) {
          const data = [tariffs[i], periods[j]];
          /* eslint-disable no-await-in-loop */
          const cost = await fetchContractData(
            type,
            WQPromotion,
            WORKNET_PROMOTION,
            data,
            GetWalletProvider(),
          );
          price[tariffs[i]][periods[j]] = new BigNumber(+cost).shiftedBy(-18).toString();
        }
      }
      return success(price);
    } catch (e) {
      console.log('user/getRaiseViewPrice');
      return error(e.code, 'Error in get raise view price', e);
    }
  },
  async promoteUserOnContract({ commit }, { cost, tariff, period }) {
    try {
      const inst = createInstance(WQPromotion, WORKNET_PROMOTION);
      const value = new BigNumber(cost).shiftedBy(18).toString();
      const { gas, gasPrice } = await getGasPrice(
        WQPromotion,
        WORKNET_PROMOTION,
        'promoteUser',
        [tariff, period],
        value,
      );
      const params = {
        from: getWalletAddress(),
        gasPrice,
        gas,
        value,
      };
      const response = await inst.methods.promoteUser(tariff, period).send(params);
      return success(response);
    } catch (e) {
      console.log('user/buyRaiseView');
      showToast('Promote user error:', `${e.message}`, 'danger');
      return error(e.code, 'Error in method promote user', e);
    }
  },
  setRememberMe({ commit }, payload) {
    commit('setRememberMe', payload);
  },
};
