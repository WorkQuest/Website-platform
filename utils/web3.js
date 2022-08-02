import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import {
  Chains,
  ChainsId,
  NetworksData,
  ChainsIdByChainNumber,
} from '~/utils/enums';

import { IS_PROD } from '~/utils/addresses';

let web3 = null;
let account = {};

export const GetWeb3Provider = () => web3;

let store;
let axios;
let web3Modal;
let web3ModalCache;
if (process.browser) {
  window.onNuxtReady(({ $store, $axios }) => {
    store = $store;
    axios = $axios;
  });
}

export const getAccountAddress = () => account?.address;
export const getAccount = () => account;

export const showToast = (title, text, variant) => store?.dispatch('main/showToast', {
  title,
  text,
  variant,
}, { root: true });

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
  switch (chain) {
    case Chains.ETHEREUM:
      if (!IS_PROD) return ChainsId.ETH_TEST;
      return ChainsId.ETH_MAIN;
    case Chains.BINANCE:
      if (!IS_PROD) return ChainsId.BSC_TEST;
      return ChainsId.BSC_MAIN;
    case Chains.WORKNET:
      if (!IS_PROD) {
        if (process.env.BRANCH === 'develop') return ChainsId.WORKNET_DEV;
        return ChainsId.WORKNET_TEST;
      }
      return ChainsId.WORKNET_MAIN;
    case Chains.POLYGON:
      if (!IS_PROD) return ChainsId.MUMBAI_TEST;
      return ChainsId.MATIC_MAIN;
    default:
      console.log(chain);
      throw error(-1, `wrong chain name: ${chain} ${Chains.BINANCE} ${Chains.ETHEREUM}`);
  }
};

export const addedNetwork = async (chain) => {
  try {
    // TODO: refactor
    let networkParams = {};
    if (chain === Chains.ETHEREUM || [+ChainsId.ETH_MAIN, +ChainsId.ETH_TEST].includes(+chain)) {
      networkParams = IS_PROD ? NetworksData.ETH_MAIN : NetworksData.ETH_TEST;
    } else if (chain === Chains.BINANCE || [+ChainsId.BSC_MAIN, +ChainsId.BSC_TEST].includes(+chain)) {
      networkParams = IS_PROD ? NetworksData.BSC_MAIN : NetworksData.BSC_TEST;
    } else if (chain === Chains.WORKNET || [+ChainsId.WORKNET_DEV, +ChainsId.WORKNET_TEST, +ChainsId.WORKNET_MAIN].includes(+chain)) {
      if (IS_PROD) networkParams = NetworksData.WORKNET_MAIN;
      else networkParams = process.env.BRANCH === 'develop' ? NetworksData.WORKNET_DEV : NetworksData.WORKNET_TEST;
    } else if (chain === Chains.POLYGON || [+ChainsId.MUMBAI_TEST, +ChainsId.MATIC_MAIN].includes(+chain)) {
      networkParams = IS_PROD ? NetworksData.MATIC_MAIN : NetworksData.MUMBAI_TEST;
    }
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
    return { ok: true };
  } catch (addError) {
    showToast('Added chain error:', `${addError.message}`, 'danger');
    return error(500, 'added chain error', addError);
  }
};
export const goToChain = async (chain) => {
  const methodName = 'wallet_switchEthereumChain';
  const chainIdParam = typeof chain === 'string' ? getChainIdByChain(chain) : ChainsIdByChainNumber[chain];
  try {
    await window.ethereum.request({
      method: methodName,
      params: [{ chainId: chainIdParam }],
    });
    account = {
      address: getAccountAddress(),
      netId: +chainIdParam,
    };
    await store.dispatch('web3/updateAccount', account);
    return success();
  } catch (e) {
    if (e.code === 4902) {
      return await addedNetwork(chain);
    }
    if (e.code === -32002) {
      showToast('Please open Metamask to change network');
      return error(e.code, 'switch chain error', e);
    }
    if (typeof window.ethereum !== 'undefined') {
      showToast('Switch chain error:', `${e.message}`, 'danger');
      return error(500, 'switch chain error', e);
    }
    return error(e.code);
  }
};

export const fetchContractData = async (_method, _abi, _address, _params, _provider = web3) => {
  try {
    if (!_provider) {
      console.error('_provider is undefined');
      return false;
    }
    const inst = new _provider.eth.Contract(_abi, _address);
    return await inst.methods[_method].apply(this, _params).call();
  } catch (e) {
    console.error(`Fetch contract data [${_method}]: ${e.message}`);
    return false;
  }
};

export const handleMetamaskStatus = (callback) => {
  const { ethereum } = window;
  ethereum.on('chainChanged', callback);
  ethereum.on('accountsChanged', callback);
};

