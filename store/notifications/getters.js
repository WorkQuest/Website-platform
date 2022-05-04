export default {
  getUnreadChatsCount: (state) => state.unreadChatsCount,
  getUnreadNotifsCount: (state) => state.unreadNotifsCount,
  getNotificationsList: (state) => state.notifications.list,
  getNotificationsCount: (state) => state.notifications.count,
  getReducedNotifications: (state) => state.reducedNotifications,
  getLocalNotifications: (state) => state.localNotifications,
};
