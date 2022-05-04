import Web3 from 'web3';

import BigNumber from 'bignumber.js';
import { Path, Chains } from '~/utils/enums';
import { Pool } from '~/utils/сonstants/mining';

import {
  error,
  success,
  showToast,
  getGasPrice,
  makeApprove,
  getAllowance,
  createInstance,
  getEstimateGas,
  fetchContractData,
  getAccountAddress,
} from '~/utils/web3';

import {
  ERC20,
  WQTExchange,
  WQLiquidityMining,
} from '~/abi';

BigNumber.config({ EXPONENTIAL_AT: 60 });

const pools = {
  [Chains.BINANCE]: 'wqt-wbnb',
  [Chains.ETHEREUM]: 'wqt-weth',
};

let LP_INSTANCE = null;
let MINING_INSTANCE = null;

export default {

  async fetchChartData({ commit }, pool) {
    try {
      const { ok, result: { data } } = await this.$axios.$get(`/v1/pool-liquidity/${pools[pool]}/token-day?limit=10`);
      commit('setWQTPrice', new BigNumber(data[0].usdPriceWQT).shiftedBy(-18).toNumber());
      commit('setTotalLiquidityUSD', data[0].reserveUSD);
      commit('setChartData', data.reverse().map((item) => ({
        ...item,
        date: this.$moment(item.date * 1000).utc(false),
      })));
      return ok;
    } catch (e) {
      console.error('mining/fetchETHChart');
      return false;
    }
  },

  async fetchSwaps({ commit }, { pool, params }) {
    try {
      const { ok, result: { data } } = await this.$axios.$get(`/v1/pool-liquidity/${pools[pool]}/swaps`, {
        params,
      });

      /**
       * @property swap.amount0In - token came to pool
       * @property swap.amount0Out - token go out from pool
       * @property swap.amount1In - wqt came to pool
       * @property swap.amount1Out - wqt go out from pool
       * @property swap.amountUSD
       */
      commit('setSwaps', data.map((swap) => {
        const isOut = swap.amount0In === '0';
        return {
          isOut,
          ...swap,
          account: swap.to,
          timestamp: swap.timestamp,
          totalValue: swap.amountUSD,
          amount0: new BigNumber(isOut ? swap.amount0Out : swap.amount0In).shiftedBy(-18).decimalPlaces(3).toString(),
          amount1: new BigNumber(isOut ? swap.amount1In : swap.amount1Out).shiftedBy(-18).decimalPlaces(3).toString(),
        };
      }));
      return ok;
    } catch (e) {
      console.error('mining/fetchSwaps');
      return false;
    }
  },

  async subscribeWS({ commit, getters }) {
    try {
      await this.$wsNotifs.subscribe(`${Path.NOTIFICATIONS}/dailyLiquidity`, async (event) => {
        const { reserveUSD } = event.data;
        commit('setTotalLiquidityUSD', reserveUSD);

        const chartData = JSON.parse(JSON.stringify(getters.getChartData));
        chartData[chartData.length - 1].reserveUSD = reserveUSD;
        commit('setChartData', chartData);
      });
    } catch (e) {
      console.error('mining/subscribeWS', e);
    }
  },

  async unsubscribeWS({ _ }) {
    try {
      await this.$wsNotifs.unsubscribe(`${Path.NOTIFICATIONS}/dailyLiquidity`);
    } catch (e) {
      console.error('mining/unsubscribeWS', e);
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
      console.error('Error mining/fetchPoolData for pool:', chain, e);
      return error();
    }
  },

  async fetchTotalSupply({ commit }, pool) {
    try {
      if (!LP_INSTANCE) {
        const provider = new Web3.providers.HttpProvider(Pool.get(pool).provider);
        const web3 = new Web3(provider);
        LP_INSTANCE = await new web3.eth.Contract(ERC20, Pool.get(pool).lpToken);
      }

      const totalSupply = await LP_INSTANCE.methods.totalSupply().call();
      commit('setTotalSupply', new BigNumber(totalSupply).shiftedBy(-18).toString());
    } catch (e) {
      console.error('Error in mining/fetchTotalSupply:', e);
    }
  },

  async fetchStakingInfo({ commit }, pool) {
    try {
      if (!MINING_INSTANCE) {
        const provider = new Web3.providers.HttpProvider(Pool.get(pool).provider);
        const web3 = new Web3(provider);
        MINING_INSTANCE = await new web3.eth.Contract(WQLiquidityMining, Pool.get(pool).miningAddress);
      }

      const { totalStaked, rewardTotal } = await MINING_INSTANCE.methods.getStakingInfo().call();
      commit('setStakingInfo', {
        totalStaked: new BigNumber(totalStaked).shiftedBy(-18).toString(),
        totalReward: new BigNumber(rewardTotal).shiftedBy(-18).toString(),
      });
    } catch (e) {
      console.error('Error in mining/fetchStakingInfo:', e);
    }
  },

  async calcProfit({ getters, commit }) {
    try {
      const {
        getStaked: staked,
        getWQTPrice: priceWQT,
        getTotalStaked: totalStaked,
        getTotalReward: totalReward,
        getTotalSupply: totalSupply,
        getTotalLiquidityUSD: reserveUSD,
      } = getters;

      const priceLP = new BigNumber(reserveUSD).dividedBy(totalSupply).toNumber();

      //                            APY formula calculation
      //                   a                                     b
      //    ______________/\________________   __________________/\____________________
      //   /                                \ /                                        \
      //                                                              priceLP
      //    (((totalReward * priceWQT) * 12) / (totalStaked * (reserveUSD / totalSupply)))

      const a = new BigNumber(totalReward).multipliedBy(priceWQT).multipliedBy(12).toNumber();
      const b = new BigNumber(totalStaked).multipliedBy(priceLP).toNumber();

      const APY = new BigNumber(a).dividedBy(b).toNumber();

      // profit is
      // ([your_staked_value] * priceLP * APY) / wqtPrice

      const yourReserveUSD = new BigNumber(staked).multipliedBy(priceLP).toNumber();
      const profit = new BigNumber(yourReserveUSD).multipliedBy(APY).dividedBy(priceWQT).toNumber();

      commit('setProfit', profit);
    } catch (e) {
      console.error('Error in mining/calcProfit:', e);
    }
  },

  async resetPoolData({ commit }) {
    commit('setPoolData', {
      balance: null,
      staked: null,
      claim: null,
    });

    commit('setStakingInfo', {
      totalStaked: null,
      totalReward: null,
    });

    commit('setProfit', null);
    commit('setTotalSupply', null);
    commit('setTotalLiquidityUSD', null);

    LP_INSTANCE = null;
    MINING_INSTANCE = null;
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
      console.error('Error in mining/swapOldTokens:', e);
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
      console.error('Error in mining/stake:', e);
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
      console.error('Error in mining/unStake:', e);
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
      console.error('Error in mining/claim:', e);
      showToast('Claim error', `${e.message}`, 'danger');
      return error(e.code, 'Error with claim', e);
    }
  },

};
