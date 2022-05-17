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
} from '~/utils/notifications';
import { error, success } from '~/utils/web3';
import { images } from '~/utils/images';
import { QuestStatuses } from '~/utils/сonstants/quests';

export default {

  async updateProfile({ rootGetters, dispatch }) {
    /** For update user profile */
    const { id } = rootGetters['user/getUserData'];
    const currentPath = this.$router.history.current.path;
    if (currentPath === `${Path.PROFILE}/${id}`) {
      const query = { limit: 8, offset: 0 };
      await dispatch('user/getAllUserReviews', { userId: id, query }, { root: true });
    }
  },

  async createLocalNotification({ commit, getters, dispatch }, {
    id, action, message, title, actionBtn, questId, userId, date,
  }) {
    if (!action && !message && !title) return;
    const notification = {
      actionNameKey: `notifications.${action}`,
      seen: true,
      id,
      action,
      actionBtn,
      sender: {
        avatar: { url: images.WQ_LOGO },
        firstName: 'Workquest info',
      },
      params: {
        title,
        isLocal: true,
      },
      data: {
        title,
        questId,
        userId,
        createdAt: moment(date || Date.now()).format('MMMM Do YYYY, h:mm'),
        message,
      },
    };
    if (action === LocalNotificationAction.GET_REWARD) {
      notification.params.path = Path.REFERRAL;
    } else if (action === LocalNotificationAction.QUEST_DRAFT) {
      notification.params.path = Path.CREATE_QUEST;
    } else if (action === LocalNotificationAction.WIKI) {
      notification.params.path = Path.WIKI;
    } else if (action === LocalNotificationAction.KYC) {
      notification.params.path = Path.SUMSUB;
    } else if (action === LocalNotificationAction.PROFILE_FILLED) {
      notification.params.path = Path.SETTINGS;
    } else if (action === LocalNotificationAction.TWOFA) {
      notification.params.path = `${Path.SETTINGS}#2FA`;
    }

    const notificationList = getters.getNotificationsList;

    const isAdded = !!notificationList.some((n) => Object.entries(LocalNotificationAction).includes(n.actionNameKey));

    if (!isAdded) await dispatch('addNotification', notification);
  },

  async removeNotification({ dispatch, commit, rootGetters }, { config, notificationId, notification: { params, actionNameKey } }) {
    if ([`notifications.${LocalNotificationAction.TWOFA}`, `notifications.${LocalNotificationAction.KYC}`].includes(actionNameKey)) {
      this.$cookies.set(
        actionNameKey.substr('notifications.'.length, actionNameKey.length),
        rootGetters['user/getStatus2FA'] !== 0,
        { maxAge: 60 * 60 * 24 * 7, enabled: false },
      );
    }
    try {
      if (!params.isLocal) await this.$axios.$delete(`${process.env.NOTIFS_URL}notifications/delete/${notificationId}`);
      await commit('removeNotification', notificationId);
      await dispatch('getNotifications', config);
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
      const { notifications, count } = result;
      if (notifications.length) {
        notifications.map(async (notification) => await dispatch('setCurrNotificationObject', notification));
      }

      if (!config) {
        commit('setReducedNotifications', notifications);
        commit('setUnreadNotifsCount', result.unreadCount);
      }

      const needPush = config?.params.limit === 1;

      commit('setNotifications', { notifications, count, needPush });

      return ok;
    } catch (e) {
      return false;
    }
  },

  async setCurrNotificationObject({ getters, rootGetters, dispatch }, notification) {
    const userData = rootGetters['user/getUserData'];
    const { data, action } = notification.notification;
    const {
      id, title, quest, user, worker, comment, employer, fromUser, rootComment,
      assignedWorker, message, toUserId, discussion, problemDescription, openDisputeUser, reason, number, status,
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
    /** Set common params */
    notification.actionNameKey = `notifications.${action}`;
    notification.creatingDate = moment(notification.createdAt).format('MMMM Do YYYY, hh:mm a');
    notification.params = { isLocal: false };

    switch (action) {
      case notificationsQuestsActions.includes(action):
        await updateQuests();
        break;

      case NotificationAction.QUEST_STATUS_UPDATED:
        notification.sender = userRole === UserRole.EMPLOYER ? assignedWorker
          || { avatar: { url: images.WQ_LOGO }, firstName: 'Workquest info' } : user;
        notification.params = {
          ...notification.params,
          title,
          path: `${Path.QUESTS}/${data.id}`,
        };
        await dispatch('updateProfile');
        break;

      case NotificationActionFromContract.QUEST_EDITED_ON_CONTRACT:
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
        break;

      case [NotificationAction.OPEN_DISPUTE, NotificationAction.DISPUTE_DECISION].includes(action):
        notification.params = {
          ...notification.params,
          title: problemDescription,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        };
        await updateQuests();
        break;

      case NotificationAction.USER_LEFT_REVIEW_ABOUT_QUEST:
        if (fromUser && !notification.sender) notification.sender = fromUser;
        notification.params = {
          ...notification.params,
          title: message,
          path: `${Path.PROFILE}/${userRole === UserRole.EMPLOYER ? toUserId : fromUser.id}`,
        };
        await dispatch('updateProfile');
        break;

      case NotificationAction.NEW_COMMENT_IN_DISCUSSION:
        if (rootComment?.author && !notification.sender) notification.sender = rootComment.author;
        break;

      case NotificationAction.COMMENT_LIKED:
        if (comment?.author && !notification.sender) notification.sender = comment.author;
        notification.params = {
          ...notification.params,
          title: comment?.text,
          path: `${PathDAO.DISCUSSIONS}/${comment.discussionId}`,
          isExternalLink: true,
          externalBase: DaoUrl,
        };
        break;

      case [NotificationAction.NEW_COMMENT_IN_DISCUSSION, NotificationAction.NEW_DISCUSSION_LIKE].includes(action):
        notification.params = {
          ...notification.params,
          title: discussion.title,
          path: `${PathDAO.DISCUSSIONS}/${discussion.id}`,
          isExternalLink: true,
          externalBase: DaoUrl,
        };
        break;

      case [...notificationsQuestsActions, NotificationAction.QUEST_STATUS_UPDATED].includes(action):
        notification.params = {
          ...notification.params,
          title: quest?.title || title,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        };
        break;

      default:
        // Не удалять! Для ловли неизвестных ивентов
        // console.error('Unknown event = ', action);
        break;
    }

    Object.assign(notification.params, { isLocal: false });

    /** Set sender if it need */
    if (quest?.user && notificationCommonFilterActions.includes(action) && !notification.sender) {
      notification.sender = quest.user;
    } else if (notificationCommonFilterAction2.includes(action && !notification.sender)) {
      if (userRole === UserRole.WORKER) notification.sender = user;
      else if (employer) notification.sender = employer;
    } else if (notificationEmployerFilterActions.includes(action) && !notification.sender) {
      if (assignedWorker) notification.sender = assignedWorker;
      else if (worker) notification.sender = worker;
    } else if (action === NotificationAction.OPENED_DISPUTE) {
      notification.sender = openDisputeUser;
      notification.params = {
        ...notification.params,
        title: `№${number}, Reason: ${reason}, Quest: ${quest?.title}`,
        path: `${Path.DISPUTES}/${data.id}`,
      };
    }
    console.log('notification.notification', notification.notification);
    return notification.notification;
  },

  async addNotification({ commit, dispatch }, notification) {
    const newNotification = await dispatch('setCurrNotificationObject', { notification });
    commit('addNotification', newNotification);
  },
};
