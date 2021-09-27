import Web3 from 'web3';
import Web4 from '@cryptonteam/web4';
import BigNumber from 'bignumber.js';
import * as abi from '~/abi/abi';

let web3 = null;
let web4 = null;

let pingTimer = null;
let account = {};

let stakeTokenDecimalsMain;
let stakeTokenDecimalsLp;

let store;
let axios;

const web3ByChainId = {};

const testNetworksAddress = {
  0: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  1: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
};

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

const getStakeTokenDecimals = (postFix) => {
  if (postFix === 'Main') {
    return stakeTokenDecimalsMain;
  } if (postFix === 'Lp') {
    return stakeTokenDecimalsLp;
  }
  console.log('unknown postfix');
  return false;
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
      if (process.env.PROD === 'true' && (+chainId !== 1)) {
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

export const staking = async (_decimals, _amount) => {
  const instance = await createInstance(abi.ERC20, process.env.LP_TOKEN);
  const contractInstance = await createInstance(abi.StakingWQ, process.env.STAKING_ADDRESS);
  const allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, process.env.LP_TOKEN, [getAccount().address, process.env.STAKING_ADDRESS])).toString();
  const form = 10 ** _decimals;
  let amount = Math.floor(_amount * form) / form;
  try {
    amount = new BigNumber(amount.toString()).shiftedBy(+_decimals).toString();
    if (+allowance < +amount) {
      store.dispatch('main/setStatusText', 'Approving');
      showToast('Stacking', 'Approving...', 'success');
      await instance.approve(process.env.STAKING_ADDRESS, amount);
      showToast('Stacking', 'Approving done', 'success');
      showToast('Stacking', 'Staking...', 'success');
      store.dispatch('main/setStatusText', 'Staking');
      await contractInstance.stake(amount);
      showToast('Stacking', 'Staking done', 'success');
    }
    return '';
  } catch (e) {
    showToast('Stacking error', `${e.message}`, 'danger');
    return error(500, 'stake error', e);
  }
};

export const unStaking = async (_decimals, _amount) => {
  const contractInstance = await createInstance(abi.StakingWQ, process.env.STAKING_ADDRESS);
  const form = 10 ** _decimals;
  let amount = Math.floor(_amount * form) / form;
  try {
    amount = new BigNumber(amount.toString()).shiftedBy(+_decimals).toString();
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
  const contractInstance = await createInstance(abi.StakingWQ, process.env.STAKING_ADDRESS);
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
export const unstakeOfStake = async (_postFix, _amount) => {
  try {
    const stakeInstanse = getStakeInstance(_postFix);
    const decimals = getStakeTokenDecimals(_postFix);
    const response = await stakeInstanse.unstake(new BigNumber(_amount).shiftedBy(+decimals).toString());
    return output(response);
  } catch (e) {
    return error(500, 'unstake error', e);
  }
};

export const swap = async (_decimals, _amount) => {
  const instance = await createInstance(abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET);
  const contractInstance = await createInstance(abi.WQTExchange, process.env.EXCHANGE_ADDRESS_BSCTESTNET);
  const allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET, [getAccount().address, process.env.EXCHANGE_ADDRESS_BSCTESTNET])).toString();
  const form = 10 ** _decimals;
  let amount = Math.floor(_amount * form) / form;
  try {
    amount = new BigNumber(amount.toString()).shiftedBy(+_decimals).toString();
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
};

export const swapWithBridge = async (_decimals, _amount, chain, chainTo, userAddress, recipient, symbol) => {
  let exchangeAddress;
  let tokenAddress;
  let bridgeAddress;
  if (chain === 'ETH') {
    tokenAddress = process.env.WQT_TOKEN;
    exchangeAddress = process.env.EXCHANGE_ADDRESS_RINKEBY;
    bridgeAddress = process.env.BRIDGE_ADDRESS_RINKEBY;
  } else {
    tokenAddress = process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET;
    exchangeAddress = process.env.EXCHANGE_ADDRESS_BSCTESTNET;
    bridgeAddress = process.env.BRIDGE_ADDRESS_BSCTESTNET;
  }
  const instance = await createInstance(abi.ERC20, tokenAddress);
  const contractInstance = await createInstance(abi.WQBridge, bridgeAddress);
  const allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, tokenAddress, [getAccount().address, bridgeAddress])).toString();
  const nonce = await web3.eth.getTransactionCount(userAddress);
  const form = 10 ** _decimals;
  let amount = Math.floor(_amount * form) / form;
  try {
    amount = new BigNumber(amount.toString()).shiftedBy(+_decimals).toString();
    if (+allowance < +amount) {
      store.dispatch('main/setStatusText', 'Approving');
      showToast('Swapping', 'Approving...', 'success');
      await instance.approve(bridgeAddress, amount);
      showToast('Swapping', 'Approving done', 'success');
      showToast('Swapping', 'Swapping...', 'success');
      store.dispatch('main/setStatusText', 'Swapping');
      await contractInstance.swap(nonce, chainTo, amount, recipient, symbol);
      showToast('Swapping', 'Swapping done', 'success');
    }
    return '';
  } catch (e) {
    showToast('Swapping error', `${e.message}`, 'danger');
    return error(500, 'stake error', e);
  }
};

export const goToChain = async (chain) => {
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
        params: [{ chainId: '0x188C' }],
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
        params: [{ chainId: '0x89' }],
      });
    }
  }
};

export const redeemSwap = async (props) => {
  const { signData, chainId } = props;
  let bridgeAddress;
  console.log(chainId);
  if (chainId !== 2) {
    console.log('RINKEBY');
    bridgeAddress = process.env.BRIDGE_ADDRESS_RINKEBY;
  } else {
    console.log('BSC');
    bridgeAddress = process.env.BRIDGE_ADDRESS_BSCTESTNET;
  }
  // const contractInstance = await createInstance(abi.WQBridge, bridgeAddress);
  try {
    console.log('start redeem');
    console.log(bridgeAddress);
    console.log(signData[3]);
    // await contractInstance.SwapRedeemed(bridgeAddress, signData);
    const test = await sendTransaction('redeem', abi.WQBridge, bridgeAddress, signData, signData[3]);
    console.log(test);
    console.log('end redeem');
  } catch (err) {
    console.log(err);
  }
};
