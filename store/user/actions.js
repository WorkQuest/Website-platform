export default {
  async signIn({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/login', payload);
      commit('setNewTokens', response.result);
      return response;
    } catch (err) {
      return err;
    }
  },
  async signUp({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/register', payload);
      console.log(response);
      return response;
    } catch (err) {
      return err;
    }
  },
  async logOut({ commit }) {
    commit('logOut');
  },
  async confirm({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/confirm-email', payload);
      console.log(response);
      return response;
    } catch (err) {
      return err;
    }
  },
  async getUserData({ commit }) {
    const response = await this.$axios.$get('/v1/profile/me');
    console.log(response);
    commit('setUserData', response.result);
    return response.result;
  },
};
