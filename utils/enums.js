import { PaidTariff } from '~/utils/сonstants/quests';
import ENV, { IS_PROD } from '~/utils/adresses';

export const isProd = IS_PROD;

export const ChainsId = {
  ETH_MAIN: '0x1',
  ETH_TEST: '0x4',
  BSC_MAIN: '0x38',
  BSC_TEST: '0x61',
  MATIC_MAIN: '0x89',
  MUMBAI_TEST: '0x13881',
  WORKNET_TEST: '0x13488D0',
};

export const ChainsIdByChainNumber = {
  1: [ChainsId.ETH_MAIN],
  4: [ChainsId.ETH_TEST],
  56: [ChainsId.BSC_MAIN],
  137: [ChainsId.MATIC_MAIN],
  80001: [ChainsId.MUMBAI_TEST],
  20220112: [ChainsId.WORKNET_TEST],
};

export const Chains = {
  ETHEREUM: 'ETH',
  BINANCE: 'BSC',
  WORKNET: 'WORKNET',
  POLYGON: 'POLYGON',
};

export const QuestModeReview = {
  QUEST_LIST: 'QuestList',
  QUEST_SINGLE: 'QuestSingle',
};

export const StakingTypes = {
  WQT: 'WQT',
  WUSD: 'WUSD',
};

export const TwoFAStatuses = { DISABLED: 0, ENABLED: 1 };
export const SumSubStatuses = { NOT_VERIFIED: 0, VERIFIED: 1 };

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
export const WorkplaceIndex = ['Remote', 'InOffice', 'Hybrid'];
export const PayPeriodsIndex = ['Hourly', 'Daily', 'Weekly', 'BiWeekly', 'SemiMonthly', 'Monthly', 'Quarterly', 'SemiAnnually', 'Annually', 'FixedPeriod', 'ByAgreement'];
export const TypeOfEmployments = ['FullTime', 'PartTime', 'FixedTerm', 'EmploymentContract', 'RemoteWork'];

export const PayPeriodsFilter = ['all', 'Hourly', 'Daily', 'Weekly', 'BiWeekly', 'SemiMonthly', 'Monthly', 'Quarterly', 'SemiAnnually', 'Annually', 'FixedPeriod', 'ByAgreement'];
export const WorkplaceFilter = ['all', 'Remote', 'InOffice', 'Hybrid'];
export const TypeOfEmploymentFilters = ['all', 'FullTime', 'PartTime', 'FixedTerm', 'EmploymentContract', 'RemoteWork'];
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
  ALL_STATUSES: 'AllStatuses',
});

export const UserRating = Object.freeze({
  8: Ratings.TOP_RANKED,
  4: Ratings.RELIABLE,
  2: Ratings.VERIFIED,
  1: Ratings.NO_STATUS,
  15: Ratings.ALL_STATUSES,
});
export const RatingFilter = [
  { key: [Ratings.ALL_STATUSES], value: 15 },
  { key: [Ratings.TOP_RANKED], value: 8 },
  { key: [Ratings.RELIABLE], value: 4 },
  { key: [Ratings.VERIFIED], value: 2 },
  { key: [Ratings.NO_STATUS], value: 1 },
];
export const RatingStatus = {
  NoStatus: 1,
  Verified: 2,
  Reliable: 4,
  TopRanked: 8,
  AllStatuses: 15,
};

export const MessageAction = {
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
};

export const ChatType = {
  GROUP: 'Group',
  QUEST: 'Quest',
  PRIVATE: 'Private',
};

export const MessageType = {
  INFO: 'Info',
  MESSAGE: 'Message',
};

export const QuestChatStatus = {
  Active: 0,
  Closed: -1,
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
  REFERRAL: '/referral',
  INSURING: '/insuring',
  SAVINGS: '/savings',
  CREDITING: '/crediting',
  LENDING: '/lending',
  MINING: '/mining',
  BRIDGE: '/bridge',
  SETTINGS: '/settings',
  DISPUTES: '/disputes',
  WORKERS: '/workers',
  CREATE_QUEST: '/create-quest',
  STAKING: '/staking',
  PROFILE: '/profile',
  ROLE: '/role',
  QUESTS: '/quests',
  MESSAGES: '/messages',
  EDIT_QUEST: '/edit-quest',
  COLLATERAL: '/collateral',
  WIKI: '/wiki',
  RAISED_VIEWS: '/raised-views',
  NOTIFICATIONS: '/notifications',
  RETIREMENT: '/retirement',
  SUMSUB: '/sumsub',
  REPORT: '/report',
  AUCTION: '/auction',
};

