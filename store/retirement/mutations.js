export default {
  setPensionWallet(state, pensionWallet) {
    state.pensionWallet = pensionWallet;
  },
  setPensionHistory(state, pensionHistory) {
    state.pensionHistory = pensionHistory.sort((a, b) => b.timestamp - a.timestamp);
  },
  setPensionHistoryData(state, { method, txs, count }) {
    state.pensionHistory[method].txs = txs;
    state.pensionHistory[method].count = count;
  },
};
