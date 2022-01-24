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
export const workplaceFilter = ['', 'distant', 'office', 'both'];
export const ratingFilter = ['', 'verified', 'reliable', 'topRanked'];
export const typeOfJobFilter = ['', 'fullTime', 'partTime', 'fixedTerm'];
export const priorityFilter = [
  0, // all
  3, // urgent
  2, // shortTerm
  1, // fixedDelivery
];

export const questChatStatus = {
  Active: 0,
  Closed: 1,
};

export const UserRole = {
  WORKER: 'worker',
  EMPLOYER: 'employer',
};

export const Path = {
  ROOT: '/quests',
  CREATE_QUEST: '/create-quest',
};

// WALLET
export const WalletState = Object.freeze({
  SignPage: 1,
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
