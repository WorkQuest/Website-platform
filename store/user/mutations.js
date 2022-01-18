/* eslint-disable no-param-reassign */

export default {
  setTwoFACode(state, data) {
    state.twoFACode = data;
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
    this.$cookies.set('access', payload.access, { path: '/' });
    this.$cookies.set('refresh', payload.refresh, { path: '/' });
    if (payload.userStatus) { this.$cookies.set('userStatus', payload.userStatus, { path: '/' }); }
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
  setImage(state, data) {
    state.userData.avatar.url = data;
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
};
