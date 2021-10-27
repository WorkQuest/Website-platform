import BigNumber from 'bignumber.js';
import { Pair as PairUniswap, Token as TokenUniswap, TokenAmount as TokenAmountUniswap } from '@uniswap/sdk';
import {
  ChainId, Token as TokenPancake, TokenAmount as TokenAmountPancake, Pair as PairPancake,
} from '@pancakeswap/sdk';
import {
  claimRewards,
  disconnectWeb3,
  fetchContractData,
  getAccountAddress,
  goToChain,
  initStackingContract,
  initWeb3,
  redeemSwap,
  showToast,
  staking,
  startPingingMetamask,
  swap,
  swapWithBridge,
  unStaking,
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
      await dispatch('startPingingMetamask');
      await commit('setAccount', response.result);
      await commit('setIsConnected', true);
      await commit('setPurseData', getAccountAddress());
      showToast('Connect to Metamask', 'Connected', 'success');
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
      amountMax0 = process.env.TOKEN_WQT_ETHEREUM_NETWORK_AMOUNT_MAX;
      amountMax1 = process.env.TOKEN_WETH_AMOUNT_MAX;
      token0 = new TokenUniswap(
        chainId,
        process.env.MAINNET_ETH_WQT_TOKEN,
        18,
        'WQT',
        'Work Quest Token',
      );
      token1 = new TokenUniswap(
        chainId,
        process.env.TOKEN_WETH_ADDRESS,
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
      amountMax0 = process.env.TOKEN_WQT_BSC_NETWORK_AMOUNT_MAX;
      amountMax1 = process.env.TOKEN_WBNB_AMOUNT_MAX;
      token0 = new TokenPancake(
        chainId,
        process.env.MAINNET_BSC_WQT_TOKEN,
        18,
        'WQT',
        'Work Quest Token',
      );
      token1 = new TokenPancake(
        chainId,
        process.env.TOKEN_WBNB_ADDRESS,
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
      const profit = ((payload.stakedAmount * priceLP) * APY) / priceWQT;
      return profit;
    } catch (err) {
      return err;
    }
  },
};