export const PathDAO = {
  DISCUSSIONS: '/discussions',
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
  BNB: 'BNB',
  ETH: 'ETH',
  WBNB: 'WBNB',
  WETH: 'WETH',
  USDT: 'USDT',
});

// wallet balance
export const WorknetTokenAddresses = Object.freeze([
  ENV.WORKNET_WUSD_TOKEN,
  ENV.WORKNET_WBNB_TOKEN,
  ENV.WORKNET_WETH_TOKEN,
  ENV.WORKNET_USDT_TOKEN,
]);

export const TokenSymbolByContract = Object.freeze({
  [ENV.WORKNET_WUSD_TOKEN?.toLowerCase()]: TokenSymbols.WUSD,
  [ENV.WORKNET_WBNB_TOKEN?.toLowerCase()]: TokenSymbols.BNB,
  [ENV.WORKNET_WETH_TOKEN?.toLowerCase()]: TokenSymbols.ETH,
  [ENV.WORKNET_USDT_TOKEN?.toLowerCase()]: TokenSymbols.USDT,
});

export const TokenMap = {
  [TokenSymbols.BNB]: ENV.WORKNET_WBNB_TOKEN,
  [TokenSymbols.ETH]: ENV.WORKNET_WETH_TOKEN,
  [TokenSymbols.WUSD]: ENV.WORKNET_WUSD_TOKEN,
  [TokenSymbols.USDT]: ENV.WORKNET_USDT_TOKEN,
};

export const WalletTables = Object.freeze({
  TXS: 'TXS',
  COLLATERAL: 'COLLATERAL',
});

export const DaoUrl = Object.freeze('https://dev-dao.workquest.co');

export const ExplorerUrl = Object.freeze('https://dev-explorer.workquest.co');

export const NetworksData = {
  ETH_MAIN: {
    chainId: ChainsId.ETH_MAIN,
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/'],
  },
  ETH_TEST: {
    chainId: ChainsId.ETH_TEST,
    chainName: 'Ethereum Testnet',
    rpcUrls: ['https://rinkey.infura.io/v3/'],
  },
  BSC_MAIN: {
    chainId: ChainsId.BSC_MAIN,
    chainName: 'BSC Mainnet',
    rpcUrls: ['https://bsc-dataseed1.binance.org/'],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  BSC_TEST: {
    chainId: ChainsId.BSC_TEST,
    chainName: 'BSC Testnet',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  WORKNET_TEST: {
    chainId: ChainsId.WORKNET_TEST,
    chainName: 'WorkQuest DEV',
    rpcUrls: ['https://dev-node-nyc3.workquest.co'],
    nativeCurrency: {
      name: 'WUSD',
      symbol: 'WUSD',
      decimals: 18,
    },
  },
  MATIC_MAIN: { // Polygon main
    chainId: ChainsId.MATIC_MAIN,
    chainName: 'Polygon Mainnet',
    rpcUrls: ['https://rpc-mainnet.matic.network'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  MUMBAI_TEST: { // Polygon test
    chainId: ChainsId.MUMBAI_TEST,
    chainName: 'Mumbai Testnet',
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    nativeCurrency: {
      name: 'TMATIC',
      symbol: 'TMATIC',
      decimals: 18,
    },
  },
};

export const PensionHistoryMethods = Object.freeze({
  Update: 'Update',
  Withdraw: 'Withdraw',
  Receive: 'Receive',
});

export const RaiseViewTariffPeriods = Object.freeze({
  usersTariff: ['1', '7', '30'],
  questTariff: ['1', '5', '7'],
});
export const TariffByIndex = Object.freeze({
  0: PaidTariff.GoldPlus,
  1: PaidTariff.Gold,
  2: PaidTariff.Silver,
  3: PaidTariff.Bronze,
});
export const RaiseViewStatus = {
  0: true,
  1: false,
};

export const EntityType = {
  USER: 'User',
  QUEST: 'Quest',
  DISCUSSION_COMMENT: 'DiscussionComment',
};
