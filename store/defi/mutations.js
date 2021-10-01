export default {
  setWqtWbnbBurns(state, data) {
    state.wqtWbnbBurns = data;
  },
  setWqtWbnbMints(state, data) {
    state.wqtWbnbMints = data;
  },
  setWqtWbnbSwaps(state, data) {
    state.wqtWbnbSwaps = data;
  },
  setWqtWbnbTokenDay(state, data) {
    state.wqtWbnbTokenDay = data;
  },
  setWqtWbnbTokenDayLast(state, data) {
    state.wqtWbnbTokenDayLast = data;
  },
  setWqtWethBurns(state, data) {
    state.wqtWethBurns = data;
  },
  setWqtWethMints(state, data) {
    state.wqtWethMints = data;
  },
  setWqtWethSwaps(state, data) {
    state.wqtWethSwaps = data;
  },
  setWqtWethTokenDay(state, data) {
    state.wqtWethTokenDay = data;
  },
  setWqtWethTokenDayLast(state, data) {
    state.wqtWethTokenDayLast = data;
  },

  swapsForCrosschain(state, data) {
    state.crosschainTokensData = data;
  },
};
