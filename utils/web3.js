import Web3 from 'web3';
import Web4 from '@cryptonteam/web4';
import BigNumber from 'bignumber.js';
import * as abi from '~/abi/abi';
import { ChainsId, Chains, StakingTypes } from '~/utils/enums';

let web3 = null;
let web4 = null;

let account = {};

let store;
let axios;

if (process.browser) {
  window.onNuxtReady(({ $store, $axios }) => {
    store = $store;
    axios = $axios;
  });
}

export const getAccountAddress = () => account?.address;
export const getAccount = () => account;

export function showToast(title, text, variant) {
  store.dispatch('main/showToast', {
    title,
    text,
    variant,
  }, { root: true });
}

export const success = (res) => ({
  ok: true,
  result: res,
});

export const error = (code = 90000, msg = '', data = null) => ({
  ok: false,
  code,
  msg,
  data,
});

export const getChainIdByChain = (chain) => {
  const isProd = process.env.PROD === 'true';
  switch (chain) {
    case Chains.ETHEREUM:
      if (!isProd) return ChainsId.ETH_TEST;
      return ChainsId.ETH_MAIN;
    case Chains.BINANCE:
      if (!isProd) return ChainsId.BSC_TEST;
      return ChainsId.BSC_MAIN;
    case Chains.BNB:
      if (!isProd) return ChainsId.BSC_TEST;
      return ChainsId.BSC_MAIN;
    default:
      throw error(-1, `wrong chain name: ${chain} ${Chains.BINANCE} ${Chains.ETHEREUM}`);
  }
};
export const goToChain = async (chain) => {
  const methodName = 'wallet_switchEthereumChain';
  const chainIdParam = [{ chainId: getChainIdByChain(chain) }];
  try {
    await window.ethereum.request({
      method: methodName,
      params: chainIdParam,
    });
    return { ok: true };
  } catch (e) {
    if (typeof window.ethereum !== 'undefined') {
      showToast('Switch chain error:', `${e.message}`, 'danger');
    }
    return error(500, 'switch chain error', e);
  }
};

export const getStakingDataByType = (stakingType) => {
  let _stakingAddress;
  let _stakingAbi;
  let _tokenAddress;

  const _miningPoolId = localStorage.getItem('miningPoolId');
  switch (stakingType) {
    case StakingTypes.MINING:
      if (process.env.PROD === 'true') {
        if (_miningPoolId === 'ETH') {
          _tokenAddress = process.env.MAINNET_STAKING_ETH_LP_TOKEN;
          _stakingAddress = process.env.MAINNET_ETH_STAKING;
          _stakingAbi = abi.StakingWQ;
        } else {
          _tokenAddress = process.env.MAINNET_STAKING_LP_TOKEN;
          _stakingAddress = process.env.MAINNET_BSC_STAKING;
          _stakingAbi = abi.WQLiquidityMining;
        }
      }
      if (process.env.PROD === 'false') {
        if (_miningPoolId === 'ETH') {
          _tokenAddress = process.env.LP_TOKEN;
          _stakingAddress = process.env.STAKING_ADDRESS;
          _stakingAbi = abi.StakingWQ;
        } else {
          _tokenAddress = process.env.CAKE_LP_TOKEN;
          _stakingAddress = process.env.TESTNET_BSC_STAKING;
          _stakingAbi = abi.WQLiquidityMining;
        }
      }
      break;
    case StakingTypes.WQT:
      if (process.env.PROD === 'false') {
        _tokenAddress = process.env.WQT_TOKEN;
        _stakingAbi = abi.WQStaking;
        _stakingAddress = process.env.STAKING;
      }
      break;
    case StakingTypes.WUSD:
      if (process.env.PROD === 'false') {
        _stakingAbi = abi.WQStakingNative;
        _stakingAddress = process.env.STAKING_NATIVE;
      }
      break;
    default:
      console.error('[getStakingDataByType] wrong staking type: ', stakingType);
      return false;
  }

  return {
    stakingAddress: _stakingAddress,
    stakingAbi: _stakingAbi,
    tokenAddress: _tokenAddress,
  };
};

export const fetchContractData = async (_method, _abi, _address, _params, _provider = web3) => {
  try {
    if (_provider === undefined) return {};
    const Contract = new _provider.eth.Contract(_abi, _address);
    return await Contract.methods[_method].apply(this, _params).call();
  } catch (e) {
    console.log(e.message);
    return false;
  }
};

