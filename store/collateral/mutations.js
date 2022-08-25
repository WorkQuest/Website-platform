export default {
  setCollateralCurrentPage(state, page) {
    state.collateralCurrentPage = page;
  },

  setCollaterals(state, { collaterals, count }) {
    state.collaterals = collaterals;
    state.collateralsCount = count;
  },

  updateCollaterals(state, collaterals) {
    state.collaterals = collaterals;
  },

  setHistoryCollateral(state, { rows, count }) {
    state.historyCollateral = rows;
    state.historyCollateralCount = count;
  },

  setTotalSupply(state, data) {
    state.totalSupply = data;
  },
  setAvailableAssets(state, data) {
    state.availableAssets = data;
  },
  setMaxRatio(state, data) {
    state.maxRatio = data;
  },
};
