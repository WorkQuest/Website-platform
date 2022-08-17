import { PaidTariff } from '~/utils/сonstants/quests';
import ENV, { IS_PROD } from '~/utils/addresses';
import { images } from '~/utils/images';

export const isProd = IS_PROD;

export const ConnectionTypes = {
  WEB3: 'WEB3',
  WQ_WALLET: 'WQ_WALLET',
};

export const ChainsId = {
  ETH_MAIN: '0x1',
  ETH_TEST: '0x4',

  BSC_MAIN: '0x38',
  BSC_TEST: '0x61',

  MATIC_MAIN: '0x89',
  MUMBAI_TEST: '0x13881',

  WORKNET_DEV: '0x13488D0',
  WORKNET_TEST: '0x7C7',
  WORKNET_MAIN: '0x7D9',
};

export const ChainsIdByChainNumber = {
  1: [ChainsId.ETH_MAIN],
  4: [ChainsId.ETH_TEST],

  56: [ChainsId.BSC_MAIN],
  97: [ChainsId.BSC_TEST],

  137: [ChainsId.MATIC_MAIN],
  80001: [ChainsId.MUMBAI_TEST],

  20220112: [ChainsId.WORKNET_DEV],
  1991: [ChainsId.WORKNET_TEST],
  2009: [ChainsId.WORKNET_MAIN],
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
  CREATED: 1,
  IN_PROGRESS: 2,
  PENDING_CLOSED: 3,
  CLOSED: 4,
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
  RAISED_VIEWS: '/raised-views',
  NOTIFICATIONS: '/notifications',
  RETIREMENT: '/retirement',
  SUMSUB: '/sumsub',
  REPORT: '/report',
  AUCTION: '/auction',
  BORROW: '/borrow',
  QRCODE: '/qrcode',
};

export const RouterNames = {
  ROOT: 'index',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  ROLE: 'role',

  CREDITING: 'crediting',
  REFERRAL: 'referral',
  REFERRAL_MY: 'referral-my',
  RETIREMENT: 'retirement',
  RETIREMENT_MY: 'retirement-my',
  STAKING: 'staking',
  STAKING_ID: 'staking-id',
  INSURING: 'insuring',
  INSURING_ID: 'insuring-id',
  BRIDGE: 'bridge',
  MINING: 'mining',
  MINING_ID: 'mining-id',
  LENDING: 'lending',
  COLLATERAL: 'collateral',
  SAVINGS: 'savings',
  SAVINGS_ID: 'savings-id',
  WIKI: 'wiki',
  PROFILE_ID: 'profile-id',
  QUESTS: 'quests',
  QUESTS_ID: 'quests-id',
  WORKERS: 'workers',
};

export const DeFiBluePanelPathNames = [
  RouterNames.BRIDGE,
  RouterNames.MINING,
  RouterNames.MINING_ID,
  RouterNames.INSURING,
  RouterNames.INSURING_ID,
  RouterNames.LENDING,
  RouterNames.REFERRAL,
  RouterNames.REFERRAL_MY,
  RouterNames.STAKING,
  RouterNames.STAKING_ID,
  RouterNames.COLLATERAL,
  RouterNames.RETIREMENT,
  RouterNames.RETIREMENT_MY,
  RouterNames.SAVINGS,
  RouterNames.SAVINGS_ID,
];

export const PreventLogoutPathNames = [
  RouterNames.MINING,
  RouterNames.MINING_ID,
  RouterNames.BRIDGE,
  RouterNames.CREDITING,
  RouterNames.COLLATERAL,
  RouterNames.WIKI,
];

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
  USDC: 'USDC',
  MATIC: 'MATIC',
});

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
  [TokenSymbols.USDC]: ENV.WORKNET_USDC_TOKEN,
};

export const WalletTables = Object.freeze({
  TXS: 'TXS',
  COLLATERAL: 'COLLATERAL',
});

export const DaoUrl = {
  master: 'https://dao.workquest.co',
  testnet: 'https://testnet-dao.workquest.co',
  stage: 'https://stage-dao.workquest.co',
  develop: 'https://dev-dao.workquest.co',
}[process.env.BRANCH];

export const ExplorerUrl = {
  master: 'https://explorer.workquest.co',
  testnet: 'https://testnet-explorer.workquest.co',
  stage: 'https://stage-explorer.workquest.co',
  develop: 'https://dev-explorer.workquest.co',
}[process.env.BRANCH];

