export default {
  resetUnreadNotifsCount(state) {
    state.unreadNotifsCount = 0;
  },
  setUnreadNotifsCount(state, count) {
    state.unreadNotifsCount += count;
  },
  setReducedNotifications(state, notifications) {
    state.reducedNotifications = notifications;
  },
  setNotifications(state, { notifications, count, needPush }) {
    state.notifications.list = needPush ? state.notifications.list.concat(notifications) : notifications;
    state.notifications.count = count;
    state.counterNotificationsInLastPage = state.notifications.list.length;
  },
  setCounterNotifications(state, number) {
    state.notifications.count = number;
  },
  removeNotification(state, notificationId) {
    state.notifications.list = state.notifications.list.filter(({ id }) => notificationId !== id);
  },
  setNotificationsAsRead(state, ids) {
    state.notifications.list.forEach((notif) => {
      if (ids.indexOf(notif.id) >= 0) notif.seen = true;
    });
    this.commit('notifications/setUnreadNotifsCount', 0 - ids.length);
  },
  addNotification(state, notification) {
    state.notifications.list.unshift(notification);
    state.reducedNotifications.unshift(notification);
    state.reducedNotifications.length = state.reducedNotifications.length === 1 ? 1 : 2;
    state.notifications.count += 1;
    this.commit('notifications/setUnreadNotifsCount', 1);
  },
  addLocalNotification(state, notification) {
    if (state.notifications.list.length < state.limitInNotificationPage
      && state.counterNotificationsInLastPage < state.limitInNotificationPage) {
      state.notifications.list.push(notification);
      state.counterNotificationsInLastPage += 1;
    }
    if (state.notifications.count < 2) state.reducedNotifications.unshift(notification);
    state.reducedNotifications.length = state.reducedNotifications.length === 1 ? 1 : 2;
    this.commit('notifications/setUnreadNotifsCount', 1);
  },
  setWaitForUpdateQuest(state, data) {
    state.waitForUpdateQuest = data;
  },
};
