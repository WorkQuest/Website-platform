export default {
  async getChatsList({ commit, rootState }, params) {
    const { result } = await this.$axios.$get('/v1/user/me/chats', { params });

    result.chats.forEach((chat) => {
      const indexOfMe = chat.members.indexOf((member) => member.id === rootState.user.userData.id);
      chat.members.splice(indexOfMe, 1);
    });
    commit('setChatsList', result);
  },
  async getMessagesList({ commit, rootState }, { params, chatId }) {
    const { result } = await this.$axios.$get(`/v1/user/me/chat/${chatId}/messages`, { params });
    const myId = rootState.user.userData.id;

    result.messages.reverse();
    result.messages.forEach((message) => {
      message.itsMe = message.sender.id === myId;
    });

    if (params.offset) {
      result.messages = result.messages.concat(rootState.data.messages.list);
    }

    commit('setMessagesList', { ...result, chatId });
  },
  handleCreateChat({ commit }, { config, userId }) {
    this.$axios.$post(`/v1/user/${userId}/send-message`, config);
  },
  async handleSendMessage({ commit }, { chatId, config }) {
    const response = await this.$axios.$post(`/v1/chat/${chatId}/send-message`, config);
    return response;
  },
  async uploadFile({ commit }, config) {
    const { result } = await this.$axios.$post('/v1/storage/get-upload-link', config);
    return result;
  },
};
