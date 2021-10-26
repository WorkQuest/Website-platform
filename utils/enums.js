// eslint-disable-next-line import/prefer-default-export
export const ChainsId = {
  ETH_MAIN: '0x1',
  ETH_TEST: '0x4',
  BSC_MAIN: '0x38',
  BSC_TEST: '0x61',
  MATIC_MAIN: '0x13881',
  MUMBAI_TEST: '0x89',
};

export const Chains = {
  ETHEREUM: 'ETH',
  BINANCE: 'BNB',
};

export const StakingTypes = {
  WQT: 'WQT',
  WUSD: 'WUSD',
  MINING: 'MINING',
};

export const NativeTokenSymbolByChainId = {
  [+ChainsId.ETH_MAIN]: 'ETH',
  [+ChainsId.ETH_TEST]: 'ETH',
  [+ChainsId.BSC_MAIN]: 'BNB',
  [+ChainsId.BSC_TEST]: 'BNB',
};
