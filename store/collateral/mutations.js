export default {
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
};
