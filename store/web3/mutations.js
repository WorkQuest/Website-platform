export default {
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
  clearAccount(state) {
    state.account = {};
  },
};
