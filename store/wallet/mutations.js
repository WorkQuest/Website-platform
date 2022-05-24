export default {
  setFrozenBalance(state, data) {
    state.frozenBalance = data;
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
  setStakingPoolData(state, { pool, data }) {
    state.stakingPoolsData[pool] = data;
  },
  setStakingUserData(state, { pool, data }) {
    state.stakingUserData[pool] = data;
  },
};
