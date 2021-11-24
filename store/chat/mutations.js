/* eslint-disable no-param-reassign */

export default {
  setChatsList(state, { chats, count }) {
    state.chats.list = chats;
    state.chats.count = count;
  },
  setMessagesList(state, {
    messages, count, chat, direction, offset, canLoadToBottom, canLoadToTop,
  }) {
    state.messagesFilter[direction ? 'bottomOffset' : 'topOffset'] = offset;

    state.messagesFilter.canLoadToBottom = canLoadToBottom;
    state.messagesFilter.canLoadToTop = canLoadToTop;

    state.messages.list = messages;
    state.messages.count = count;
    state.messages.chat = chat;
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
    const { members, userMembers } = state.messages.chat;

    state.messages.chat.members = members.filter((member) => member.id !== userId);
    state.messages.chat.userMembers = userMembers.filter((member) => member.id !== userId);
  },
  addUserToChat(state, user) {
    state.messages.chat.members.push(user);
    state.messages.chat.userMembers.push(user);
  },
};
