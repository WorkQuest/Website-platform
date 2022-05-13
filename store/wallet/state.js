import { TokenSymbols } from '~/utils/enums';

export default () => ({
  transactions: [],
  transactionsCount: 0,
  isWalletConnected: false,
  callbackLayout: 'default',
  isOnlyConfirm: false, // for confirm password layout
  selectedToken: TokenSymbols.WQT,
  balance: {
    WQT: { balance: 0, fullBalance: 0, decimals: 18 },
  },
  pensionWallet: null,
  pensionHistory: {
    Update: { txs: [], count: 0 },
    Receive: { txs: [], count: 0 },
    Withdraw: { txs: [], count: 0 },
  },
  stakingPoolsData: { WQT: {}, WUSD: {} },
  stakingUserData: { WQT: {}, WUSD: {} },
});
