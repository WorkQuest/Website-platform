export default {
  setFrozenBalance(state, data) {
    state.balance.WQT.frozenBalance = data;
  },
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
  setCommonTokenData(state, [symbol, decimals]) {
    state.balance = {
      ...state.balance,
      [symbol]: { decimals },
    };
  },
  setBalance(state, { symbol, balance, fullBalance }) {
    state.balance = {
      ...state.balance,
      [symbol]: {
        ...state.balance[symbol],
        balance,
        fullBalance,
      },
    };
  },
  setSelectedToken(state, token) {
    state.selectedToken = token;
  },
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
  setStakingPoolData(state, { pool, data }) {
    state.stakingPoolsData[pool] = data;
  },
  setStakingUserData(state, { pool, data }) {
    state.stakingUserData[pool] = data;
  },
};
