export default {
  setCurrentTab(state, value) {
    state.currentTab = value;
  },

  setLots(state, { lots, count }) {
    state.lots = lots;
    state.lotsCount = count;
  },

  setDuration(state, data) {
    state.duration = data;
  },
};
