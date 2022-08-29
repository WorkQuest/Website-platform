export default {
  setSwapsData(state, { swaps, count }) {
    state.swaps = swaps;
    state.swapsCount = count;
  },
  resetSwapsData(state) {
    state.swaps = [];
    state.swapsCount = null;
  },
  setRedeemed(state, { transactionHash, nonce }) {
    const index = state.swaps.findIndex((item) => item.transactionHash === transactionHash && item.nonce === nonce);
    if (index !== -1) {
      const swaps = JSON.parse(JSON.stringify(state.swaps));
      swaps[index].canRedeemed = false;
      swaps[index].status = false;
      state.swaps = swaps;
    }
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
