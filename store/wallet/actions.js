import BigNumber from 'bignumber.js';
import {
  connectWallet,
  disconnect,
  getBalance, getContractFeeData,
  getIsWalletConnected,
  getStyledAmount, getWalletAddress, getTransferFeeData,
  transfer, transferToken, GetWalletProvider, stake, sendWalletTransaction,
} from '~/utils/wallet';
import {
  fetchContractData, success, error,
} from '~/utils/web3';
import * as abi from '~/abi/abi';
import { PensionHistoryMethods, StakingTypes, TokenSymbols } from '~/utils/enums';
import {
  getPensionDefaultData,
  getPensionWallet,
  pensionContribute, pensionExtendLockTime,
  pensionsWithdraw,
  pensionUpdateFee,
} from '~/utils/wallet.js';

export default {
  async getPensionTransactions({ commit, getters }, { method, limit, offset }) {
    try {
      const path = method === PensionHistoryMethods.Update ? 'wallet-update' : method.toLowerCase();
      const res = await this.$axios.get(`/v1/pension-fund/${path}`, {
        params: {
          userAddress: getWalletAddress(),
          limit,
          offset,
        },
      });
      commit('setPensionHistoryData', { method, txs: res.data.result.events, count: res.data.result.count });
    } catch (e) {
      console.error('wallet/getPensionTransactions');
    }
  },
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
      return res?.result?.isValid;
    } catch (e) {
      return false;
    }
  },
  confirmPassword({ commit, getters }, { nuxt, callbackLayout }) {
    if (callbackLayout) commit('setCallbackLayout', callbackLayout);
    commit('setIsOnlyConfirm', true);
    nuxt.setLayout('confirmPassword');
  },
  /**
   * Check wallet is connected
   * @returns boolean
   */
  checkWalletConnected({ commit, getters }, { nuxt, callbackLayout }) {
    const connected = getIsWalletConnected();
    commit('setIsOnlyConfirm', false);
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
  connectWallet({ commit }, { userWalletAddress, userPassword }) {
    const res = connectWallet(userWalletAddress, userPassword);
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
    const res = await fetchContractData(
      'balanceOf',
      abi.ERC20,
      process.env.WQT_TOKEN,
      [userAddress],
      GetWalletProvider(),
    );
    commit('setBalance', {
      symbol: TokenSymbols.WQT,
      balance: res ? getStyledAmount(res) : 0,
      fullBalance: res ? getStyledAmount(res, true) : 0,
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

  async approve({ commit }, { tokenAddress, spenderAddress, amount }) {
    try {
      amount = new BigNumber(amount).shiftedBy(18).toString();
      return await sendWalletTransaction(
        'approve',
        {
          abi: abi.ERC20,
          address: tokenAddress,
          data: [spenderAddress, amount],
        },
      );
    } catch (e) {
      console.error('Approve error', e.message);
      return false;
    }
  },
  async getAllowance({ commit }, { tokenAddress, spenderAddress }) {
    const res = await fetchContractData('allowance', abi.ERC20, tokenAddress, [getWalletAddress(), spenderAddress], GetWalletProvider());
    if (!res) return false;
    return new BigNumber(res.toString()).shiftedBy(-18).toString();
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
      contractAddress = process.env.WORKNET_STAKING_WQT;
    } else if (pool === StakingTypes.WUSD) {
      _abi = abi.WQStakingNative;
      contractAddress = process.env.WORKNET_STAKING_WUSD;
    } else {
      console.error(`Wrong pool: ${pool}`);
      return;
    }
    const stakingInfo = await fetchContractData('getStakingInfo', _abi, contractAddress, null, GetWalletProvider());
    if (!stakingInfo) {
      commit('setStakingPoolData', { pool });
      return;
    }

    let {
      // eslint-disable-next-line prefer-const
      rewardTokenAddress, totalStaked, totalDistributed, rewardTotal, maxStake, minStake,
    } = stakingInfo;

    let decimals = 18;
    let tokenSymbol = TokenSymbols.WUSD;
    if (pool !== StakingTypes.WUSD) {
      [decimals, tokenSymbol] = await Promise.all([
        fetchContractData('decimals', abi.ERC20, rewardTokenAddress, null, GetWalletProvider()),
        fetchContractData('symbol', abi.ERC20, rewardTokenAddress, null, GetWalletProvider()),
      ]);
    }

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
        claimPeriod: new BigNumber(stakingInfo.claimPeriod / 60).decimalPlaces(3).toString(),
        stakePeriod: new BigNumber(stakingInfo.stakePeriod / 60).decimalPlaces(3).toString(),
        distributionTime: new BigNumber(stakingInfo.distributionTime / 60).decimalPlaces(3).toString(),
        totalStaked: getStyledAmount(totalStaked, false, decimals),
        totalDistributed: getStyledAmount(totalDistributed, false, decimals),
        rewardTotal: getStyledAmount(rewardTotal, false, decimals),
        maxStake: getStyledAmount(maxStake, false, decimals),
        fullMaxStake: getStyledAmount(maxStake, true, decimals),
        minStake: getStyledAmount(minStake, false, decimals),
        fullMinStake: getStyledAmount(minStake, true, decimals),
      },
    });
  },
  async getStakingUserInfo({ commit }, pool) {
    const decimals = 18;
    const _abi = pool === StakingTypes.WUSD ? abi.WQStakingNative : abi.WQStaking;
    const contractAddress = pool === StakingTypes.WUSD ? process.env.WORKNET_STAKING_WUSD : process.env.WORKNET_STAKING_WQT;
    const [userInfo, stakes] = await Promise.all([
      fetchContractData('getInfoByAddress', _abi, contractAddress, [getWalletAddress()], GetWalletProvider()),
      fetchContractData('stakes', _abi, contractAddress, [getWalletAddress()], GetWalletProvider()),
    ]);
    const { _balance, claim_, staked_ } = userInfo;
    const { unstakeTime } = stakes;
    commit('setStakingUserData', {
      pool,
      data: {
        ...userInfo,
        isStakingStarted: pool === StakingTypes.WUSD || +stakes.stakedAt !== 0,
        date: unstakeTime ? new Date(unstakeTime * 1000) : false,
        claim: getStyledAmount(claim_, false, decimals),
        fullClaim: getStyledAmount(claim_, true, decimals),
        staked: getStyledAmount(staked_, false, decimals),
        fullStaked: getStyledAmount(staked_, true, decimals),
        balance: getStyledAmount(_balance, false, decimals),
        fullBalance: getStyledAmount(_balance, true, decimals),
      },
    });
  },
  async stake({ commit }, {
    stakingType, amount, poolAddress, duration,
  }) {
    return await stake(stakingType, amount, poolAddress, duration);
  },
  async getStakingUnstakeFeeData({ dispatch }, { stakingType, poolAddress, amount }) {
    const _abi = stakingType === StakingTypes.WUSD ? abi.WQStakingNative : abi.WQStaking;
    return await dispatch('getContractFeeData', {
      method: 'unstake',
      _abi,
      contractAddress: poolAddress,
      data: [amount ? new BigNumber(amount).shiftedBy(18).toString() : '1'],
    });
  },
  async getStakingRenewalFeeData({ dispatch }, { stakingType, poolAddress }) {
    const _abi = stakingType === StakingTypes.WUSD ? abi.WQStakingNative : abi.WQStaking;
    return await dispatch('getContractFeeData', {
      method: 'autoRenewal',
      _abi,
      contractAddress: poolAddress,
    });
  },
  async getStakingClaimFeeData({ dispatch }, { stakingType, poolAddress }) {
    const _abi = stakingType === StakingTypes.WUSD ? abi.WQStakingNative : abi.WQStaking;
    return await dispatch('getContractFeeData', {
      method: 'claim',
      _abi,
      contractAddress: poolAddress,
    });
  },
  async getStakeFeeForAmount({ dispatch }, {
    amount, stakingType, poolAddress, days,
  }) {
    const isNative = stakingType === StakingTypes.WUSD;
    return await dispatch('getContractFeeData', {
      _abi: isNative ? abi.WQStakingNative : abi.WQStaking,
      contractAddress: poolAddress,
      method: 'stake',
      amount: isNative ? amount : null,
      data: isNative ? null : [new BigNumber(amount).shiftedBy(18).toString(), days.toString()],
    });
  },
  async getStakingApproveFeeData({ dispatch }, { stakeTokenAddress, poolAddress, fullMaxStake }) {
    fullMaxStake = new BigNumber(fullMaxStake).shiftedBy(18).toString();
    return await dispatch('getContractFeeData', {
      _abi: abi.ERC20,
      method: 'approve',
      contractAddress: stakeTokenAddress,
      data: [poolAddress, fullMaxStake],
    });
  },
  async stakingUnstake({ commit }, { amount, stakingType, poolAddress }) {
    try {
      amount = new BigNumber(amount).shiftedBy(18).toString();
      const _abi = stakingType === StakingTypes.WUSD ? abi.WQStakingNative : abi.WQStaking;
      const res = await sendWalletTransaction(
        'unstake',
        {
          abi: _abi,
          address: poolAddress,
          data: [amount],
        },
      );
      return success(res);
    } catch (e) {
      console.error('Unstake error', e.message);
      return error(9000, e.message);
    }
  },
  async stakingClaimRewards({ commit }, { stakingType, poolAddress }) {
    try {
      const _abi = stakingType === StakingTypes.WUSD ? abi.WQStakingNative : abi.WQStaking;
      await sendWalletTransaction('claim', { abi: _abi, address: poolAddress });
      return success();
    } catch (e) {
      console.error('Claim error', e.message);
      return error();
    }
  },
  async stakingRenewal({ commit }, { stakingType, poolAddress }) {
    try {
      const _abi = stakingType === StakingTypes.WUSD ? abi.WQStakingNative : abi.WQStaking;
      return success(await sendWalletTransaction('autoRenewal', { abi: _abi, address: poolAddress }));
    } catch (e) {
      console.error('Renewal error', e.message);
      return error();
    }
  },
};
