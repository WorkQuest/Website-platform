export default {
  BASE_URL: 'https://testnet-app.workquest.co/api/',
  SUMSUB_URL: 'https://cockpit.sumsub.com',
  // GMAPKEY: process.env.GMAPKEY,
  // SECRET_SUMSUB: process.env.SECRET_SUMSUB,

  WQ_PROVIDER: 'https://testnet-gate.workquest.co',
  ETH_PROVIDER: 'https://purple-newest-replica.rinkeby.quiknode.pro/c6df441ce132d1593e56f9b29f3eec92ec666709',
  BSC_PROVIDER: 'https://falling-solemn-tab.bsc-testnet.quiknode.pro/f9994103eaa58d8a21af4e462e9dc21009e2ee8c',
  POLYGON_PROVIDER: 'https://thrumming-broken-crater.matic-testnet.quiknode.pro/c63d640e4507796d4278309bfbaa707f6c276cac',

  WQ_WS_PROVIDER: 'wss://testnet-gate-01.workquest.co/tendermint-rpc/websocket',
  ETH_WS_PROVIDER: 'wss://purple-newest-replica.rinkeby.quiknode.pro/c6df441ce132d1593e56f9b29f3eec92ec666709',
  BSC_WS_PROVIDER: 'wss://falling-solemn-tab.bsc-testnet.quiknode.pro/f9994103eaa58d8a21af4e462e9dc21009e2ee8c',
  POLYGON_WS_PROVIDER: 'wss://thrumming-broken-crater.matic-testnet.quiknode.pro/c63d640e4507796d4278309bfbaa707f6c276cac',

  WQ_EXPLORER: 'https://testnet-explorer-api.workquest.co/api/v1',
  WQ_ORACLE_URL: 'https://testnet-oracle.workquest.co/api/v1',
  WQ_LIQUIDATOR_URL: 'https://testnet-liquidator.workquest.co/api/v1',
  NOTIFS_URL: 'https://testnet-notification.workquest.co/api/',

  WS_NOTIFS_URL: 'wss://testnet-notification.workquest.co/api/v1/notifications',
  WS_CHAT_ACTIONS_URL: 'wss://testnet-app.workquest.co/api/v1/notifications/chat',

  ETHERSCAN_API_URL: 'https://api-rinkeby.etherscan.io/api',
  BSCSCAN_API_URL: 'https://api-testnet.bscscan.com/api',
  POLYGONSCAN_API_URL: 'https://api-testnet.polygonscan.com/api',

  ETHEREUM_BRIDGE: '0x96213B35117C9713D51AA975a281e448d8fFe72f',
  ETHEREUM_STABLE_BRIDGE: '0x9870a749Ae5CdbC4F96E3D0C067eB212779a8FA1',
  ETHEREUM_USDC_TOKEN: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
  ETHEREUM_USDT_TOKEN: '0x55Ca68111bDF746A76F4Ac19FDf2Cc516Bfd48cc',
  ETHEREUM_LP_TOKEN: '0x6dc948fF7AC50B60ecFd208974aE79f9A444Fe18',
  ETHEREUM_MINING: '0x917dc1a9E858deB0A5bDCb44C7601F655F728DfE',
  ETHEREUM_WQT_TOKEN: '0x73F188C779587eD79415D93F7032b9DA45B60f3A',
  // ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,

  BSC_BRIDGE: '0xEeCB550F5C850C5200C0ea02Fa6caA43C89aC252',
  BSC_STABLE_BRIDGE: '0x833d71EF0b51Aa9Fb69b1f986381132628ED10F3',
  BSC_USDT_TOKEN: '0x7562F0B6B6A90d27FE99cAAA03f637aec88200D9', // decimals 18
  BSC_USDC_TOKEN: '0x0D36247C353b6c857984129aDA6AF067ABA74afa', // decimals 18
  BSC_LP_TOKEN: '0x64326F459a5a0135FD95B50c07916faF101f9F29',
  BSC_MINING: '0xd919F27c74C1873986Fe97a482Fe71228CeDa40A',
  BSC_OLD_WQT_TOKEN: '0x75349C3f2C3CFD94488A71a350Ba841C14309c5b',
  BSC_WQT_EXCHANGE: '0x4F78EC055f079D68341eCB0e2cC4BeC5b10334C4',
  BSC_WQT_TOKEN: '0xd32FCb9C2cecE43c32Ce346C81b1c1460a4049A7',
  BSC_RPC_URL: 'https://bsc-dataseed.binance.org/',

  POLYGON_USDT_TOKEN: '0x631E327EA88C37D4238B5c559A715332266e7Ec1',
  POLYGON_STABLE_BRIDGE: '0xE2e7518080a0097492087E652E8dEB1f6b96B62b',
  WORKNET_ETH_AUCTION: '0x09083640347Ed569A58dfa5F862E26456827E3c0',
  WORKNET_BNB_AUCTION: '0x05C07481441795f4B6a6a455cde45139062693A6',
  WORKNET_USDT_AUCTION: '0x779ed11983B3daA43a55E2c01dD3EA89A227e5D7',
  WORKNET_USDC_AUCTION: '0x9a02C7Cde2d83556870F91c78c58052D0D330e37',
  WORKNET_BORROWING: '0xAD10a2538a3FCC3748eD8eC53e586dDf3EA56344',
  WORKNET_BRIDGE: '0xAA00DA59dD36a66f677E8305b94e75DA74204E63',
  WORKNET_LENDING: '0xEB604754C4A7cd0771278aC0c335739187Ca4900',
  WORKNET_ORACLE: '0x64111bDFf2176CfdFDd2863804f9f6c4F4536AEf',
  WORKNET_PENSION_FUND: '0x760cFBa449e6897FD4fcF370cdAc37E978198252',
  WORKNET_PROMOTION: '0x23918c4cC7001fB4e2BF28c8283b02BcD6975bf0',
  WORKNET_REFERRAL: '0x630C6Ec460E8252549E8483ee9aDA8923754dFD3',
  WORKNET_ROUTER: '0xCa38f5061E68924D0c00cf331dBc87eFE60fC5e3',
  WORKNET_SAVING_PRODUCT: '0xaFbadED10D19032f4Df676002DB0956F2FBE6437',
  WORKNET_STAKING_WQT: '0xd64b62d4F571173c3E27A6aE1cBadaf21d09189C',
  WORKNET_STAKING_WUSD: '0x89F4ef98E10dC9b907Ba0e6cd3D37376D304F5CD',
  WORKNET_WBNB_TOKEN: '0xa337B9E29e12d06339b1fEaB0fA48118b53F7baA',
  WORKNET_WETH_TOKEN: '0x4339A9DE478d37Aff3858E3ab5e548d5096629E8',
  WORKNET_WUSD_TOKEN: '0xF95eF11d0af1f40995218Bb2B67Ef909bcf30078',
  WORKNET_USDT_TOKEN: '0xAD6fc739Aa794990bA05e325A72772A6E131D267',
  WORKNET_USDC_TOKEN: '0x888d8d4114aceE9E7439Da2239dbE0352984A0b5',
  WORKNET_WQ_FACTORY: '0xdB53703E7998441d93794cb0AF1092Fac2778124',
  WORKNET_VOTING: '0x4B4a9201384BB7756B2d7ab73b0697cA90A9191E',
};
