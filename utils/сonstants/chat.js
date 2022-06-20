export const UserRoles = Object.freeze({
  USER: 'User',
  ADMIN: 'Admin',
});

export const FileTypes = Object.freeze({
  IMAGE: 'image',
  VIDEO: 'video',
});

export const QuestChatStatus = Object.freeze({
  Active: 0,
  Closed: -1,
});

export const MessageType = Object.freeze({
  INFO: 'Info',
  MESSAGE: 'Message',
});

export const ChatType = Object.freeze({
  GROUP: 'Group',
  QUEST: 'Quest',
  PRIVATE: 'Private',
});

export const MessageAction = Object.freeze({
  GROUP_CHAT_CREATE: 'GroupChatCreate',
  NEW_MESSAGE: 'NewMessage',
  MESSAGE_READ_BY_RECIPIENT: 'MessageReadByRecipient',
  GROUP_CHAT_ADD_USERS: 'GroupChatAddMember',
  GROUP_CHAT_LEAVE_USER: 'GroupChatLeaveMember',
  GROUP_CHAT_DELETE_USER: 'GroupChatDeleteMember',
  GROUP_CHAT_RESTORED_USER: 'GroupChatMemberRestored',
  EMPLOYER_INVITE_ON_QUEST: 'EmployerInviteOnQuest',
  WORKER_RESPONSE_ON_QUEST: 'WorkerResponseOnQuest',
  EMPLOYER_REJECT_RESPONSE_ON_QUEST: 'EmployerRejectResponseOnQuest',
  WORKER_REJECT_INVITE_ON_QUEST: 'WorkerRejectInviteOnQuest',
  WORKER_ACCEPT_INVITE_ON_QUEST: 'WorkerAcceptInviteOnQuest',
  QUEST_CHAT_ADD_DISPUTE_ADMIN: 'QuestChatAddDisputeAdmin',
  QUEST_CHAT_LEAVE_DISPUTE_ADMIN: 'QuestChatLeaveDisputeAdmin',
});
