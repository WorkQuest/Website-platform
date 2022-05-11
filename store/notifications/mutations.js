export default {
  changeUnreadChatsCount(state, { count, needAdd }) {
    state.unreadChatsCount = needAdd ? state.unreadChatsCount + count : count;
  },
  setReducedNotifications(state, notifications) {
    state.reducedNotifications = notifications;
  },
  setNotifications(state, { notifications, count, needPush }) {
    // TODO: Переписать!
    state.notifications.list = needPush ? state.notifications.list.concat(notifications) : notifications;
    state.notifications.count = count;
  },
  removeNotification(state, notificationId) {
    state.notifications.list = state.notifications.list.filter(({ id }) => notificationId !== id);
  },
  setUnreadNotifsCount(state, count) {
    state.unreadNotifsCount += count;
  },
  setNotificationsAsRead(state, ids) {
    state.notifications.list.forEach((notif) => {
      if (ids.indexOf(notif.id) >= 0) notif.seen = true;
      return notif;
    });
    this.commit('notifications/setUnreadNotifsCount', 0 - ids.length);
  },
  addNotification(state, notification) {
    state.notifications.list.push(notification);
    state.reducedNotifications.unshift(notification);
    state.reducedNotifications.length = state.reducedNotifications.length === 1 ? 1 : 2;
    state.notifications.count += 1;
    this.commit('notifications/setUnreadNotifsCount', 1);
  },
};
