import Web3 from 'web3';
import Web4 from '@cryptonteam/web4';
import BigNumber from 'bignumber.js';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import * as abi from '~/abi/abi';
import {
  Chains, ChainsId, ChainsIdByChainNumber, NetworksData, StakingTypes,
} from '~/utils/enums';

let bscRpcContract = null;
let web3 = null;
let web4 = null;

let account = {};

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
const isProd = process.env.PROD === 'true';

export const getAccountAddress = () => account?.address;
export const getAccount = () => account;

export const showToast = (title, text, variant) => store.dispatch('main/showToast', {
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
      if (!isProd) return ChainsId.ETH_TEST;
      return ChainsId.ETH_MAIN;
    case Chains.BINANCE:
      if (!isProd) return ChainsId.BSC_TEST;
      return ChainsId.BSC_MAIN;
    case Chains.BNB:
      if (!isProd) return ChainsId.BSC_TEST;
      return ChainsId.BSC_MAIN;
    case Chains.WORKNET:
      return ChainsId.WORKNET_TEST;
    default:
      throw error(-1, `wrong chain name: ${chain} ${Chains.BINANCE} ${Chains.ETHEREUM}`);
  }
};

export const addedNetwork = async (chain) => {
  try {
    let networkParams = {};
    if (chain === Chains.ETHEREUM || [1, 4].includes(+chain)) {
      networkParams = isProd ? NetworksData.ETH_MAIN : NetworksData.ETH_TEST;
    } else if (chain === Chains.BNB || [56, 97].includes(+chain)) {
      networkParams = isProd ? NetworksData.BSC_MAIN : NetworksData.BSC_TEST;
    } else if (chain === Chains.WORKNET || chain === 20220112) {
      networkParams = NetworksData.WORKNET_TEST;
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
    return { ok: true };
  } catch (e) {
    if (e.code === 4902) {
      return await addedNetwork(chain);
    }
    if (typeof window.ethereum !== 'undefined') {
      showToast('Switch chain error:', `${e.message}`, 'danger');
      return error(500, 'switch chain error', e);
    }
    return { ok: false };
  }
};
export const getStakingDataByType = (stakingType, token = '') => {
  let _stakingAddress;
  let _stakingAbi;
  let _tokenAddress;
  const _miningPoolId = localStorage.getItem('miningPoolId');
  switch (stakingType) {
    case StakingTypes.MINING:
      if (_miningPoolId === Chains.ETHEREUM) {
        _tokenAddress = process.env.ETHEREUM_LP_TOKEN;
        _stakingAddress = process.env.ETHEREUM_MINING;
        _stakingAbi = abi.StakingWQ;
      } else {
        _tokenAddress = process.env.BSC_LP_TOKEN;
        _stakingAddress = process.env.BSC_MINING;
        _stakingAbi = abi.WQLiquidityMining;
      }
      break;
    case StakingTypes.CROSS_CHAIN:
      if (_miningPoolId === Chains.ETHEREUM) {
        _tokenAddress = process.env.ETHEREUM_WQT_TOKEN;
        _stakingAddress = process.env.ETHEREUM_BRIDGE;
      } else if (_miningPoolId === Chains.BINANCE || _miningPoolId === Chains.BNB) {
        _tokenAddress = process.env.BSC_WQT_TOKEN;
        _stakingAddress = process.env.BSC_BRIDGE;
      } else if (_miningPoolId === Chains.WORKNET) {
        switch (token) {
          case 'BNB':
            _tokenAddress = process.env.WORKNET_WBNB_TOKEN;
            break;
          case 'ETH':
            _tokenAddress = process.env.WORKNET_WETH_TOKEN;
            break;
          default:
            _tokenAddress = process.env.WORKNET_WQT_TOKEN;
        }
        _stakingAddress = process.env.WORKNET_BRIDGE;
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
    if (!_provider) {
      console.error('_provider is undefined');
      return {};
    }
    const Contract = new _provider.eth.Contract(_abi, _address);
    return await Contract.methods[_method].apply(this, _params).call();
  } catch (e) {
    console.error(`Fetch contract data [${_method}]: ${e.message}`);
    return false;
  }
};

export const sendTransaction = async (_method, payload, _provider = web3) => {
  if (!_provider) {
    console.error('_provider is undefined');
    return false;
  }
  let transactionData;
  const inst = new _provider.eth.Contract(payload.abi, payload.address);
  const gasPrice = await _provider.eth.getGasPrice();
  const accountAddress = await web3.eth.getCoinbase();
  if (_method === 'claim') {
    const data = inst.methods[_method].apply(null).encodeABI();
    const gasEstimate = await inst.methods[_method].apply(null).estimateGas({ from: accountAddress });
    transactionData = {
      to: payload.address,
      from: accountAddress,
      data,
      gasPrice,
      gas: gasEstimate,
    };
  } else if (_method === 'swap') {
    const gasEstimate = await inst.methods[_method].apply(null, payload.data).estimateGas({
      from: accountAddress,
      value: payload.value,
    });
    await inst.methods.swap(...payload.data).send({
      from: accountAddress,
      value: payload.value,
      gasPrice,
      gas: gasEstimate,
    });
    return '';
  } else {
    const data = inst.methods[_method].apply(null, payload.data).encodeABI();
    const gasEstimate = await inst.methods[_method].apply(null, payload.data).estimateGas({ from: accountAddress });
    transactionData = {
      to: payload.address,
      from: accountAddress,
      data,
      gasPrice,
      gas: gasEstimate,
    };
  }
  // noinspection ES6RedundantAwait
  return await _provider.eth.sendTransaction(transactionData);
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
    if (!isProd) {
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
        walletOptions = {
          rpc: {
            20211224: 'https://dev-node-nyc3.workquest.co',
          },
          // network: 'worknet',
        };
      }
    }
    if (isProd) {
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
            20211224: 'https://dev-node-nyc3.workquest.co',
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
    web4 = new Web4();
    userAddress = await web3.eth.getCoinbase();
    await web4.setProvider(provider, userAddress);
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
  web4 = null;
  account = {};
};

// Get Balance for native token
export const getNativeBalance = async (address = getAccountAddress()) => await web3.eth.getBalance(address);

// Get transaction count (or nonce) for this address
export const getTransactionCount = async (address = getAccountAddress()) => await web3.eth.getTransactionCount(address);

// Get current gas price
export const getGasPrice = async () => await web3.eth.getGasPrice();

export const createInstanceWeb3 = async (ab, address) => new web3.eth.Contract(ab, address);

export const createInstance = async (ab, address) => {
  const abs = web4.getContractAbstraction(ab);
  return await abs.getInstance(address);
};

let tokenInstance;
let bridgeInstance;
let allowance;
let amount;
let nonce;

// Calculate transaction fee for method
export const getTransactionFee = async (_abi, _contractAddress, method, data = null, value = null) => {
  try {
    if (!method) console.error('getTransactionFee undefined method');
    const inst = new web3.eth.Contract(_abi, _contractAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await inst.methods[method].apply(null, data).estimateGas({ from: account.address, value });
    const fee = new BigNumber(gasPrice * gasEstimate).shiftedBy(-18).toString();
    return success(fee);
  } catch (e) {
    return error(500, 'Get transaction fee error', e);
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

export const unStaking = async (_decimals, _amount, _stakingAddress, _stakingAbi) => {
  try {
    amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
    showToast('Unstaking', 'Unstaking...', 'success');
    store.dispatch('main/setStatusText', 'Staking');
    const payload = {
      abi: _stakingAbi,
      address: _stakingAddress,
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

export const claimRewards = async (_stakingAddress, _stakingAbi) => {
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
    if (e.message.toString().includes('You cannot claim tokens yet')) {
      showToast('Stacking error', 'You cannot claim tokens yet', 'danger');
    } else {
      showToast('Claim error', `${e.message}`, 'danger');
    }
    return error(500, 'claim error', e);
  }
};

// TODO: DELETE
export const authRenewal = async (_stakingAddress, _stakingAbi) => {
  showToast('Auto renewal', 'Accepting...', 'success');
  try {
    const payload = {
      abi: _stakingAbi,
      address: _stakingAddress,
    };
    await sendTransaction('autoRenewal', payload);
    return success();
  } catch (e) {
    if (e.message.toString().includes('You cannot claim tokens yet')) {
      showToast('Stacking error', 'You cannot claim tokens yet', 'danger');
    } else if (e.message.toString().includes('You cannot stake tokens yet')) {
      showToast('Stacking error', 'You cannot stake tokens yet', 'danger');
    } else {
      showToast('Auto renewal error', `${e.message}`, 'danger');
    }
    return error(500, 'auto renewal', e);
  }
};

export const swap = async (decimals, amountValue) => {
  try {
    const _tokenInstance = await createInstance(abi.ERC20, process.env.BSC_OLD_WQT_TOKEN);
    const _exchangeInstance = await createInstance(abi.WQTExchange, process.env.BSC_WQT_EXCHANGE);

    const _allowance = await _tokenInstance.allowance(account.address, process.env.BSC_WQT_EXCHANGE);
    const _amount = new BigNumber(amountValue.toString()).shiftedBy(+decimals).toString();

    if (new BigNumber(_allowance.toString()).isLessThan(_amount)) {
      store.dispatch('main/setStatusText', 'Approving');
      showToast('Swapping', 'Approving...', 'success');
      await _tokenInstance.approve(process.env.BSC_WQT_EXCHANGE, _amount);
      showToast('Swapping', 'Approving done', 'success');
    }

    showToast('Swapping', 'Swapping...', 'success');
    await _exchangeInstance.swap(_amount);
    store.dispatch('main/setStatusText', 'Swapping');
    showToast('Swapping', 'Swapping done', 'success');

    return success(true);
  } catch (e) {
    showToast('Swapping error', `${e.message}`, 'danger');
    return error(500, 'stake error', e);
  }
};

export const swapWithBridge = async (_decimals, _amount, chain, chainTo, userAddress, recipient, symbol) => {
  let swapData = '';
  let tokenAddress;
  let bridgeAddress;
  const isNative = symbol !== 'WQT' && chain !== Chains.WORKNET;
  if (chain === Chains.ETHEREUM) {
    tokenAddress = process.env.ETHEREUM_WQT_TOKEN;
    bridgeAddress = process.env.ETHEREUM_BRIDGE;
  } else if (chain === Chains.BNB || chain === Chains.BINANCE) {
    tokenAddress = process.env.BSC_WQT_TOKEN;
    bridgeAddress = process.env.BSC_BRIDGE;
  } else if (chain === Chains.WORKNET) {
    switch (symbol) {
      case 'BNB':
        tokenAddress = process.env.WORKNET_WBNB_TOKEN;
        break;
      case 'ETH':
        tokenAddress = process.env.WORKNET_WETH_TOKEN;
        break;
      default:
        tokenAddress = process.env.WORKNET_WQT_TOKEN;
    }
    bridgeAddress = process.env.WORKNET_BRIDGE;
  }
  bridgeInstance = await createInstance(abi.WQBridge, bridgeAddress);
  if (!isNative) {
    tokenInstance = await createInstance(abi.ERC20, tokenAddress);
    allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, tokenAddress, [account.address, bridgeAddress])).toString();
  }
  nonce = await web3.eth.getTransactionCount(userAddress);
  try {
    amount = new BigNumber(_amount.toString()).shiftedBy(+_decimals).toString();
    if (!isNative && +allowance < +amount) {
      await store.dispatch('main/setStatusText', 'Approving');
      showToast('Swapping', 'Approving...', 'success');
      await tokenInstance.approve(bridgeAddress, amount);
      allowance = new BigNumber(await fetchContractData('allowance', abi.ERC20, tokenAddress, [account.address, bridgeAddress])).toString();
      showToast('Swapping', 'Approving done', 'success');
      showToast('Swapping', 'Swapping...', 'success');
      await store.dispatch('main/setStatusText', 'Swapping');
      swapData = await bridgeInstance.swap(nonce, chainTo, amount, recipient, symbol);
    } else if (isNative) {
      await store.dispatch('main/setStatusText', 'Swapping');
      const payload = {
        abi: abi.WQBridge,
        address: bridgeAddress,
        value: amount,
        data: [
          nonce.toString(), chainTo.toString(), amount, recipient, symbol,
        ],
      };
      await sendTransaction('swap', payload);
    } else {
      showToast('Swapping', 'Swapping...', 'success');
      await store.dispatch('main/setStatusText', 'Swapping');
      swapData = await bridgeInstance.swap(nonce, chainTo, amount, recipient, symbol);
    }
    showToast('Swapping', 'Swapping done', 'success');
    return swapData;
  } catch (e) {
    console.log(e);
    showToast('Swapping error', `${e.message}`, 'danger');
    return error(500, 'stake error', e);
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

export const initStackingContract = async (chain) => {
  const stakingAbi = abi.WQLiquidityMining;
  let stakingAddress;
  let websocketProvider;
  if (chain === 'ETH') {
    stakingAddress = isProd ? process.env.ETHEREUM_MINING : '0x85fCeFe4b3646E74218793e8721275D3448b76F4';
    websocketProvider = process.env.ETHEREUM_WS_INFURA;
  } else {
    stakingAddress = isProd ? process.env.BSC_MINING : '0x7F31d9c6Cf99DDB89E2a068fE7B96d230b9D19d1';
    websocketProvider = process.env.BSC_WS_MORALIS;
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

export const getBinanceContractRPC = async () => {
  if (bscRpcContract) return bscRpcContract;
  try {
    const address = isProd ? process.env.BSC_LP_TOKEN : '0x3ea2de549ae9dcb7992f91227e8d6629a22c3b40';
    const provider = await new Web3.providers.HttpProvider(process.env.BSC_RPC_URL);
    const web3Bsc = await new Web3(provider);
    bscRpcContract = await new web3Bsc.eth.Contract(abi.BSCPool, address);
    return bscRpcContract;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getPoolTokensAmountBSC = async () => {
  try {
    const poolContract = await getBinanceContractRPC();
    const res = await poolContract.methods.getReserves().call();
    return {
      wqtAmount: new BigNumber(res._reserve0).shiftedBy(-18).toString(),
      wbnbAmount: new BigNumber(res._reserve1).shiftedBy(-18).toString(),
    };
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getPoolTotalSupplyBSC = async () => {
  try {
    const poolContract = await getBinanceContractRPC();
    const res = await poolContract.methods.totalSupply().call();
    return new BigNumber(res).shiftedBy(-18).toString();
  } catch (e) {
    console.log(e);
    return false;
  }
};
