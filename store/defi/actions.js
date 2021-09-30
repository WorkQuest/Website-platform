import moment from 'moment';
import BigNumber from 'bignumber.js';

export default {
  showToast({ dispatch }, { title, text, variant }) {
    dispatch('main/showToast', {
      title,
      text,
      variant,
    }, { root: true });
  },

  async wqtWbnbBurns({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/burns');
    commit('setWqtWbnbBurns', response.result);
    return response;
  },
  async wqtWbnbMints({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/mints');
    commit('setWqtWbnbMints', response.result);
    return response;
  },
  async wqtWbnbSwaps({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/swaps');
    commit('setWqtWbnbSwaps', response.result);
    console.log('wqtWbnbSwaps', response);
    return response;
  },
  async wqtWbnbTokenDay({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-wbnb/tokenDay?${query || 'limit=100'}`);
    commit('setWqtWbnbTokenDay', response.result);
    return response;
  },

  async wqtWbnbTokenDayLast({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-wbnb/tokenDay?${query}`);
    commit('setWqtWbnbTokenDayLast', response.result);
    return response;
  },

  async wqtWethBurns({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/burns');
    commit('setWqtWethBurns', response.result);
    return response;
  },
  async wqtWethMints({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/mints');
    commit('setWqtWethMints', response.result);
    return response;
  },
  async wqtWethSwaps({ commit }) {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-weth/swaps');
    commit('setWqtWethSwaps', response.result);
    return response;
  },
  async wqtWethTokenDay({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-weth/tokenDay?${query || 'limit=100'}`);
    commit('setWqtWethTokenDay', response.result);
    return response;
  },
  async wqtWethTokenDayLast({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-weth/tokenDay?${query}`);
    commit('setWqtWethTokenDayLast', response.result);
    return response;
  },
  async swapsForCrosschain({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/swaps/take?recipient=${payload}`);
    const items = [];
    response.result.swaps.forEach((data) => {
      let direction = [];
      if (data.chainFrom === 2) {
        direction = [
          require('~/assets/img/ui/ethereum.svg'),
          require('~/assets/img/ui/bnb-logo.svg'),
        ];
      } else {
        direction = [
          require('~/assets/img/ui/bnb-logo.svg'),
          require('~/assets/img/ui/ethereum.svg'),
        ];
      }
      const recipient = `${data.recipient.slice(0, 10)}...${data.recipient.slice(-10)}`;
      const tx = `${data.transactionHash.slice(0, 10)}...${data.transactionHash.slice(-10)}`;
      const created = moment(new Date(data.timestamp * 1000)).format('MMMM Do YYYY, h:mm');
      const amount = new BigNumber(data.amount).shiftedBy(-18).toString();
      const status = data.active;
      const clearData = data.signData;
      const chain = data.chainFrom === 3 ? 'ETH' : 'BNB';
      const tableItems = {
        chainId: data.chainFrom,
        chain,
        clearData,
        status,
        amount,
        direction,
        recipient,
        tx,
        txFull: data.transactionHash,
        created,
      };
      items.push(tableItems);
    });
    commit('swapsForCrosschain', items);
    return response;
  },
};
