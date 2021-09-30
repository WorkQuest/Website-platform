import Web3 from 'web3';
import Web4 from '@cryptonteam/web4';
import BigNumber from 'bignumber.js';
import * as abi from '~/abi/abi';

let web3 = null;
let web4 = null;

let pingTimer = null;
let account = {};

let store;
let axios;

if (process.browser) {
  window.onNuxtReady(({ $store, $axios }) => {
    store = $store;
    axios = $axios;
  });
}

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

export const sendTransaction = async (_method, _abi, _address, _params, _userAddress, _provider = web3) => {
  const inst = new web3.eth.Contract(_abi, _address);
  const data = inst.methods[_method].apply(null, _params).encodeABI();
  return await web3.eth.sendTransaction({
    to: _address,
    data,
    from: _userAddress,
  });
};

const getChainTypeById = (chainId) => {
  if (+chainId === 1 || +chainId === 4) {
    return 0;
  }
  if (+chainId === 56 || +chainId === 97) {
    return 1;
  }
  if (+chainId === 80001 || +chainId === 137) {
    return 2;
  }
  return -1;
};

export const startPingingMetamask = async (callback) => {
  try {
    if (web3) {
      clearInterval(pingTimer);
      const referenceAddress = await web3.eth.getCoinbase();
      const referenceChainId = await web3.eth.net.getId();
      pingTimer = setInterval(async () => {
        if (!web3) {
          callback();
          clearInterval(pingTimer);
        }
        const address = await web3.eth.getCoinbase();
        const chainId = await web3.eth.net.getId();
        const isChangedAddress = address !== referenceAddress;
        const isChangedNetId = chainId !== referenceChainId;
        if (isChangedAddress || isChangedNetId) {
          callback();
          clearInterval(pingTimer);
        }
      }, 2000);
    }
    return success();
  } catch (e) {
    return error(500, 'pingingMetamask err', e);
  }
};

export const initWeb3 = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      if ((await web3.eth.getCoinbase()) === null) {
        await window.ethereum.enable();
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
      await web4.setProvider(window.ethereum, userAddress);
      return success(account);
    }
    return 'ok';
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

export const getAccount = () => account;

let instance;
let contractInstance;
let allowance;
let form;
let amount;
let tokenAddress;
let stakingAddress;
let stakingAbi;
let bridgeAddress;
let nonce;

export const staking = async (_decimals, _amount) => {
  // form = 10 ** _decimals;
  // amount = Math.floor(_amount * form) / form;
  const miningPoolId = localStorage.getItem('miningPoolId');
  if (process.env.PROD === 'true') {
    if (miningPoolId === 'ETH') {
      tokenAddress = process.env.LP_TOKEN;
      stakingAddress = process.env.STAKING_ADDRESS;
      stakingAbi = abi.StakingWQ;
    } else {
      tokenAddress = process.env.MAINNET_STAKING_LP_TOKEN;
      stakingAddress = process.env.MAINNET_BSC_STAKING;
      stakingAbi = abi.WQLiquidityMining;
    }
  }
  if (process.env.PROD === 'false') {
    if (miningPoolId === 'ETH') {
      tokenAddress = process.env.LP_TOKEN;
      stakingAddress = process.env.STAKING_ADDRESS;
      stakingAbi = abi.StakingWQ;
    } else {
      tokenAddress = process.env.CAKE_LP_TOKEN;
      stakingAddress = process.env.TESTNET_BSC_STAKING;
      stakingAbi = abi.WQLiquidityMining;
    }
    console.log('tokenAddress', tokenAddress);
    console.log('stakingAddress', stakingAddress);
    console.log('stakingAbi', stakingAbi);
  }
  instance = await createInstance(abi.ERC20, tokenAddress);
  contractInstance = await createInstance(stakingAbi, stakingAddress);
  allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, tokenAddress, [getAccount().address, stakingAddress])).toString();
  try {
    amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
    if (+allowance < +amount) {
      store.dispatch('main/setStatusText', 'Approving');
      showToast('Stacking', 'Approving...', 'success');
      await instance.approve(stakingAddress, amount);
      showToast('Stacking', 'Approving done', 'success');
    }
    showToast('Stacking', 'Staking...', 'success');
    store.dispatch('main/setStatusText', 'Staking');
    await contractInstance.stake(amount);
    showToast('Stacking', 'Staking done', 'success');
    return '';
  } catch (e) {
    showToast('Stacking error', `${e.message}`, 'danger');
    return error(500, 'stake error', e);
  }
};

