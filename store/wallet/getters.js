export default {
  isWalletConnected: (state) => state.isWalletConnected,
  userAddress: (state) => state.userAddress,
  callbackLayout: (state) => state.callbackLayout || 'default',
};
