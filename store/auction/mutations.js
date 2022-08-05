export default {
  setLost(state, { lots, count }) {
    state.lots = lots;
    state.lotsCount = count;
  },
};
