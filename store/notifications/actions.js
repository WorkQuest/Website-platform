import moment from 'moment';
import {
  DaoUrl, LocalNotificationAction,
  NotificationAction,
  notificationCommonFilterAction2,
  notificationCommonFilterActions, notificationEmployerFilterActions, Path, PathDAO,
  UserRole,
} from '~/utils/enums';

export default {
  async createLocalNotification({ commit, getters, dispatch }, {
    action, message, title, actionBtn, date,
  }) {
    async function setLocalNotification() {
      if (!action && !message && !title) return {};
      const notification = {
        actionNameKey: `notifications.${action}`,
        creatingDate: moment(date || Date.now()).format('MMMM Do YYYY, h:mm'),
        seen: false,
        notification: {
          action,
          actionBtn,
          data: {
            title,
            createdAt: moment(date || Date.now()).format('MMMM Do YYYY, h:mm'),
            id: 'b70bef2b-f07f-4707-8e05-8c667362beb854',
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
    async function checkAdded() {
      for (let i = 0; i < notificationList.length; i += 1) {
        if (['notifications.kyc', 'notifications.2fa'].includes(notificationList.actionNameKey)) return true;
      }
      return false;
    }
    const isAdded = await checkAdded();
    if (!isAdded) await dispatch('addNotification', notification);
  },
  async removeNotification({ dispatch, commit }, { config, notificationId }) {
    // TODO: Дописать логику удаления для локальных нотификаций
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
    const getUserData = rootGetters['user/getUserData'];
    const isAuth = rootGetters['user/isAuth'];
    const { action, data } = notification.notification;
    const {
      id, title, quest, user, worker, comment, employer, fromUser, rootComment,
      assignedWorker, message, toUserId, discussion, problemDescription,
    } = data;
    const currentUserId = getUserData.id;
    const userRole = rootGetters.getUserRole;
    const currentPath = this.$router.history.current.path;
    if (!isAuth) {
      // TODO: Не удалять!!! Разобраться в проблеме!
      console.log('!!!!!!!!!getters.getUserData.id!!!!!!!!!', currentUserId);
      console.log('!!!!!!!!!getters.getUserRole!!!!!!!!!!!!', userRole);
      await dispatch('user/getUserData', { root: true });
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
        const query = {
          limit: 8,
          offset: 0,
        };
        await dispatch('user/getAllUserReviews', { userId: currentUserId, query }, { root: true });
      }
    }
    async function setAllNotificationsParams(currTitle, path, isExternalLink, externalBase, isLocal) {
      notification.actionNameKey = `notifications.${action}`;
      notification.creatingDate = moment(notification.createdAt).format('MMMM Do YYYY, hh:mm a');
      notification.params = {
        title: currTitle, path, isExternalLink, externalBase, isLocal,
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

      /** Workquest local */

      case LocalNotificationAction.KYC:
        await setAllNotificationsParams(title, `${Path.SUMSUB}`, false, '', true);
        break;

      case LocalNotificationAction.TWOFA:
        await setAllNotificationsParams(title, `${Path.SETTINGS}`, false, '', true);
        break;

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
    console.log('notification', notification);
    return notification;
  },
};
