export default {
  async getChatsList({ commit, rootState }, params) {
    try {
      const { result } = await this.$axios.$get('/v1/user/me/chats', { params });

      result.chats.forEach((chat) => {
        chat.userMembers = chat.userMembers.filter((member) => member.id !== rootState.user.userData.id);
        chat.isUnread = chat.meMember.unreadCountMessages > 0;
      });
      if (params.offset) result.chats = rootState.chat.chats.list.concat(result.chats);

      commit('setChatsList', result);
    } catch (e) {
      console.log(e);
    }
  },
  async getMessagesList({ commit, rootState: { user, chat } }, {
    config, chatId, direction, offset,
  }) {
    try {
      const method = chatId === 'starred' ? '/v1/user/me/chat/messages/star' : `/v1/user/me/chat/${chatId}/messages`;
      const { result } = await this.$axios.$get(method, config);
      const myId = user.userData.id;

      result.messages.forEach((message) => {
        message.itsMe = message.sender.id === myId;

        if (message.medias.length) {
          message.medias.forEach((file) => {
            // eslint-disable-next-line prefer-destructuring
            file.type = file.contentType.split('/')[0];
          });
        }
      });

      if (result.chat) {
        result.chat.members = result.chat.userMembers.filter((member) => member.id !== myId);
        result.chat.isUnread = result.chat.meMember.unreadCountMessages > 0;
      }

      if (direction) {
        result.messages = chat.messages.list.concat(result.messages);
      } else {
        if (chatId !== 'starred') result.messages.reverse();

        result.messages = result.messages.concat(chat.messages.list);
      }
      const { messages, count } = result;

      const canLoadToBottom = chatId !== 'starred' && messages[messages.length - 1]?.number < result.count;
      const canLoadToTop = chatId === 'starred' ? messages.length < count : messages[0]?.number > 1;

      commit('setMessagesList', {
        ...result, direction, offset: offset + 25, canLoadToBottom, canLoadToTop,
      });
      commit('setIsChatOpened', true);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getCurrChatData({ commit }, chatId) {
    try {
      return await this.$axios.$get(`/v1/user/me/chat/${chatId}`);
    } catch (e) {
      console.log(e);
      return { ok: false };
    }
  },
  async handleCreateGroupChat({ commit }, config) {
    try {
      const response = await this.$wsChat.$post('/api/v1/user/me/chat/group/create', config);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async handleSendMessage({ commit, rootState: { chat: { messages, messagesFilter } } }, { chatId, config }) {
    const { payload } = await this.$wsChat.$post(`/api/v1/chat/${chatId}/send-message`, config);

    if (payload.ok && !messagesFilter.canLoadToBottom) {
      const message = payload.result;
      message.itsMe = true;

      if (message.medias.length) {
        message.medias.forEach((file) => {
          // eslint-disable-next-line prefer-destructuring
          file.type = file.contentType.split('/')[0];
        });
      }

      await commit('addMessageToList', message);
    }
    return payload;
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
  async getUsersForGroupChat({ commit }, config) {
    const { result } = await this.$axios.$get('/v1/user/me/chat/members/users-by-chats', config);

    commit('setGroupChatUsers', result);
  },
  async removeMember({ commit, rootState: { chat: { messagesFilter } } }, { chatId, userId }) {
    const response = await this.$axios.$delete(`/v1/user/me/chat/group/${chatId}/remove/${userId}`);

    if (response.ok) {
      const message = response.result;

      if (!messagesFilter.canLoadToBottom) {
        message.itsMe = true;

        await commit('addMessageToList', message);
      }

      await commit('removeUserFromChat', message.infoMessage.user.id);
    }

    return response;
  },
  async addNewMembers({ commit, rootState: { chat: { messagesFilter } } }, { chatId, config }) {
    try {
      const response = await this.$axios.$post(`/v1/user/me/chat/group/${chatId}/add`, config);

      if (response.ok) {
        response.result.forEach((message) => {
          if (!messagesFilter.canLoadToBottom) {
            message.itsMe = true;

            commit('addMessageToList', message);
          }

          commit('addUserToChat', message.infoMessage.user);
        });
      }

      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async leaveFromChat({ commit }, chatId) {
    const response = await this.$axios.$post(`/v1/user/me/chat/group/${chatId}/leave`);
    return response;
  },
};
