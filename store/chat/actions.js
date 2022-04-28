import { ChatType, Path } from '~/utils/enums';

export default {
  async getChatsList({ commit, rootState, state: { chatsFilter } }) {
    try {
      const { result, ok } = await this.$axios.$get('/v1/user/me/chats', { params: chatsFilter });

      result.chats.forEach((chat) => {
        chat.userMembers = chat.userMembers.filter((member) => member.id !== rootState.user.userData.id);
        chat.isUnread = chat.meMember.unreadCountMessages > 0;
      });
      if (chatsFilter.offset) result.chats = rootState.chat.chats.list.concat(result.chats);

      commit('setChatsList', result);
      return ok;
    } catch (e) {
      return false;
    }
  },
  async getMessagesList({ commit, rootState: { user, chat } }, {
    config, chatId, direction, offset, isHideFooter,
  }) {
    try {
      const method = `/v1/user/me/chat/${chatId === 'starred' ? 'messages/star' : `${chatId}${Path.MESSAGES}`}`;
      const { result, ok } = await this.$axios.$get(method, config);
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
      if (isHideFooter) commit('setIsChatOpened', true);
      return result;
    } catch (e) {
      return false;
    }
  },
  async getCurrChatData({ commit, rootState, getters: { getSearchValue } }, chatId) {
    try {
      const { ok, result } = await this.$axios.$get(`/v1/user/me/chat/${chatId}`);

      const isSearchValIncluded = (value) => value.toLowerCase().includes(getSearchValue);
      const hasSearchedUser = () => result.userMembers.some(({ firstName, lastName }) => {
        if (isSearchValIncluded(firstName) || isSearchValIncluded(lastName)) return true;
        return false;
      });
      const isChatNameIncludesSearchVal = () => {
        if (result.type === ChatType.GROUP) return isSearchValIncluded(result.name);
        if (result.type === ChatType.QUEST) return isSearchValIncluded(result.questChat.quest.title);
        return false;
      };

      if (getSearchValue && !isChatNameIncludesSearchVal() && !hasSearchedUser()) return ok;

      result.isUnread = true;
      result.userMembers = result.userMembers.filter((member) => member.id !== rootState.user.userData.id);

      commit('updateChatsList', result);
      return ok;
    } catch (e) {
      return false;
    }
  },
  async handleCreateGroupChat({ commit, dispatch }, config) {
    try {
      const { payload } = await this.$wsChatActions.$post('/api/v1/user/me/chat/group/create', config);
      return payload;
    } catch (e) {
      await dispatch('main/showToast', {
        title: 'Error',
        text: e.data.msg,
      }, { root: true });
      return { ok: false };
    }
  },
  async handleSendMessage({ commit, state, dispatch }, { chatId, config }) {
    try {
      const { payload } = await this.$wsChatActions.$post(`/api/v1/chat/${chatId}/send-message`, config);

      if (payload.ok && !state.messagesFilter.canLoadToBottom) {
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
      return payload.ok;
    } catch (e) {
      await dispatch('main/showToast', {
        title: 'Error',
        text: e.data.msg,
      }, { root: true });
      return false;
    }
  },
  async uploadFile({ commit }, config) {
    try {
      const { result } = await this.$axios.$post('/v1/storage/get-upload-link', config);
      return result;
    } catch (e) {
      return false;
    }
  },
  async setMessageAsRead({ commit }, { config, chatId }) {
    try {
      const { ok } = await this.$axios.$post(`/v1/read/message/${chatId}`, config);

      commit('setChatAsRead');
      commit('notifications/changeUnreadChatsCount', { needAdd: true, count: -1 }, { root: true });
      return ok;
    } catch (e) {
      return false;
    }
  },
  async setStarForChat({ commit }, chatId) {
    try {
      const { result } = await this.$axios.$post(`/v1/user/me/chat/${chatId}/star`);
      commit('setChatStarVal', { chatId, val: true });
      return result;
    } catch (e) {
      return false;
    }
  },
  async removeStarForChat({ commit }, chatId) {
    try {
      const { result } = await this.$axios.$delete(`/v1/user/me/chat/${chatId}/star`);
      commit('setChatStarVal', { chatId, val: false });
      return result;
    } catch (e) {
      return false;
    }
  },
  async setStarForMessage({ commit }, { messageId, chatId }) {
    try {
      const { result } = await this.$axios.$post(`/v1/user/me/chat/${chatId}/message/${messageId}/star`);
      commit('setMessageStarVal', { messageId, val: true });
      return result;
    } catch (e) {
      return false;
    }
  },
  async removeStarForMessage({ commit }, { messageId }) {
    try {
      const { result } = await this.$axios.$delete(`/v1/user/me/chat/message/${messageId}/star`);
      commit('setMessageStarVal', { messageId, val: false });
      return result;
    } catch (e) {
      return false;
    }
  },
  async setImage({ commit }, { url, formData, type }) {
    try {
      const response = await this.$axios.$put(url, formData, {
        headers: {
          'Content-Type': type,
          'x-amz-acl': 'public-read',
        },
      });
      return response;
    } catch (e) {
      return false;
    }
  },
  async getUsersForGroupChat({ commit }, config) {
    try {
      const { result, ok } = await this.$axios.$get('/v1/user/me/chat/members/users-by-chats', config);

      commit('setGroupChatUsers', result);
      return ok;
    } catch (e) {
      return false;
    }
  },
  async removeMember({ commit, state }, { chatId, userId }) {
    try {
      const { ok, result } = await this.$axios.$delete(`/v1/user/me/chat/group/${chatId}/remove/${userId}`);

      if (ok) {
        const message = result;

        if (!state.messagesFilter.canLoadToBottom) {
          message.itsMe = true;

          await commit('addMessageToList', message);
        }

        await commit('removeUserFromChat', message.infoMessage.user.id);
      }

      return ok;
    } catch (e) {
      return false;
    }
  },
  async addNewMembers({ commit, state }, { chatId, config }) {
    try {
      const response = await this.$axios.$post(`/v1/user/me/chat/group/${chatId}/add`, config);

      if (response.ok) {
        response.result.forEach((message) => {
          if (!state.messagesFilter.canLoadToBottom) {
            message.itsMe = true;

            commit('addMessageToList', message);
          }

          commit('addUserToChat', message.infoMessage.user);
        });
      }

      return response.ok;
    } catch (e) {
      return false;
    }
  },
  async leaveFromChat({ commit }, chatId) {
    try {
      const { ok } = await this.$axios.$post(`/v1/user/me/chat/group/${chatId}/leave`);
      return ok;
    } catch (e) {
      return false;
    }
  },
};
