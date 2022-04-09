import { Chains, TokenSymbols } from '~/utils/enums';

export const BlockchainIndex = Object.freeze({
  [Chains.WORKNET]: 1,
  [Chains.ETHEREUM]: 2,
  [Chains.BINANCE]: 3,
});

export const BlockchainByIndex = Object.freeze({
  1: Chains.WORKNET,
  2: Chains.ETHEREUM,
  3: Chains.BINANCE,
});

export const BridgeAddresses = Object.freeze({
  [Chains.WORKNET]: process.env.WORKNET_BRIDGE,
  [Chains.ETHEREUM]: process.env.ETHEREUM_BRIDGE,
  [Chains.BINANCE]: process.env.BSC_BRIDGE,
});

export const SwapAddresses = new Map([
  [
    Chains.ETHEREUM,
    {
      icon: require('~/assets/img/ui/ethereum.svg'),
      title: Chains.ETHEREUM,
      chain: Chains.ETHEREUM,
      index: BlockchainIndex.ETH,
      nativeSymbol: TokenSymbols.ETH,
      tokenAddress: {
        [TokenSymbols.WQT]: process.env.ETHEREUM_WQT_TOKEN,
      },
    },
  ],
  [
    Chains.BINANCE,
    {
      icon: require('~/assets/img/ui/bnb_yellow.svg'),
      title: Chains.BINANCE,
      chain: Chains.BINANCE,
      index: BlockchainIndex.BSC,
      nativeSymbol: TokenSymbols.BNB,
      tokenAddress: {
        [TokenSymbols.WQT]: process.env.BSC_WQT_TOKEN,
      },
    },
  ],
  [
    Chains.WORKNET,
    {
      icon: require('~/assets/img/ui/WQT.png'),
      title: Chains.WORKNET,
      chain: Chains.WORKNET,
      index: BlockchainIndex.WORKNET,
      nativeSymbol: TokenSymbols.WUSD,
      tokenAddress: {
        [TokenSymbols.WQT]: process.env.WORKNET_WQT_TOKEN,
        [TokenSymbols.ETH]: process.env.WORKNET_WETH_TOKEN,
        [TokenSymbols.BNB]: process.env.WORKNET_WBNB_TOKEN,
      },
    },
  ],
]);