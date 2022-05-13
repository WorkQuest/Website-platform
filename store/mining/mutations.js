export default {
  setSwaps(state, data) {
    state.swaps = data;
  },
  setChartData(state, data) {
    state.chartData = data;
  },
  setTotalLiquidityUSD(state, data) {
    state.totalLiquidityUSD = data;
  },
  setTotalSupply(state, data) {
    state.totalSupply = data;
  },
  setStakingInfo(state, { totalStaked, totalReward }) {
    state.stakingInfo = { totalStaked, totalReward };
  },
  setPoolData(state, data) {
    state.poolData = { ...data };
  },
  setProfit(state, value) {
    state.profit = value;
  },
  setWQTPrice(state, value) {
    state.wqtPrice = value;
  },
};
