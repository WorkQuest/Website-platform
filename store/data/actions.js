export default {
  async getChatsList({ commit, rootState }, params) {
    const { result } = await this.$axios.$get('/v1/user/me/chats', { params });

    result.chats.forEach((chat) => {
      chat.userMembers = chat.userMembers.filter((member) => member.id !== rootState.user.userData.id);
      chat.isUnread = chat.meMember.unreadCountMessages > 0;
    });
    commit('setChatsList', result);
  },
  async getMessagesList({ commit, rootState }, { config, chatId }) {
    const { result } = await this.$axios.$get(`/v1/user/me/chat/${chatId}/messages`, config);
    const myId = rootState.user.userData.id;

    result.messages.reverse();
    result.messages.forEach((message) => {
      message.itsMe = message.sender.id === myId;
    });

    if (config.params.offset) {
      result.messages = result.messages.concat(rootState.data.messages.list);
    }

    commit('setMessagesList', { ...result, chatId });
  },
  handleCreateChat({ commit }, { config, userId }) {
    this.$axios.$post(`/v1/user/${userId}/send-message`, config);
  },
  async handleSendMessage({ commit }, { chatId, config }) {
    const response = await this.$wsChat.$post(`/api/v1/chat/${chatId}/send-message`, config);
    return response;
  },
  async uploadFile({ commit }, config) {
    const { result } = await this.$axios.$post('/v1/storage/get-upload-link', config);
    return result;
  },
  async setMessageAsRead({ commit }, { config, chatId }) {
    const { result } = await this.$axios.$post(`/v1/read/message/${chatId}`, config);
    return result;
  },
  async setStarForChat({ commit }, chatId) {
    const { result } = await this.$axios.$post(`/v1/user/me/chat/${chatId}/star`);
    commit('setChatStarVal', { chatId, val: true });
    return result;
  },
  async removeStarForChat({ commit }, chatId) {
    const { result } = await this.$axios.$delete(`/v1/user/me/chat/${chatId}/star`);
    commit('setChatStarVal', { chatId, val: false });
    return result;
  },
  async setStarForMessage({ commit }, messageId) {
    const { result } = await this.$axios.$post(`/v1/user/me/chat/message/${messageId}/star`);
    commit('setMessageStarVal', { messageId, val: true });
    return result;
  },
  async removeStarForMessage({ commit }, messageId) {
    const { result } = await this.$axios.$delete(`/v1/user/me/chat/message/${messageId}/star`);
    commit('setMessageStarVal', { messageId, val: false });
    return result;
  },
};
