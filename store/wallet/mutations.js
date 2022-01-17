export default {
  setTransactions(state, transactions) {
    state.transactions = transactions;
  },
  setTransactionsCount(state, count) {
    state.transactionsCount = count;
  },
  setIsWalletConnected(state, isWalletConnected) {
    state.isWalletConnected = isWalletConnected;
  },
  setCallbackLayout(state, layout) {
    state.callbackLayout = layout;
  },
  setUserAddress(state, address) {
    state.userAddress = address;
  },
  setBalance(state, { symbol, balance, fullBalance }) {
    state.balance[symbol].balance = balance;
    state.balance[symbol].fullBalance = fullBalance;
  },
  setSelectedToken(state, token) {
    state.selectedToken = token;
  },
};
