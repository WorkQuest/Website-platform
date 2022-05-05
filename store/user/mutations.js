/* eslint-disable no-param-reassign */

export default {
  setLang(state, data) {
    state.currentLang = data;
  },
  setEducations(state, data) {
    state.userData.additionalInfo.educations = data;
  },
  setWorkExperiences(state, data) {
    state.userData.additionalInfo.workExperiences = data;
  },
  setVerificationCode(state, data) {
    state.verificationCode = data;
  },
  setTwoFACode(state, data) {
    state.twoFACode = data;
  },
  setCurrentReviewMarkOnQuest(state, data) {
    state.currentReviewMarkOnQuest = data;
  },
  setUserPortfolioCases(state, data) {
    state.portfolios = data;
  },
  setUploaderImage(state, data) {
    state.medias = data;
  },
  setUploaderData(state, data) {
    state.portfolio = data;
  },
  setCaseImage(state, data) {
    state.medias = data;
  },
  setCaseData(state, data) {
    state.portfolio = data;
  },
  setTokens(state, payload) {
    state.tokens.access = payload.access;
    state.tokens.refresh = payload.refresh;
    if (state.isRememberMeChecked || state.tokens.refresh) {
      const expireRefreshTokenInSeconds = JSON.parse(atob(payload.refresh
        .split('.')[1])).exp - new Date().getTime() / 1000 || 86400 * 30;
      this.$cookies.set('access', payload.access, { path: '/', maxAge: expireRefreshTokenInSeconds });
      this.$cookies.set('refresh', payload.refresh, { path: '/', maxAge: expireRefreshTokenInSeconds });
      if (payload.userStatus) {
        this.$cookies.set('userStatus', payload.userStatus, { path: '/', maxAge: expireRefreshTokenInSeconds });
      }
      state.isRememberMeChecked = false;
    } else {
      this.$cookies.set('access', payload.access, { path: '/' });
      if (payload.userStatus) {
        this.$cookies.set('userStatus', payload.userStatus, { path: '/' });
      }
    }
    this.$cookies.set('socialNetwork', payload.social, { path: '/' });
  },
  setUserData(state, data) {
    state.userData = data;
  },
  setAnotherUserData(state, data) {
    state.anotherUserData = data;
  },
  setUserRole(state, data) {
    state.userRole = data;
  },
  logOut(state) {
    this.$cookies.remove('access');
    this.$cookies.remove('refresh');
    this.$cookies.remove('userStatus');
    this.$cookies.remove('role');
    this.$cookies.remove('userLogin');
    this.$cookies.remove('socialNetwork');
    this.$cookies.remove('questDraft');
    sessionStorage.clear();
    state.userData = {};
    state.tokens = { access: '', refresh: '' };
  },
  setCurrentUserPosition(state, data) {
    state.currentUserPosition = data;
  },
  setUserPassword(state, data) {
    state.userDataPassword = data;
  },
  setImageType(state, data) {
    state.imageLink = data;
  },
  setSendCode(state, data) {
    state.userSendCode = data;
  },
  setUserReviews(state, data) {
    state.userReviews = data;
  },
  setEnable2FA(state, data) {
    state.userEnable2FA = data;
  },
  setDisable2FA(state, data) {
    state.userDisable2FA = data;
  },
  setTwoFAStatus(state, data) {
    state.userData.totpIsActive = data;
  },
  setStatisticData(state, data) {
    state.statisticData = data;
    this.commit('user/changeUnreadChatsCount', { count: data.chatsStatistic?.unreadCountChats || 0, needAdd: false });
  },
  changeUnreadChatsCount(state, { count, needAdd }) {
    state.unreadChatsCount = needAdd ? state.unreadChatsCount + count : count;
  },
  setReducedNotifications(state, notifications) {
    state.reducedNotifications = notifications;
  },
  setNotifications(state, { result: { notifications, count }, needPush }) {
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
    this.commit('user/setUnreadNotifsCount', 0 - ids.length);
  },
  addNotification(state, notification) {
    state.notifications.list.push(notification);
    state.reducedNotifications.unshift(notification);
    state.reducedNotifications.length = state.reducedNotifications.length === 1 ? 1 : 2;
    state.notifications.count += 1;
    this.commit('user/setUnreadNotifsCount', 1);
  },
  setRememberMe(state, payload) {
    state.isRememberMeChecked = payload;
  },
};
