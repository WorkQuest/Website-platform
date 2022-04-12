export default {
  isConnected: (state) => state.isConnected,
  isHandlingMetamaskStatus: (state) => state.isHandlingMetamaskStatus,
  getTokens: (state) => state.tokens || '',
  getAccount: (state) => state.account,
  getUserBalance: (state) => state.tokensAmount?.balanceTokenAmount || '',
  getUserStake: (state) => state.tokensAmount?.stakeTokenAmount || '',
  getAccountData: (state) => state.accountData || '',
  getTokensAmount: (state) => state.tokensAmount || '',
  getStatusBusy: (state) => state.busy,
  getBSCTokensData: (state) => state.tokensBSC,
  getMetaMaskStatus: (state) => state.metamaskStatus,
};
