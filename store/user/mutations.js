import { accessLifetime, refreshLifetime } from '~/utils/сonstants/cookiesLifetime';
import { Path } from '~/utils/enums';

export default {
  setTwoFAPassed(state, value) {
    state.twoFAPassed = value;
  },
  setLang(state, data) {
    state.currentLang = data;
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
  setCaseImage(state, data) {
    state.medias = data;
  },
  setCaseData(state, data) {
    state.portfolio = data;
  },
  setTokens(state, payload) {
    state.tokens.access = payload.access;
    state.tokens.refresh = payload.refresh;

    this.$cookies.set('access', payload.access, { path: Path.ROOT, maxAge: accessLifetime });
    this.$cookies.set('refresh', payload.refresh, { path: Path.ROOT, maxAge: refreshLifetime });
    if (payload.userStatus) {
      this.$cookies.set('userStatus', payload.userStatus, { path: Path.ROOT, maxAge: accessLifetime });
    }
    this.$cookies.set('socialNetwork', payload.social, { path: Path.ROOT, maxAge: accessLifetime });
  },
  setUserData(state, data) {
    state.userData = { ...state.userData, ...data };
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
    this.$cookies.remove('notificationPage');

    const redirectTo = sessionStorage.getItem('redirectTo');
    sessionStorage.clear();
    if (redirectTo) sessionStorage.setItem('redirectTo', redirectTo);

    state.userData = {};
    state.tokens = { access: null, refresh: null };
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
    this.commit('chat/changeUnreadChatsCount', { count: data.chatsStatistic?.unreadCountChats || 0, needAdd: false }, { root: true });
  },
};
