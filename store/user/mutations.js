/* eslint-disable no-param-reassign */

export default {
  setOldTokens(state, { access, refresh }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;
  },
  setNewTokens(state, { access, refresh }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;
    this.$cookies.set('access', access, { path: '/' });
    this.$cookies.set('refresh', refresh, { path: '/' });
  },
  logOut(state) {
    this.$cookies.remove('access');
    this.$cookies.remove('refresh');
    this.$cookies.remove('status');
    state.userData = {};
  },
  setUserData(state, value) {
    state.userData = value;
    state.status = value.status;
    this.$cookies.set('status', value.status, { path: '/' });
  },
};
