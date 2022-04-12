export default {
  setSwapsData(state, { swaps, count }) {
    state.swaps = swaps;
    state.swapsCount = count;
  },
  resetSwapsData(state) {
    state.swaps = [];
    state.swapsCount = null;
  },
  setToken(state, payload) {
    state.token = { ...payload };
  },
  resetToken(state) {
    state.token = {
      amount: null,
      decimals: null,
    };
  },
};
