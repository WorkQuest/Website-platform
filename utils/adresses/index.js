import * as dev from './dev';
import * as test from './test';
import * as stage from './stage';
import * as main from './main';

const keysByBranch = {
  main: main.default,
  stage: stage.default,
  test: test.default,
  dev: dev.default,
}[process.env.BRANCH];

export const IS_PROD = ['main', 'stage'].includes(process.env.BRANCH);

/**
 * @property BRANCH - ENV
 * @property WQ_EXPLORER
 * @property BASE_URL
 * @property GMAPKEY - ENV,
 * @property SECRET_SUMSUB - ENV

 * @property WQ_PROVIDER
 * @property WQ_EXPLORER
 * @property WQ_ORACLE_URL

 * @property NOTIFS_URL
 * @property WS_NOTIFS_URL
 * @property WS_CHAT_ACTIONS_URL
 * @property WS_WQ_PROVIDER

 * @property ETHEREUM_RPC_URL - ENV
 * @property ETHEREUM_BRIDGE
 * @property ETHEREUM_LP_TOKEN
 * @property ETHEREUM_MINING
 * @property ETHEREUM_WQT_TOKEN

 * @property BSC_BRIDGE
 * @property BSC_LP_TOKEN
 * @property BSC_MINING
 * @property BSC_OLD_WQT_TOKEN
 * @property BSC_WQT_EXCHANGE
 * @property BSC_WQT_TOKEN
 * @property BSC_RPC_URL

 * @property BSC_USDT_TOKEN
 * @property BSC_STABLE_BRIDGE

 * @property POLYGON_USDT_TOKEN
 * @property POLYGON_STABLE_BRIDGE

 * @property ETHEREUM_USDT_TOKEN
 * @property ETHEREUM_STABLE_BRIDGE

 * @property WBNB_TOKEN
 * @property WETH_TOKEN

 * @property WORKNET_BORROWING
 * @property WORKNET_BRIDGE
 * @property WORKNET_LENDING
 * @property WORKNET_ORACLE
 * @property WORKNET_PENSION_FUND
 * @property WORKNET_PROMOTION
 * @property WORKNET_REFERRAL
 * @property WORKNET_ROUTER
 * @property WORKNET_SAVING_PRODUCT
 * @property WORKNET_STAKING_WQT
 * @property WORKNET_STAKING_WUSD
 * @property WORKNET_WBNB_TOKEN
 * @property WORKNET_WETH_TOKEN
 * @property WORKNET_WUSD_TOKEN
 * @property WORKNET_USDT_TOKEN
 * @property WORKNET_WQ_FACTORY
 * @property WORKNET_VOTING
 */
export default keysByBranch;
