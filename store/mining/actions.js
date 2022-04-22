import {
  Pair as PairUniswap,
  Token as TokenUniswap,
  TokenAmount as TokenAmountUniswap,
} from '@uniswap/sdk';

import BigNumber from 'bignumber.js';
import { Path, Chains } from '~/utils/enums';
import { Pool } from '~/utils/Constants/mining';

import {
  error,
  success,
  showToast,
  getGasPrice,
  makeApprove,
  getAllowance,
  getEstimateGas,
  fetchContractData,
  getAccountAddress,
  createInstance,
  initStackingContract,
  getPoolTotalSupplyBSC,
  getPoolTokensAmountBSC,
} from '~/utils/web3';

import { ERC20, WQTExchange } from '~/abi';

BigNumber.config({ EXPONENTIAL_AT: 60 });

/**
 * Returns prepared data for swaps table on liquidity mining page.
 * @param {Array} swaps - array of swaps from back
 * @returns {Array.<{
 * isOut: boolean,
 * totalValue: string,
 * amount0: string,
 * amount1: string,
 * account: string,
 * timestamp: string,
 * }>}
 * amount0 - have to WQT!
 * amount1 - pool's token
 * @property swap.amountUSD
 */
function prepareDataForSwapsTable(swaps) {
  return swaps.map((swap) => {
    const isOut = swap.amount0In === '0';
    return {
      isOut,
      totalValue: swap.amountUSD,
      amount0: isOut ? swap.amount0Out : swap.amount0In,
      amount1: isOut ? swap.amount1In : swap.amount1Out,
      account: swap.to,
      timestamp: swap.timestamp || swap.transaction.timestamp,
    };
  });
}

