import { TokenSymbols } from '~/utils/enums';

export default () => ({
  transactions: [],
  transactionsCount: 0,
  isWalletConnected: false,
  callbackLayout: 'default',
  isOnlyConfirm: false, // for confirm password layout
  selectedToken: TokenSymbols.WUSD,
  balance: {
    WQT: {
      balance: 0, // Display balance
      fullBalance: 0,
      frozenBalance: 0,
    },
    WUSD: {
      balance: 0,
      fullBalance: 0,
    },
    ETH: {
      balance: 0,
      fullBalance: 0,
    },
    BNB: {
      balance: 0,
      fullBalance: 0,
    },
  },
  stakingPoolsData: { WQT: {}, WUSD: {} },
  stakingUserData: { WQT: {}, WUSD: {} },
});
