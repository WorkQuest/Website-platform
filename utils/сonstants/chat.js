export const UserRoles = Object.freeze({
  USER: 'User',
  ADMIN: 'Admin',
});

export const FileTypes = Object.freeze({
  IMAGE: 'image',
  VIDEO: 'video',
  APPLICATION: 'application',
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

export const GetInfoMessageText = (action, itsMe) => {
  let text = 'chat.systemMessages.';
  switch (action) {
    case MessageAction.EMPLOYER_INVITE_ON_QUEST:
      text += itsMe ? 'youInvitedToTheQuest' : 'employerInvitedWorkerToQuest';
      break;
    case MessageAction.WORKER_RESPONSE_ON_QUEST:
      text += itsMe ? 'youHaveRespondedToTheQuest' : 'respondedToTheQuest';
      break;
    case MessageAction.EMPLOYER_REJECT_RESPONSE_ON_QUEST:
      text += itsMe ? 'youRejectTheResponseOnQuest' : 'rejectedTheResponseToTheQuest';
      break;
    case MessageAction.WORKER_REJECT_INVITE_ON_QUEST:
      text += itsMe ? 'youRejectedTheInviteToTheQuest' : 'rejectedTheInviteToTheQuest';
      break;
    case MessageAction.WORKER_ACCEPT_INVITE_ON_QUEST:
      text += itsMe ? 'youAcceptedTheInviteToTheQuest' : 'acceptedTheInviteToTheQuest';
      break;
    case MessageAction.GROUP_CHAT_CREATE:
      text += itsMe ? 'youCreatedAGroupChat' : 'createdAGroupChat';
      break;
    case MessageAction.GROUP_CHAT_DELETE_USER:
      text += itsMe ? 'youHaveRemovedFromChat' : 'removedFromChat';
      break;
    case MessageAction.GROUP_CHAT_ADD_USERS:
      text += itsMe ? 'youAddedToChat' : 'addedToChat';
      break;
    case MessageAction.GROUP_CHAT_LEAVE_USER:
      text += itsMe ? 'youLeftTheChat' : 'leftTheChat';
      break;
    case MessageAction.QUEST_CHAT_ADD_DISPUTE_ADMIN:
      text += 'adminAddedToChat';
      break;
    case MessageAction.QUEST_CHAT_LEAVE_DISPUTE_ADMIN:
      text += 'adminLeaveFromChat';
      break;
    case MessageAction.GROUP_CHAT_RESTORED_USER:
      text += 'restoredToChat';
      break;
    default:
      text = '';
      break;
  }
  return text;
};
