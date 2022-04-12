export default {
  setBusy(state, payload) {
    state.busy = payload;
  },
  setIsConnected(state, payload) {
    state.isConnected = payload;
  },
  setIsHandlingMetamaskStatus(state, payload) {
    state.isHandlingMetamaskStatus = payload;
  },
  setAccountData(state, payload) {
    state.accountData = payload;
  },
  setAccount(state, payload) {
    state.account = payload;
  },
  setBSCTokensData(state, payload) {
    state.tokensBSC = payload;
  },
  clearAccount(state) {
    state.account = {};
  },
  setStakeAndRewardData(state, payload) {
    state.tokensAmount = payload;
  },
  setMetaMaskStatus(state, payload) {
    state.metamaskStatus = payload;
  },
};
