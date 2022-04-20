import { Chains, TokenSymbols, isProd } from '~/utils/enums';
import { StakingWQ, WQLiquidityMining } from '~/abi/index';
import { images } from '~/utils/images';

export const some = '';

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
