export default {
  getSwaps: (state) => state.swaps,
  getChartData: (state) => {
    const chartDataAsc = [...state.chartData].sort((a, b) => (a.date > b.date ? 1 : 0));
    const lastElementIndex = chartDataAsc.length - 1;
    return chartDataAsc.map((el, currentIndex) => {
      const currentDayIndex = lastElementIndex - currentIndex;
      const dayToDisplay = window.$nuxt.$root.$moment().utc(false).subtract(currentDayIndex, 'days');
      let n = 0;
      while (n <= lastElementIndex) {
        const position = lastElementIndex - n;
        if (window.$nuxt.$root.$moment(dayToDisplay).isSameOrAfter(chartDataAsc[position].date, 'days')) {
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
  getTotalSupply: (state) => state.totalSupply,
  getTotalStaked: (state) => state.stakingInfo.totalStaked,
  getTotalReward: (state) => state.stakingInfo.totalReward,
  getTotalLiquidityUSD: (state) => state.totalLiquidityUSD,
  getBalance: (state) => state.poolData.balance,
  getStaked: (state) => state.poolData.staked,
  getClaim: (state) => state.poolData.claim,
  getProfit: (state) => state.profit,
  getWQTPrice: (state) => state.wqtPrice,
};
