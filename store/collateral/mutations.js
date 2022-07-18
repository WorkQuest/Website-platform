export default {
  setCollaterals(state, { collateral, count }) {
    state.collaterals = collateral;
    state.collateralsCount = count;
  },
};