export const unStaking = async (_decimals, _amount) => {
  // form = 10 ** _decimals;
  // amount = Math.floor(_amount * form) / form;
  const miningPoolId = localStorage.getItem('miningPoolId');
  if (process.env.PROD === 'true') {
    if (miningPoolId === 'ETH') {
      stakingAddress = process.env.STAKING_ADDRESS;
      stakingAbi = abi.StakingWQ;
    } else {
      stakingAddress = process.env.MAINNET_BSC_STAKING;
      stakingAbi = abi.WQLiquidityMining;
    }
  }
  if (process.env.PROD === 'false') {
    if (miningPoolId === 'ETH') {
      stakingAddress = process.env.STAKING_ADDRESS;
      stakingAbi = abi.StakingWQ;
    } else {
      stakingAddress = process.env.TESTNET_BSC_STAKING;
      stakingAbi = abi.WQLiquidityMining;
    }
  }
  contractInstance = await createInstance(stakingAbi, stakingAddress);
  try {
    amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
    showToast('Unstacking', 'Unstacking...', 'success');
    store.dispatch('main/setStatusText', 'Staking');
    await contractInstance.unstake(amount);
    showToast('Unstacking', 'Unstaking done', 'success');
    return '';
  } catch (e) {
    showToast('Unstacking error', `${e.message}`, 'danger');
    return error(500, 'stake error', e);
  }
};

export const claimRewards = async (_decimals, _amount) => {
  const miningPoolId = localStorage.getItem('miningPoolId');
  if (process.env.PROD === 'true') {
    if (miningPoolId === 'ETH') {
      stakingAddress = process.env.STAKING_ADDRESS;
      stakingAbi = abi.StakingWQ;
    } else {
      stakingAddress = process.env.MAINNET_BSC_STAKING;
      stakingAbi = abi.WQLiquidityMining;
    }
  }
  if (process.env.PROD === 'false') {
    if (miningPoolId === 'ETH') {
      stakingAddress = process.env.STAKING_ADDRESS;
      stakingAbi = abi.StakingWQ;
    } else {
      stakingAddress = process.env.TESTNET_BSC_STAKING;
      stakingAbi = abi.WQLiquidityMining;
    }
  }
  contractInstance = await createInstance(stakingAbi, stakingAddress);
  try {
    showToast('Claiming', 'Claiming...', 'success');
    await contractInstance.claim();
    await contractInstance.rewardTotal();
    showToast('Claiming', 'Claiming done', 'success');
    return '';
  } catch (e) {
    showToast('Claim error', `${e.message}`, 'danger');
    return error(500, 'claim error', e);
  }
};

