import moment from 'moment';

import {
  Path,
  DaoUrl,
  PathDAO,
  UserRole,
} from '~/utils/enums';

import {
  NotificationAction,
  LocalNotificationAction,
  notificationsQuestsActions,
  notificationCommonFilterActions,
  notificationCommonFilterAction2,
  notificationEmployerFilterActions,
} from '~/utils/notifications';

import { error, success } from '~/utils/web3';

import { images } from '~/utils/images';

import ENV from '~/utils/adresses/index';

export default {

  async updateProfile({ rootGetters, dispatch }) {
    /** For update user profile */
    const { id } = rootGetters['user/getUserData'];
    const currentPath = this.$router.history.current.path;
    if (currentPath === `${Path.PROFILE}/${id}`) {
      // TODO летят запросы если даже это была старая нотификация
      // как проверить: зайти на свой профиль, обновить страницу, смотреть в network
      await dispatch('user/getAllUserReviews', {
        userId: id,
        params: { limit: 8, offset: 0 },
      }, { root: true });
    }
  },

  async createLocalNotification({ commit, getters, dispatch }, {
    id, action, message, title, actionBtn, questId, userId, date,
  }) {
    if (!action && !message && !title) return;
    const notificationList = getters.getNotificationsList;
    const isAdded = !!notificationList.some((n) => Object.entries(LocalNotificationAction).includes(n.actionNameKey));
    if (!isAdded) {
      const notification = {
        actionNameKey: `notifications.${action}`,
        seen: true,
        id,
        action,
        actionBtn,
        sender: {
          avatar: { url: images.WQ_LOGO },
          firstName: $nuxt.$t('ui.notifications.workquestInfo'),
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
      await dispatch('addNotification', notification);
    }
  },

  async removeNotification({ dispatch, commit, rootGetters }, { config, notification: { params, actionNameKey, id } }) {
    if ([`notifications.${LocalNotificationAction.TWOFA}`, `notifications.${LocalNotificationAction.KYC}`].includes(actionNameKey)) {
      this.$cookies.set(
        actionNameKey.substr('notifications.'.length, actionNameKey.length),
        rootGetters['user/getStatus2FA'] !== 0,
        { maxAge: 60 * 60 * 24 * 7, enabled: false },
      );
    }
    try {
      if (!params.isLocal) await this.$axios.$delete(`${ENV.NOTIFS_URL}notifications/delete/${id}`);
      await commit('removeNotification', id);
      await dispatch('getNotifications', config);
      return success();
    } catch (e) {
      return error(e);
    }
  },

  async readNotifications({ commit }, payload) {
    try {
      const { ok } = await this.$axios.$put(`${ENV.NOTIFS_URL}notifications/mark-read`, payload);
      commit('setNotificationsAsRead', payload.notificationIds);
      return ok;
    } catch (e) {
      return false;
    }
  },

  async getNotifications({ commit, dispatch }, config) {
    try {
      const currConfig = config || { params: { limit: 2, offset: 0 } };
      const { data: { result, ok } } = await this.$axios.get(`${ENV.NOTIFS_URL}notifications`, currConfig);
      const { notifications, count } = result;

      await Promise.all(notifications.map(async (notification) => await dispatch('setCurrNotificationObject', notification)));

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

  async setCurrNotificationObject({
    getters, rootGetters, dispatch, commit,
  }, notification) {
    const { data, action } = notification.notification;
    const {
      id, title, quest, user, worker, comment, employer, fromUser, rootComment,
      assignedWorker, message, toUserId, discussion, problemDescription, openDisputeUser, reason, number,
    } = data;
    const userRole = rootGetters['user/getUserRole'];

    /** Set common params */
    notification.actionNameKey = `notifications.${action}`;
    notification.creatingDate = moment(notification.createdAt).format('MMMM Do YYYY, hh:mm a');
    notification.params = { isLocal: false };

    switch (action) {
      case NotificationAction.QUEST_STATUS_UPDATED:
        notification.sender = userRole === UserRole.EMPLOYER ? assignedWorker
          || { avatar: { url: images.WQ_LOGO }, firstName: $nuxt.$t('ui.notifications.workquestInfo') } : user;
        notification.params = {
          ...notification.params,
          title,
          path: `${Path.QUESTS}/${data.id}`,
        };

        await dispatch('updateProfile');
        break;

      case NotificationAction.QUEST_EDITED_ON_CONTRACT:
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

        // TODO: проверка на то были ли мы приглашены на квест или мы сами подали на него
        // ui.notifications.respondedQuestEdited - u responded
        // ui.notifications.invitedQuestEdited - that u invited
        if (userRole === UserRole.WORKER) {
          notification.params.isLocal = true;
          notification.data = {
            ...notification.data,
            message: $nuxt.$t('ui.notifications.respondedQuestEdited'),
          };
        }

        break;

      case NotificationAction.DISPUTE_DECISION:
        notification.params = {
          ...notification.params,
          title: problemDescription,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        };
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

      case NotificationAction.EMPLOYER_INVITED_WORKER_TO_QUEST:
        notification.params = {
          ...notification.params,
          title: title || quest?.title,
          path: `${Path.QUESTS}/${quest?.id || id}`,
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
          title: title || quest?.title,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        };
        break;

      default:
        break;
    }

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
        title: `№${number}, ${$nuxt.$t('modals.titles.reason')}: ${reason}, ${$nuxt.$t('quests.questBig')}: ${quest?.title}`,
        path: `${Path.DISPUTES}/${data.id}`,
      };
    }
    return notification.notification;
  },

  async handleUpdateDataFromWS({
    getters, rootGetters, dispatch, commit,
  }, notification) { // Fetching data if it needs
    const userData = rootGetters['user/getUserData'];
    const userRole = rootGetters['user/getUserRole'];
    const { action, data } = notification.notification;
    const { id, quest } = data;
    const currentPath = this.$router.history.current.path;
    const currentUserId = userData.id;

    // Disabling loader after sending txs (transactionReceipt modal) and calling callback
    const handleWaitForUpdateQuest = async () => {
      dispatch('main/setLoading', false, { root: true });
      if (getters.getWaitForUpdateQuest?.callback) {
        await getters.getWaitForUpdateQuest.callback();
      }
      commit('setWaitForUpdateQuest', null);
    };

    // eslint-disable-next-line default-case
    switch (action) {
      case NotificationAction.QUEST_STATUS_UPDATED:
        if (getters.getWaitForUpdateQuest?.id === data?.id) {
          await handleWaitForUpdateQuest();
        }
        break;
      case NotificationAction.QUEST_EDITED_ON_CONTRACT:
        if (getters.getWaitForUpdateQuest?.id === data?.id) {
          await handleWaitForUpdateQuest();
        }
        break;
    }

    // For update quest & quest lists
    if ([
      ...notificationsQuestsActions,
      NotificationAction.QUEST_STATUS_UPDATED,
      NotificationAction.DISPUTE_DECISION,
    ].includes(action)) {
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
          await dispatch('quests/setResponseToQuest', notification.notification, { root: true });
        }
      }
    }
  },

  async addNotification({ commit, dispatch }, notification) {
    const buffer = { notification };
    await dispatch('setCurrNotificationObject', buffer);
    await dispatch('handleUpdateDataFromWS', buffer);
    commit('addNotification', buffer);
  },
};
