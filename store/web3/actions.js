import BigNumber from 'bignumber.js';

import {
  Pair as PairUniswap,
  Token as TokenUniswap,
  TokenAmount as TokenAmountUniswap,
} from '@uniswap/sdk';

import Web3 from 'web3';
import {
  claimRewards,
  disconnectWeb3,
  fetchContractData,
  getAccountAddress,
  goToChain,
  initStackingContract,
  initWeb3,
  initMetaMaskWeb3,
  redeemSwap,
  showToast,
  staking,
  unStaking,
  swap,
  getAccount,
  swapWithBridge,
  getStakingDataByType,
  handleMetamaskStatus,
  fetchActions,
  unsubscirbeListeners,
  getChainIdByChain,
  initProvider,
  authRenewal,
  getPensionDefaultData,
  getPensionWallet,
  pensionUpdateFee,
  pensionContribute,
  pensionsWithdraw,
  pensionExtendLockTime,
  getTxFee,
  getPoolTotalSupplyBSC, getPoolTokensAmountBSC,
  sendTransaction, createInstance, error,
} from '~/utils/web3';
import * as abi from '~/abi/abi';
import { StakingTypes } from '~/utils/enums';
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
    commit('clearTokens');
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
      await commit('setPurseData', getAccountAddress());
      if (!isReconnection) showToast('Connect to wallet', 'Connected', 'success');
    } else {
      commit('setIsConnected', false);
      showToast('Error connect to wallet', `${response.data}`, 'danger');
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
    const { stakingAbi, stakingAddress } = getStakingDataByType(stakingType);
    return getTxFee(stakingAbi, stakingAddress, 'claim');
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
    let totalSupply;
    let reserveUSD;
    if (payload.chain === 'ETH') {
      const ethereum_wqt_token = process.env.PROD === 'false'
        ? '0x06677Dc4fE12d3ba3C7CCfD0dF8Cd45e4D4095bF'
        : process.env.ETHEREUM_WQT_TOKEN;

      const token0 = new TokenUniswap(
        1,
        ethereum_wqt_token,
        18,
        'WQT',
        'Work Quest Token',
      );
      const token1 = new TokenUniswap(
        1,
        process.env.WETH_TOKEN,
        18,
        'WETH',
        'Wrapped Ether',
      );
      const pair = new PairUniswap(
        new TokenAmountUniswap(token0, 2000000000000000000),
        new TokenAmountUniswap(token1, 1000000000000000000),
      );
      const uniswapApi = this.$axios.create({
        baseURL: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      });
      const result = await uniswapApi.post('', {
        query: `{
        pairDayDatas (first: 1, skip: 0,
        orderBy:date, orderDirection: desc,
        where: {pairAddress: "${pair.liquidityToken.address.toLowerCase()}"})
        { totalSupply reserveUSD }}`,
      });
      totalSupply = result.data.data.pairDayDatas[0].totalSupply;
      reserveUSD = result.data.data.pairDayDatas[0].reserveUSD;
    } else {
      const [supply, tokensAmount] = await Promise.all([
        getPoolTotalSupplyBSC(),
        getPoolTokensAmountBSC(),
      ]);
      totalSupply = supply;
      reserveUSD = new BigNumber(tokensAmount.wqtAmount).multipliedBy(tokensAmount.wbnbAmount).sqrt().toNumber();
    }
    try {
      const apiCoingecko = this.$axios.create({ baseURL: 'https://api.coingecko.com/api/v3/coins/work-quest' });
      const [coingeckoResult, stakingInfoEvent] = await Promise.all([
        apiCoingecko.get(''),
        initStackingContract(payload.chain),
      ]);
      const priceWQT = coingeckoResult.data.market_data.current_price.usd;
      const totalStaked = new BigNumber(stakingInfoEvent.totalStaked).shiftedBy(-18).toNumber();
      const rewardTotal = new BigNumber(stakingInfoEvent.rewardTotal).shiftedBy(-18).toNumber();

      const priceLP = new BigNumber(reserveUSD).dividedBy(totalSupply).toNumber();
      const a = new BigNumber(rewardTotal).multipliedBy(12).multipliedBy(priceWQT).toNumber();
      const b = new BigNumber(totalStaked).multipliedBy(priceLP).toNumber();

      const APY = new BigNumber(a).dividedBy(b).toNumber();
      return new BigNumber(payload.stakedAmount)
        .multipliedBy(priceLP)
        .multipliedBy(APY)
        .dividedBy(priceWQT)
        .toNumber(); // profit
    } catch (err) {
      return err;
    }
  },
  async initProvider({ commit }, payload) {
    const providerData = await initProvider(payload);
    commit('setMetaMaskStatus', providerData.isMetaMask);
    return providerData;
  },

  /* Pension Program */
  async getPensionDefaultData() {
    return await getPensionDefaultData();
  },
  async getPensionContributed() {
    const _abi = abi.WQPensionFund;
    const _pensionAddress = process.env.PENSION_FUND;
    return await fetchContractData('contributed', _abi, _pensionAddress);
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
  async getPensionWithdrawTxFee({ commit }, _amount) {
    const _abi = abi.WQPensionFund;
    const _pensionAddress = process.env.PENSION_FUND;
    _amount = new BigNumber(_amount).shiftedBy(18).toString();
    return await getTxFee(_abi, _pensionAddress, 'withdraw', [_amount]);
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
  async fetchPensionActions({ commit }, { callback, events, params }) {
    const _abi = abi.WQPensionFund;
    const _pensionAddress = process.env.PENSION_FUND;
    await fetchActions(_abi, _pensionAddress, callback, events, params);
  },
  async pensionExtendLockTime() {
    return await pensionExtendLockTime();
  },

  // добавленно только для страницы demo-blockchain
  async sendTransaction({ commit }, { address, amount, balance }) {
    try {
      const { ethereum } = window;
      const web3 = new Web3(ethereum);
      const accountAddress = await getAccountAddress();

      let _amount = new BigNumber(amount).shiftedBy(18);
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await web3.eth.estimateGas({
        from: accountAddress,
        to: address,
        value: _amount,
      });

      const amountGas = new BigNumber(gasPrice).multipliedBy(gasEstimate).shiftedBy(-18).toNumber();
      const amountGasPlusAmount = new BigNumber(amountGas).plus(amount).toNumber();
      if (new BigNumber(balance).isLessThan(amountGasPlusAmount)) _amount = new BigNumber(amount).minus(amountGas).shiftedBy(18);

      return await web3.eth.sendTransaction({
        from: accountAddress,
        to: address,
        value: _amount,
        gasPrice,
        gas: gasEstimate,
      });
    } catch (err) {
      showToast('Send transaction error', `${err.message}`, 'danger');
      return error(500, 'send transaction error', err);
    }
  },
  async showBalanceOnDemo() {
    let balance = 0;
    try {
      const { ethereum } = window;
      const web3 = new Web3(ethereum);
      const accountAddress = await getAccountAddress();
      await web3.eth.getBalance(accountAddress, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          balance = result;
        }
      });
      return new BigNumber(balance).shiftedBy(-18).toString();
    } catch (err) {
      showToast('Balance error', `${err.message}`, 'danger');
      return error(500, 'balance error', err);
    }
  },

  // mobile browser check
  // false - desktop, true - mobile && !metamask
  checkIsMobileMetamaskNeed() {
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return false;
    }
    if (typeof window.ethereum === 'undefined') {
      return true;
    }
    return false;
  },
};