export const swap = async (_decimals, _amount) => {
  // form = 10 ** _decimals;
  // amount = Math.floor(_amount * form) / form;
  if (process.env.PROD === 'true') {
    instance = await createInstance(abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET);
    contractInstance = await createInstance(abi.MainNetWQTExchange, process.env.EXCHANGE_ADDRESS_BSCMAINNET);
    allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET, [getAccount().address, process.env.EXCHANGE_ADDRESS_BSCMAINNET])).toString();
    try {
      amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
      if (+allowance < +amount) {
        store.dispatch('main/setStatusText', 'Approving');
        showToast('Swapping', 'Approving...', 'success');
        await instance.approve(process.env.EXCHANGE_ADDRESS_BSCMAINNET, amount);
        showToast('Swapping', 'Approving done', 'success');
      }
      showToast('Swapping', 'Swapping...', 'success');
      await contractInstance.swap(amount);
      store.dispatch('main/setStatusText', 'Swapping');
      showToast('Swapping', 'Swapping done', 'success');
      return '';
    } catch (e) {
      showToast('Swapping error', `${e.message}`, 'danger');
      return error(500, 'stake error', e);
    }
  } if (process.env.PROD === 'false') {
    instance = await createInstance(abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET);
    contractInstance = await createInstance(abi.WQTExchange, process.env.EXCHANGE_ADDRESS_BSCTESTNET);
    allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET, [getAccount().address, process.env.EXCHANGE_ADDRESS_BSCTESTNET])).toString();
    try {
      amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
      if (+allowance < +amount) {
        store.dispatch('main/setStatusText', 'Approving');
        showToast('Swapping', 'Approving...', 'success');
        await instance.approve(process.env.EXCHANGE_ADDRESS_BSCTESTNET, amount);
        showToast('Swapping', 'Approving done', 'success');
      }
      showToast('Swapping', 'Swapping...', 'success');
      await contractInstance.swap(amount);
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
  // form = 10 ** _decimals;
  // amount = Math.floor(_amount * form) / form;
  if (process.env.PROD === 'true') {
    if (chain === 'ETH') {
      tokenAddress = process.env.MAINNET_ETH_WQT_TOKEN;
      bridgeAddress = process.env.MAINNET_ETH_BRIDGE;
    } else {
      tokenAddress = process.env.MAINNET_BSC_WQT_TOKEN;
      bridgeAddress = process.env.MAINNET_BSC_BRIDGE;
    }
    instance = await createInstance(abi.ERC20, tokenAddress);
    contractInstance = await createInstance(abi.MainNetWQBridge, bridgeAddress);
    allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, tokenAddress, [getAccount().address, bridgeAddress])).toString();
    nonce = await web3.eth.getTransactionCount(userAddress);
    try {
      amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
      if (+allowance < +amount) {
        store.dispatch('main/setStatusText', 'Approving');
        showToast('Swapping', 'Approving...', 'success');
        await instance.approve(bridgeAddress, amount);
        showToast('Swapping', 'Approving done', 'success');
      }
      showToast('Swapping', 'Swapping...', 'success');
      store.dispatch('main/setStatusText', 'Swapping');
      await contractInstance.swap(nonce, chainTo, amount, recipient, symbol);
      showToast('Swapping', 'Swapping done', 'success');
      return '';
    } catch (e) {
      showToast('Swapping error', `${e.message}`, 'danger');
      return error(500, 'stake error', e);
    }
  } if (process.env.PROD === 'false') {
    if (chain === 'ETH') {
      tokenAddress = process.env.NEW_WQT_TOKEN;
      bridgeAddress = process.env.BRIDGE_ADDRESS_RINKEBY;
    } else {
      tokenAddress = process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET;
      bridgeAddress = process.env.BRIDGE_ADDRESS_BSCTESTNET;
    }
    instance = await createInstance(abi.ERC20, tokenAddress);
    contractInstance = await createInstance(abi.WQBridge, bridgeAddress);
    allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, tokenAddress, [getAccount().address, bridgeAddress])).toString();
    nonce = await web3.eth.getTransactionCount(userAddress);
    let swapData = '';
    try {
      amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
      if (+allowance < +amount) {
        store.dispatch('main/setStatusText', 'Approving');
        showToast('Swapping', 'Approving...', 'success');
        await instance.approve(bridgeAddress, amount);
        showToast('Swapping', 'Approving done', 'success');
      }
      showToast('Swapping', 'Swapping...', 'success');
      store.dispatch('main/setStatusText', 'Swapping');
      swapData = await contractInstance.swap(nonce, chainTo, amount, recipient, symbol);
      showToast('Swapping', 'Swapping done', 'success');
      return swapData;
    } catch (e) {
      showToast('Swapping error', `${e.message}`, 'danger');
      return error(500, 'stake error', e);
    }
  }
  return '';
};

export const goToChain = async (chain) => {
  if (chain === 'undefined') {
    showToast('Error connect to Metamask', 'Wrong chain ID', 'danger');
  }
  if (chain === 'ETH') {
    if (process.env.PROD === 'false') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });
    }
    if (process.env.PROD === 'true') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
    }
  } else {
    if (process.env.PROD === 'false') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
    }
    if (process.env.PROD === 'true') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
    }
  }
};

export const redeemSwap = async (props) => {
  const { signData, chainId } = props;
  if (process.env.PROD === 'true') {
    if (chainId !== 2) {
      bridgeAddress = process.env.MAINNET_ETH_BRIDGE;
    } else {
      bridgeAddress = process.env.MAINNET_BSC_BRIDGE;
    }
    try {
      showToast('Redeeming', 'Redeem...', 'success');
      return await sendTransaction('redeem', abi.MainNetWQBridge, bridgeAddress, signData, signData[3]);
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
      return await sendTransaction('redeem', abi.WQBridge, bridgeAddress, signData, signData[3]);
    } catch (e) {
      showToast('Redeeming', `${e.message}`, 'warning');
      return error(500, 'redeem error', e);
    }
  }
  return '';
};
