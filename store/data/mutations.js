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
};
