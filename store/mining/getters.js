export default {
  getTableData: (state) => state.tableData,
  getChartData: (state) => {
    const chartDataAsc = [...state.chartData].sort((a, b) => (a.date > b.date ? 1 : 0));
    const lastElementIndex = chartDataAsc.length - 1;
    return chartDataAsc.map((el, currentIndex) => {
      const currentDayIndex = lastElementIndex - currentIndex;
      const dayToDisplay = window.$nuxt.$root.$moment().utc(false).subtract(currentDayIndex, 'days');
      let n = 0;
      while (n <= lastElementIndex) {
        const position = lastElementIndex - n;
        const currentDayInTheChart = window.$nuxt.$root.$moment(chartDataAsc[position].date * 1000).utc(false);
        if (window.$nuxt.$root.$moment(dayToDisplay).isSameOrAfter(currentDayInTheChart, 'days')) {
          return {
            ...chartDataAsc[position],
            date: dayToDisplay,
          };
        }
        n += 1;
      }
      return {
        ...chartDataAsc[0],
        date: dayToDisplay,
      };
    });
  },
  getTotalLiquidityUSD: (state) => state.totalLiquidityUSD,
  getBalance: (state) => state.poolData.balance,
  getStaked: (state) => state.poolData.staked,
  getClaim: (state) => state.poolData.claim,
  getAPY: (state) => state.APY,
  isInitWS: (state) => state.isInitWS,
};
