/* eslint-disable no-param-reassign */

export default {
  setOldTokens(state, { access, refresh, status }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;
    state.status = status;
  },
  setNewTokens(state, { access, refresh, status }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;
    state.status = status;
    this.$cookies.set('access', access, { path: '/' });
    this.$cookies.set('refresh', refresh, { path: '/' });
    this.$cookies.set('status', status, { path: '/' });
  },
  logOut(state) {
    this.$cookies.remove('access');
    this.$cookies.remove('refresh');
    this.$cookies.remove('status');
    state.userData = {};
  },
  setUserData(state, value) {
    state.userData = value;
  },
};
