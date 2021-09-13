export default {
  setIsConnected(state, payload) {
    state.isConnected = payload;
  },
  setBalance(state, payload) {
    state.balance = payload;
  },
  setExampleContract(state, payload) {
    state.tokens = {
      ...state.tokens,
      exampleContract: payload,
    };
  },
  setWeb3ExampleToken(state, payload) {
    state.tokens = {
      ...state.tokens,
      exampleWeb3: payload,
    };
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
