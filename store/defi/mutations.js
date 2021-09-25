export default {
  setTokensData(state, data) {
    state.tokensData = data;
  },
  setSwapsData(state, data) {
    state.swapsData = data;
  },
  setTokensDayData(state, data) {
    state.tokensDayData = data;
  },
  swapsForCrosschain(state, data) {
    state.crosschainTokensData = data;
  },
};
