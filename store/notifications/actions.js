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
  notificationEmployerFilterActions, notificationsQuestsActions,
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
      if (action === LocalNotificationAction.GET_REWARD) {
        notification.notification.params = { path: `${Path.REFERRAL}` };
      } else if (action === LocalNotificationAction.QUEST_DRAFT) {
        notification.notification.params = { path: `${Path.CREATE_QUEST}` };
      } else if (action === LocalNotificationAction.WIKI) {
        notification.notification.params = { path: `${Path.WIKI}` };
      } else if (action === LocalNotificationAction.KYC) {
        notification.notification.params = { path: `${Path.SUMSUB}` };
      } else if (action === LocalNotificationAction.PROFILE_FILLED) {
        notification.notification.params = { path: `${Path.SETTINGS}` };
      } else if (action === LocalNotificationAction.TWOFA) {
        notification.notification.params = { path: `${Path.SETTINGS}` };
      }
      notification.actionNameKey = `notifications.${action}`;
      Object.assign(notification.notification.params, { title, isLocal: true });

      return notification.notification;
    }
    const notification = await setLocalNotification();

    const notificationList = getters.getNotificationsList;
    async function checkAddedLocalNotification() {
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
        // TODO: Пофиксить!
        await dispatch('quests/getQuest', params, { root: true });
        if (userRole === UserRole.EMPLOYER && currentUserId && quest?.user?.id === currentUserId) {
          await dispatch('quests/responsesToQuest', params, { root: true });
          await dispatch('quests/questListForInvitation', currentUserId, { root: true });
        }
      }
    }
    /** Set common params */
    notification.actionNameKey = `notifications.${action}`;
    notification.creatingDate = moment(notification.createdAt).format('MMMM Do YYYY, hh:mm a');
    notification.params = { isLocal: false };

    if (notificationsQuestsActions.includes(action)) {
      await updateQuests();
    } else if (action === NotificationAction.QUEST_STATUS_UPDATED) {
      notification.sender = userRole === UserRole.EMPLOYER ? assignedWorker
        || { avatar: { url: require('assets/img/app/logo.svg') }, firstName: 'Workquest info' } : user;
      notification.params = {
        ...notification.params,
        title,
        path: `${Path.QUESTS}/${data.id}`,
      };
      await dispatch('updateProfile');
    } else if (action === NotificationActionFromContract.QUEST_EDITED_ON_CONTRACT) {
      notification.sender = {
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      notification.params = {
        ...notification.params,
        title,
        path: `${Path.QUESTS}/${quest?.id || id}`,
      };
    } else if ([
      NotificationAction.OPEN_DISPUTE,
      NotificationAction.DISPUTE_DECISION,
    ].includes(action)) {
      notification.params = {
        ...notification.params,
        title: problemDescription,
        path: `${Path.QUESTS}/${quest?.id || id}`,
      };
      await updateQuests();
    } else if (action === NotificationAction.USER_LEFT_REVIEW_ABOUT_QUEST) {
      if (fromUser && !notification.sender) notification.sender = fromUser;
      notification.params = {
        ...notification.params,
        title: message,
        path: `${Path.PROFILE}/${userRole === UserRole.EMPLOYER ? toUserId : fromUser.id}`,
      };
      await dispatch('updateProfile');
    } else if (action === NotificationAction.NEW_COMMENT_IN_DISCUSSION) {
      if (rootComment?.author && !notification.sender) notification.sender = rootComment.author;
    } else if (action === NotificationAction.COMMENT_LIKED) {
      if (comment?.author && !notification.sender) notification.sender = comment.author;
      notification.params = {
        ...notification.params,
        title: comment?.text,
        path: `${PathDAO.DISCUSSIONS}/${comment.discussionId}`,
        isExternalLink: true,
        externalBase: DaoUrl,
      };
    } else if ([
      NotificationAction.NEW_COMMENT_IN_DISCUSSION,
      NotificationAction.NEW_DISCUSSION_LIKE,
    ].includes(action)) {
      notification.params = {
        ...notification.params,
        title: discussion.title,
        path: `${PathDAO.DISCUSSIONS}/${discussion.id}`,
        isExternalLink: true,
        externalBase: DaoUrl,
      };
    } else if ([
      ...notificationsQuestsActions,
      NotificationAction.QUEST_STATUS_UPDATED,
    ].includes(action)) {
      notification.params = {
        ...notification.params,
        title: quest?.title || title,
        path: `${Path.QUESTS}/${quest?.id || id}`,
      };
    } else {
      // Не удалять! Для ловли неизвестных ивентов
      // console.error('Unknown event = ', action);
    }
    Object.assign(notification.params, { isLocal: false });

    /** Set sender if it need */
    if (quest?.user && notificationCommonFilterActions.includes(action) && !notification.sender) {
      notification.sender = quest.user;
    } else if (userRole === UserRole.WORKER && notificationCommonFilterAction2.includes(action && !notification.sender)) {
      notification.sender = user;
    } else if (assignedWorker && notificationEmployerFilterActions.includes(action) && !notification.sender) {
      notification.sender = assignedWorker;
    } else if (worker && notificationEmployerFilterActions.includes(action) && !notification.sender) {
      notification.sender = worker;
    } else if (worker && notificationEmployerFilterActions.includes(action) && !notification.sender) {
      notification.sender = worker;
    } else if (employer && notificationCommonFilterAction2.includes(action) && !notification.sender) {
      notification.sender = employer;
    }
    console.log('notification', notification);
    return notification.notification;
  },

  async addNotification({ commit, dispatch }, notification) {
    // TODO: Добавить разделение на локальные и с сервера
    if (notification.params?.isLocal) {
      // commit('addNotification', notification);
      commit('addLocalNotification', notification);
    }
    const newNotification = await dispatch('setCurrNotificationObject', { notification });
    commit('addNotification', newNotification);
  },
};
