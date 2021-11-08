export default {
  async getChatsList({ commit, rootState }, params) {
    const { result } = await this.$axios.$get('/v1/user/me/chats', { params });

    result.chats.forEach((chat) => {
      chat.userMembers = chat.userMembers.filter((member) => member.id !== rootState.user.userData.id);
      chat.isUnread = chat.meMember.unreadCountMessages > 0;
    });
    commit('setChatsList', result);
  },
  async getMessagesList({ commit, rootState: { user, data } }, {
    config, chatId, direction, offset,
  }) {
    const method = chatId === 'starred' ? '/v1/user/me/chat/messages/star' : `/v1/user/me/chat/${chatId}/messages`;
    const { result } = await this.$axios.$get(method, config);
    const myId = user.userData.id;

    result.messages.forEach((message) => {
      message.itsMe = message.sender.id === myId;
    });

    if (direction) {
      result.messages = data.messages.list.concat(result.messages);
    } else {
      if (chatId !== 'starred')result.messages.reverse();

      result.messages = result.messages.concat(data.messages.list);
    }

    commit('setMessagesList', {
      ...result, chatId, direction, offset,
    });
    return result;
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
  async setStarForMessage({ commit }, { messageId, chatId }) {
    const { result } = await this.$axios.$post(`/v1/user/me/chat/${chatId}/message/${messageId}/star`);
    commit('setMessageStarVal', { messageId, val: true });
    return result;
  },
  async removeStarForMessage({ commit }, { messageId }) {
    const { result } = await this.$axios.$delete(`/v1/user/me/chat/message/${messageId}/star`);
    commit('setMessageStarVal', { messageId, val: false });
    return result;
  },
  async setImage({ commit }, { url, formData, type }) {
    const response = await this.$axios.$put(url, formData, {
      headers: {
        'Content-Type': type,
        'x-amz-acl': 'public-read',
      },
    });
    return response;
  },
};
