import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import {
  error, success, fetchContractData, sendTransaction,
} from '~/utils/web3';
import * as abi from '~/abi/abi';
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

let web3 = new Web3(process.env.WQ_PROVIDER);
export const GetWalletProvider = () => web3;
const wallet = {
  address: null,
  privateKey: null,
  init(address, privateKey) {
    if (!web3) web3 = new Web3(process.env.WQ_PROVIDER);
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
  if (!sessionData) return;
  const mnemonic = sessionData[userAddress];
  if (!mnemonic) return;
  const _walletTemp = createWallet(mnemonic);
  if (_walletTemp && _walletTemp.address.toLowerCase() === userAddress) {
    wallet.init(_walletTemp.address.toLowerCase(), _walletTemp.privateKey);
  }
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

// WUSD
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
// Send WUSD
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
export const transferToken = async (recipient, value) => {
  try {
    value = new BigNumber(value).shiftedBy(18).toString();
    const inst = new web3.eth.Contract(abi.ERC20, process.env.WQT_TOKEN);
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods.transfer.apply(null, [recipient, value]).estimateGas({ from: wallet.address }),
    ]);
    const res = await inst.methods.transfer(recipient, value).send({
      from: wallet.address,
      gas: gasEstimate,
      gasPrice,
    });
    return success(res);
  } catch (e) {
    console.error(e.message);
    return error();
  }
};
/**
 * Get fee from contract
 * @param _method
 * @param _abi
 * @param _contractAddress
 * @param data - array
 * @param recipient
 * @param amount - WUSD
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

/** PENSION FUND */
export const getPensionDefaultData = async () => {
  try {
    const _abi = abi.WQPensionFund;
    const _pensionAddress = process.env.PENSION_FUND;
    const [lockTime, defaultFee] = await Promise.all([
      fetchContractData('lockTime', _abi, _pensionAddress, null, web3),
      fetchContractData('defaultFee', _abi, _pensionAddress, null, web3),
    ]);
    return success({
      defaultFee: new BigNumber(defaultFee.toString()).shiftedBy(-18).toString(),
      lockTime,
    });
  } catch (e) {
    console.error(`PensionDefault: ${e}`);
    return error();
  }
};
export const getPensionWallet = async () => {
  try {
    const myPensionWallet = await fetchContractData('wallets', abi.WQPensionFund, process.env.PENSION_FUND, [wallet.address], web3);
    const {
      unlockDate, fee, amount, createdAt, rewardAllowed, rewardDebt, rewardDistributed,
    } = myPensionWallet;
    const _amount = new BigNumber(amount).shiftedBy(-18);
    let _fee = new BigNumber(fee).shiftedBy(-18);
    if (_fee.isGreaterThan('0') && _fee.isLessThan('0.0000001')) {
      _fee = '>0.0000001';
    } else _fee = _fee.decimalPlaces(8).toString();
    return success({
      rewardAllowed,
      rewardDebt,
      rewardDistributed,
      isCreated: !!createdAt && createdAt !== '0',
      unlockDate: unlockDate ? new Date(unlockDate * 1000) : null,
      fee: _fee,
      amount: _amount.isGreaterThan('0') && _amount.isLessThan(min) ? `>${min.toString()}` : _amount.decimalPlaces(4).toString(),
      fullAmount: _amount.toString(),
    });
  } catch (e) {
    console.error(`PensionWallet: ${e}`);
    return error();
  }
};
export const pensionContribute = async (amount) => {
  try {
    const inst = new web3.eth.Contract(abi.WQPensionFund, process.env.PENSION_FUND);
    amount = new BigNumber(amount).shiftedBy(18).toString();
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods.contribute.apply(null, [wallet.address]).estimateGas({ from: wallet.address, value: amount }),
    ]);
    const res = await inst.methods.contribute(wallet.address).send({
      from: wallet.address,
      gas: gasEstimate,
      gasPrice,
      value: amount,
    });
    return success(res);
  } catch (e) {
    console.error(`Contribute: ${e}`);
    return error();
  }
};
export const pensionUpdateFee = async (fee) => {
  try {
    const inst = new web3.eth.Contract(abi.WQPensionFund, process.env.PENSION_FUND);
    fee = new BigNumber(fee).shiftedBy(18).toString();
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods.updateFee.apply(null, [fee]).estimateGas({ from: wallet.address }),
    ]);
    const res = await inst.methods.updateFee(fee).send({
      from: wallet.address,
      gas: gasEstimate,
      gasPrice,
    });
    return success(res);
  } catch (e) {
    console.error(`UpdateFee: ${e}`);
    return error();
  }
};
export const pensionsWithdraw = async (_amount) => {
  try {
    _amount = new BigNumber(_amount).shiftedBy(18).toString();
    const inst = new web3.eth.Contract(abi.WQPensionFund, process.env.PENSION_FUND);
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods.withdraw.apply(null, [_amount]).estimateGas({ from: wallet.address }),
    ]);
    const res = await inst.methods.withdraw(_amount).send({
      from: wallet.address,
      gas: gasEstimate,
      gasPrice,
    });
    return success(res);
  } catch (e) {
    console.error(`Withdraw: ${e}`);
    return error();
  }
};
export const pensionExtendLockTime = async () => {
  try {
    const inst = new web3.eth.Contract(abi.WQPensionFund, process.env.PENSION_FUND);
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods.extendLockTime.apply(null, []).estimateGas({ from: wallet.address }),
    ]);
    const res = await inst.methods.extendLockTime().send({
      from: wallet.address,
      gas: gasEstimate,
      gasPrice,
    });
    return success(res);
  } catch (e) {
    console.error(`ExtendLockTime: ${e}`);
    return error();
  }
};

/** Staking */
export const stake = async (stakingType, amount, poolAddress, duration) => {
  try {
    amount = new BigNumber(amount).shiftedBy(18).toString();
    let res;
    if (stakingType === StakingTypes.WQT) {
      res = await sendTransaction(
        'stake',
        {
          abi: abi.WQStaking,
          address: poolAddress,
          data: [amount, duration.toString()],
        },
        GetWalletProvider(),
      );
      return success(res);
    }
    const inst = new web3.eth.Contract(abi.WQStakingNative, poolAddress);
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
