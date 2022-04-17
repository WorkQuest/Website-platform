export default {
  getTableData: (state) => state.tableData,
  getChartData: (state) => {
    const chartDataAsc = [...state.chartData].sort((a, b) => (a.date > b.date ? 1 : 0));
    const lastElementIndex = chartDataAsc.length - 1;
    const chartData = chartDataAsc.map((el, currentIndex) => {
      const currentDayIndex = lastElementIndex - currentIndex;
      const dayToDisplay = window.$nuxt.$root.$moment().utc(false).subtract(currentDayIndex, 'days');
      let n = 0;
      let isFound = false;
      while (n <= lastElementIndex && !isFound) {
        const position = lastElementIndex - n;
        const currentDayInTheChart = window.$nuxt.$root.$moment(chartDataAsc[position].date * 1000).utc(false);
        if (window.$nuxt.$root.$moment(dayToDisplay).isSameOrAfter(currentDayInTheChart, 'days') && !isFound) {
          isFound = true;
          return {
            date: dayToDisplay,
            reserve0: chartDataAsc[position].reserve0,
            reserve1: chartDataAsc[position].reserve1,
            totalSupply: chartDataAsc[position].totalSupply,
            reserveUSD: chartDataAsc[position].reserveUSD,
            dailyVolumeToken0: chartDataAsc[position].dailyVolumeToken0,
            dailyVolumeToken1: chartDataAsc[position].dailyVolumeToken1,
            dailyVolumeUSD: chartDataAsc[position].dailyVolumeUSD,
            dailyTxns: chartDataAsc[position].dailyTxns,
          };
        }
        n += 1;
      }
      if (!isFound) {
        return {
          date: dayToDisplay,
          reserve0: chartDataAsc[0].reserve0,
          reserve1: chartDataAsc[0].reserve1,
          totalSupply: chartDataAsc[0].totalSupply,
          reserveUSD: chartDataAsc[0].reserveUSD,
          dailyVolumeToken0: chartDataAsc[0].dailyVolumeToken0,
          dailyVolumeToken1: chartDataAsc[0].dailyVolumeToken1,
          dailyVolumeUSD: chartDataAsc[0].dailyVolumeUSD,
          dailyTxns: chartDataAsc[0].dailyTxns,
        };
      }
      return {};
    });
    return chartData;
  },
  getTotalLiquidityUSD: (state) => state.totalLiquidityUSD,
};
