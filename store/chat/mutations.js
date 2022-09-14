/* eslint-disable no-param-reassign */

export default {
  changeUnreadChatsCount(state, { count, needAdd }) {
    state.unreadChatsCount = needAdd ? state.unreadChatsCount + count : count;
  },
  setChatsList(state, { chats, count }) {
    state.chats.list = chats;
    state.chats.count = count;
  },
  removeChatFromListById(state, chatId) {
    const chatIndex = state.chats.list.findIndex((item) => item.id === chatId);
    if (chatIndex >= 0) {
      const { list } = state.chats;
      const newList = list.filter((item) => item.id !== chatId);
      state.chats = {
        list: newList,
        count: state.chats.count - 1,
      };
    }
  },
  setMessagesList(state, {
    messages, count, chat, direction, offset, canLoadToBottom, canLoadToTop,
  }) {
    state.messagesFilter[direction ? 'bottomOffset' : 'topOffset'] = offset;

    state.messagesFilter.canLoadToBottom = canLoadToBottom;
    state.messagesFilter.canLoadToTop = canLoadToTop;

    state.messages.list = messages;
    state.messages.count = count;
    state.currChat = chat;
  },
  clearMessagesFilter(state) {
    state.messagesFilter = {
      topOffset: 0,
      bottomOffset: 0,
      canLoadToBottom: false,
      canLoadToTop: false,
    };
  },
  addMessageToList(state, message) {
    state.messages.count += 1;
    state.messages.list.push(message);
  },
  updateChatsList(state, chat) {
    const chatIndex = state.chats.list.findIndex((chatList) => chatList.id === chat.id);

    if (chatIndex >= 0) {
      state.chats.list.splice(chatIndex, 1);
      state.chats.count -= 1;
    }

    this.commit('chat/addChatToList', chat);
  },
  setChatAsRead(state) {
    state.currChat.isUnread = false;
  },
  setChatAsUnread(state) {
    state.currChat.isUnread = true;
  },
  addChatToList(state, chat) {
    state.chats.count += 1;
    state.chats.list.unshift(chat);
  },
  setChatStarVal(state, { chatId, val }) {
    state.chats.list.some((chat) => {
      if (chat.id !== chatId) return false;
      chat.star = val;
      return true;
    });
  },
  setMessageStarVal(state, { messageId, val }) {
    state.messages.list.some((message) => {
      if (message.id !== messageId) return false;
      message.star = val;
      return true;
    });
  },
  setGroupChatUsers(state, { users, count }) {
    state.groupChatUsers.list = users;
    state.groupChatUsers.count = count;
  },
  removeUserFromChat(state, userId) {
    const { members, userMembers } = state.currChat;
    state.currChat.members = members.filter((member) => member.userId !== userId);
    state.currChat.userMembers = userMembers.filter((member) => member.userId !== userId);
  },
  addUserToChat(state, user) {
    state.currChat.members.push(user);
    state.currChat.userMembers.push(user);
  },
  setIsChatOpened(state, val) {
    state.isChatOpened = val;
  },
  changeChatsFilterValue(state, changes) {
    changes.forEach(({ key, val }) => {
      state.chatsFilter[key] = val;
    });
  },
};
