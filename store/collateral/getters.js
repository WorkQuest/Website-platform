export default {
  getCollaterals: (state) => state.collaterals,
  getCollateralsCount: (state) => state.collateralsCount,

  getHistoryCollateral: (state) => state.historyCollateral,
  getHistoryCollateralCount: (state) => state.historyCollateralCount,

  getTotalSupply: (state) => state.totalSupply,
  getAvailableAssets: (state) => state.availableAssets,
  getMaxRatio: (state) => state.maxRatio,
};