export const sendTransaction = async (_method, payload, _provider = web3) => {
  let transactionData;
  const inst = new web3.eth.Contract(payload.abi, payload.address);
  const gasPrice = await web3.eth.getGasPrice();
  if (_method === 'claim') {
    const data = inst.methods[_method].apply(null).encodeABI();
    const gasEstimate = await inst.methods[_method].apply(null).estimateGas({ from: account.address });
    transactionData = {
      to: payload.address,
      from: account.address,
      data,
      gasPrice,
      gas: gasEstimate,
    };
  } else {
    const data = inst.methods[_method].apply(null, payload.data).encodeABI();
    const gasEstimate = await inst.methods[_method].apply(null, payload.data).estimateGas({ from: account.address });
    transactionData = {
      to: payload.address,
      from: account.address,
      data,
      gasPrice,
      gas: gasEstimate,
    };
  }
  return await web3.eth.sendTransaction(transactionData);
};

const getChainTypeById = (chainId) => {
  if (+chainId === +ChainsId.ETH_MAIN || +chainId === +ChainsId.ETH_TEST) {
    return 0;
  }
  if (+chainId === +ChainsId.BSC_MAIN || +chainId === +ChainsId.BSC_TEST) {
    return 1;
  }
  if (+chainId === +ChainsId.MATIC_MAIN || +chainId === +ChainsId.MUMBAI_TEST) {
    return 2;
  }
  return -1;
};

export const handleMetamaskStatus = (callback) => {
  const { ethereum } = window;
  ethereum.on('chainChanged', callback);
  ethereum.on('accountsChanged', callback);
};

export const initWeb3 = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      web3 = new Web3(ethereum);
      if ((await web3.eth.getCoinbase()) === null) {
        await ethereum.enable();
      }
      const [userAddress, chainId] = await Promise.all([
        web3.eth.getCoinbase(),
        web3.eth.net.getId(),
      ]);
      if (process.env.PROD === 'true' && ![1, 56].includes(+chainId)) {
        return error(500, 'Wrong blockchain in metamask', 'Current site work on mainnet. Please change network.');
      }
      if (process.env.PROD === 'false' && ![4, 97].includes(+chainId)) {
        return error(500, 'Wrong blockchain in metamask', 'Current site work on testnet. Please change network.');
      }
      account = {
        address: userAddress,
        netId: chainId,
        netType: getChainTypeById(chainId),
      };
      web4 = new Web4();
      await web4.setProvider(ethereum, userAddress);
      return success(account);
    }
    return false;
  } catch (e) {
    return error(500, '', e.message);
  }
};

export const disconnectWeb3 = () => {
  web3 = null;
  web4 = null;
  account = {};
};

export const createInstance = async (ab, address) => {
  const abs = web4.getContractAbstraction(ab);
  return await abs.getInstance(address);
};

let tokenInstance;
let bridgeInstance;
let allowance;
let amount;
let nonce;

export const getStakingRewardTxFee = async (stakingType) => {
  let inst;
  if (stakingType === StakingTypes.WQT) {
    inst = new web3.eth.Contract(abi.WQStaking, process.env.STAKING);
  } else if (stakingType === StakingTypes.WUSD) {
    inst = new web3.eth.Contract(abi.WQStakingNative, process.env.STAKING_NATIVE);
  } else {
    console.error('[rewardTxFee] wrong staking type:', stakingType);
    return 0;
  }
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await inst.methods.claim.apply(null)
      .estimateGas({ from: account.address });
    return new BigNumber(gasPrice * gasEstimate).shiftedBy(-18)
      .decimalPlaces(8)
      .toString();
  } catch (e) {
    return error(500, 'TxFee error', e);
  }
};

export const staking = async (_decimals, _amount, _tokenAddress, _stakingAddress, _stakingAbi, duration, stakingType) => {
  let instance;
  const isNative = stakingType === StakingTypes.WUSD;
  if (!isNative) {
    instance = await createInstance(abi.ERC20, _tokenAddress);
    allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, _tokenAddress, [getAccountAddress(), _stakingAddress])).toString();
  }
  try {
    amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
    if (!isNative && +allowance < +amount) {
      store.dispatch('main/setStatusText', 'Approving');
      showToast('Staking', 'Approving...', 'success');
      await instance.approve(_stakingAddress, amount);
      showToast('Staking', 'Approving done', 'success');
    }
    showToast('Staking', 'Staking...', 'success');
    store.dispatch('main/setStatusText', 'Staking');
    const payload = {
      abi: _stakingAbi,
      address: _stakingAddress,
    };
    if (stakingType === StakingTypes.MINING) {
      payload.data = [amount];
    } else if (stakingType === StakingTypes.WQT) {
      payload.data = [amount, duration];
    } else if (stakingType === StakingTypes.WUSD) {
      // payload.data = { value: amount };
      const contractInstance = await createInstance(_stakingAbi, _stakingAddress);
      await contractInstance.stake({ value: amount });
      showToast('Staking', 'Staking done', 'success');
      return '';
    } else {
      console.error('[staking] wrong staking type:', stakingType);
      return error(500, 'stake error');
    }
    await sendTransaction('stake', payload);
    showToast('Staking', 'Staking done', 'success');
    return '';
  } catch (e) {
    if (e.message.toString().includes('You cannot stake tokens yet')) {
      showToast('Stacking error', 'You cannot stake tokens yet', 'danger');
    } else {
      showToast('Stacking error', `${e.message}`, 'danger');
    }
    return error(500, 'stake error', e);
  }
};

