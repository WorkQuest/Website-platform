export default {
  getTokensData: (state) => state.tokensData || '',
  getSwapsData: (state) => state.swapsData || '',
  getTokensDayData: (state) => state.tokensDayData[0] || '',
};
