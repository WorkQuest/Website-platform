export default {
  async getChatsList({ commit }) {
    const { result } = await this.$axios.$get('/v1/user/me/chats');
    commit('');
  },
};
