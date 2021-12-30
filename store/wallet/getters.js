export default {
  getIsWalletConnected: (state) => state.isWalletConnected,
  getUserAddress: (state) => state.userAddress,
  getCallbackLayout: (state) => state.callbackLayout || 'default',
  getBalanceData: (state) => state.balance,
  getSelectedToken: (state) => state.selectedToken,
};
