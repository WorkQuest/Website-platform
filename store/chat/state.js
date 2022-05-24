export default () => ({
  unreadChatsCount: 0,
  isChatOpened: false,
  chats: {
    list: [],
    count: 0,
  },
  messages: {
    list: [],
    count: 0,
  },
  currChat: null,
  groupChatUsers: {
    count: 0,
    list: [],
  },
  messagesFilter: {
    topOffset: 0,
    bottomOffset: 0,
    canLoadToBottom: false,
    canLoadToTop: false,
  },
  chatsFilter: {
    limit: 15,
    offset: 0,
    starred: false,
    q: undefined,
  },
});
