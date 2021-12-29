import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { error, success } from '~/utils/web3';

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

const wallet = {
  address: null,
  privateKey: null,
  init(address, privateKey) {
    this.address = address;
    this.privateKey = privateKey;
    if (privateKey) {
      sessionStorage.setItem('keys', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('keys')),
        [address]: privateKey,
      }));
    }
  },
  reset() {
    this.address = null;
    this.privateKey = null;
  },
};

export const setWalletAddress = (userAddress) => wallet.init(userAddress, null);

/**
 * trying to get key from session then return wallet connected
 * @returns {boolean}
 */
export const getIsWalletConnected = () => {
  if (!wallet.privateKey && wallet.address) {
    const session = JSON.parse(sessionStorage.getItem('keys'));
    if (!session) return false;
    const key = session[wallet.address];
    if (key) {
      wallet.init(wallet.address, key);
      return true;
    }
  }
  return !!wallet.address && !!wallet.privateKey;
};

/**
 * Check wallet for current address
 * @param userAddress from api
 * @param userPassword from user
 * @returns {result: *, ok: boolean}
 */
export const connectWallet = (userAddress, userPassword) => {
  if (!userPassword || !userAddress) return error();
  if (wallet.address && wallet.privateKey) return success();
  let _wallet;
  const sessionData = JSON.parse(sessionStorage.getItem('mnemonic'));
  const storageData = JSON.parse(localStorage.getItem('mnemonic'));
  if (!sessionData && !storageData) {
    return error();
  }

  const sessionMnemonic = sessionData ? sessionData[userAddress] : null;
  const storageMnemonic = storageData ? storageData[userAddress] : null;
  if (!sessionMnemonic && !storageMnemonic) {
    return error();
  }

  // Check in session if exists
  if (sessionMnemonic) {
    _wallet = createWallet(sessionMnemonic);
    if (_wallet && _wallet.address === userAddress) {
      wallet.init(_wallet.address, _wallet.privateKey);
      return success();
    }
  }

  // Check in storage
  if (storageMnemonic) {
    const mnemonic = decryptStringWitheKey(storageMnemonic, userPassword);
    _wallet = createWallet(mnemonic);
    if (wallet && wallet.address === this.userAddress) {
      wallet.init(_wallet.address, _wallet.privateKey);
      return success();
    }
  }

  // Wrong mnemonic for current account!
  return error();
};

export const disconnect = () => {
  wallet.reset();
};

const min = new BigNumber(0.0001);
const getStyledAmount = (amount) => {
  const value = new BigNumber(amount).shiftedBy(-18);
  if (value.isLessThan(min)) return '<0.0001';
  return value.toFixed(4);
};

export const getBalance = async () => {
  const web3 = new Web3(process.env.PROVIDER);
  const balance = await web3.eth.getBalance(wallet.address);
  return getStyledAmount(balance);
};

const sendTransaction = async () => {

};
