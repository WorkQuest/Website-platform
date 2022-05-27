import { Chains, isProd } from '~/utils/enums';
import { WQLiquidityMining } from '~/abi/index';
import { images } from '~/utils/images';
import ENV from '~/utils/adresses/index';

export const PoolURL = Object.freeze({
  BNB: 'https://pancakeswap.finance/add/BNB/0xe89508D74579A06A65B907c91F697CF4F8D9Fac7',
  ETH: 'https://app.uniswap.org/#/add/v2/0x06677dc4fe12d3ba3c7ccfd0df8cd45e4d4095bf/ETH',
});

export const Pool = new Map([
  [
    Chains.ETHEREUM,
    {
      chain: Chains.ETHEREUM,
      rewardToken: ENV.ETHEREUM_WQT_TOKEN,
      stakingToken: ENV.ETHEREUM_LP_TOKEN,
      stakingAddress: ENV.ETHEREUM_MINING,
      stakingAbi: WQLiquidityMining,
      icon: images.ETH,
      provider: process.env.ETHEREUM_RPC_URL,
      // need only for testnet, in mainnet we can use stakingToken
      lpToken: isProd ? ENV.ETHEREUM_LP_TOKEN : '0xf1fE852fCA1b5a869ef1FE06a2799E1F38B70B84',
      miningAddress: isProd ? ENV.ETHEREUM_MINING : '0x85fCeFe4b3646E74218793e8721275D3448b76F4',
    },
  ],
  [
    Chains.BINANCE,
    {
      chain: Chains.BINANCE,
      rewardToken: ENV.BSC_WQT_TOKEN,
      stakingToken: ENV.BSC_LP_TOKEN,
      stakingAddress: ENV.BSC_MINING,
      stakingAbi: WQLiquidityMining,
      icon: images.BNB,
      provider: ENV.BSC_RPC_URL,
      // need only for testnet, in mainnet we can use stakingToken
      lpToken: isProd ? ENV.BSC_LP_TOKEN : '0x3EA2de549ae9DcB7992F91227e8d6629A22C3b40',
      miningAddress: isProd ? ENV.BSC_MINING : '0x7F31d9c6Cf99DDB89E2a068fE7B96d230b9D19d1',
    },
  ],
]);