export default {

  async fetchChartData({ dispatch }, pool) {
    switch (pool) {
      case Chains.BINANCE:
        await dispatch('fetchBNBChart');
        break;
      case Chains.ETHEREUM:
        await dispatch('fetchETHChart');
        break;
      default:
        console.error('Unknown pool:', pool);
        break;
    }
  },

  async fetchSwaps({ dispatch }, { pool, params }) {
    switch (pool) {
      case Chains.BINANCE:
        await dispatch('fetchBNBSwaps', params);
        break;
      case Chains.ETHEREUM:
        await dispatch('fetchETHSwaps', params);
        break;
      default:
        console.error('Unknown pool:', pool);
        break;
    }
  },

  async fetchBNBSwaps({ commit }, { limit = 10, offset = 0 }) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/swaps', {
        params: {
          limit,
          offset,
        },
      });
      // amount0 - это WQT
      // amount1 - это WBNB
      const swaps = result.swaps.map((swap) => ({
        ...swap,
        amount0In: new BigNumber(swap.amount0In).shiftedBy(-18).decimalPlaces(3).toString(),
        amount0Out: new BigNumber(swap.amount0Out).shiftedBy(-18).decimalPlaces(3).toString(),
        amount1In: new BigNumber(swap.amount1In).shiftedBy(-18).decimalPlaces(3).toString(),
        amount1Out: new BigNumber(swap.amount1Out).shiftedBy(-18).decimalPlaces(3).toString(),
      }));
      commit('setSwaps', prepareDataForSwapsTable(swaps));
      return ok;
    } catch (e) {
      console.error('error in getTableDataForWqtWbnbPool', e);
      return false;
    }
  },

  async fetchETHSwaps({ commit }, { limit = 10, offset = 0 }) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/swaps', {
        params: {
          limit,
          offset,
        },
      });
      // amount0 - это WETH
      // amount1 - это WQT
      const swaps = result.map((swap) => ({
        ...swap,
        amount1In: swap.amount0In,
        amount1Out: swap.amount0Out,
        amount0In: swap.amount1In,
        amount0Out: swap.amount1Out,
      }));
      commit('setSwaps', prepareDataForSwapsTable(swaps));
      return ok;
    } catch (e) {
      console.error('error in getTableDataForWqtWethPool', e);
      return false;
    }
  },

  /**
   * @property result.reserveUSD
   * @param commit
   * @return {Promise<boolean|*>}
   */
  async fetchBNBChart({ commit }) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/tokenDay?limit=10');
      commit('setTotalLiquidityUSD', result[0].reserveUSD);
      commit('setChartData', result.reverse());
      return ok;
    } catch (e) {
      console.error('getChartDataForWqtWethPool');
      return false;
    }
  },

  /**
   * @property result.infoPer10Days
   * @param commit
   * @return {Promise<boolean|*>}
   */
  async fetchETHChart({ commit }) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/tokenDay?limit=10');
      const totalLiquidity = result.infoPer10Days[0].reserveUSD;
      commit('setTotalLiquidityUSD', totalLiquidity);
      commit('setChartData', result.infoPer10Days.reverse());
      return ok;
    } catch (e) {
      console.error('getChartDataForWqtWbnbPool');
      return false;
    }
  },

  /**
   * @property $wsNotifs
   * @param commit
   * @param getters
   * @param rootGetters
   * @return {Promise<void>}
   */
  async subscribeWS({ commit, getters, rootGetters }) {
    try {
      console.log('subscribeWS', rootGetters['main/notificationsConnectionStatus']);
      await this.$wsNotifs.subscribe(`${Path.NOTIFICATIONS}/daily_liquidity`, async (event) => {
        console.log(event);
      });
    } catch (e) {
      console.error('subscribeWS', e);
    }
  },

  async unsubscribeWS({ _ }) {
    try {
      console.log('unsubscribeWS');
      await this.$wsNotifs.unsubscribe();
    } catch (e) {
      console.error('unsubscribeWS', e);
    }
  },

  async fetchPoolData({ commit }, { chain }) {
    try {
      const { stakingAddress, stakingAbi } = Pool.get(chain);
      const { _balance, staked_, claim_ } = await fetchContractData(
        'getInfoByAddress',
        stakingAbi,
        stakingAddress,
        [getAccountAddress()],
      );

      commit('setPoolData', {
        balance: new BigNumber(_balance).shiftedBy(-18).toString(),
        staked: new BigNumber(staked_).shiftedBy(-18).toString(),
        claim: new BigNumber(claim_).shiftedBy(-18).toString(),
      });
      return success();
    } catch (e) {
      console.error('Error fetchPoolData for pool:', chain, e);
      return error();
    }
  },

  /**
   * @property totalSupply
   * @property pairDayDatas
   * @property stakingInfoEvent.rewardTotal
   * @property stakingInfoEvent.totalStaked
   * @property market_data.current_price
   * @param commit
   * @param payload
   * @return {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchAPY({ commit }, payload) {
    let totalSupply;
    let reserveUSD;
    if (payload.chain === Chains.ETHEREUM) {
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
      const profit = new BigNumber(payload.stakedAmount)
        .multipliedBy(priceLP)
        .multipliedBy(APY)
        .dividedBy(priceWQT)
        .toNumber();
      commit('setAPY', profit);
      return success(profit);
    } catch (err) {
      console.error('Error in fetchAPY:', err);
      return error(err);
    }
  },

  async resetPoolData({ commit }) {
    commit('setPoolData', {
      balance: null,
      staked: null,
      claim: null,
    });
    commit('setAPY', 0);
  },

  async fetchTokenInfo({ dispatch }, tokenAddress) {
    const { ok, result } = await dispatch('web3/fetchTokenInfo', tokenAddress, { root: true });
    return ok ? result : { balance: 0, decimals: 0, symbol: '' };
  },

  async swapOldTokens({ _ }, { amount, decimals }) {
    try {
      const tokenInstance = await createInstance(ERC20, process.env.BSC_OLD_WQT_TOKEN);
      const exchangeInstance = await createInstance(WQTExchange, process.env.BSC_WQT_EXCHANGE);

      const value = new BigNumber(amount).shiftedBy(+decimals).toString();
      const allowance = await getAllowance(getAccountAddress(), process.env.BSC_WQT_EXCHANGE, tokenInstance);
      if (new BigNumber(allowance).isLessThan(value)) {
        showToast('Swapping', 'Approving...', 'success');
        await makeApprove(process.env.BSC_WQT_EXCHANGE, value, tokenInstance);
        showToast('Swapping', 'Approving done', 'success');
      }

      showToast('Swapping', 'Swapping...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, exchangeInstance, 'swap', [value]),
      ]);
      const result = await exchangeInstance.methods.swap(value).send({
        from: getAccountAddress(),
        gasPrice,
        gas,
      });
      showToast('Swapping', 'Swapping done', 'success');

      return success(result);
    } catch (e) {
      console.error('Error in swap old token', e);
      showToast('Swapping error', `${e.message}`, 'danger');
      return error(500, 'Swap error', e);
    }
  },

  async stake({ _ }, { amount, chain }) {
    try {
      const { stakingAbi, stakingAddress, stakingToken } = Pool.get(chain);
      const instanceStake = await createInstance(stakingAbi, stakingAddress);
      const instanceToken = await createInstance(ERC20, stakingToken);

      const value = new BigNumber(amount).shiftedBy(18).toString();
      const allowance = await getAllowance(getAccountAddress(), stakingAddress, instanceToken);
      if (new BigNumber(allowance).isLessThan(value)) {
        showToast('Swapping', 'Approving...', 'success');
        await makeApprove(stakingAddress, value, instanceToken);
        showToast('Swapping', 'Approving done', 'success');
      }

      showToast('Staking', 'Staking...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, instanceStake, 'stake', [value]),
      ]);
      const result = await instanceStake.methods.stake(value).send({
        from: getAccountAddress(),
        gasPrice,
        gas,
      });
      showToast('Staking', 'Staking done', 'success');

      return success(result);
    } catch (e) {
      console.error('Error in mining stake', e);
      showToast('Staking error', `${e.message}`, 'danger');
      return error(e.code, 'Stake error', e);
    }
  },

  /**
   * @property unstake
   * @param _
   * @param amount
   * @param chain
   * @return {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async unStake({ _ }, { amount, chain }) {
    try {
      const { stakingAbi, stakingAddress } = Pool.get(chain);
      const inst = await createInstance(stakingAbi, stakingAddress);

      const value = new BigNumber(amount).shiftedBy(18).toString();
      showToast('Unstaking', 'Unstaking...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, inst, 'unstake', [value]),
      ]);
      const result = await inst.methods.unstake(value).send({
        from: getAccountAddress(),
        gasPrice,
        gas,
      });
      showToast('Unstaking', 'Unstaking done', 'success');

      return success(result);
    } catch (e) {
      console.error('Error in mining unStake', e);
      showToast('Unstaking error', `${e.message}`, 'danger');
      return error(e.code, 'Stake error', e);
    }
  },

  async claim({ _ }, { chain }) {
    try {
      const { stakingAbi, stakingAddress } = Pool.get(chain);
      const inst = await createInstance(stakingAbi, stakingAddress);

      showToast('Claiming', 'Claiming...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, inst, 'claim', []),
      ]);
      const result = await inst.methods.claim().send({
        from: getAccountAddress(),
        gasPrice,
        gas,
      });
      showToast('Claiming', 'Claiming done', 'success');

      return success(result);
    } catch (e) {
      console.error('Error in mining claim', e);
      showToast('Claim error', `${e.message}`, 'danger');
      return error(e.code, 'Error with claim', e);
    }
  },

};
