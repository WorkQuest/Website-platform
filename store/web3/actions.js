import BigNumber from 'bignumber.js';

import {
  Pair as PairUniswap,
  Token as TokenUniswap,
  TokenAmount as TokenAmountUniswap,
} from '@uniswap/sdk';

import {
  Token as TokenPancake,
  TokenAmount as TokenAmountPancake,
  Pair as PairPancake,
} from '@pancakeswap/sdk';

import {
  claimRewards,
  disconnectWeb3,
  fetchContractData,
  getAccountAddress,
  goToChain,
  initStackingContract,
  initWeb3, initMetaMaskWeb3,
  redeemSwap,
  showToast,
  staking,
  unStaking,
  swap,
  getAccount,
  swapWithBridge,
  getStakingDataByType,
  getStakingRewardTxFee, handleMetamaskStatus, fetchActions, unsubscirbeListeners, getChainIdByChain,
  initProvider,
  authRenewal,
  getPensionDefaultData,
  getPensionWallet,
  pensionUpdateFee, pensionContribute, pensionsWithdraw, pensionExtendLockTime,
} from '~/utils/web3';
import * as abi from '~/abi/abi';
import { StakingTypes } from '~/utils/enums';

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
    commit('clearTokens');
    commit('clearAccount');
    localStorage.removeItem('isMetaMask');
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
      await commit('setPurseData', getAccountAddress());
      if (!isReconnection) showToast('Connect to Metamask', 'Connected', 'success');
    } else {
      commit('setIsConnected', false);
      showToast('Error connect to Metamask', `${response.data}`, 'danger');
    }
  },
  async handleConnectionStatusChanged({ dispatch }) {
    await dispatch('disconnect');
    await dispatch('connect', { isReconnection: true, chain: localStorage.getItem('miningPoolId') });
  },

  // Only MetaMask
  async connectToMetaMask({ commit, dispatch, getters }, payload) {
    const isReconnection = payload?.isReconnection;
    const response = await initMetaMaskWeb3(payload);
    if (response.ok) {
      if (!getters.isHandlingMetamaskStatus && !isReconnection) {
        handleMetamaskStatus(() => dispatch('handleMetamaskStatusChanged'));
        commit('setIsHandlingMetamaskStatus', true);
      }
      await commit('setAccount', response.result);
      await commit('setIsConnected', true);
      await commit('setPurseData', getAccountAddress());
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
          type: 'installMetamask',
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
    const [oldTokenDecimal, oldTokenSymbol, oldTokenBalance, newTokenDecimal, newTokenSymbol, newTokenBalance] = await Promise.all([
      fetchContractData('decimals', abi.ERC20, process.env.BSC_OLD_WQT_TOKEN),
      fetchContractData('symbol', abi.ERC20, process.env.BSC_OLD_WQT_TOKEN),
      fetchContractData('balanceOf', abi.ERC20, process.env.BSC_OLD_WQT_TOKEN, [getAccountAddress()]),
      fetchContractData('decimals', abi.ERC20, process.env.BSC_WQT_TOKEN),
      fetchContractData('symbol', abi.ERC20, process.env.BSC_WQT_TOKEN),
      fetchContractData('balanceOf', abi.ERC20, process.env.BSC_WQT_TOKEN, [getAccountAddress()]),
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

  async getCrosschainTokensData({ commit }) {
    const { tokenAddress } = getStakingDataByType(StakingTypes.CROSS_CHAIN);
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
    return {
      ...userInfo,
      date: duration.unstakeTime ? new Date(duration.unstakeTime * 1000) : false,
      claim: new BigNumber(userInfo.claim_).shiftedBy(-decimals).decimalPlaces(5).toString(),
      staked: new BigNumber(userInfo.staked_).shiftedBy(-decimals).decimalPlaces(4).toString(),
      _staked: new BigNumber(userInfo.staked_).shiftedBy(-decimals).toString(),
      balance: new BigNumber(userInfo._balance).shiftedBy(-decimals).decimalPlaces(4).toString(),
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

    let decimals;
    let tokenSymbol;
    if (!rewardTokenAddress) {
      decimals = 18;
      tokenSymbol = null;
    } else {
      const [_decimals, _tokenSymbol] = await Promise.all([
        fetchContractData('decimals', abi.ERC20, rewardTokenAddress),
        fetchContractData('symbol', abi.ERC20, rewardTokenAddress),
      ]);
      decimals = _decimals;
      tokenSymbol = _tokenSymbol;
    }

    const min = new BigNumber(0.0001);
    const _minStake = new BigNumber(minStake).shiftedBy(-decimals).isLessThan(min)
      ? min.toString() : new BigNumber(minStake).shiftedBy(-decimals).toString();

    return {
      ...stakingInfo,
      decimals,
      tokenSymbol,
      stakeTokenSymbol: tokenSymbol,
      claimPeriod: new BigNumber(stakingInfo.claimPeriod / 60 / 60).decimalPlaces(3).toString(),
      stakePeriod: new BigNumber(stakingInfo.stakePeriod / 60 / 60).decimalPlaces(3).toString(),
      distributionTime: new BigNumber(stakingInfo.distributionTime / 60).decimalPlaces(3).toString(),
      totalStaked: new BigNumber(totalStaked).shiftedBy(-decimals).decimalPlaces(4).toString(),
      totalDistributed: new BigNumber(totalDistributed).shiftedBy(-decimals).decimalPlaces(4).toString(),
      rewardTotal: new BigNumber(rewardTotal).shiftedBy(-decimals).decimalPlaces(4).toString(),
      maxStake: new BigNumber(maxStake).shiftedBy(-decimals).decimalPlaces(4).toString(),
      _maxStake: new BigNumber(maxStake).shiftedBy(-decimals).toString(),
      _minStake,
      minStake: new BigNumber(minStake).shiftedBy(-decimals).decimalPlaces(4).toString(),
    };
  },
  async fetchStakingActions({ commit }, { stakingType, callback, events }) {
    const { stakingAbi, stakingAddress } = getStakingDataByType(stakingType);
    await fetchActions(stakingAbi, stakingAddress, callback, events);
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
  async autoRenewal({ commit }, { stakingType }) {
    const { stakingAddress, stakingAbi } = getStakingDataByType(stakingType);
    return await authRenewal(stakingAddress, stakingAbi);
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
  getAccount() {
    return getAccount();
  },
  async chainIsCompareToCurrent({ dispatch }, chain) {
    return +getChainIdByChain(chain) === +getAccount().netId;
  },
  async getAPY({ commit }, payload) {
    // TODO: add actual Data
    let token0;
    let token1;
    let chainId;
    let amountMax0;
    let amountMax1;
    let api;
    let pair;
    const stakingInfoEvent = await initStackingContract(payload.chain);
    if (payload.chain === 'ETH') {
      chainId = 1;
      amountMax0 = 2000000000000000000;
      amountMax1 = 1000000000000000000;

      // TODO совпадают названия переменных, нужен этот костыль
      const ethereum_wqt_token = process.env.PROD === 'false'
        ? '0x06677Dc4fE12d3ba3C7CCfD0dF8Cd45e4D4095bF'
        : process.env.ETHEREUM_WQT_TOKEN;

      token0 = new TokenUniswap(
        chainId,
        ethereum_wqt_token,
        18,
        'WQT',
        'Work Quest Token',
      );
      token1 = new TokenUniswap(
        chainId,
        process.env.WETH_TOKEN,
        18,
        'WETH',
        'Wrapped Ether',
      );
      pair = new PairUniswap(
        new TokenAmountUniswap(token0, amountMax0),
        new TokenAmountUniswap(token1, amountMax1),
      );
      api = this.$axios.create({
        baseURL: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      });
    } else {
      chainId = 56;
      amountMax0 = 2000000000000000000;
      amountMax1 = 2000000000000000000;

      // TODO совпадают названия переменных, нужен этот костыль
      const bsc_wqt_token = process.env.PROD === 'false'
        ? '0xe89508D74579A06A65B907c91F697CF4F8D9Fac7'
        : process.env.BSC_WQT_TOKEN;

      token0 = new TokenPancake(
        chainId,
        bsc_wqt_token,
        18,
        'WQT',
        'Work Quest Token',
      );
      token1 = new TokenPancake(
        chainId,
        process.env.WBNB_TOKEN,
        18,
        'WETH',
        'Wrapped BNB',
      );
      pair = new PairPancake(
        new TokenAmountPancake(token0, amountMax0),
        new TokenAmountPancake(token1, amountMax1),
      );
      api = this.$axios.create({
        baseURL: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
      });
    }
    const apiCoingecko = this.$axios.create({
      baseURL: 'https://api.coingecko.com/api/v3/coins/work-quest',
    });
    try {
      const coingeckoResult = await apiCoingecko.get('');
      const priceWQT = coingeckoResult.data.market_data.current_price.usd;
      const result = await api.post('', {
        query: `{
        pairDayDatas (first: 1, skip: 0,
        orderBy:date, orderDirection: desc,
        where: {pairAddress: "${pair.liquidityToken.address.toLowerCase()}"})
        { totalSupply reserveUSD }}`,
      });
      const { totalSupply } = result.data.data.pairDayDatas[0];
      const { reserveUSD } = result.data.data.pairDayDatas[0];
      const totalStaked = new BigNumber(stakingInfoEvent.totalStaked).shiftedBy(-18).toNumber();
      const rewardTotal = new BigNumber(stakingInfoEvent.rewardTotal).shiftedBy(-18).toNumber();
      const priceLP = reserveUSD / totalSupply;
      const APY = ((rewardTotal * 12) * priceWQT) / (totalStaked * priceLP);
      return ((payload.stakedAmount * priceLP) * APY) / priceWQT; // profit
    } catch (err) {
      return err;
    }
  },
  async initProvider({ commit }, payload) {
    const providerData = await initProvider(payload);
    commit('setMetaMaskStatus', providerData.isMetaMask);
    return providerData;
  },

  async getPensionDefaultData() {
    return await getPensionDefaultData();
  },
  async getPensionContributed() {
    const _abi = abi.WQPensionFund;
    const _pensionAddress = process.env.PENSION_FUND_TEST;
    const res = await fetchContractData('contributed', _abi, _pensionAddress);
    console.log('contributed', res);
    return res;
  },
  async getPensionWallet() {
    return await getPensionWallet();
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
    let feeOk = false;
    let depositOk = false;
    const equalsFee = new BigNumber(defaultFee).shiftedBy(-18).isEqualTo(new BigNumber(fee).shiftedBy(-18));
    if (!firstDeposit || !equalsFee) {
      feeOk = await pensionUpdateFee(fee);
    } else feeOk = true;
    if (firstDeposit) depositOk = await pensionContribute(firstDeposit);
    else return feeOk;
    return depositOk && feeOk;
  },
  async fetchPensionActions({ commit }, { callback, events, params }) {
    const _abi = abi.WQPensionFund;
    const _pensionAddress = process.env.PENSION_FUND_TEST;
    await fetchActions(_abi, _pensionAddress, callback, events, params);
  },
  async pensionExtendLockTime() {
    return await pensionExtendLockTime();
  },
};
