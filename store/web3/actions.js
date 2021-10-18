import BigNumber from 'bignumber.js';
import {
  initWeb3,
  staking,
  unStaking,
  claimRewards,
  disconnectWeb3,
  swap,
  startPingingMetamask, fetchContractData, getAccountAddress, createInstance, showToast, goToChain, swapWithBridge, redeemSwap,
  stakingBSC, unStakingBSC, claimRewardsBSC,
} from '~/utils/web3';
import * as abi from '~/abi/abi';
import { WQLiquidityMining } from '~/abi/abi';

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
      commit('setPurseData', getAccountAddress());
      showToast('Connect to Metamask', 'Connected', 'success');
    } else if (typeof window.ethereum === 'undefined') {
      showToast('Error connect to Metamask', 'Metamask not installed! Please install Metamask!', 'danger');
    } else {
      commit('setIsConnected', false);
      showToast('Error connect to Metamask', `${response.data}`, 'danger');
    }
  },

  async initContract({ commit }) {
    const miningPoolId = localStorage.getItem('miningPoolId');
    let stakingAddress;
    let stakingAbi;
    if (process.env.PROD === 'false') {
      if (miningPoolId === 'ETH') {
        stakingAddress = process.env.STAKING_ADDRESS;
        stakingAbi = abi.StakingWQ;
      } else {
        stakingAddress = process.env.TESTNET_BSC_STAKING;
        stakingAbi = abi.WQLiquidityMining;
      }
    }
    if (process.env.PROD === 'true') {
      if (miningPoolId === 'ETH') {
        stakingAddress = process.env.MAINNET_ETH_STAKING;
        stakingAbi = abi.StakingWQ;
      } else {
        stakingAddress = process.env.MAINNET_BSC_STAKING;
        stakingAbi = abi.WQLiquidityMining;
      }
    }
    const stakingInfo = await fetchContractData('getStakingInfo', stakingAbi, stakingAddress);
    const { stakeTokenAddress } = stakingInfo;
    const { rewardTokenAddress } = stakingInfo;
    const stakeDecimal = await fetchContractData('decimals', abi.ERC20, stakeTokenAddress);
    const stakeSymbol = await fetchContractData('symbol', abi.ERC20, stakeTokenAddress);
    const rewardDecimal = await fetchContractData('decimals', abi.ERC20, rewardTokenAddress);
    const rewardSymbol = await fetchContractData('symbol', abi.ERC20, rewardTokenAddress);
    const stakeBalance = await fetchContractData('balanceOf', abi.ERC20, stakeTokenAddress, [getAccountAddress()]);
    const rewardBalance = await fetchContractData('balanceOf', abi.ERC20, rewardTokenAddress, [getAccountAddress()]);
    console.log(stakeDecimal, rewardDecimal);
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
      const oldTokenDecimal = await fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET);
      const oldTokenSymbol = await fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET);
      const oldTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET, [getAccountAddress()]);
      const newTokenDecimal = await fetchContractData('decimals', abi.ERC20, process.env.MAINNET_BSC_WQT_TOKEN);
      const newTokenSymbol = await fetchContractData('symbol', abi.ERC20, process.env.MAINNET_BSC_WQT_TOKEN);
      const newTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.MAINNET_BSC_WQT_TOKEN, [getAccountAddress()]);

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
      const oldTokenDecimal = await fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET);
      const oldTokenSymbol = await fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET);
      const oldTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET, [getAccountAddress()]);
      const newTokenDecimal = await fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET);
      const newTokenSymbol = await fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET);
      const newTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET, [getAccountAddress()]);

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
    const miningPoolId = localStorage.getItem('miningPoolId');
    let stakingAddress;
    let stakingAbi;
    if (process.env.PROD === 'false') {
      if (miningPoolId === 'ETH') {
        stakingAddress = process.env.STAKING_ADDRESS;
        stakingAbi = abi.StakingWQ;
      } else {
        stakingAddress = process.env.TESTNET_BSC_STAKING;
        stakingAbi = abi.WQLiquidityMining;
      }
    }
    if (process.env.PROD === 'true') {
      if (miningPoolId === 'ETH') {
        stakingAddress = process.env.MAINNET_ETH_STAKING;
        stakingAbi = abi.StakingWQ;
      } else {
        stakingAddress = process.env.MAINNET_BSC_STAKING;
        stakingAbi = abi.WQLiquidityMining;
      }
    }
    const userInfo = await fetchContractData('getInfoByAddress', stakingAbi, stakingAddress, [getAccountAddress()]);
    console.log(stakeDecimal);
    const payload = {
      balanceTokenAmount: new BigNumber(userInfo._balance).shiftedBy(-18).toString(),
      stakeTokenAmount: new BigNumber(userInfo.staked_).shiftedBy(-18).toString(),
      rewardTokenAmount: new BigNumber(userInfo.claim_).shiftedBy(-18).toString(),
    };
    commit('setStakeAndRewardData', payload);
    return payload;
  },

  async getCrosschainTokensData({ commit }) {
    const miningPoolId = localStorage.getItem('miningPoolId');
    let token;
    if (process.env.PROD === 'false') {
      if (miningPoolId === 'ETH') {
        token = process.env.TOKEN_WQT_ADDRESS_RINKEBY;
      } else {
        token = process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET;
      }
    }
    if (process.env.PROD === 'true') {
      if (miningPoolId === 'ETH') {
        token = process.env.MAINNET_ETH_WQT_TOKEN;
      } else {
        token = process.env.MAINNET_BSC_WQT_TOKEN;
      }
    }
    const tokenDecimal = await fetchContractData('decimals', abi.ERC20, token);
    const tokenSymbol = await fetchContractData('symbol', abi.ERC20, token);
    const tokenValue = await fetchContractData('balanceOf', abi.ERC20, token, [getAccountAddress()]);
    const payload = {
      tokenAmount: new BigNumber(tokenValue).shiftedBy(-tokenDecimal).toString(),
      tokenSymbol,
    };
    commit('setCrosschainTokensData', payload);
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
  async swapWithBridge({ commit }, {
    _decimals, _amount, chain, chainTo, userAddress, recipient, symbol,
  }) {
    return await swapWithBridge(_decimals, _amount, chain, chainTo, userAddress, recipient, symbol);
  },
  async goToChain({ commit }, { chain }) {
    // commit('setIsConnected', false);
    return await goToChain(chain);
  },
  async redeemSwap({ commit }, payload) {
    return await redeemSwap(payload);
  },
};
