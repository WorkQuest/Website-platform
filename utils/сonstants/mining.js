import { Chains } from '~/utils/enums';
import { StakingWQ, WQLiquidityMining } from '~/abi/index';
import { images } from '~/utils/images';

export const PoolURL = Object.freeze({
  BNB: 'https://pancakeswap.finance/add/BNB/0xe89508D74579A06A65B907c91F697CF4F8D9Fac7',
  ETH: 'https://app.uniswap.org/#/add/v2/0x06677dc4fe12d3ba3c7ccfd0df8cd45e4d4095bf/ETH',
});

export const Pool = new Map([
  [
    Chains.ETHEREUM,
    {
      chain: Chains.ETHEREUM,
      rewardToken: process.env.ETHEREUM_WQT_TOKEN,
      stakingToken: process.env.ETHEREUM_LP_TOKEN,
      stakingAddress: process.env.ETHEREUM_MINING,
      stakingAbi: StakingWQ,
      icon: images.ETH,
    },
  ],
  [
    Chains.BINANCE,
    {
      chain: Chains.BINANCE,
      rewardToken: process.env.BSC_WQT_TOKEN,
      stakingToken: process.env.BSC_LP_TOKEN,
      stakingAddress: process.env.BSC_MINING,
      stakingAbi: WQLiquidityMining,
      icon: images.BNB,
    },
  ],
]);
