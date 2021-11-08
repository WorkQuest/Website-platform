import Web3 from 'web3';
import Web4 from '@cryptonteam/web4';
import BigNumber from 'bignumber.js';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import * as abi from '~/abi/abi';
import { Chains, ChainsId, StakingTypes } from '~/utils/enums';

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
      if (_miningPoolId === 'ETH') {
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
      _tokenAddress = _miningPoolId === 'ETH'
        ? process.env.ETHEREUM_WQT_TOKEN
        : process.env.BSC_WQT_TOKEN;
      break;
    case StakingTypes.WQT:
      _tokenAddress = process.env.ETHEREUM_WQT_TOKEN;
      _stakingAbi = abi.WQStaking;
      _stakingAddress = process.env.WQT_STAKING;
      break;
    case StakingTypes.WUSD:
      _stakingAbi = abi.WQStakingNative;
      _stakingAddress = process.env.WQT_STAKING_NATIVE;
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

// export const initWeb3 = async () => {
//   try {
//     const { ethereum } = window;
//     if (ethereum) {
//       web3 = new Web3(ethereum);
//       if ((await web3.eth.getCoinbase()) === null) {
//         await ethereum.enable();
//       }
//       const [userAddress, chainId] = await Promise.all([
//         web3.eth.getCoinbase(),
//         web3.eth.net.getId(),
//       ]);
//       if (process.env.PROD === 'true' && ![1, 56].includes(+chainId)) {
//         return error(500, 'Wrong blockchain in metamask', 'Current site work on mainnet. Please change network.');
//       }
//       if (process.env.PROD === 'false' && ![4, 97].includes(+chainId)) {
//         return error(500, 'Wrong blockchain in metamask', 'Current site work on testnet. Please change network.');
//       }
//       account = {
//         address: userAddress,
//         netId: chainId,
//         netType: getChainTypeById(chainId),
//       };
//       web4 = new Web4();
//       await web4.setProvider(ethereum, userAddress);
//       return success(account);
//     }
//     return false;
//   } catch (e) {
//     return error(500, '', e.message);
//   }
// };
let walletOptions = {};
export const initWeb3Modal = async (chain) => {
  if (process.env.PROD === 'false') {
    if (chain === 'ETH') {
      walletOptions = {
        rpc: {
          4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        },
        // network: 'ethereum',
      };
    } else if (chain === 'BNB') {
      walletOptions = {
        rpc: {
          97: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
        },
        // network: 'binance',
      };
    }
  }
  if (process.env.PROD === 'true') {
    if (chain === 'ETH') {
      walletOptions = {
        rpc: {
          1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        },
        // network: 'ethereum',
      };
    } else {
      walletOptions = {
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
        },
        // network: 'binance',
      };
    }
  }
};

export const initWeb3 = async (chain) => {
  try {
    let provider = null;
    let userAddress;
    await initWeb3Modal(chain);
    const web3Modal = new Web3Modal({
      // theme: 'dark',
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: walletOptions,
        },
      }, // required
    });
    provider = await web3Modal.connect();
    store.dispatch('web3/setMetaMaskStatus', provider.isMetaMask);
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
      await window.ethereum.enable();
    }
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
  } catch (e) {
    return error(500, '', 'Connected error');
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
    inst = new web3.eth.Contract(abi.WQStaking, process.env.WQT_STAKING);
  } else if (stakingType === StakingTypes.WUSD) {
    inst = new web3.eth.Contract(abi.WQStakingNative, process.env.WQT_STAKING_NATIVE);
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
  if (chain === Chains.ETHEREUM) {
    tokenAddress = process.env.ETHEREUM_WQT_TOKEN;
    bridgeAddress = process.env.ETHEREUM_BRIDGE;
  } else {
    tokenAddress = process.env.BSC_WQT_TOKEN;
    bridgeAddress = process.env.BSC_BRIDGE;
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
  if (chainId !== 2) {
    bridgeAddress = process.env.ETHEREUM_BRIDGE;
  } else {
    bridgeAddress = process.env.BSC_BRIDGE;
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
    stakingAddress = process.env.PROD === 'true' ? process.env.ETHEREUM_MINING : '0x85fCeFe4b3646E74218793e8721275D3448b76F4';
    websocketProvider = process.env.ETHEREUM_WS_INFURA;
  } else {
    stakingAddress = process.env.PROD === 'true' ? process.env.BSC_MINING : '0x7F31d9c6Cf99DDB89E2a068fE7B96d230b9D19d1';
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

// Можно ли объединить нижние методы в один?
export const addAffiliat = async () => {
  const templateRes = { // TODO: брать подпись с бэка
    userId: '24b58470-49ca-4b0b-9658-2fd9d620f23b',
    affiliateId: '8d97b56e-bf23-4d67-863d-72f975d33d25',
    affiliateWallet: '0x50eBFe5a6Bb921c1EF7080BA5798AC75f1988c0D',
    messageHash: '0x2a5403fd47923dd6c83a633c57715a979c0f655bb344ba9112943e43ceb5df95',
  };
  const { v, r, s } = ethers.utils.splitSignature(templateRes.messageHash);
  const _affiliat = templateRes.affiliateWallet;
  const _abi = abi.WQReferral;
  const _contractAddress = process.env.WQ_REFERRAL;
  try {
    const contractInstance = await createInstance(_abi, _contractAddress);
    await contractInstance.addAffiliat(v, r, s, _affiliat);
    return success();
  } catch (e) {
    console.log('[Add affiliat error]', e);
    return error(500, 'Add affiliat error', e);
  }
};

export const calcReferral = async (referralAddress) => {
  const _abi = abi.WQReferral;
  const _contractAddress = process.env.WQ_REFERRAL;
  try {
    const contractInstance = await createInstance(_abi, _contractAddress);
    await contractInstance.calcReferral(referralAddress);
    return success();
  } catch (e) {
    console.log(e);
    return error(500, 'Calc referral error', e);
  }
};

export const claimReferral = async () => {
  const _abi = abi.WQReferral;
  const _contractAddress = process.env.WQ_REFERRAL;
  try {
    const contractInstance = await createInstance(_abi, _contractAddress);
    await contractInstance.claim();
    return success();
  } catch (e) {
    console.log(e);
    return error(500, 'Claim referral error', e);
  }
};