export const WikiUrl = 'https://workquest.wiki';

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
  WORKNET_MAIN: {
    chainId: ChainsId.WORKNET_MAIN,
    chainName: 'WorkNet',
    rpcUrls: ['https://mainnet-gate.workquest.co/'],
    blockExplorerUrls: [ExplorerUrl],
    // iconUrls:[] TODO: add icon url
    nativeCurrency: {
      name: 'WorkQuest',
      symbol: 'WQT',
      decimals: 18,
    },
  },
  WORKNET_TEST: {
    chainId: ChainsId.WORKNET_TEST,
    chainName: 'WorkNet Testnet',
    rpcUrls: ['https://testnet-gate.workquest.co/'],
    blockExplorerUrls: [ExplorerUrl],
    // iconUrls:[] TODO: add icon url
    nativeCurrency: {
      name: 'WorkQuest',
      symbol: 'WQT',
      decimals: 18,
    },
  },
  WORKNET_DEV: {
    chainId: ChainsId.WORKNET_DEV,
    chainName: 'WorkNet Devnet',
    rpcUrls: ['https://dev-node-nyc3.workquest.co/'],
    blockExplorerUrls: [ExplorerUrl],
    // iconUrls:[] TODO: add icon url
    nativeCurrency: {
      name: 'WorkQuest',
      symbol: 'WQT',
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

/** WALLET */

// For switch wallet providers
export const ProviderTypesByChain = {
  [Chains.WORKNET]: 'WQ_PROVIDER',
  [Chains.ETHEREUM]: 'ETH_PROVIDER',
  [Chains.BINANCE]: 'BSC_PROVIDER',
  [Chains.POLYGON]: 'POLYGON_PROVIDER',
};

// wallet balance
export const WorknetTokenAddresses = Object.freeze([
  ENV.WORKNET_WUSD_TOKEN,
  ENV.WORKNET_WBNB_TOKEN,
  ENV.WORKNET_WETH_TOKEN,
  ENV.WORKNET_USDT_TOKEN,
]);

export const WalletTokensData = Object.freeze({
  [Chains.WORKNET]: {
    WSProvider: ENV.WQ_WS_PROVIDER,
    explorer: ExplorerUrl,
    chain: Chains.WORKNET,
    tokenAddresses: [
      ENV.WORKNET_WUSD_TOKEN,
      ENV.WORKNET_WBNB_TOKEN,
      ENV.WORKNET_WETH_TOKEN,
      ENV.WORKNET_USDT_TOKEN,
    ],
    tokenList: [
      { title: TokenSymbols.WQT, icon: images.WQT }, // FIRST IS NATIVE TOKEN!
      { title: TokenSymbols.WUSD, icon: images.WUSD, tokenAddress: ENV.WORKNET_WUSD_TOKEN },
      { title: TokenSymbols.BNB, icon: images.BNB, tokenAddress: ENV.WORKNET_WBNB_TOKEN },
      { title: TokenSymbols.ETH, icon: images.ETH_BLACK, tokenAddress: ENV.WORKNET_WETH_TOKEN },
      { title: TokenSymbols.USDT, icon: images.USDT, tokenAddress: ENV.WORKNET_USDT_TOKEN },
      { title: TokenSymbols.USDC, icon: images.USDC, tokenAddress: ENV.WORKNET_USDC_TOKEN },
    ],
  },
  [Chains.ETHEREUM]: {
    WSProvider: ENV.ETH_WS_PROVIDER,
    chain: Chains.ETHEREUM,
    explorer: `https://${IS_PROD ? '' : 'rinkeby.'}etherscan.io`,
    explorerIcon: images.ETH,
    tokenAddresses: [
      ENV.ETHEREUM_WQT_TOKEN,
      ENV.ETHEREUM_USDT_TOKEN,
    ],
    tokenList: [
      { title: TokenSymbols.ETH, icon: images.ETH_BLACK }, // FIRST IS NATIVE TOKEN!
      { title: TokenSymbols.WQT, icon: images.WQT, tokenAddress: ENV.ETHEREUM_WQT_TOKEN },
      { title: TokenSymbols.USDT, icon: images.USDT, tokenAddress: ENV.ETHEREUM_USDT_TOKEN },
    ],
  },
  [Chains.BINANCE]: {
    WSProvider: ENV.BSC_WS_PROVIDER,
    chain: Chains.BINANCE,
    explorer: `https://${IS_PROD ? '' : 'testnet.'}bscscan.com`,
    explorerIcon: images.BNB,
    tokenAddresses: [
      ENV.BSC_WQT_TOKEN,
      ENV.BSC_USDT_TOKEN,
    ],
    tokenList: [
      { title: TokenSymbols.BNB, icon: images.BNB }, // FIRST IS NATIVE TOKEN!
      { title: TokenSymbols.WQT, icon: images.WQT, tokenAddress: ENV.BSC_WQT_TOKEN },
      { title: TokenSymbols.USDT, icon: images.USDT, tokenAddress: ENV.BSC_USDT_TOKEN },
    ],
  },
  [Chains.POLYGON]: {
    WSProvider: ENV.POLYGON_WS_PROVIDER,
    chain: Chains.POLYGON,
    explorer: `https://${IS_PROD ? '' : 'mumbai.'}polygonscan.com`,
    explorerIcon: images.POLYGON,
    tokenAddresses: [
      ENV.POLYGON_USDT_TOKEN,
    ],
    tokenList: [
      { title: TokenSymbols.MATIC, icon: images.POLYGON }, // FIRST IS NATIVE TOKEN!
      { title: TokenSymbols.USDT, icon: images.USDT, tokenAddress: ENV.POLYGON_USDT_TOKEN },
    ],
  },
});

export const Layout = Object.freeze({
  DEFAULT: 'default',
  GUEST: 'guest', // has access to bridge and mining
  AUTH: 'auth',
  CONFIRM: 'confirm', // if mnemonic not decoded
  ROLE: 'role',
});

export const AddressType = Object.freeze({
  BECH32: 'BECH32',
  HEX: 'HEX',
});
