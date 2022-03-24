import { Chains, TokenSymbols } from '~/utils/enums';

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
      title: TokenSymbols.ETH,
      chain: Chains.ETHEREUM,
    },
  ],
  [
    Chains.BINANCE,
    {
      icon: require('~/assets/img/ui/bnb_yellow.svg'),
      title: TokenSymbols.BNB,
      chain: Chains.BINANCE,
    },
  ],
  [
    Chains.WORKNET,
    {
      icon: require('~/assets/img/ui/WQT.png'),
      title: TokenSymbols.WQT,
      chain: Chains.WORKNET,
    },
  ],
]);
