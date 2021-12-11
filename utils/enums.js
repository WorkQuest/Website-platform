// eslint-disable-next-line import/prefer-default-export
export const ChainsId = {
  ETH_MAIN: '0x1',
  ETH_TEST: '0x4',
  BSC_MAIN: '0x38',
  BSC_TEST: '0x61',
  MATIC_MAIN: '0x13881',
  MUMBAI_TEST: '0x89',
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
  RaiseViews: 1,
  Active: 2,
  Created: 3,
  WaitWorker: 4,
  WaitConfirm: 6,
  Dispute: 7,
  Closed: 8,
  Done: 9,
};
export const InfoModeWorker = {
  ADChat: 1,
  Active: 2,
  Rejected: 3,
  WaitConfirm: 4,
  Created: 5,
  Dispute: 7,
  Closed: 8,
  Done: 9,
};
export const questPriority = {
  Low: 1,
  Normal: 2,
  Urgent: 3,
};
export const responsesType = {
  Responded: 0,
  Invited: 1,
};
export const keyCodes = {
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
