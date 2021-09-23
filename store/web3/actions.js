import BigNumber from 'bignumber.js';
import {
  initWeb3,
  staking,
  unStaking,
  claimRewards,
  disconnectWeb3,
  swap,
  startPingingMetamask, fetchContractData, getAccount, createInstance, showToast, goToChain,
} from '~/utils/web3';
import * as abi from '~/abi/abi';

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
  async startPingingMetamask({ dispatch }) {
    await startPingingMetamask(() => {
      showToast('Connect to Metamask', 'Disconnected', 'success');
      dispatch('disconnect');
    });
  },

  async connect({ commit, dispatch }) {
    const response = await initWeb3();
    if (response.ok) {
      dispatch('startPingingMetamask');
      commit('setAccount', response.result);
      commit('setIsConnected', true);
      showToast('Connect to Metamask', 'Connected', 'success');
    } else {
      commit('setIsConnected', false);
      showToast('Error connect to Metamask', `${response.data}`, 'danger');
    }
  },

  async initContract({ commit }) {
    const stakingInfo = await fetchContractData('getStakingInfo', abi.StakingWQ, process.env.STAKING_ADDRESS);
    const { stakeTokenAddress } = stakingInfo;
    const { rewardTokenAddress } = stakingInfo;
    const stakeDecimal = await fetchContractData('decimals', abi.ERC20, stakeTokenAddress);
    const stakeSymbol = await fetchContractData('symbol', abi.ERC20, stakeTokenAddress);
    const rewardDecimal = await fetchContractData('decimals', abi.ERC20, rewardTokenAddress);
    const rewardSymbol = await fetchContractData('symbol', abi.ERC20, rewardTokenAddress);
    const stakeBalance = await fetchContractData('balanceOf', abi.ERC20, stakeTokenAddress, [getAccount().address]);
    const rewardBalance = await fetchContractData('balanceOf', abi.ERC20, rewardTokenAddress, [getAccount().address]);
    const payload = {
      userPurse: {
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
    const oldTokenDecimal = await fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET);
    const oldTokenSymbol = await fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET);
    const oldTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET, [getAccount().address]);
    const newTokenDecimal = await fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET);
    const newTokenSymbol = await fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET);
    const newTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET, [getAccount().address]);

    const payload = {
      userPurse: {
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
    commit('setAccountData', payload);
  },

  async getTokensData({ commit }, { rewardDecimal, stakeDecimal }) {
    const userInfo = await fetchContractData('getInfoByAddress', abi.StakingWQ, process.env.STAKING_ADDRESS, [getAccount().address]);
    const payload = {
      balanceTokenAmount: new BigNumber(userInfo._balance).shiftedBy(-stakeDecimal).toString(),
      stakeTokenAmount: new BigNumber(userInfo.staked_).shiftedBy(-stakeDecimal).toString(),
      rewardTokenAmount: new BigNumber(userInfo.claim_).shiftedBy(-rewardDecimal).toString(),
    };
    commit('setStakeAndRewardData', payload);
    return payload;
  },

  async stake({ commit }, { decimals, amount }) {
    return await staking(decimals, amount);
  },
  async unstake({ commit }, { decimals, amount }) {
    return await unStaking(decimals, amount);
  },
  async claimRewards({ commit }) {
    return await claimRewards();
  },
  async swap({ commit }, { decimals, amount }) {
    return await swap(decimals, amount);
  },
  async goToChain({ commit }, { chain }) {
    return await goToChain(chain);
  },
};
