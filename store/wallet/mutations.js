export default {
  setIsWalletConnected(state, isWalletConnected) {
    state.isWalletConnected = isWalletConnected;
  },
  setCallbackLayout(state, layout) {
    state.callbackLayout = layout;
  },
  setUserAddress(state, address) {
    state.userAddress = address;
  },
};
