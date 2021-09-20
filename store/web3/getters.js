export default {
  isConnected: (state) => state.isConnected,
  getTokens: (state) => state.tokens,
  getAccount: (state) => state.account,
  getBalance: (state) => state.balance,
  getTokenWETH: (state) => state.tokenWETH,
  getAccountData: (state) => state.accountData,
  getTokensAmount: (state) => state.tokensAmount,
  getLPTokenPrice: (state) => state.tokenLPAmount,
  getStatusBusy: (state) => state.busy,
};
