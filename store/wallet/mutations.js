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
  setIsOnlyConfirm(state, value) {
    state.isOnlyConfirm = value;
  },
  setBalance(state, { symbol, balance, fullBalance }) {
    state.balance[symbol].balance = balance;
    state.balance[symbol].fullBalance = fullBalance;
  },
  setSelectedToken(state, token) {
    state.selectedToken = token;
  },
  setPensionWallet(state, pensionWallet) {
    state.pensionWallet = pensionWallet;
  },
  setStakingPoolData(state, { pool, data }) {
    state.stakingPoolsData[pool] = data;
  },
  setStakingUserData(state, { pool, data }) {
    state.stakingUserData[pool] = data;
  },
};
