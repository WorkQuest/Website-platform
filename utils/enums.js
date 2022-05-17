// eslint-disable-next-line import/prefer-default-export
export const isProd = process.env.PROD === 'true';

export const ChainsId = {
  ETH_MAIN: '0x1',
  ETH_TEST: '0x4',
  BSC_MAIN: '0x38',
  BSC_TEST: '0x61',
  MATIC_MAIN: '0x13881',
  MUMBAI_TEST: '0x89',
  WORKNET_TEST: '0x13488D0',
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
  20220112: '0x13488D0',
};

export const Chains = {
  ETHEREUM: 'ETH',
  BINANCE: 'BSC',
  WORKNET: 'WORKNET',
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
  { key: 'all', value: 15 },
  { key: 'topRanked', value: 8 },
  { key: 'reliable', value: 4 },
  { key: 'verified', value: 2 },
  { key: 'noStatus', value: 1 },
];
export const RatingStatus = {
  NoStatus: 1,
  Verified: 2,
  Reliable: 4,
  TopRanked: 8,
  AllStatuses: 15,
};

export const MessageAction = {
  GROUP_CHAT_CREATE: 'groupChatCreate',
  NEW_MESSAGE: 'newMessage',
  MESSAGE_READ_BY_RECIPIENT: 'messageReadByRecipient',
  GROUP_CHAT_ADD_USERS: 'groupChatAddUser',
  GROUP_CHAT_LEAVE_USER: 'groupChatLeaveUser',
  GROUP_CHAT_DELETE_USER: 'groupChatDeleteUser',
  EMPLOYER_INVITE_ON_QUEST: 'employerInviteOnQuest',
  WORKER_RESPONSE_ON_QUEST: 'workerResponseOnQuest',
  EMPLOYER_REJECT_RESPONSE_ON_QUEST: 'employerRejectResponseOnQuest',
  WORKER_REJECT_INVITE_ON_QUEST: 'workerRejectInviteOnQuest',
  WORKER_ACCEPT_INVITE_ON_QUEST: 'workerAcceptInviteOnQuest',
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
  SUMSUB: '/sumsub',
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
  process.env.WORKNET_WUSD_TOKEN,
  process.env.WORKNET_WBNB_TOKEN,
  process.env.WORKNET_WETH_TOKEN,
  process.env.WORKNET_USDT_TOKEN,
]);

export const TokenSymbolByContract = Object.freeze({
  [process.env.WORKNET_WUSD_TOKEN.toLowerCase()]: TokenSymbols.WUSD,
  [process.env.WORKNET_WBNB_TOKEN.toLowerCase()]: TokenSymbols.BNB,
  [process.env.WORKNET_WETH_TOKEN.toLowerCase()]: TokenSymbols.ETH,
  [process.env.WORKNET_USDT_TOKEN.toLowerCase()]: TokenSymbols.USDT,
});

export const TokenMap = {
  [TokenSymbols.BNB]: process.env.WORKNET_WBNB_TOKEN,
  [TokenSymbols.ETH]: process.env.WORKNET_WETH_TOKEN,
  [TokenSymbols.WUSD]: process.env.WORKNET_WUSD_TOKEN,
  [TokenSymbols.USDT]: process.env.WORKNET_USDT_TOKEN,
};

export const WalletTables = Object.freeze({
  TXS: 'TXS',
  COLLATERAL: 'COLLATERAL',
});

export const DaoUrl = Object.freeze('https://dev-dao.workquest.co');

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
  WORKNET_TEST: {
    chainId: '0x13488D0',
    chainName: 'WorkQuest DEV',
    rpcUrls: ['https://dev-node-nyc3.workquest.co'],
    nativeCurrency: {
      name: 'WUSD',
      symbol: 'WUSD',
      decimals: 18,
    },
  },
};

export const PensionHistoryMethods = Object.freeze({
  Update: 'Update',
  Withdraw: 'Withdraw',
  Receive: 'Receive',
});

export const RaiseViewTariffPeriods = {
  usersTariff: ['1', '7', '30'],
  questTariff: ['1', '5', '7'],
};
export const RaiseViewStatus = {
  0: true,
  1: false,
};
