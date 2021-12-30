import { StakingTypes as TokensSymbols } from '~/utils/enums';

export default () => ({
  isWalletConnected: false,
  userAddress: null,
  callbackLayout: null,
  selectedToken: TokensSymbols.WUSD,
  balance: {
    WQT: {
      balance: 0,
      fullBalance: 0,
    },
    WUSD: {
      balance: 0,
      fullBalance: 0,
    },
  },
});
