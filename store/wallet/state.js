import { StakingTypes, StakingTypes as TokensSymbols } from '~/utils/enums';

export default () => ({
  transactions: [],
  transactionsCount: 0,
  isWalletConnected: false,
  callbackLayout: 'default',
  selectedToken: TokensSymbols.WUSD,
  balance: {
    WQT: {
      balance: 0, // Display balance
      fullBalance: 0,
    },
    WUSD: {
      balance: 0,
      fullBalance: 0,
    },
  },
  stakingPoolsData: { WQT: {}, WUSD: {} },
  stakingUserData: { WQT: {}, WUSD: {} },
});
