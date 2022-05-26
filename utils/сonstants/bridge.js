import { Chains, TokenSymbols, isProd } from '~/utils/enums';
import ENV from '~/utils/adresses/index';

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
  [Chains.WORKNET]: ENV.WORKNET_BRIDGE,
  [Chains.ETHEREUM]: ENV.ETHEREUM_BRIDGE,
  [Chains.BINANCE]: ENV.BSC_BRIDGE,
  [Chains.POLYGON]: ENV.POLYGON_STABLE_BRIDGE,
});

export const BridgeEvents = Object.freeze({
  SWAP_INITIALIZED: 'SwapInitialized',
  SWAP_REDEEMED: 'SwapRedeemed',
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
        [TokenSymbols.WQT]: ENV.ETHEREUM_WQT_TOKEN,
        [TokenSymbols.USDT]: ENV.ETHEREUM_USDT_TOKEN,
      },
      explorer: `https://${isProd ? '' : 'rinkeby.'}etherscan.io`,
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
        [TokenSymbols.WQT]: ENV.BSC_WQT_TOKEN,
        [TokenSymbols.USDT]: ENV.BSC_USDT_TOKEN,
      },
      explorer: `https://${isProd ? '' : 'testnet.'}bscscan.com`,
    },
  ],
  [
    Chains.WORKNET,
    {
      icon: require('~/assets/img/ui/WQT.png'),
      title: Chains.WORKNET,
      chain: Chains.WORKNET,
      index: BlockchainIndex.WORKNET,
      nativeSymbol: TokenSymbols.WQT,
      tokenAddress: {
        [TokenSymbols.WQT]: ENV.WORKNET_WQT_TOKEN, // TODO fix it, this secret was deleted
        [TokenSymbols.ETH]: ENV.WORKNET_WETH_TOKEN,
        [TokenSymbols.BNB]: ENV.WORKNET_WBNB_TOKEN,
        [TokenSymbols.USDT]: ENV.WORKNET_USDT_TOKEN,
      },
      explorer: `https://${isProd ? 'dev-' : 'dev-'}explorer.workquest.co`,
    },
  ],
]);

/** Buy WQT Modal */
export const BuyWQTTokensData = new Map([
  [
    Chains.ETHEREUM,
    {
      title: Chains.ETHEREUM,
      chain: Chains.ETHEREUM,
      icon: require('~/assets/img/ui/ethereum.svg'),
      bridgeAddress: ENV.ETHEREUM_STABLE_BRIDGE,
      tokens: [
        {
          title: TokenSymbols.USDT,
          tokenAddress: ENV.ETHEREUM_USDT_TOKEN,
        },
      ],
    },
  ],
  [
    Chains.BINANCE,
    {
      title: Chains.BINANCE,
      chain: Chains.BINANCE,
      icon: require('~/assets/img/ui/bnb_yellow.svg'),
      bridgeAddress: ENV.BSC_STABLE_BRIDGE,
      tokens: [
        {
          title: TokenSymbols.USDT,
          tokenAddress: ENV.BSC_USDT_TOKEN,
        },
      ],
    },
  ],
  [
    Chains.POLYGON,
    {
      title: Chains.POLYGON,
      chain: Chains.POLYGON,
      icon: require('~/assets/img/ui/Polygon.svg'),
      bridgeAddress: ENV.POLYGON_STABLE_BRIDGE,
      tokens: [
        {
          title: TokenSymbols.USDT,
          tokenAddress: ENV.POLYGON_USDT_TOKEN,
        },
      ],
    },
  ],
]);
