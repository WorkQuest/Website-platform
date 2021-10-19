import BigNumber from 'bignumber.js';
import {
  initWeb3,
  staking,
  unStaking,
  claimRewards,
  disconnectWeb3,
  swap,
  startPingingMetamask, fetchContractData, getAccount, createInstance, showToast, goToChain, swapWithBridge, redeemSwap,
  stakingBSC, unStakingBSC, claimRewardsBSC,
  fetchStakingInfo,
} from '~/utils/web3';
import * as abi from '~/abi/abi';
import { WQLiquidityMining } from '~/abi/abi';

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
      commit('setPurseData', getAccount().address);
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
        stakingAddress = process.env.STAKING_ADDRESS;
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
    const stakeBalance = await fetchContractData('balanceOf', abi.ERC20, stakeTokenAddress, [getAccount().address]);
    const rewardBalance = await fetchContractData('balanceOf', abi.ERC20, rewardTokenAddress, [getAccount().address]);
    console.log(stakeDecimal, rewardDecimal);
    const payload = {
      userPurse: {
        address: getAccount().address,
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
      const oldTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET, [getAccount().address]);
      const newTokenDecimal = await fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET);
      const newTokenSymbol = await fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET);
      const newTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET, [getAccount().address]);

      const payload = {
        userPurse: {
          address: getAccount().address,
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
      const oldTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET, [getAccount().address]);
      const newTokenDecimal = await fetchContractData('decimals', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET);
      const newTokenSymbol = await fetchContractData('symbol', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET);
      const newTokenBalance = await fetchContractData('balanceOf', abi.ERC20, process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET, [getAccount().address]);

      const payload = {
        userPurse: {
          address: getAccount().address,
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
        stakingAddress = process.env.STAKING_ADDRESS;
        stakingAbi = abi.StakingWQ;
      } else {
        stakingAddress = process.env.MAINNET_BSC_STAKING;
        stakingAbi = abi.WQLiquidityMining;
      }
    }
    const userInfo = await fetchContractData('getInfoByAddress', stakingAbi, stakingAddress, [getAccount().address]);
    console.log(stakeDecimal, rewardDecimal);
    const payload = {
      balanceTokenAmount: new BigNumber(userInfo._balance).shiftedBy(-18).toString(),
      stakeTokenAmount: new BigNumber(userInfo.staked_).shiftedBy(-18).toString(),
      rewardTokenAmount: new BigNumber(userInfo.claim_).shiftedBy(-18).toString(),
    };
    commit('setStakeAndRewardData', payload);
    return payload;
  },

  async fetchStakingInfo({ commit }, { native }) {
    let stakingAbi;
    let stakingAddress;
    if (process.env.PROD === 'false') {
      if (native) {
        stakingAbi = abi.WQStakingNative;
        stakingAddress = process.env.STAKING;
      } else {
        stakingAbi = abi.WQStaking;
        stakingAddress = process.env.STAKING;
      }
    } else {
      console.log('dev only');
    }
    const [stakingInfo, userInfo] = await Promise.all([
      fetchContractData('getStakingInfo', stakingAbi, stakingAddress),
      fetchContractData('getInfoByAddress', stakingAbi, stakingAddress, [getAccount().address]),
    ]);
    const {
      rewardTokenAddress, totalStaked, totalDistributed, rewardTotal, maxStake,
    } = stakingInfo;
    const reg = /\d{3,4}?(?=...)/g;
    const [rewardDecimal, tokenSymbol] = await Promise.all([
      fetchContractData('decimals', abi.ERC20, rewardTokenAddress),
      fetchContractData('symbol', abi.ERC20, rewardTokenAddress),
    ]);
    console.log(rewardTokenAddress, tokenSymbol, native, '\nUSER INFO:', userInfo);

    return {
      ...stakingInfo,
      rewardDecimal,
      tokenSymbol,
      claimPeriod: stakingInfo.claimPeriod / 60 / 60,
      stakePeriod: stakingInfo.stakePeriod / 60 / 60,
      distributionTime: stakingInfo.distributionTime / 60,
      totalStaked: new BigNumber(totalStaked).shiftedBy(-rewardDecimal).decimalPlaces(2).toString()
        .replace(reg, '$& '),
      totalDistributed: new BigNumber(totalDistributed).shiftedBy(-rewardDecimal).decimalPlaces(2).toString()
        .replace(reg, '$& '),
      rewardTotal: new BigNumber(rewardTotal).shiftedBy(-rewardDecimal).decimalPlaces(2).toString()
        .replace(reg, '$& '),
      maxStake: new BigNumber(maxStake).shiftedBy(-rewardDecimal).decimalPlaces(2).toString()
        .replace(reg, '$& '),
      userInfo,
    };
    // claimPeriod: "7200"
    // distributionTime: "1800"
    // maxStake: "100000000000000000000000" 100 000
    // minStake: "1000000000000000000000" - 1 000
    // rewardTokenAddress: "0xD8e8070b6cec220a86D336597E682F6E20f60c31"
    // rewardTotal: "100000000000000000000000"
    // stakePeriod: "900"
    // stakeTokenAddress: "0xD8e8070b6cec220a86D336597E682F6E20f60c31"
    // startTime: "1634538588"
    // totalDistributed: "0"
    // totalStaked: "0"

    /*

    duration: start time - скорее всего считать нужно из него как-то

    getInfoByAddress - по кошельку получаю инфу по юзеру

    stake - положить

    getClaim - размер реварда available для стейкера
    claim - забрать

    (потом можно проверить getClaim)

     */
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
