// eslint-disable-next-line import/prefer-default-export
export const ChainsId = {
  ETH_MAIN: '0x1',
  ETH_TEST: '0x4',
  BSC_MAIN: '0x38',
  BSC_TEST: '0x61',
  MATIC_MAIN: '0x13881',
  MUMBAI_TEST: '0x89',
  WUSD_TEST: '0x1346618',
};

export const QuestModeReview = {
  QUEST_LIST: 'QuestList',
  QUEST_SINGLE: 'QuestSingle',
};

export const ChainsIdByChainNumber = {
  1: '0x1',
  4: '0x4',
  56: '0x38',
  97: '0x61',
  20211224: '0x1346618',
};

export const NativeTokenSymbolByChainId = {
  [+ChainsId.ETH_MAIN]: 'ETH',
  [+ChainsId.ETH_TEST]: 'ETH',
  [+ChainsId.BSC_MAIN]: 'BNB',
  [+ChainsId.BSC_TEST]: 'BNB',
};

export const Chains = {
  ETHEREUM: 'ETH',
  BINANCE: 'BSC',
  BNB: 'BNB', // Same as bsc for bridge
  WUSD: 'WUSD',
};

export const StakingTypes = {
  WQT: 'WQT',
  WUSD: 'WUSD',
  MINING: 'MINING',
  CROSS_CHAIN: 'CROSS_CHAIN',
};

export const QuestStatuses = {
  Rejected: -1,
  Created: 0,
  Active: 1,
  Closed: 2,
  Dispute: 3,
  WaitWorker: 4,
  WaitConfirm: 5,
  Done: 6,
};
export const SumSubStatuses = { NOT_VERIFIED: 0, VERIFIED: 1 };
export const InfoModeEmployer = {
  Rejected: -1,
  Created: 0,
  Active: 1,
  Closed: 2,
  Dispute: 3,
  WaitWorker: 4,
  WaitConfirm: 5,
  Done: 6,
};
export const InfoModeWorker = {
  Created: 0,
  ADChat: 1,
  Active: 2,
  Rejected: 3,
  WaitWorker: 4,
  WaitConfirm: 5,
  Dispute: 7,
  Closed: 8,
  Done: 9,
  Responded: 10,
  Invited: 11,
};
export const DisputeStatues = {
  PENDING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};
export const questPriority = {
  Low: 1,
  Normal: 2,
  Urgent: 3,
};
export const ResponsesType = {
  Responded: 0,
  Invited: 1,
};
export const ResponseStatus = {
  rejected: -1,
  awaiting: 0,
  accepted: 1,
};
export const KeyCodes = {
  Escape: 27,
  ArrowLeft: 37,
  ArrowRight: 39,
};

// Filters
export const WorkplaceFilter = ['all', 'distant', 'office', 'both'];
export const WorkplaceIndex = ['distant', 'office', 'both'];
export const TypeOfJobFilter = ['fullTime', 'partTime', 'fixedTerm'];
export const PriorityFilter = [
  { key: 'all', value: 0 },
  { key: 'urgent', value: 3 },
  { key: 'shortTerm', value: 2 },
  { key: 'fixedDelivery', value: 1 },
];

export const Ratings = Object.freeze({
  TOP_RANKED: 'topRanked',
  RELIABLE: 'reliable',
  VERIFIED: 'verified',
  NO_STATUS: 'noStatus',
});
export const UserRating = Object.freeze({
  0: Ratings.TOP_RANKED,
  1: Ratings.RELIABLE,
  2: Ratings.VERIFIED,
  3: Ratings.NO_STATUS,
});
export const RatingFilter = [
  { key: 'all', value: 3 },
  { key: 'topRanked', value: 0 },
  { key: 'reliable', value: 1 },
  { key: 'verified', value: 2 },
];

export const MessageAction = {
  GROUP_CHAT_CREATE: 'groupChatCreate',
  NEW_MESSAGE: 'newMessage',
  MESSAGE_READ_BY_RECIPIENT: 'messageReadByRecipient',
  GROUP_CHAT_ADD_USERS: 'groupChatAddUsers',
  GROUP_CHAT_LEAVE_USER: 'groupChatLeaveUser',
  GROUP_CHAT_DELETE_USER: 'groupChatDeleteUser',
  EMPLOYER_INVITE_ON_QUEST: 'employerInviteOnQuest',
  WORKER_RESPONSE_ON_QUEST: 'workerResponseOnQuest',
  EMPLOYER_REJECT_RESPONSE_ON_QUEST: 'employerRejectResponseOnQuest',
  WORKER_REJECT_INVITE_ON_QUEST: 'workerRejectInviteOnQuest',
  WORKER_ACCEPT_INVITE_ON_QUEST: 'workerAcceptInviteOnQuest',
};

