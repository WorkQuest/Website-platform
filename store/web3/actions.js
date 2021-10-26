import BigNumber from 'bignumber.js';
import {
  initWeb3,
  staking,
  unStaking,
  claimRewards,
  disconnectWeb3,
  swap,
  fetchContractData,
  getAccountAddress,
  getAccount,
  showToast,
  goToChain,
  swapWithBridge,
  redeemSwap,
  getStakingDataByType,
  getStakingRewardTxFee, handleMetamaskStatus, fetchStakingActions, unsubscirbeStakingListeners, getChainIdByChain,
} from '~/utils/web3';
import * as abi from '~/abi/abi';

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
BigNumber.config({ EXPONENTIAL_AT: 60 });

export default {
  showToast({ dispatch }, title, text, variant) {
    dispatch('main/showToast', {
      title,
      text,
      variant,
    }, { root: true });
  },

  switchBusyStatusTrue({ commit }) {
    commit('setBusy', true);
  },
  switchBusyStatusFalse({ commit }) {
    commit('setBusy', false);
  },

  disconnect({ commit }) {
    disconnectWeb3();
    commit('setIsConnected', false);
    commit('clearTokens');
    commit('clearAccount');
  },

  async connect({ commit, dispatch, getters }, payload) {
    const isReconnection = payload?.isReconnection;
    const response = await initWeb3();
    if (response.ok) {
      if (!getters.isHandlingMetamaskStatus) {
        handleMetamaskStatus(() => dispatch('handleMetamaskStatusChanged'));
        commit('setIsHandlingMetamaskStatus', true);
      }
      await commit('setAccount', response.result);
      await commit('setIsConnected', true);
      await commit('setPurseData', getAccountAddress());
      if (!isReconnection) showToast('Connect to Metamask', 'Connected', 'success');
    } else {
      commit('setIsConnected', false);
      showToast('Error connect to Metamask', `${response.data}`, 'danger');
    }
  },
  async handleMetamaskStatusChanged({ dispatch }) {
    console.log('handle status changes');
    await dispatch('disconnect');
    await dispatch('connect', { isReconnection: true });
  },

  async initContract({ commit }) {
    const { stakingAddress, stakingAbi } = getStakingDataByType('MINING');
    const stakingInfo = await fetchContractData('getStakingInfo', stakingAbi, stakingAddress);
    const { stakeTokenAddress } = stakingInfo;
    const { rewardTokenAddress } = stakingInfo;
    const [stakeDecimal, stakeSymbol, rewardDecimal, rewardSymbol, stakeBalance, rewardBalance] = await Promise.all([
      fetchContractData('decimals', abi.ERC20, stakeTokenAddress),
      fetchContractData('symbol', abi.ERC20, stakeTokenAddress),
      fetchContractData('decimals', abi.ERC20, rewardTokenAddress),
      fetchContractData('symbol', abi.ERC20, rewardTokenAddress),
      fetchContractData('balanceOf', abi.ERC20, stakeTokenAddress, [getAccountAddress()]),
      fetchContractData('balanceOf', abi.ERC20, rewardTokenAddress, [getAccountAddress()]),
    ]);
    const payload = {
      userPurse: {
        address: getAccountAddress(),
        stakeBalance: new BigNumber(stakeBalance).shiftedBy(-stakeDecimal).toString(),
        stakeSymbol,
        rewardBalance: new BigNumber(rewardBalance).shiftedBy(-rewardDecimal).toString(),
        rewardSymbol,
      },
      decimals: {
        stakeDecimal,
        rewardDecimal,
      },
    };
    commit('setAccountData', payload);
  },

  async initTokensData({ commit }) {
    if (process.env.PROD === 'true') {
      const [oldTokenDecimal, oldTokenSymbol, oldTokenBalance, newTokenDecimal, newTokenSymbol, newTokenBalance] = await Promise.all([
        fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET),
        fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET),
        fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET, [getAccountAddress()]),
        fetchContractData('decimals', abi.ERC20, process.env.MAINNET_BSC_WQT_TOKEN),
        fetchContractData('symbol', abi.ERC20, process.env.MAINNET_BSC_WQT_TOKEN),
        fetchContractData('balanceOf', abi.ERC20, process.env.MAINNET_BSC_WQT_TOKEN, [getAccountAddress()]),
      ]);
      const payload = {
        userPurse: {
          address: getAccountAddress(),
          oldTokenBalance: new BigNumber(oldTokenBalance).shiftedBy(-oldTokenDecimal).toString(),
          oldTokenSymbol,
          newTokenBalance: new BigNumber(newTokenBalance).shiftedBy(-newTokenDecimal).toString(),
          newTokenSymbol,
        },
        decimals: {
          oldTokenDecimal,
          newTokenDecimal,
        },
      };
      commit('setBSCTokensData', payload);
    } if (process.env.PROD === 'false') {
      const [oldTokenDecimal, oldTokenSymbol, oldTokenBalance, newTokenDecimal, newTokenSymbol, newTokenBalance] = await Promise.all([
        fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET),
        fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET),
        fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET, [getAccountAddress()]),
        fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET),
        fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET),
        fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET, [getAccountAddress()]),
      ]);
      const payload = {
        userPurse: {
          address: getAccountAddress(),
          oldTokenBalance: new BigNumber(oldTokenBalance).shiftedBy(-oldTokenDecimal).toString(),
          oldTokenSymbol,
          newTokenBalance: new BigNumber(newTokenBalance).shiftedBy(-newTokenDecimal).toString(),
          newTokenSymbol,
        },
        decimals: {
          oldTokenDecimal,
          newTokenDecimal,
        },
      };
      commit('setBSCTokensData', payload);
    }
  },

  async getTokensData({ commit }, { rewardDecimal, stakeDecimal }) {
    const { stakingAddress, stakingAbi } = getStakingDataByType('MINING');
    const userInfo = await fetchContractData('getInfoByAddress', stakingAbi, stakingAddress, [getAccountAddress()]);
    const payload = {
      balanceTokenAmount: new BigNumber(userInfo._balance).shiftedBy(-18).toString(),
      stakeTokenAmount: new BigNumber(userInfo.staked_).shiftedBy(-18).toString(),
      rewardTokenAmount: new BigNumber(userInfo.claim_).shiftedBy(-18).toString(),
    };
    commit('setStakeAndRewardData', payload);
    return payload;
  },

  async getCrosschainTokensData({ commit }) {
    const { tokenAddress } = getStakingDataByType('MINING');
    const [tokenDecimal, tokenSymbol, tokenValue] = await Promise.all([
      fetchContractData('decimals', abi.ERC20, tokenAddress),
      fetchContractData('symbol', abi.ERC20, tokenAddress),
      fetchContractData('balanceOf', abi.ERC20, tokenAddress, [getAccountAddress()]),
    ]);
    const payload = {
      tokenAmount: new BigNumber(tokenValue).shiftedBy(-tokenDecimal).toString(),
      tokenSymbol,
    };
    commit('setCrosschainTokensData', payload);
    return payload;
  },

  async fetchStakingUserInfo({ commit }, { stakingType, decimals }) {
    const { stakingAbi, stakingAddress } = getStakingDataByType(stakingType);
    const [userInfo, duration] = await Promise.all([
      fetchContractData('getInfoByAddress', stakingAbi, stakingAddress, [getAccountAddress()]),
      fetchContractData('stakes', stakingAbi, stakingAddress, [getAccountAddress()]),
    ]);
    console.log(duration);
    return {
      ...userInfo,
      date: duration.unstakeTime ? new Date(duration.unstakeTime * 1000) : false,
      claim: new BigNumber(userInfo.claim_).shiftedBy(-decimals).decimalPlaces(2).toString(),
      staked: new BigNumber(userInfo.staked_).shiftedBy(-decimals).decimalPlaces(2).toString(),
      balance: new BigNumber(userInfo._balance).shiftedBy(-decimals).decimalPlaces(2).toString(),
      _balance: new BigNumber(userInfo._balance).shiftedBy(-decimals).toString(),
    };
  },
  getStakingRewardTxFee({ commit }, stakingType) {
    return getStakingRewardTxFee(stakingType);
  },
  async fetchStakingInfo({ commit }, { stakingType }) {
    const { stakingAbi, stakingAddress } = getStakingDataByType(stakingType);
    const stakingInfo = await fetchContractData('getStakingInfo', stakingAbi, stakingAddress);
    if (!stakingInfo) {
      return false;
    }
    const {
      rewardTokenAddress, totalStaked, totalDistributed, rewardTotal, maxStake, minStake,
    } = stakingInfo;
    const [decimals, tokenSymbol] = await Promise.all([
      fetchContractData('decimals', abi.ERC20, rewardTokenAddress),
      fetchContractData('symbol', abi.ERC20, rewardTokenAddress),
    ]);
    return {
      ...stakingInfo,
      decimals,
      tokenSymbol,
      claimPeriod: new BigNumber(stakingInfo.claimPeriod / 60 / 60).decimalPlaces(3).toString(),
      stakePeriod: new BigNumber(stakingInfo.stakePeriod / 60 / 60).decimalPlaces(3).toString(),
      distributionTime: new BigNumber(stakingInfo.distributionTime / 60).decimalPlaces(3).toString(),
      totalStaked: new BigNumber(totalStaked).shiftedBy(-decimals).decimalPlaces(2).toString(),
      totalDistributed: new BigNumber(totalDistributed).shiftedBy(-decimals).decimalPlaces(2).toString(),
      rewardTotal: new BigNumber(rewardTotal).shiftedBy(-decimals).decimalPlaces(2).toString(),
      maxStake: new BigNumber(maxStake).shiftedBy(-decimals).decimalPlaces(2).toString(),
      minStake: new BigNumber(minStake).shiftedBy(-decimals).decimalPlaces(2).toString(),
    };
  },
  async fetchStakingActions({ commit }, { stakingType, callback }) {
    const { stakingAbi, stakingAddress } = getStakingDataByType(stakingType);
    await fetchStakingActions(stakingAbi, stakingAddress, callback);
  },
  unsubscribeStakingActions() {
    unsubscirbeStakingListeners();
  },
  async stake({ commit }, {
    decimals, amount, stakingType, duration,
  }) {
    const {
      tokenAddress,
      stakingAddress,
      stakingAbi,
    } = getStakingDataByType(stakingType);
    return await staking(decimals, amount, tokenAddress, stakingAddress, stakingAbi, duration, stakingType);
  },
  async unstake({ commit }, { decimals, amount }) {
    return await unStaking(decimals, amount);
  },
  async claimRewards({ commit }, { stakingType, amount }) {
    const { stakingAddress, stakingAbi } = getStakingDataByType(stakingType);
    return await claimRewards(stakingAddress, stakingAbi, amount);
  },
  async swap({ commit }, { decimals, amount }) {
    return await swap(decimals, amount);
  },
  async swapWithBridge({ commit }, {
    _decimals, _amount, chain, chainTo, userAddress, recipient, symbol,
  }) {
    return await swapWithBridge(_decimals, _amount, chain, chainTo, userAddress, recipient, symbol);
  },
  async goToChain({ commit }, { chain }) {
    return await goToChain(chain);
  },
  async redeemSwap({ commit }, payload) {
    return await redeemSwap(payload);
  },
  getAccountAddress() {
    return getAccountAddress();
  },
  async chainIsCompareToCurrent({ dispatch }, chain) {
    return +getChainIdByChain(chain) === +getAccount().netId;
  },
};
