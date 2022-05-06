import moment from 'moment';
import {
  DaoUrl, Path, PathDAO,
  UserRole,
} from '~/utils/enums';
import {
  NotificationAction,
  LocalNotificationAction,
  NotificationActionFromContract,
  notificationCommonFilterActions,
  notificationCommonFilterAction2,
  notificationEmployerFilterActions,
} from '~/utils/notifications-enum';
import { error, success } from '~/utils/web3';

export default {

  async updateProfile() {
    /** For update user profile */
    const { getters, dispatch } = this.app.store;
    const userData = getters['user/getUserData'];
    const currentUserId = userData.id;
    const currentPath = this.$router.history.current.path;
    if (currentPath === `${Path.PROFILE}/${currentUserId}`) {
      const query = { limit: 8, offset: 0 };
      await dispatch('user/getAllUserReviews', { userId: currentUserId, query }, { root: true });
    }
  },

  async createLocalNotification({ commit, getters, dispatch }, {
    id, action, message, title, actionBtn, questId, userId, date,
  }) {
    async function setLocalNotification() {
      if (!action && !message && !title) return {};
      const notification = {
        actionNameKey: `notifications.${action}`,
        creatingDate: moment(date || Date.now()).format('MMMM Do YYYY, h:mm'),
        seen: false,
        id,
        notification: {
          params: {},
          action,
          actionBtn,
          data: {
            title,
            questId,
            userId,
            createdAt: moment(date || Date.now()).format('MMMM Do YYYY, h:mm'),
            message,
            sender: {
              avatar: require('assets/img/app/logo.svg'),
              firstName: 'Workquest info',
            },
          },
        },
      };
      if (action === LocalNotificationAction.REVIEW_USER) {
        notification.notification.params = { title: message, path: `${Path.PROFILE}/${toUserId}`, isLocal: true };
        await this.updateProfile();
      } else if ([NotificationActionFromContract.QUEST_STATUS_UPDATED1,
        NotificationActionFromContract.QUEST_STATUS_UPDATED2].includes(action)) {
        notification.notification.params = { title: quest?.title || title, path: `${Path.QUESTS}/${quest?.id || id}` };
        await this.updateProfile();
      } else if (action === LocalNotificationAction.GET_REWARD) {
        notification.notification.params = { title, path: `${Path.REFERRAL}`, isLocal: true };
      } else if (action === LocalNotificationAction.QUEST_DRAFT) {
        notification.notification.params = { title, path: `${Path.CREATE_QUEST}`, sLocal: true };
      } else if (action === LocalNotificationAction.WIKI) {
        notification.notification.params = { title, path: `${Path.WIKI}`, isLocal: true };
      } else if (action === LocalNotificationAction.KYC) {
        notification.notification.params = { title, path: `${Path.SUMSUB}`, isLocal: true };
      } else if (action === LocalNotificationAction.PROFILE_FILLED) {
        notification.notification.params = { title, path: `${Path.SETTINGS}`, isLocal: true };
      } else if (action === LocalNotificationAction.TWOFA) {
        notification.notification.params = { title, path: `${Path.SETTINGS}`, isLocal: true };
      }

      return notification.notification;
    }
    const notification = await setLocalNotification();

    const notificationList = getters.getNotificationsList;
    async function checkAddedLocalNotification() {
      // TODO: Доработать!
      const isAdded = () => notificationList.some((n) => Object.entries(LocalNotificationAction).includes(n.actionNameKey));
      return isAdded();
    }
    const isAdded = await checkAddedLocalNotification();
    if (!isAdded) await dispatch('addNotification', notification);
  },

  async removeNotification({ dispatch, commit, rootGetters }, { config, notificationId, notification }) {
    const { params } = notification;
    if (notification.actionNameKey === `notifications.${LocalNotificationAction.TWOFA}`) {
      this.$cookies.set(LocalNotificationAction.TWOFA, rootGetters['user/getStatus2FA'] !== 0,
        { maxAge: 60 * 60 * 24 * 7, enabled: false });
    }
    if (notification.actionNameKey === `notifications.${LocalNotificationAction.KYC}`) {
      this.$cookies.set(LocalNotificationAction.KYC, rootGetters['user/getStatusKYC'] !== 0,
        { maxAge: 60 * 60 * 24 * 7, enabled: false });
    }
    try {
      await commit('removeNotification', notificationId);
      await dispatch('getNotifications', config);
      if (!params.isLocal) {
        const res = await this.$axios.$delete(`${process.env.NOTIFS_URL}notifications/delete/${notificationId}`);
        return success(res);
      }
      return success();
    } catch (e) {
      return error(e);
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

  async setCurrNotificationObject({ getters, rootGetters, dispatch }, notification) {
    const userData = rootGetters['user/getUserData'];
    const { action, data } = notification.notification;
    const {
      id, title, quest, user, worker, comment, employer, fromUser, rootComment,
      assignedWorker, message, toUserId, discussion, problemDescription,
    } = data;
    const currentUserId = userData.id;
    const userRole = rootGetters.getUserRole;
    const currentPath = this.$router.history.current.path;

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
          userId: currentUserId,
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

    async function setServerNotificationsParams({
      // eslint-disable-next-line no-shadow
      title = '', path = '', isExternalLink = false,
      externalBase = '', isLocal = false, scrollToPx = 0,
    }) {
      notification.actionNameKey = `notifications.${action}`;
      notification.creatingDate = moment(notification.createdAt).format('MMMM Do YYYY, hh:mm a');
      notification.params = {
        title, path, isExternalLink, externalBase, isLocal, scrollToPx,
      };
      if (!notification.sender) {
        /** Worker && Employer */
        if (fromUser && action === NotificationAction.USER_LEFT_REVIEW_ABOUT_QUEST) notification.sender = fromUser;
        if (comment?.author && action === NotificationAction.COMMENT_LIKED) notification.sender = comment.author;
        if (rootComment?.author && action === NotificationAction.NEW_COMMENT_IN_DISCUSSION) notification.sender = rootComment.author;
        if (quest?.user && notificationCommonFilterActions.includes(action)) notification.sender = quest.user;
        // TODO: После обновления убрать лишний ключ
        if ([
          NotificationActionFromContract.QUEST_STATUS_UPDATED1,
          NotificationActionFromContract.QUEST_STATUS_UPDATED2,
        ].includes(action)) notification.sender = { avatar: { url: require('assets/img/app/logo.svg') }, firstName: 'Workquest info' };
        /** Worker */
        if (userRole === UserRole.WORKER && notificationCommonFilterAction2.includes(action)) notification.sender = user;
        /** Employer */
        if (assignedWorker && notificationEmployerFilterActions.includes(action)) notification.sender = assignedWorker;
        else if (worker && notificationEmployerFilterActions.includes(action)) notification.sender = worker;
        else if (employer && notificationCommonFilterAction2.includes(action)) notification.sender = employer;
      }
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
      case NotificationAction.QUEST_END_SOON:
        await setServerNotificationsParams({
          title: quest?.title || title,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        });
        await updateQuests();
        break;

      case NotificationAction.OPEN_DISPUTE:
      case NotificationAction.DISPUTE_DECISION:
        await setServerNotificationsParams({
          title: problemDescription,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        });
        await updateQuests();
        break;

      case NotificationAction.USER_LEFT_REVIEW_ABOUT_QUEST:
        await setServerNotificationsParams({
          title: message,
          path: `${Path.PROFILE}/${toUserId}`,
        });
        await dispatch('updateProfile');
        break;

      /** DAO */
      case NotificationAction.NEW_COMMENT_IN_DISCUSSION:
      case NotificationAction.NEW_DISCUSSION_LIKE: {
        await setServerNotificationsParams({
          title: discussion.title,
          path: `${PathDAO.DISCUSSIONS}/${discussion.id}`,
          isExternalLink: true,
          externalBase: DaoUrl,
        });
        break;
      }

      case NotificationAction.COMMENT_LIKED: {
        await setServerNotificationsParams({
          title: comment?.text,
          path: `${PathDAO.DISCUSSIONS}/${comment.discussionId}`,
          isExternalLink: true,
          externalBase: DaoUrl,
        });
        break;
      }

      /** Workquest local */
      case LocalNotificationAction.REVIEW_USER:
        await setServerNotificationsParams({
          title: message,
          path: `${Path.PROFILE}/${toUserId}`,
          isLocal: true,
        });
        await dispatch('updateProfile');
        break;

      case NotificationActionFromContract.QUEST_STATUS_UPDATED1:
      case NotificationActionFromContract.QUEST_STATUS_UPDATED2:
        await setServerNotificationsParams({
          title: quest?.title || title,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        });
        await dispatch('updateProfile');
        break;

      case LocalNotificationAction.GET_REWARD:
        await setServerNotificationsParams({
          title,
          path: `${Path.REFERRAL}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.QUEST_DRAFT:
        await setServerNotificationsParams({
          title,
          path: `${Path.CREATE_QUEST}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.WIKI:
        await setServerNotificationsParams({
          title,
          path: `${Path.WIKI}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.KYC:
        await setServerNotificationsParams({
          title,
          path: `${Path.SUMSUB}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.PROFILE_FILLED:
        await setServerNotificationsParams({
          title,
          path: `${Path.SETTINGS}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.TWOFA:
        await setServerNotificationsParams({
          title,
          path: `${Path.SETTINGS}`,
          isLocal: true,
        });
        break;

      default: {
        // Не удалять! Для ловли неизвестных ивентов
        console.error('Unknown event = ', action);
        break;
      }
    }
    return notification;
  },

  async addNotification({ commit, dispatch }, notification) {
    // TODO: Добавить разделение на локальные и с сервера
    if (notification.params.isLocal) commit('addLocalNotification', notification);
    const newNotification = await dispatch('setCurrNotificationObject', { notification });
    commit('addNotification', newNotification);
  },
};
