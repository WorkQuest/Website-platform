import moment from 'moment';

import {
  Path,
  DaoUrl,
  PathDAO,
  UserRole, ResponsesType, WikiUrl,
} from '~/utils/enums';

import {
  NotificationAction,
  LocalNotificationAction,
  notificationsQuestsActions,
  notificationCommonFilterActions,
  notificationCommonFilterAction2,
  notificationEmployerFilterActions, QuestNotificationByStatus,
} from '~/utils/notifications';

import { error, success } from '~/utils/web3';

import { images } from '~/utils/images';

import ENV from '~/utils/addresses/index';
import { notificationLifetime } from '~/utils/сonstants/cookiesLifetime';
import { QuestStatuses } from '~/utils/сonstants/quests';

export default {

  async updateProfile({ rootGetters, dispatch }) {
    /** For update user profile */
    const { id } = rootGetters['user/getUserData'];
    const currentPath = this.$router.history.current.path;
    if (currentPath === `${Path.PROFILE}/${id}`) {
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

    // isAdded
    if (notificationList.some((n) => Object.entries(LocalNotificationAction).includes(n.actionNameKey))) return;

    const path = {
      [LocalNotificationAction.QUEST_DRAFT]: Path.CREATE_QUEST,
      [LocalNotificationAction.QUESTS_SPECS]: `${Path.QUESTS}?mySpecs=true`,
      [LocalNotificationAction.WALLET_UPDATE]: Path.WALLET,
    }[action];

    const notification = {
      actionNameKey: `notifications.${action}`,
      seen: true,
      id,
      action,
      actionBtn,
      sender: {
        avatar: { url: images.WQ_LOGO_ROUNDED },
        firstName: $nuxt.$t('ui.notifications.workquestInfo'),
      },
      params: {
        title,
        path,
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
    commit('addLocalNotification', notification);
  },

  async removeNotification({ dispatch, commit, rootGetters }, { config, notification: { params, actionNameKey, id } }) {
    if ([`notifications.${LocalNotificationAction.TWOFA}`, `notifications.${LocalNotificationAction.KYC}`].includes(actionNameKey)) {
      this.$cookies.set(
        actionNameKey.substr('notifications.'.length, actionNameKey.length),
        rootGetters['user/getStatus2FA'] !== 0,
        { maxAge: notificationLifetime },
      );
    }
    try {
      if (!params.isLocal) await this.$axios.$delete(`${ENV.NOTIFS_URL}notifications/delete/${id}`);
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
  async markReadAllNotifications({ commit }) {
    try {
      const { ok } = await this.$axios.$put(`${ENV.NOTIFS_URL}notifications/mark-read-all`);
      commit('resetUnreadNotifsCount');
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
  async setCounterNotifications({ commit }, number) {
    commit('setCounterNotifications', number);
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

    const wqInfoSender = { avatar: { url: images.WQ_LOGO_ROUNDED }, firstName: $nuxt.$t('ui.notifications.workquestInfo') };

    switch (action) {
      // default notifications after register
      case NotificationAction.GET_REWARD:
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data.title,
          path: Path.REFERRAL,
        };
        break;
      case NotificationAction.WIKI:
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data.title,
          path: '/',
          isExternalLink: true,
          externalBase: WikiUrl,
        };
        break;
      case NotificationAction.KYC:
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data.title,
          path: Path.SUMSUB,
        };
        break;
      case NotificationAction.PROFILE_FILLED:
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data.title,
          path: Path.SETTINGS,
        };
        break;
      case NotificationAction.TWOFA:
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data.title,
          path: `${Path.SETTINGS}#2FA`,
        };
        break;

      case NotificationAction.PAID_REFERRAL:
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data.title,
          path: Path.REFERRAL,
        };
        notification.data = {
          message: $nuxt.$t(`notifications.${NotificationAction.PAID_REFERRAL}`),
        };
        break;

      case NotificationAction.NEW_QUEST_FOR_SPECIALIZATION:
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data.title,
          path: `${Path.QUESTS}/${data.id}`,
        };
        break;

      case NotificationAction.UPDATE_RATING_STATISTIC:
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: ['NoStatus', 'Verified', 'Reliable', 'TopRanked'][data.status],
          path: `${Path.PROFILE}/${user.id}`,
        };
        break;

      case NotificationAction.QUEST_STATUS_UPDATED:
        if (![QuestStatuses.WaitWorker, QuestStatuses.Done].includes(data.status)) {
          notification.sender = userRole === UserRole.EMPLOYER
            ? assignedWorker || wqInfoSender
            : user;
        } else {
          notification.sender = wqInfoSender;
        }
        notification.data = {
          ...notification.data,
          message: $nuxt.$t(`notifications.${QuestNotificationByStatus[data.status]}`),
        };
        notification.params = {
          ...notification.params,
          title,
          path: `${Path.QUESTS}/${data.id}`,
        };
        break;

      case NotificationAction.QUEST_EDITED:
        if (userRole === UserRole.WORKER) {
          notification.data = {
            ...notification.data,
            message: $nuxt.$t(
              data?.responseType === ResponsesType.Invited
                ? 'ui.notifications.invitedQuestEdited'
                : 'ui.notifications.respondedQuestEdited',
            ),
          };
        } else {
          notification.data = {
            ...notification.data,
            message: $nuxt.$t('notifications.questEdited'),
          };
        }
        break;
      // Can be changed on contract only quest price
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
        break;

      case NotificationAction.OPENED_DISPUTE:
        notification.params = {
          ...notification.params,
          title: problemDescription,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        };
        break;

      case NotificationAction.DISPUTE_DECISION_ON_CONTRACT:
        notification.actionNameKey = `notifications.${NotificationAction.DISPUTE_DECISION}${data.decision}`;
        notification.action = NotificationAction.DISPUTE_DECISION;
        notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: problemDescription,
          path: `${Path.QUESTS}/${quest?.id || id}`,
        };
        break;

      case NotificationAction.DISPUTE_DECISION_REWORK:
      case NotificationAction.DISPUTE_DECISION:
        notification.actionNameKey = `notifications.${NotificationAction.DISPUTE_DECISION}`;
        notification.action = NotificationAction.DISPUTE_DECISION;
        notification.sender = wqInfoSender;
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
        break;

      case NotificationAction.NEW_COMMENT_IN_DISCUSSION:
        if (data?.user) notification.sender = data.user;
        else notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data?.text,
          path: `${PathDAO.DISCUSSIONS}/${data.discussionId}`,
          isExternalLink: true,
          externalBase: DaoUrl,
        };
        break;

      case NotificationAction.NEW_DISCUSSION_LIKE:
        if (data?.user) notification.sender = data.user;
        else notification.sender = wqInfoSender;
        notification.params = {
          ...notification.params,
          title: data?.text,
          path: `${PathDAO.DISCUSSIONS}/${data.discussionId}`,
          isExternalLink: true,
          externalBase: DaoUrl,
        };
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

      case NotificationAction.REPORT_DECIDED:
      case NotificationAction.REPORT_REJECTED:
      case NotificationAction.REPORT_SUBMITTED:
        notification.sender = wqInfoSender;
        break;

      default:
        break;
    }

    if (notificationsQuestsActions.includes(action)) {
      notification.params = {
        ...notification.params,
        title: quest?.title || title,
        path: `${Path.QUESTS}/${quest?.id || id}`,
      };
    }

    /** Set sender if it need */
    if (quest?.user && notificationCommonFilterActions.includes(action) && !notification.sender) {
      notification.sender = quest.user;
    } else if (notificationCommonFilterAction2.includes(action) && !notification.sender) {
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
    if ([
      NotificationAction.QUEST_EDITED_ON_CONTRACT,
      NotificationAction.QUEST_STATUS_UPDATED,
      NotificationAction.OPENED_DISPUTE,
      NotificationAction.DISPUTE_DECISION,
      NotificationAction.DISPUTE_DECISION_REWORK,
    ].includes(action)
    && getters.getWaitForUpdateQuest?.id === data?.id) {
      await handleWaitForUpdateQuest();
    }

    // For update quest & quest lists
    if ([
      ...notificationsQuestsActions,
      NotificationAction.QUEST_STATUS_UPDATED,
      NotificationAction.DISPUTE_DECISION,
      NotificationAction.DISPUTE_DECISION_REWORK,
      NotificationAction.OPENED_DISPUTE,
      NotificationAction.DISPUTE_DECISION_ON_CONTRACT,
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
        const payload = JSON.parse(sessionStorage.getItem('questsListFilter'));
        await dispatch('quests/getUserQuests', {
          userId: currentUserId,
          role: userRole,
          query: payload && payload.query ? payload.query : query,
        }, { root: true });
      } else if (currentPath === `${Path.QUESTS}/${quest?.id || id}`) {
        const params = quest?.id || id;
        await dispatch('quests/getQuest', params, { root: true });
        if (userRole === UserRole.EMPLOYER && currentUserId && quest?.user?.id === currentUserId) {
          await dispatch('quests/setResponseToQuest', notification.notification, { root: true });
        }
      }
    }
    commit('addUnreadNotifsCount', 1);
  },

  async addNotification({ commit, dispatch }, notification) {
    const buffer = { notification };
    await dispatch('setCurrNotificationObject', buffer);
    await dispatch('handleUpdateDataFromWS', buffer);
    commit('addNotification', buffer);
  },
};
