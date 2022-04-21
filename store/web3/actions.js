import BigNumber from 'bignumber.js';

import Web3 from 'web3';
import {
  claimRewards,
  disconnectWeb3,
  fetchContractData,
  getAccountAddress,
  goToChain,
  initWeb3,
  showToast,
  staking,
  unStaking,
  getAccount,
  getStakingDataByType,
  handleMetamaskStatus,
  unsubscirbeListeners,
  getChainIdByChain,
  initProvider,
  error, success,
} from '~/utils/web3';
import { ERC20 } from '~/abi/index';
import { Chains, StakingTypes } from '~/utils/enums';
import modals from '~/store/modals/modals';

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
    commit('setMetaMaskStatus', false);
    commit('clearAccount');
    localStorage.removeItem('walletconnect');
  },

  async connect({ commit, dispatch, getters }, payload) {
    const isReconnection = payload?.isReconnection;
    const response = await initWeb3(payload);
    if (response.ok) {
      if (!getters.isHandlingMetamaskStatus && !isReconnection) {
        handleMetamaskStatus(() => dispatch('handleMetamaskStatusChanged'));
        commit('setIsHandlingMetamaskStatus', true);
      }
      await commit('setAccount', response.result);
      await commit('setIsConnected', true);
      if (!isReconnection) showToast('Connect to wallet', 'Connected', 'success');
      return true;
    }
    commit('setIsConnected', false);
    showToast('Error connect to wallet', `${response.data}`, 'danger');
    return false;
  },
  async handleConnectionStatusChanged({ dispatch }) {
    await dispatch('disconnect');
    await dispatch('connect', { isReconnection: true, chain: localStorage.getItem('miningPoolId') });
  },

  async updateAccount({ commit }, newData) {
    commit('setAccount', newData);
  },

  // Only MetaMask
  async connectToMetaMask({ commit, dispatch, getters }, payload) {
    const isReconnection = payload?.isReconnection;
    const response = await initWeb3(payload);
    if (response.ok) {
      if (!getters.isHandlingMetamaskStatus && !isReconnection) {
        handleMetamaskStatus(() => dispatch('handleMetamaskStatusChanged'));
        commit('setIsHandlingMetamaskStatus', true);
      }
      await commit('setAccount', response.result);
      await commit('setIsConnected', true);
    }
  },
  async handleMetamaskStatusChanged({ dispatch }) {
    await dispatch('disconnect');
    await dispatch('connectToMetaMask', { isReconnection: true });
  },

  async checkMetaMaskStatus({ getters, dispatch }, chain) {
    if (!getters.isConnected) {
      if (typeof window.ethereum === 'undefined') {
        localStorage.setItem('metamaskStatus', 'notInstalled');
        this.ShowModal({
          key: modals.status,
          img: '~assets/img/ui/cardHasBeenAdded.svg',
          title: 'Please install Metamask!',
          subtitle: 'Please click install...',
          button: 'Install',
          callback: () => window.open('https://metamask.io/download.html'),
        });
      } else {
        localStorage.setItem('metamaskStatus', 'installed');
        await dispatch('connectToMetaMask');
        await dispatch('goToChain', { chain });
      }
    }
  },

  async initContract({ commit }) {
    const { stakingAddress, stakingAbi } = getStakingDataByType(StakingTypes.MINING);
    console.log('initContract', stakingAddress);
    const stakingInfo = await fetchContractData('getStakingInfo', stakingAbi, stakingAddress);
    const { stakeTokenAddress } = stakingInfo;
    const { rewardTokenAddress } = stakingInfo;
    const [stakeDecimal, stakeSymbol, rewardDecimal, rewardSymbol, stakeBalance, rewardBalance] = await Promise.all([
      fetchContractData('decimals', ERC20, stakeTokenAddress),
      fetchContractData('symbol', ERC20, stakeTokenAddress),
      fetchContractData('decimals', ERC20, rewardTokenAddress),
      fetchContractData('symbol', ERC20, rewardTokenAddress),
      fetchContractData('balanceOf', ERC20, stakeTokenAddress, [getAccountAddress()]),
      fetchContractData('balanceOf', ERC20, rewardTokenAddress, [getAccountAddress()]),
    ]);
    console.log(stakeBalance, rewardBalance);
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

  async fetchTokenInfo({ commit }, tokenAddress) {
    try {
      const [balance, decimals, symbol] = await Promise.all([
        fetchContractData('balanceOf', ERC20, tokenAddress, [getAccountAddress()]),
        fetchContractData('decimals', ERC20, tokenAddress),
        fetchContractData('symbol', ERC20, tokenAddress),
      ]);
      return success({
        balance,
        decimals,
        symbol,
      });
    } catch (e) {
      console.error('Error in fetchTokenInfo:', e);
      return error();
    }
  },

  async getTokensData({ commit }) {
    const { stakingAddress, stakingAbi } = getStakingDataByType(StakingTypes.MINING);
    const userInfo = await fetchContractData('getInfoByAddress', stakingAbi, stakingAddress, [getAccountAddress()]);
    const payload = {
      balanceTokenAmount: new BigNumber(userInfo._balance).shiftedBy(-18).toString(),
      stakeTokenAmount: new BigNumber(userInfo.staked_).shiftedBy(-18).toString(),
      rewardTokenAmount: new BigNumber(userInfo.claim_).shiftedBy(-18).toString(),
    };
    commit('setStakeAndRewardData', payload);
    return payload;
  },

  unsubscribeActions() {
    unsubscirbeListeners();
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
  async unstake({ commit }, { decimals, amount, stakingType }) {
    const { stakingAddress, stakingAbi } = getStakingDataByType(stakingType);
    return await unStaking(decimals, amount, stakingAddress, stakingAbi);
  },
  async claimRewards({ commit }, { stakingType }) {
    const { stakingAddress, stakingAbi } = getStakingDataByType(stakingType);
    return await claimRewards(stakingAddress, stakingAbi);
  },
  async goToChain({ commit }, { chain }) {
    return await goToChain(chain);
  },
  getAccountAddress() {
    return getAccountAddress();
  },
  getAccount() {
    return getAccount();
  },
  async chainIsCompareToCurrent({ dispatch }, chain) {
    return +getChainIdByChain(chain) === +getAccount().netId;
  },

  async initProvider({ commit }, payload) {
    const providerData = await initProvider(payload);
    commit('setMetaMaskStatus', providerData.isMetaMask);
    return providerData;
  },

  // mobile browser check
  // false - desktop, true - mobile && !metamask
  checkIsMobileMetamaskNeed() {
    if (!this.checkIfMobile()) return false;
    return typeof window.ethereum === 'undefined';
  },
};
