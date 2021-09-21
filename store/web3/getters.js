export default {
  isConnected: (state) => state.isConnected,
  getTokens: (state) => state.tokens || '',
  getAccount: (state) => state.account,
  getUserBalance: (state) => state.tokensAmount?.balanceTokenAmount || '',
  getUserStake: (state) => state.tokensAmount?.stakeTokenAmount || '',
  getTokenWETH: (state) => state.tokenWETH || '',
  getAccountData: (state) => state.accountData || '',
  getTokensAmount: (state) => state.tokensAmount || '',
  getLPTokenPrice: (state) => state.tokenLPAmount || '',
  getStatusBusy: (state) => state.busy,
};
