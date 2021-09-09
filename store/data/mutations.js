/* eslint-disable no-param-reassign */

export default {
  setChatsList(state, { chats, count }) {
    state.chats.list = chats;
    state.chats.count = count;
  },
  setMessagesList(state, { messages, count }) {
    state.messages.list = messages;
    state.messages.count = count;
  },
};