export const initProvider = async (payload) => {
  const isReconnection = payload?.isReconnection;
  const { chain } = payload;
  try {
    let walletOptions;
    // TODO refactor, need to get network params by chain and branch
    if (!IS_PROD) {
      if (chain === Chains.ETHEREUM) {
        walletOptions = {
          rpc: {
            4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
          },
          // network: 'ethereum',
        };
      } else if (chain === Chains.BINANCE) {
        walletOptions = {
          rpc: {
            97: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
          },
          // network: 'binance',
        };
      } else if (chain === Chains.WORKNET) {
        if (process.env.BRANCH === 'develop') {
          walletOptions = {
            rpc: {
              20220112: 'https://dev-node-nyc3.workquest.co',
            },
            // network: 'worknet',
          };
        } else {
          walletOptions = {
            rpc: {
              1991: 'https://testnet-gate.workquest.co/',
            },
            // network: 'worknet',
          };
        }
      }
    }
    if (IS_PROD) {
      if (chain === Chains.ETHEREUM) {
        walletOptions = {
          rpc: {
            1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
          },
          // network: 'ethereum',
        };
      } else if (chain === Chains.BINANCE) {
        walletOptions = {
          rpc: {
            56: 'https://bsc-dataseed.binance.org/',
          },
          // network: 'binance',
        };
      } else if (chain === Chains.WORKNET) {
        walletOptions = {
          rpc: {
            2009: 'https://mainnet-gate.workquest.co/',
          },
          // network: 'worknet',
        };
      }
    }

    web3Modal = new Web3Modal({
      // theme: 'dark',
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: walletOptions,
        },
      }, // required
    });

    let provider = web3ModalCache;
    if (!isReconnection) {
      provider = await web3Modal.connect();
    }
    web3ModalCache = provider;
    if (provider.isMetaMask) {
      localStorage.setItem('isMetaMask', 'true');
    } else {
      localStorage.setItem('isMetaMask', 'false');
    }
    return provider;
  } catch (e) {
    console.log(e);
    return error(500, 'User has not selected a wallet', e);
  }
};

export const initWeb3 = async (payload) => {
  try {
    let userAddress;
    const provider = await initProvider(payload);
    web3 = new Web3(provider);
    userAddress = await web3.eth.getCoinbase();
    if (userAddress === null) {
      await provider.enable();
      userAddress = await web3.eth.getCoinbase();
    }
    const chainId = await web3.eth.net.getId();
    if ((await web3.eth.getCoinbase()) === null) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    account = {
      address: userAddress,
      netId: chainId,
    };
    return success(account);
  } catch (e) {
    return error(500, '', 'Connected error');
  }
};

export const disconnectWeb3 = () => {
  if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER') === 'walletconnect') {
    localStorage.removeItem('walletconnect');
    localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
  }
  if (web3Modal) {
    web3Modal.clearCachedProvider();
  }
  web3 = null;
  account = {};
};

// Get Balance for native token
export const getNativeBalance = async (address = getAccountAddress(), _provider = web3) => await _provider.eth.getBalance(address);

// Get transaction count (or nonce) for this address
export const getTransactionCount = async (address = getAccountAddress(), _provider = web3) => await _provider.eth.getTransactionCount(address);

// Get current gas price
export const getGasPrice = async () => await web3.eth.getGasPrice();

export const createInstance = (abi, address) => new web3.eth.Contract(abi, address);

export const getAllowance = async (owner, sender, inst = null, abi = null, address = null) => {
  try {
    if (!inst) inst = createInstance(abi, address);
    return await inst.methods.allowance.apply(null, [owner, sender]).call();
  } catch (e) {
    console.error('Error in getAllowance', e);
    throw e;
  }
};

export const makeApprove = async (spender, amount, inst = null, abi = null, address = null) => {
  try {
    if (!inst) inst = createInstance(abi, address);
    await inst.methods.approve(spender, amount).send({
      from: getAccountAddress(),
    });
  } catch (e) {
    console.error('Error in makeApprove', e);
    throw e;
  }
};

// Get estimate gas
export const getEstimateGas = async (contractAbi = null, contractAddress = null, inst = null, method, attr, value = null) => {
  try {
    if (!inst) inst = createInstance(contractAbi, contractAddress);
    return await
    (value)
      ? inst.methods[method](...attr).estimateGas({ from: getAccountAddress(), value })
      : inst.methods[method](...attr).estimateGas({ from: getAccountAddress() });
  } catch (e) {
    console.error('getGasPriceError', e);
    return false;
  }
};

// Calculate transaction fee for method
export const getTransactionFee = async (accountAddress, _abi, _contractAddress, method, data = null, value = null, provider = web3) => {
  try {
    if (!method) {
      console.error('getTransactionFee undefined method');
      return error();
    }
    if (!provider) {
      console.error('getTransactionFee undefined provider');
      return error();
    }
    const inst = new provider.eth.Contract(_abi, _contractAddress);
    const gasPrice = await provider.eth.getGasPrice();
    const gasEstimate = await inst.methods[method].apply(null, data).estimateGas({ from: accountAddress, value });
    return new BigNumber(gasPrice * gasEstimate).shiftedBy(-18).toString();
  } catch (e) {
    return error(500, 'Get transaction fee error', e);
  }
};

let actionsListeners = [];
let lastActionHash = null;

export const unsubscirbeListeners = () => {
  for (let i = 0; i < actionsListeners.length; i += 1) {
    actionsListeners[i].unsubscribe();
  }
  actionsListeners = [];
  lastActionHash = null;
};
export const fetchContractAction = (inst, method, callback, params) => inst.events[method](params, (err, result) => {
  if (!err && callback && lastActionHash !== result.transactionHash) {
    lastActionHash = result.transactionHash;
    callback(method, result);
  }
});
export const fetchActions = async (stakingAbi, stakingAddress, callback, events, params = []) => {
  const contractInst = new web3.eth.Contract(stakingAbi, stakingAddress);
  await unsubscirbeListeners();
  for (let i = 0; i < events.length; i += 1) {
    actionsListeners.push(fetchContractAction(contractInst, events[i], callback, params[i]));
  }
};
