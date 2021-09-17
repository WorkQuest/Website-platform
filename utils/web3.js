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

if (process.browser) {
  window.onNuxtReady(({ $store, $axios }) => {
    store = $store;
    axios = $axios;
  });
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
  } catch (err) {
    console.log(err);
    return false;
  }
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
  } catch (err) {
    return error(500, 'pingingMetamask err', err);
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

      if (process.env.PROD === 'false' && (+chainId !== 4)) {
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
  } catch (err) {
    return error(500, '', err.message);
  }
};

export const disconnectWeb3 = () => {
  web3 = null;
  web4 = null;
  account = {};
  console.log('disconnectWeb3');
};

export const createInstance = async (ab, address) => {
  const abs = web4.getContractAbstraction(ab);
  return await abs.getInstance(address);
};

export const getAccount = () => account;

export const staking = async (_decimals, _amount) => {
  try {
    const form = 10 ** _decimals;
    let amount = Math.floor(_amount * form) / form;
    amount = new BigNumber(amount.toString()).shiftedBy(+_decimals).toString();
    console.log('amount with precision', amount);
    const allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, process.env.LP_TOKEN, [getAccount().address, process.env.STAKING_ADDRESS])).toString();
    console.log('Allowance: ', allowance);
    if (+allowance < +amount) {
      store.dispatch('main/setStatusText', 'Approving');
      console.log('Approving...');
      const instance = await createInstance(abi.ERC20, process.env.LP_TOKEN);
      console.log(instance);
      const re = await instance.approve(process.env.STAKING_ADDRESS, amount);
      console.log(re);
    }
    console.log('Staking...');
    store.dispatch('main/setStatusText', 'Staking');
    const contractInstance = await createInstance(abi.StakingWQ, process.env.STAKING_ADDRESS);
    const days = 30;
    console.log('amount', amount);
    const stakeRes = await contractInstance.stake(amount);
    console.log('stakeRes', stakeRes);
    console.log('Staking done');
    return '';
  } catch (err) {
    return error(500, 'stake error', err);
  }
};

export const unStaking = async (_decimals, _amount) => {
  console.log('Unstaking start');
  try {
    const form = 10 ** _decimals;
    let amount = Math.floor(_amount * form) / form;
    console.log(4, _decimals, amount);
    amount = new BigNumber(amount.toString()).shiftedBy(+_decimals).toString();
    console.log('amount with precision', amount);
    console.log('Unstaking...');
    store.dispatch('main/setStatusText', 'Staking');
    const contractInstance = await createInstance(abi.StakingWQ, process.env.STAKING_ADDRESS);
    console.log(contractInstance);
    const stakeRes = await contractInstance.unstake(amount);
    console.log('stakeRes', stakeRes);
    console.log('Unstaking done');
    return '';
  } catch (err) {
    return error(500, 'stake error', err);
  }
};

export const claimRewards = async (_decimals, _amount) => {
  console.log('ClaimRewards');
  try {
    console.log('claiming...');
    const contractInstance = await createInstance(abi.StakingWQ, process.env.STAKING_ADDRESS);
    console.log(contractInstance);
    const stakeRes = await contractInstance.claim();
    const rewards = await contractInstance.rewardTotal();
    console.log('rewards', rewards);
    console.log('stakeRes', stakeRes);
    console.log('claiming done');
    return '';
  } catch (err) {
    return error(500, 'claim error', err);
  }
};
export const unstakeOfStake = async (_postFix, _amount) => {
  try {
    const stakeInstanse = getStakeInstance(_postFix);
    const decimals = getStakeTokenDecimals(_postFix);
    const response = await stakeInstanse.unstake(new BigNumber(_amount).shiftedBy(+decimals).toString());
    return output(response);
  } catch (err) {
    return error(500, 'unstake error', err);
  }
};
