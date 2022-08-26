import { LotsStatuses } from '~/utils/сonstants/auction';

export default () => ({
  currentTab: LotsStatuses.INACTIVE,

  lots: [],
  lotsCount: null,

  duration: {
    USDT: 0,
    USDC: 0,
    ETH: 0,
    BNB: 0,
  },
});
