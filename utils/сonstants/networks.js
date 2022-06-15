import ENV, { IS_PROD } from '~/utils/addresses';
import { ChainsId } from '~/utils/enums';

export const ChainId = {
  ETH: {
    develop: '0x4',
    testnet: '0x4',
    stage: '0x1',
    master: '0x1',
  }[process.env.BRANCH],
  BSC: {
    develop: '0x61',
    testnet: '0x61',
    stage: '0x38',
    master: '0x38',
  }[process.env.BRANCH],
  MATIC: {
    develop: '0x13881',
    testnet: '0x13881',
    stage: '0x89',
    master: '0x89',
  }[process.env.BRANCH],
  WORKNET: {
    develop: '0x13488D0',
    testnet: '0x7C7',
    stage: '0x7C7',
    master: '0x7C7',
  }[process.env.BRANCH],
};

export const ChainsIdByChainNumber = {
  1: [ChainsId.ETH_MAIN],
  4: [ChainsId.ETH_TEST],

  56: [ChainsId.BSC_MAIN],
  97: [ChainsId.BSC_TEST],

  137: [ChainsId.MATIC_MAIN],
  80001: [ChainsId.MUMBAI_TEST],

  20220112: [ChainsId.WORKNET_DEV],
  1991: [ChainsId.WORKNET_TEST],
};
