import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
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
  },
  reset() {
    this.address = null;
    this.privateKey = null;
  },
};
let test = false;
export const getWallet = () => wallet;
export const isWalletConnected = () => {
  if (!test) { test = true; return false; }
  return test;
  // return account.address && account.privateKey;
};

/**
 * Check wallet for current address
 * @param userAddress from api
 * @param userPassword from user
 * @returns {result: *, ok: boolean}
 */
export const connectWallet = (userAddress, userPassword) => {
  if (wallet.address && wallet.privateKey) return success();
  let _wallet;
  const sessionData = JSON.parse(sessionStorage.getItem('mnemonic'));
  const storageData = JSON.parse(localStorage.getItem('mnemonic'));
  if (!sessionData && !storageData) {
    return error();
  }

  const sessionMnemonic = sessionData ? sessionData[address] : null;
  const storageMnemonic = storageData ? storageData[address] : null;
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

export const clearConnection = () => {
  wallet.reset();
};

export const checkAccount = () => {

};
