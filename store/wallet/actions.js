import BigNumber from 'bignumber.js';
import {
  connectWallet, connectWithMnemonic,
  disconnect,
  fetchContractData,
  getBalance, getContractFeeData,
  getIsWalletConnected,
  getStyledAmount, getWalletAddress, getTransferFeeData,
  transfer, transferToken,
} from '~/utils/wallet';
import * as abi from '~/abi/abi';
import { StakingTypes, TokenSymbols } from '~/utils/enums';
import {
  getPensionDefaultData,
  getPensionWallet,
  pensionContribute, pensionExtendLockTime,
  pensionsWithdraw,
  pensionUpdateFee,
} from '~/utils/wallet.js';

export default {
  async getTransactions({ commit }, params) {
    try {
      const res = await this.$axios({ url: `/account/${getWalletAddress()}/txs`, baseURL: process.env.WQ_EXPLORER, params });
      commit('setTransactions', res.data.result.txs);
      commit('setTransactionsCount', res.data.result.count);
    } catch (e) {
      commit('setTransactions', []);
      commit('setTransactionsCount', 0);
    }
  },
  async checkPassword({ commit }, password) {
    try {
      const res = await this.$axios.$post('/v1/auth/validate-password', { password });
      if (res.ok) {
        return res.result.isValid;
      }
      return false;
    } catch (e) {
      return false;
    }
  },
  /**
   * Check wallet is connected
   * @returns boolean
   */
  checkWalletConnected({ commit, getters }, { nuxt, callbackLayout }) {
    const connected = getIsWalletConnected();
    if (!connected) {
      if (callbackLayout) commit('setCallbackLayout', callbackLayout);
      nuxt.setLayout('confirmPassword');
    } else {
      commit('setIsWalletConnected', true);
    }
  },
  /**
   * Connect wallet with password
   * Use when checkWalletConnected from confirmPassword modal
   * @param commit
   * @param getters
   * @param userAddress
   * @param userPassword
   */
  connectWallet({ commit }, { userAddress, userPassword }) {
    const res = connectWallet(userAddress, userPassword);
    if (res?.ok) commit('setIsWalletConnected', true);
    return res;
  },
  disconnect() {
    disconnect();
  },
  setSelectedToken({ commit }, token) {
    commit('setSelectedToken', token);
  },
  async getBalance({ commit }) {
    const res = await getBalance();
    commit('setBalance', {
      symbol: TokenSymbols.WUSD,
      balance: res.ok ? res.result.balance : 0,
      fullBalance: res.ok ? res.result.fullBalance : 0,
    });
  },
  async getBalanceWQT({ commit }, userAddress) {
    const res = await fetchContractData('balanceOf', abi.ERC20, process.env.WQT_TOKEN, [userAddress]);
    commit('setBalance', {
      symbol: TokenSymbols.WQT,
      balance: res.ok ? getStyledAmount(res.result) : 0,
      fullBalance: res.ok ? getStyledAmount(res.result, true) : 0,
    });
  },
  /**
   * Send transfer
   * @param recipient
   * @param value
   */
  async transfer({ commit }, { recipient, value }) {
    return await transfer(recipient, value);
  },
  async getTransferFeeData({ commit }, { recipient, value }) {
    return await getTransferFeeData(recipient, value);
  },
  /**
   * Send transfer for WQT token
   * @param commit
   * @param recipient
   * @param value
   */
  async transferWQT({ commit }, { recipient, value }) {
    return await transferToken(recipient, value);
  },
  /**
   * Get Fee Data from contract method
   * @param commit
   * @param method
   * @param _abi
   * @param contractAddress
   * @param data - Array []
   * @param recipient
   * @param amount - decimal value
   * @returns {Promise<{result: *, ok: boolean}|{msg: string, code: number, data: null, ok: boolean}|undefined>}
   */
  async getContractFeeData({ commit }, {
    method, _abi, contractAddress, data, recipient, amount,
  }) {
    return await getContractFeeData(method, _abi, contractAddress, data, recipient, amount);
  },

  /** PENSION PROGRAM */
  /** Get default lockTime & fee */
  async pensionGetDefaultData() {
    return await getPensionDefaultData();
  },
  async pensionGetWalletInfo({ commit }) {
    const res = await getPensionWallet();
    if (res.ok === false) {
      commit('setPensionWallet', null);
      return;
    }
    commit('setPensionWallet', res.result);
  },
  async pensionUpdateFee({ commit }, fee) {
    return await pensionUpdateFee(fee);
  },
  async pensionContribute({ commit }, amount) {
    return await pensionContribute(amount);
  },
  async pensionWithdraw({ commit }, amount) {
    return await pensionsWithdraw(amount);
  },
  async pensionStartProgram({ commit }, payload) {
    const { firstDeposit, fee, defaultFee } = payload;
    let feeOk = true;
    let depositOk = false;
    const equalsFee = new BigNumber(defaultFee).shiftedBy(-18).isEqualTo(new BigNumber(fee).shiftedBy(-18));
    if (!firstDeposit || !equalsFee) {
      feeOk = await pensionUpdateFee(fee);
    }
    if (firstDeposit) depositOk = await pensionContribute(firstDeposit);
    else return feeOk;
    return depositOk && feeOk;
  },
  async pensionExtendLockTime() {
    return await pensionExtendLockTime();
  },

  /** Staking */
  async getStakingPoolsData({ commit }, pool) {
    let _abi = null;
    let contractAddress = null;
    if (pool === StakingTypes.WQT) {
      _abi = abi.WQStaking;
      contractAddress = process.env.WQT_STAKING;
    } else if (pool === StakingTypes.WUSD) {
      _abi = abi.WQStakingNative;
      contractAddress = process.env.WQT_STAKING_NATIVE;
    } else {
      console.error(`Wrong pool: ${pool}`);
      return;
    }
    const res = await fetchContractData('getStakingInfo', _abi, contractAddress, []);
    if (!res.ok) commit('setStakingPoolData', { pool });

    const stakingInfo = res.result;

    const {
      rewardTokenAddress, totalStaked, totalDistributed, rewardTotal, maxStake, minStake,
    } = res.result;

    let decimals;
    let tokenSymbol;
    if (!rewardTokenAddress) {
      decimals = 18;
      tokenSymbol = pool;
    } else {
      const [decimalsRes, tokenSymbolRes] = await Promise.all([
        fetchContractData('decimals', abi.ERC20, rewardTokenAddress),
        fetchContractData('symbol', abi.ERC20, rewardTokenAddress),
      ]);
      decimals = decimalsRes.result;
      tokenSymbol = tokenSymbolRes.result;
    }

    const min = new BigNumber(0.0001);
    const _minStake = new BigNumber(minStake).shiftedBy(-decimals).isLessThan(min)
      ? min.toString() : new BigNumber(minStake).shiftedBy(-decimals).toString();

    commit('setStakingPoolData', {
      pool,
      data: {
        ...stakingInfo,
        link: pool,
        poolAddress: contractAddress,
        decimals,
        tokenSymbol,
        isNative: tokenSymbol === StakingTypes.WUSD,
        stakeTokenSymbol: tokenSymbol,
        claimPeriod: new BigNumber(stakingInfo.claimPeriod / 60 / 60).decimalPlaces(3).toString(),
        stakePeriod: new BigNumber(stakingInfo.stakePeriod / 60 / 60).decimalPlaces(3).toString(),
        distributionTime: new BigNumber(stakingInfo.distributionTime / 60).decimalPlaces(3).toString(),
        totalStaked: new BigNumber(totalStaked).shiftedBy(-decimals).decimalPlaces(4).toString(),
        totalDistributed: new BigNumber(totalDistributed).shiftedBy(-decimals).decimalPlaces(4).toString(),
        rewardTotal: new BigNumber(rewardTotal).shiftedBy(-decimals).decimalPlaces(4).toString(),
        maxStake: new BigNumber(maxStake).shiftedBy(-decimals).decimalPlaces(4).toString(),
        fullMaxStake: new BigNumber(maxStake).shiftedBy(-decimals).toString(),
        minStake: _minStake,
        fullMinStake: new BigNumber(minStake).shiftedBy(-decimals).toString(),
      },
    });
  },
  async getStakingUserInfo({ commit }, { pool, decimals }) {
    const _abi = pool === StakingTypes.WUSD ? abi.WQStakingNative : abi.WQStakingNative;
    const contractAddress = pool === StakingTypes.WUSD ? process.env.WQT_STAKING_NATIVE : process.env.WQT_STAKING;
    const [userInfo, duration] = await Promise.all([
      fetchContractData('getInfoByAddress', _abi, contractAddress, [getWalletAddress()]),
      fetchContractData('stakes', _abi, contractAddress, [getWalletAddress()]),
    ]);
    console.log(userInfo);
    commit('setStakingUserData', {
      pool,
      data: {
        ...userInfo,
        date: duration.unstakeTime ? new Date(duration.unstakeTime * 1000) : false,
        claim: new BigNumber(userInfo.claim_).shiftedBy(-decimals).decimalPlaces(5).toString(),
        staked: new BigNumber(userInfo.staked_).shiftedBy(-decimals).decimalPlaces(4).toString(),
        fullStaked: new BigNumber(userInfo.staked_).shiftedBy(-decimals).toString(),
        balance: new BigNumber(userInfo._balance).shiftedBy(-18).decimalPlaces(4).toString(),
        fullBalance: new BigNumber(userInfo._balance).shiftedBy(-decimals).toString(),
      },
    });
  },
};
