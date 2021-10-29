/* eslint-disable no-param-reassign */

export default {
  setChatsList(state, { chats, count }) {
    state.chats.list = chats;
    state.chats.count = count;
  },
  setMessagesList(state, { messages, count, chatId }) {
    state.messages.list = messages;
    state.messages.count = count;
    state.messages.chatId = chatId;
  },
  addMessageToList(state, message) {
    state.messages.count += 1;
    state.messages.list.push(message);
  },
  updateConnectionsStatus(state, { name, value }) {
    state.connections[name] = value;
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
};
