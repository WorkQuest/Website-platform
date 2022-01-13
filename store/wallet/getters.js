export default {
  getIsWalletConnected: (state) => state.isWalletConnected,
  getUserAddress: (state) => state.userAddress,
  getCallbackLayout: (state) => state.callbackLayout,
  getBalanceData: (state) => state.balance,
  getSelectedToken: (state) => state.selectedToken,
  getQuestsFee: (state) => state.questsFee,
};
