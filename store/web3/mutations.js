export default {
  setBusy(state, payload) {
    state.busy = payload;
  },
  setIsConnected(state, payload) {
    state.isConnected = payload;
  },
  setBalance(state, payload) {
    state.balance = payload;
  },
  setWETHToken(state, payload) {
    state.tokenWETH = payload;
  },
  setWeb3ExampleToken(state, payload) {
    state.tokens = {
      ...state.tokens,
      exampleWeb3: payload,
    };
  },
  setAccountData(state, payload) {
    state.accountData = payload;
  },
  clearTokens(state) {
    state.tokens = {};
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
  setLpTokenPrice(state) {
    state.tokenLPAmount = {};
  },
  setPurseData(state, payload) {
    state.purseData = payload;
  },
};
