import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';

const bip39 = require('bip39');

// eslint-disable-next-line import/prefer-default-export
export const generateMnemonic = () => bip39.generateMnemonic();
export const createWallet = (mnemonic) => ethers.utils.HDNode.fromMnemonic(mnemonic);

export const encryptStringWithKey = (toEncrypt, key) => AES.encrypt(toEncrypt, key);
export const decryptStringWitheKey = (toDecrypt, key) => AES.decrypt(toDecrypt, key).toString(enc.Utf8);
