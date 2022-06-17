import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import {
  error,
  success,
} from '~/utils/web3';
import ENV from '~/utils/addresses/index';

import {
  WQOracle,
  WQStaking,
  WQStakingNative,
} from '~/abi/index';

import { StakingTypes } from '~/utils/enums';

const bip39 = require('bip39');

// eslint-disable-next-line import/prefer-default-export
export const generateMnemonic = () => bip39.generateMnemonic();
export const createWallet = (mnemonic) => {
  try {
    return ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath("m/44'/60'/0'/0/0");
  } catch (e) {
    // incorrect mnemonic
    return false;
  }
};

export const encryptStringWithKey = (toEncrypt, key) => AES.encrypt(toEncrypt, key).toString();
export const decryptStringWitheKey = (toDecrypt, key) => AES.decrypt(toDecrypt, key).toString(enc.Utf8);

let cipherKey = null;
export const getCipherKey = () => cipherKey;
// eslint-disable-next-line no-return-assign
export const setCipherKey = (key) => cipherKey = key;

let web3 = new Web3(ENV.WQ_PROVIDER);
export const getProvider = () => web3;
export const createInstance = (_abi, _address) => new web3.eth.Contract(_abi, _address);

export const GetWalletProvider = () => web3;
const wallet = {
  address: null,
  privateKey: null,
  init(address, privateKey) {
    if (!web3) web3 = new Web3(ENV.WQ_PROVIDER);
    this.address = address.toLowerCase();
    this.privateKey = privateKey;
    if (privateKey) {
      const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = account.address;
    }
  },
  reset() {
    this.address = null;
    this.privateKey = null;
  },
};
export const getIsWalletConnected = () => !!wallet.address && !!wallet.privateKey;
export const getWalletAddress = () => wallet.address;
// Метод нужен для вызова метода wallet не затрагивая другие данные
export const initWallet = (address, key) => {
  wallet.init(address, key);
};

export const connectWalletToProvider = (providerType) => {
  if (!getIsWalletConnected()) {
    console.error('Wallet is not connected');
    return error(-1, 'Wallet is not connected');
  }

  const provider = ENV[providerType];
  console.log('provider', provider);
  if (!providerType || !provider) {
    console.error(`Wrong provider type: ${providerType}`);
    return error(-2, `Wrong provider type: ${providerType}`);
  }
  // TODO: need to unsubscribe from WEB3 listeners!
  // TODO: можно сделать хранение предыдущей сети в LocalStorage и подключать автоматически к нужной сети, если нужно
  web3 = new Web3(provider);
  if (wallet.privateKey) {
    const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
  }
  return success();
};

/**
 * * Check wallet for current address
 * @param userAddress
 * @param userPassword
 * @returns {{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}}
 */
export const connectWallet = (userAddress, userPassword) => {
  if (!userPassword || !userAddress) return error();
  if (wallet.address && wallet.privateKey) return success();
  let _walletTemp;
  const storageData = JSON.parse(localStorage.getItem('mnemonic'));
  if (!storageData) {
    return error();
  }

  const storageMnemonic = storageData ? storageData[userAddress] : null;
  if (!storageMnemonic) {
    return error();
  }

  // Check in storage
  if (storageMnemonic) {
    const mnemonic = decryptStringWitheKey(storageMnemonic, userPassword);
    _walletTemp = createWallet(mnemonic);
    if (_walletTemp && _walletTemp.address.toLowerCase() === userAddress) {
      wallet.init(_walletTemp.address.toLowerCase(), _walletTemp.privateKey);
      sessionStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('mnemonic')),
        [userAddress]: mnemonic,
      }));
      return success();
    }
  }

  // Wrong mnemonic for current account!
  return error();
};

/**
 * Connect to wallet with mnemonic from session
 * @param userAddress
 */
export const connectWithMnemonic = (userAddress) => {
  const sessionData = JSON.parse(sessionStorage.getItem('mnemonic'));
  if (!sessionData) return false;
  const mnemonic = sessionData[userAddress];
  if (!mnemonic) return false;
  const _walletTemp = createWallet(mnemonic);
  if (_walletTemp && _walletTemp.address.toLowerCase() === userAddress) {
    wallet.init(_walletTemp.address.toLowerCase(), _walletTemp.privateKey);
    return true;
  }
  return false;
};

export const disconnect = () => {
  wallet.reset();
};

const min = Object.freeze(new BigNumber(0.0001));
/**
 * @param amount
 * @param full - returns with all decimals
 * @param decimals
 * @returns {string|BigNumber}
 */
export const getStyledAmount = (amount, full = false, decimals = 18) => {
  const value = new BigNumber(amount).shiftedBy(-decimals);
  if (value.isEqualTo(0)) return '0';
  if (full) return value.toString();
  if (value.isLessThan(min)) return `<${min.toString()}`;
  return value.decimalPlaces(4).toString();
};

// web3.eth.net.getId() - если нужно будет получить chainId