export const unStaking = async (_decimals, _amount) => {
  const { stakingAddress, stakingAbi } = getStakingDataByType(StakingTypes.MINING);
  try {
    amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
    showToast('Unstaking', 'Unstaking...', 'success');
    store.dispatch('main/setStatusText', 'Staking');
    const payload = {
      abi: stakingAbi,
      address: stakingAddress,
      data: [amount],
    };
    await sendTransaction('unstake', payload);
    showToast('Unstaking', 'Unstaking done', 'success');
    return '';
  } catch (e) {
    showToast('Unstaking error', `${e.message}`, 'danger');
    return error(500, 'stake error', e);
  }
};

export const claimRewards = async (_stakingAddress, _stakingAbi, _amount) => {
  try {
    showToast('Claiming', 'Claiming...', 'success');
    const payload = {
      abi: _stakingAbi,
      address: _stakingAddress,
    };
    await sendTransaction('claim', payload);
    showToast('Claiming', 'Claiming done', 'success');
    return '';
  } catch (e) {
    showToast('Claim error', `${e.message}`, 'danger');
    return error(500, 'claim error', e);
  }
};

export const swap = async (_decimals, _amount) => {
  let exchangeInstance;
  if (process.env.PROD === 'true') {
    tokenInstance = await createInstance(abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET);
    exchangeInstance = await createInstance(abi.MainNetWQTExchange, process.env.EXCHANGE_ADDRESS_BSCMAINNET);
    allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET, [account.address, process.env.EXCHANGE_ADDRESS_BSCMAINNET])).toString();
    try {
      amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
      if (+allowance < +amount) {
        store.dispatch('main/setStatusText', 'Approving');
        showToast('Swapping', 'Approving...', 'success');
        await tokenInstance.approve(process.env.EXCHANGE_ADDRESS_BSCMAINNET, amount);
        showToast('Swapping', 'Approving done', 'success');
      }
      showToast('Swapping', 'Swapping...', 'success');
      await exchangeInstance.swap(amount);
      store.dispatch('main/setStatusText', 'Swapping');
      showToast('Swapping', 'Swapping done', 'success');
      return '';
    } catch (e) {
      showToast('Swapping error', `${e.message}`, 'danger');
      return error(500, 'stake error', e);
    }
  } if (process.env.PROD === 'false') {
    tokenInstance = await createInstance(abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET);
    exchangeInstance = await createInstance(abi.WQTExchange, process.env.EXCHANGE_ADDRESS_BSCTESTNET);
    allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET, [account.address, process.env.EXCHANGE_ADDRESS_BSCTESTNET])).toString();
    try {
      amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
      if (+allowance < +amount) {
        store.dispatch('main/setStatusText', 'Approving');
        showToast('Swapping', 'Approving...', 'success');
        await tokenInstance.approve(process.env.EXCHANGE_ADDRESS_BSCTESTNET, amount);
        showToast('Swapping', 'Approving done', 'success');
      }
      showToast('Swapping', 'Swapping...', 'success');
      await exchangeInstance.swap(amount);
      store.dispatch('main/setStatusText', 'Swapping');
      showToast('Swapping', 'Swapping done', 'success');
      return '';
    } catch (e) {
      showToast('Swapping error', `${e.message}`, 'danger');
      return error(500, 'stake error', e);
    }
  }
  return '';
};

