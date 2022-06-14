export default {
  getCurrentPrices: (state) => state.currentPrices,
  getPrices: (state) => state.prices,
  getSymbols: (state) => state.symbols,
  getMinRatio: (state) => state.minRatio,
  getSecurityRatio: (state) => state.securityRatio,
  getDesiredSecurityRatio: (state) => state.desiredSecurityRatio,
};
