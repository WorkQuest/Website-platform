import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';

const bip39 = require('bip39');

// eslint-disable-next-line import/prefer-default-export
export const generateMnemonic = () => bip39.generateMnemonic();
export const createWallet = (mnemonic) => {
  try {
    return ethers.utils.HDNode.fromMnemonic(mnemonic);
  } catch (e) {
    // incorrect mnemonic
    return false;
  }
};

export const encryptStringWithKey = (toEncrypt, key) => AES.encrypt(toEncrypt, key).toString();
export const decryptStringWitheKey = (toDecrypt, key) => AES.decrypt(toDecrypt, key).toString(enc.Utf8);

// const toEncrypt = this.mnemonic;
// const encrypt = encryptStringWithKey(toEncrypt, 'secret');
// console.log(toEncrypt, ' >> encrypt:');
// console.log(encrypt.toString());
// const decrypt = decryptStringWitheKey(encrypt, 'secret');
// console.log('decrypt >>', decrypt);