export const swapWithBridge = async (_decimals, _amount, chain, chainTo, userAddress, recipient, symbol) => {
  let swapData = '';
  let tokenAddress;
  let bridgeAddress;
  if (process.env.PROD === 'true') {
    if (chain === Chains.ETHEREUM) {
      tokenAddress = process.env.MAINNET_ETH_WQT_TOKEN;
      bridgeAddress = process.env.MAINNET_ETH_BRIDGE;
    } else {
      tokenAddress = process.env.MAINNET_BSC_WQT_TOKEN;
      bridgeAddress = process.env.MAINNET_BSC_BRIDGE;
    }
  } else if (chain === Chains.ETHEREUM) {
    tokenAddress = process.env.NEW_WQT_TOKEN;
    bridgeAddress = process.env.BRIDGE_ADDRESS_RINKEBY;
  } else {
    tokenAddress = process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET;
    bridgeAddress = process.env.BRIDGE_ADDRESS_BSCTESTNET;
  }
  tokenInstance = await createInstance(abi.ERC20, tokenAddress);
  bridgeInstance = await createInstance(abi.MainNetWQBridge, bridgeAddress);
  allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, tokenAddress, [account.address, bridgeAddress])).toString();
  nonce = await web3.eth.getTransactionCount(userAddress);
  try {
    amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
    if (+allowance < +amount) {
      store.dispatch('main/setStatusText', 'Approving');
      showToast('Swapping', 'Approving...', 'success');
      await tokenInstance.approve(bridgeAddress, amount);
      showToast('Swapping', 'Approving done', 'success');
    }
    showToast('Swapping', 'Swapping...', 'success');
    store.dispatch('main/setStatusText', 'Swapping');
    swapData = await bridgeInstance.swap(nonce, chainTo, amount, recipient, symbol);
    showToast('Swapping', 'Swapping done', 'success');
    return swapData;
  } catch (e) {
    showToast('Swapping error', `${e.message}`, 'danger');
    return error(500, 'stake error', e);
  }
};

export const redeemSwap = async (props) => {
  const { signData, chainId } = props;
  let bridgeAddress;
  if (process.env.PROD === 'true') {
    if (chainId !== 2) {
      bridgeAddress = process.env.MAINNET_ETH_BRIDGE;
    } else {
      bridgeAddress = process.env.MAINNET_BSC_BRIDGE;
    }
    try {
      showToast('Redeeming', 'Redeem...', 'success');
      const payload = {
        abi: abi.MainNetWQBridge,
        address: bridgeAddress,
        data: signData,
        userAddress: signData[3],
      };
      return await sendTransaction('redeem', payload);
    } catch (e) {
      showToast('Redeeming', `${e.message}`, 'warning');
      return error(500, 'redeem error', e);
    }
  } if (process.env.PROD === 'false') {
    if (chainId !== 2) {
      bridgeAddress = process.env.BRIDGE_ADDRESS_RINKEBY;
    } else {
      bridgeAddress = process.env.BRIDGE_ADDRESS_BSCTESTNET;
    }
    try {
      showToast('Redeeming', 'Redeem...', 'success');
      const payload = {
        abi: abi.WQBridge,
        address: bridgeAddress,
        data: signData,
        userAddress: signData[3],
      };
      return await sendTransaction('redeem', payload);
    } catch (e) {
      console.log(e);
      showToast('Redeeming', `${e.message}`, 'warning');
      return error(500, 'redeem error', e);
    }
  }
  return '';
};

let actionsListeners = [];
let lastActionHash = null;

export const unsubscirbeStakingListeners = () => {
  for (let i = 0; i < actionsListeners.length; i += 1) {
    actionsListeners[i].unsubscribe();
  }
  actionsListeners = [];
};
export const fetchContractAction = (inst, method, callback, params) => inst.events[method]({
  ...params,
}, (err, result) => {
  if (!err && callback && lastActionHash !== result.transactionHash) {
    lastActionHash = result.transactionHash;
    callback(method, result);
  }
});
export const fetchStakingActions = async (stakingAbi, stakingAddress, callback, events) => {
  const inst = new web3.eth.Contract(stakingAbi, stakingAddress);
  await unsubscirbeStakingListeners();
  for (let i = 0; i < events.length; i += 1) {
    actionsListeners.push(fetchContractAction(inst, events[i], callback));
  }
};

export const initStackingContract = async (chain) => {
  const stakingAbi = abi.WQLiquidityMining;
  let stakingAddress;
  let websocketProvider;
  if (chain === 'ETH') {
    stakingAddress = process.env.MAINNET_ETH_STAKING;
    websocketProvider = process.env.MAINNET_ETH_INFURA;
  } else {
    stakingAddress = process.env.MAINNET_BSC_STAKING;
    websocketProvider = process.env.MAINNET_BSC_MORALIS;
  }
  const liquidityMiningProvider = new Web3(new Web3.providers.WebsocketProvider(websocketProvider, {
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000,
    },
    reconnect: {
      auto: true,
      delay: 1000,
      onTimeout: false,
    },
  }));
  const liquidityMiningContract = new liquidityMiningProvider.eth.Contract(stakingAbi, stakingAddress);
  return await liquidityMiningContract.methods.getStakingInfo().call();
};
