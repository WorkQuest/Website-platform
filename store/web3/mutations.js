export default {
  setIsConnected(state, payload) {
    state.isConnected = payload;
  },
  setIsHandlingMetamaskStatus(state, payload) {
    state.isHandlingMetamaskStatus = payload;
  },
  setAccount(state, payload) {
    state.account = payload;
  },
};
