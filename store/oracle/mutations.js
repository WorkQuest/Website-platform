export default {
  setCurrentPrice(state, data) {
    state.currentPrice = data;
  },
  setSecurityRatio(state, data) {
    state.securityRatio = data;
  },
  setDesiredSecurityRatio(state, data) {
    state.desiredSecurityRatio = data;
  },
};
