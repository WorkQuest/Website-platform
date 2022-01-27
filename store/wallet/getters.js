export default {
  getTransactions: (state) => state.transactions,
  getTransactionsCount: (state) => state.transactionsCount,
  getIsWalletConnected: (state) => state.isWalletConnected,
  getCallbackLayout: (state) => state.callbackLayout,
  getBalanceData: (state) => state.balance,
  getSelectedToken: (state) => state.selectedToken,
  getPensionWallet: (state) => state.pensionWallet,
};
