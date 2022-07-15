export default {
  setLost(state, { collateral, count }) {
    state.lots = collateral;
    state.lotsCount = count;
  },
};
