export default {
  setInitWS(state, isInit) {
    console.log('commit setInitWS', isInit);
    state.isInitWS = isInit;
  },
  setTableData(state, data) {
    state.tableData = data;
  },
  setChartData(state, data) {
    state.chartData = data;
  },
  setTotalLiquidityUSD(state, data) {
    state.totalLiquidityUSD = data;
  },
  setPoolData(state, data) {
    state.poolData = { ...data };
  },
  setAPY(state, value) {
    state.APY = value;
  },
};
