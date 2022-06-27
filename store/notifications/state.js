export default () => ({
  unreadNotifsCount: 0,
  notifications: {
    list: [],
    count: 0,
  },
  reducedNotifications: [],
  waitForUpdateQuest: null,
  counterNotificationsInLastPage: 0,
  limitInNotificationPage: 10,
  localNotificationsInLastPage: [],
});
