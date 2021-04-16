export default {
  async signIn({ commit, dispatch }, payload) {
    const response = await this.$axios.$post('/v1/auth/login', payload);
    commit('setNewTokens', response.result);
    await dispatch('getUserData');
    return response;
  },
  async signUp({ commit }, payload) {
    const response = await this.$axios.$post('/v1/auth/register', payload);
    return response;
  },
  async confirm({ commit }, payload) {
    const response = await this.$axios.$post('/v1/auth/confirm-email', payload);
    return response;
  },
  async getUserData({ commit }) {
    const response = await this.$axios.$get('/v1/profile/me');
    commit('setUserData', response.result);
    return response;
  },
  async logout({ commit }) {
    commit('logOut');
  },
};
