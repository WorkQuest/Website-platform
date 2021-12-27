export default {
  getMessages: (state) => state.messages,
  getCurrChatInfo: (state) => state.messages.chat || null,
  getChats: (state) => state.chats,
  getCurrChatId: (state) => (state.messages.chat?.id || ''),
  getLastMessageId: (state) => (!state.messagesFilter.canLoadToBottom && state.messages.list.length ? state.messages.list[state.messages.list.length - 1].id : null),
  getMessagesFilter: (state) => state.messagesFilter,
  getGroupChatUsers: (state) => state.groupChatUsers,
  getChatMembers: (state) => (state.messages.chat?.members || []),
  isChatOpened: (state) => state.isChatOpened,
  hasUnreadMessage: (state) => state.chats.list.some(((chat) => chat.isUnread)),
};