export const NotificationAction = {
  QUEST_STARTED: 'questStarted',
  WORKER_REJECTED_QUEST: 'workerRejectedQuest',
  WORKER_ACCEPTED_QUEST: 'workerAcceptedQuest',
  WORKER_COMPLETED_QUEST: 'workerCompletedQuest',
  EMPLOYER_ACCEPTED_COMPLETED_QUEST: 'employerAcceptedCompletedQuest',
  EMPLOYER_REJECTED_COMPLETED_QUEST: 'employerRejectedCompletedQuest',
  WORKER_RESPONDED_TO_QUEST: 'workerRespondedToQuest',
  EMPLOYER_INVITED_WORKER_TO_QUEST: 'employerInvitedWorkerToQuest',
  WORKER_ACCEPTED_INVITATION_TO_QUEST: 'workerAcceptedInvitationToQuest',
  WORKER_REJECTED_INVITATION_TO_QUEST: 'workerRejectedInvitationToQuest',
  EMPLOYER_REJECTED_WORKERS_RESPONSE: 'employerRejectedWorkersResponse',
  WAIT_WORKER: 'waitWorker',

  USER_LEFT_REVIEW_ABOUT_QUEST: 'userLeftReviewAboutQuest',

  OPEN_DISPUTE: 'openDispute',
};

export const ChatType = {
  GROUP: 'group',
  QUEST: 'quest',
};

export const MessageType = {
  INFO: 'info',
  MESSAGE: 'message',
};

export const QuestChatStatus = {
  Active: 0,
  Closed: 1,
};

export const UserRole = {
  WORKER: 'worker',
  EMPLOYER: 'employer',
};

export const Path = {
  ROOT: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  MY_QUESTS: '/my',
  WALLET: '/wallet',
  PENSION: '/pension',
  REFERRAL: '/referral',
  INSURING: '/insuring',
  SAVINGS: '/savings',
  CREDITING: '/crediting',
  MINING: '/mining',
  CROSSCHAIN: '/crosschain',
  SETTINGS: '/settings',
  DISPUTES: '/disputes',
  WORKERS: '/workers',
  CREATE_QUEST: '/create-quest',
  STAKING: '/staking',
  PROFILE: '/profile',
  ROLE: '/role',
  QUESTS: '/quests',
  EDIT_QUEST: '/edit-quest',
  COLLATERAL: '/collateral',
  WIKI: '/wiki',
};

// WALLET
export const WalletState = Object.freeze({
  Default: 1,
  SaveMnemonic: 2,
  ConfirmMnemonic: 3,
  ImportOrCreate: 4,
  ImportMnemonic: 5,
});

export const UserStatuses = Object.freeze({
  Unconfirmed: 0,
  Confirmed: 1,
  NeedSetRole: 2,
});

export const TokenSymbols = Object.freeze({
  WQT: 'WQT',
  WUSD: 'WUSD',
});

export const TokenSymbolByContract = Object.freeze({
  [process.env.WORKNET_WQT_TOKEN.toLowerCase()]: TokenSymbols.WQT,
});

export const WalletTables = Object.freeze({
  TXS: 'TXS',
  COLLATERAL: 'COLLATERAL',
});

export const ExplorerUrl = Object.freeze('https://dev-explorer.workquest.co');

export const NetworksData = {
  ETH_MAIN: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
  },
  ETH_TEST: {
    chainId: '0x4',
    chainName: 'Ethereum Testnet',
    rpcUrls: ['https://rinkey.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
  },
  BSC_MAIN: {
    chainId: '0x38',
    chainName: 'BSC Mainnet',
    rpcUrls: ['https://bsc-dataseed1.binance.org/'],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  BSC_TEST: {
    chainId: '0x61',
    chainName: 'BSC Testnet',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  WUSD_TEST: {
    chainId: '0x1346618',
    chainName: 'WorkQuest DEV',
    rpcUrls: ['https://dev-node-nyc3.workquest.co'],
    nativeCurrency: {
      name: 'WUSD',
      symbol: 'WUSD',
      decimals: 18,
    },
  },
};

export const tokenMap = {
  BNB: process.env.WORKNET_WBNB_TOKEN,
  ETH: process.env.WORKNET_WETH_TOKEN,
  WQT: process.env.WORKNET_WQT_TOKEN,
};

export const PensionHistoryMethods = Object.freeze({
  Update: 'Update',
  Withdraw: 'Withdraw',
  Receive: 'Receive',
});
