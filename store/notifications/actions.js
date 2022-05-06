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
      return notification.notification;
    }
    const notification = await setLocalNotification();
    const notificationList = getters.getNotificationsList;
    // const is added = () => some
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
    if (notification.actionNameKey === `notifications.${LocalNotificationAction.TWOFA}`) this.$cookies.set(LocalNotificationAction.TWOFA, rootGetters['user/getStatus2FA'] !== 0, { maxAge: 60 * 60 * 24 * 7, enabled: false });
    if (notification.actionNameKey === `notifications.${LocalNotificationAction.KYC}`) this.$cookies.set(LocalNotificationAction.KYC, rootGetters['user/getStatusKYC'] !== 0, { maxAge: 60 * 60 * 24 * 7, enabled: false });
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
  async addNotification({ commit, dispatch }, notification) {
    const newNotification = await dispatch('setCurrNotificationObject', { notification });
    if (newNotification.params.isLocal) commit('addLocalNotification', newNotification);
    commit('addNotification', newNotification);
  },
  async setCurrNotificationObject({ getters, rootGetters, dispatch }, notification) {
    const getUserData = rootGetters['user/getUserData'];
    const { action, data } = notification.notification;
    const {
      id, title, quest, user, worker, comment, employer, fromUser, rootComment,
      assignedWorker, message, toUserId, discussion, problemDescription, questId,
    } = data;
    const currentUserId = getUserData.id;
    const userRole = rootGetters.getUserRole;
    const currentPath = this.$router.history.current.path;
    // const isAuth = rootGetters['user/isAuth'];
    // if (!isAuth) {
    //   // TODO: Не удалять!!! Разобраться в проблеме!
    //   console.log('!!!!!!!!!getters.getUserData.id!!!!!!!!!', currentUserId);
    //   console.log('!!!!!!!!!getters.getUserRole!!!!!!!!!!!!', userRole);
    //   await dispatch('user/getUserData', { root: true });
    // }
    async function setSender() {
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
    async function updateProfile() {
      /* For update user profile */
      if (currentPath === `${Path.PROFILE}/${currentUserId}`) {
        const query = { limit: 8, offset: 0 };
        await dispatch('user/getAllUserReviews', { userId: currentUserId, query }, { root: true });
      }
    }
    async function setAllNotificationsParams({
      // eslint-disable-next-line no-shadow
      title = '', path = '', isExternalLink = false,
      externalBase = '', isLocal = false, scrollToPx = 0,
    }) {
      notification.actionNameKey = `notifications.${action}`;
      notification.creatingDate = moment(notification.createdAt).format('MMMM Do YYYY, hh:mm a');
      notification.params = {
        title, path, isExternalLink, externalBase, isLocal, scrollToPx,
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
      case NotificationAction.QUEST_END_SOON:
        await setAllNotificationsParams({
          title: quest?.title || title,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        });
        await updateQuests();
        break;

      case NotificationAction.OPEN_DISPUTE:
      case NotificationAction.DISPUTE_DECISION:
        await setAllNotificationsParams({
          title: problemDescription,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        });
        await updateQuests();
        break;

      case NotificationAction.USER_LEFT_REVIEW_ABOUT_QUEST:
        await setAllNotificationsParams({
          title: message,
          path: `${Path.PROFILE}/${toUserId}`,
        });
        await updateProfile();
        break;

      /** Workquest local */
      case LocalNotificationAction.REVIEW_USER:
        await setAllNotificationsParams({
          title: message,
          path: `${Path.PROFILE}/${toUserId}`,
          isLocal: true,
        });
        await updateProfile();
        break;

      case NotificationActionFromContract.QUEST_STATUS_UPDATED1:
      case NotificationActionFromContract.QUEST_STATUS_UPDATED2:
        await setAllNotificationsParams({
          title: quest?.title || title,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        });
        await updateQuests();
        break;

      case LocalNotificationAction.GET_REWARD:
        await setAllNotificationsParams({
          title,
          path: `${Path.REFERRAL}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.QUEST_DRAFT:
        await setAllNotificationsParams({
          title,
          path: `${Path.CREATE_QUEST}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.WIKI:
        await setAllNotificationsParams({
          title,
          path: `${Path.WIKI}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.KYC:
        await setAllNotificationsParams({
          title,
          path: `${Path.SUMSUB}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.PROFILE_FILLED:
        await setAllNotificationsParams({
          title,
          path: `${Path.SETTINGS}`,
          isLocal: true,
        });
        break;

      case LocalNotificationAction.TWOFA:
        await setAllNotificationsParams({
          title,
          path: `${Path.SETTINGS}`,
          isLocal: true,
        });
        break;

      /** DAO */
      case NotificationAction.NEW_COMMENT_IN_DISCUSSION:
      case NotificationAction.NEW_DISCUSSION_LIKE: {
        await setAllNotificationsParams({
          title: discussion.title,
          path: `${PathDAO.DISCUSSIONS}/${discussion.id}`,
          isExternalLink: true,
          externalBase: DaoUrl,
        });
        break;
      }

      case NotificationAction.COMMENT_LIKED: {
        await setAllNotificationsParams({
          title: comment?.text,
          path: `${PathDAO.DISCUSSIONS}/${comment.discussionId}`,
          isExternalLink: true,
          externalBase: DaoUrl,
        });
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
};