// WQT
export const getBalance = async () => {
  try {
    const balance = await web3.eth.getBalance(wallet.address);
    return success({
      balance: getStyledAmount(balance),
      fullBalance: getStyledAmount(balance, true),
    });
  } catch (e) {
    console.error('get balance error', e);
    return error();
  }
};
export const transfer = async (recipient, value) => {
  try {
    value = new BigNumber(value).shiftedBy(18).toString();
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      web3.eth.estimateGas({
        from: wallet.address,
        to: recipient,
        value,
      }),
    ]);
    const txRes = await web3.eth.sendTransaction({
      from: wallet.address,
      to: recipient,
      value,
      gas: gasEstimate,
      gasPrice,
    });
    return success(txRes);
  } catch (e) {
    console.error('transfer error', e);
    return error();
  }
};
export const getTransferFeeData = async (recipient, value) => {
  try {
    value = new BigNumber(value).shiftedBy(18).toString();
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      web3.eth.estimateGas({
        from: wallet.address,
        to: recipient,
        value,
      }),
    ]);
    return success({
      gasPrice,
      gasEstimate,
      fee: new BigNumber(gasPrice * gasEstimate).shiftedBy(-18).toString(),
    });
  } catch (e) {
    console.error('txFee error', e);
    return error();
  }
};

/** CONTRACTS */
export const sendWalletTransaction = async (_method, {
  abi, address, value, data,
}) => {
  if (!web3) {
    console.error('web3 is undefined');
    return false;
  }
  try {
    const inst = new web3.eth.Contract(abi, address);
    const gasPrice = await web3.eth.getGasPrice();
    const accountAddress = getWalletAddress();
    const txData = inst.methods[_method].apply(null, data).encodeABI();
    if (value) {
      const gas = await inst.methods[_method].apply(null, data).estimateGas({
        from: accountAddress,
        value,
      });
      return await inst.methods[_method](...data).send({
        from: accountAddress,
        to: address,
        data: txData,
        gasPrice,
        gas,
        value,
      });
    }
    const gas = await inst.methods[_method].apply(null, data).estimateGas({
      from: accountAddress,
    });
    const transactionData = {
      from: accountAddress,
      to: address,
      data: txData,
      gasPrice,
      gas,
    };
    // noinspection ES6RedundantAwait
    return await web3.eth.sendTransaction(transactionData);
  } catch (e) {
    console.error('method: sendWalletTransaction', e);
    return error(e.code, e.message, e);
  }
};
/**
 * Get fee from contract
 * @param _method
 * @param _abi
 * @param _contractAddress
 * @param data - array
 * @param recipient
 * @param amount - WQT
 * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
 */
export const getContractFeeData = async (_method, _abi, _contractAddress, data, recipient = null, amount = 0) => {
  try {
    const inst = new web3.eth.Contract(_abi, _contractAddress);
    const tx = {
      from: wallet.address,
    };
    if (recipient) tx.to = recipient;
    if (amount) {
      amount = new BigNumber(amount).shiftedBy(18).toString();
      tx.value = amount;
    }
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods[_method].apply(null, data).estimateGas(tx),
    ]);
    return success({
      gasPrice,
      gasEstimate,
      fee: new BigNumber(gasPrice * gasEstimate).shiftedBy(-18).toString(),
    });
  } catch (e) {
    console.error(`Get contract fee data error: ${_method}.`, e.message);
    return error(1000, e.message);
  }
};

/** Staking */
export const stake = async (stakingType, amount, poolAddress, duration) => {
  try {
    amount = new BigNumber(amount).shiftedBy(18).toString();
    let res;
    if (stakingType === StakingTypes.WQT) {
      res = await sendWalletTransaction(
        'stake',
        {
          abi: WQStaking,
          address: poolAddress,
          data: [amount, duration.toString()],
        },
      );
      return success(res);
    }
    const inst = new web3.eth.Contract(WQStakingNative, poolAddress);
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods.stake.apply(null, []).estimateGas({ from: wallet.address, value: amount }),
    ]);
    res = await inst.methods.stake().send({
      from: wallet.address,
      to: poolAddress,
      value: amount,
      gas: gasEstimate,
      gasPrice,
    });
    return success(res);
  } catch (e) {
    console.error('Stake error', e.message);
    return error();
  }
};

/** Collateral */
export const getGasPrice = async (contractAbi, address, method, attr, value = null) => {
  try {
    const inst = new web3.eth.Contract(contractAbi, address);
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      (value)
        ? inst.methods[method](...attr).estimateGas({ from: wallet.address, value })
        : inst.methods[method](...attr).estimateGas({ from: wallet.address }),
    ]);
    return { gas: Number(gasEstimate), gasPrice: Number(gasPrice) };
  } catch (e) {
    console.error('wallet/getGasPrice', e);
    return { gas: false, gasPrice: false };
  }
};

export const setTokenPrice = async ({ currency }, {
  gasPrice, gas, timestamp, price, v, r, s,
}) => {
  try {
    const inst = new web3.eth.Contract(WQOracle, ENV.WORKNET_ORACLE);
    await inst.methods.setTokenPriceUSD(timestamp, price, v, r, s, currency).send({
      from: wallet.address,
      gas,
      gasPrice,
    });
  } catch (e) {
    console.error('setTokenPriceError', e);
    throw error();
  }
};

// TODO check and del
export const setTokenPrices = async ({
  gasPrice, gas, timestamp, prices, v, r, s, symbols,
}) => {
  try {
    const inst = new web3.eth.Contract(WQOracle, ENV.WORKNET_ORACLE);
    await inst.methods.setTokenPricesUSD(timestamp, v, r, s, prices, symbols).send({
      from: wallet.address,
      gas,
      gasPrice,
    });
  } catch (e) {
    console.error('setTokenPricesError', e);
    throw error();
  }
};

export const hashText = (value) => {
  if (!value) console.error('Wrong value for hashText');
  return web3.utils.keccak256(value);
};
