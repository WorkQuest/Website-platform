import BigNumber from 'bignumber.js';
import {
  initWeb3,
  staking,
  unStaking,
  claimRewards,
  disconnectWeb3,
  startPingingMetamask, fetchContractData, getAccount,
} from '~/utils/web3';
import * as abi from '~/abi/abi';

BigNumber.config({ EXPONENTIAL_AT: 60 });

export default {
  disconnect({ commit }) {
    disconnectWeb3();
    commit('setIsConnected', false);
    commit('clearTokens');
    commit('clearAccount');
  },
  async startPingingMetamask({ dispatch }) {
    await startPingingMetamask(() => {
      dispatch('disconnect');
    });
  },
  async connect({ commit, dispatch }) {
    const response = await initWeb3();
    if (response.ok) {
      dispatch('startPingingMetamask');
      commit('setAccount', response.result);
      commit('setIsConnected', true);
    } else {
      console.log('Web3 connect error', response);
      commit('setIsConnected', false);
      dispatch('main/showToast', {
        title: 'Error',
        text: `${response.data}`,
        variant: 'danger',
      }, { root: true });
    }
  },

  async initWeb3ExampleContract({ commit }) {
    const stakingInfo = await fetchContractData('getStakingInfo', abi.StakingWQ, process.env.STAKING_ADDRESS);
    const { stakeTokenAddress } = stakingInfo;
    console.log('stakingInfo', stakingInfo, process.env.STAKING_ADDRESS);
    const { rewardTokenAddress } = stakingInfo;
    console.log('stakeTokenAddress', stakeTokenAddress, 'rewardTokenAddress', rewardTokenAddress);
    const stakeDecimal = await fetchContractData('decimals', abi.ERC20, stakeTokenAddress);
    const stakeSymbol = await fetchContractData('symbol', abi.ERC20, stakeTokenAddress);
    const rewardDecimal = await fetchContractData('decimals', abi.ERC20, rewardTokenAddress);
    const rewardSymbol = await fetchContractData('symbol', abi.ERC20, rewardTokenAddress);
    console.log(rewardSymbol);
    const stakeBalance = await fetchContractData('balanceOf', abi.ERC20, stakeTokenAddress, [getAccount().address]);
    const rewardBalance = await fetchContractData('balanceOf', abi.ERC20, rewardTokenAddress, [getAccount().address]);
    console.log('1', stakeDecimal, stakeSymbol, new BigNumber(stakeBalance).shiftedBy(-stakeDecimal).toString(), rewardDecimal, rewardSymbol, new BigNumber(rewardBalance).shiftedBy(-rewardDecimal).toString());
    const userInfo = await fetchContractData('getInfoByAddress', abi.StakingWQ, process.env.STAKING_ADDRESS, [getAccount().address]);
    console.log(userInfo);

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

  async stake({ commit }, { decimals, amount }) {
    return await staking(decimals, amount);
  },
  async unstake({ commit }, { decimals, amount }) {
    console.log(2);
    return await unStaking(decimals, amount);
  },
  async claimRewards({ commit }) {
    return await claimRewards();
  },
};
