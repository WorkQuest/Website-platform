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
    try {
      const response = await this.$axios.$get('https://app.workquest.co/api/v1/pool-liquidity/wqt-wbnb/swaps');
      commit('setWqtWbnbSwaps', response.result);
      return response;
    } catch (e) {
      console.error('error in wqtWbnbSwaps', e);
      return false;
    }
  },
  async wqtWbnbTokenDay({ commit }, query) {
    try {
      const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-wbnb/tokenDay?${query || 'limit=10'}`);
      commit('setWqtWbnbTokenDay', response.result);
      return response;
    } catch (e) {
      console.error('error in wqtWbnbTokenDay', e);
      return false;
    }
  },
  async tableWqtWbnbTokenDay({ commit }, query) {
    try {
      const response = await this.$axios.$get(`https://app.workquest.co/api/v1/pool-liquidity/wqt-wbnb/swaps?${query || 'limit=10'}`);
      commit('setTableWqtWbnbTokenDay', response.result);
      return response;
    } catch (e) {
      console.error('error in tableWqtWbnbTokenDay', e);
      return false;
    }
  },

  async wqtWbnbTokenDayLast({ commit }, query) {
    try {
      const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-wbnb/tokenDay?${query}`);
      commit('setWqtWbnbTokenDayLast', response.result);
      return response;
    } catch (e) {
      console.error('error in wqtWbnbTokenDayLast', e);
      return false;
    }
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
    const response = await this.$axios.$get('https://app.workquest.co/api/v1/pool-liquidity/wqt-weth/swaps');
    commit('setWqtWethSwaps', response.result);
    return response;
  },
  async tableWqtWethTokenDay({ commit }, query) {
    try {
      const response = await this.$axios.$get(`https://app.workquest.co/api/v1/pool-liquidity/wqt-weth/swaps?${query || 'limit=10'}`);
      commit('setTableWqtWethTokenDay', response.result);
      return response;
    } catch (e) {
      console.error('error in tableWqtWbnbTokenDay', e);
      return false;
    }
  },
  async wqtWethTokenDay({ commit }, query) {
    try {
      const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-weth/tokenDay?${query || 'limit=10'}`);
      commit('setWqtWethTokenDay', response.result);
      return response;
    } catch (e) {
      console.error('error in tableWqtWbnbTokenDay', e);
      return false;
    }
  },
  async wqtWethTokenDayLast({ commit }, query) {
    const response = await this.$axios.$get(`/v1/pool-liquidity/wqt-weth/tokenDay?${query}`);
    commit('setWqtWethTokenDayLast', response.result);
    return response;
  },
  async swapsForCrosschain({ commit }, { recipientAddress, query }) {
    const items = [];
    let response = {};
    if (query === false) {
      commit('swapsForCrosschain', items);
      return response;
    }
    response = await this.$axios.$get(`/v1/bridge/recipient/${recipientAddress}/swaps?${query || ''}`);
    response.result.swaps.forEach((data) => {
      let direction = [];
      if (data.chainFrom === 2) {
        direction = [
          require('~/assets/img/ui/ethereum.svg'),
          require('~/assets/img/ui/bnb_yellow.svg'),
        ];
      } else {
        direction = [
          require('~/assets/img/ui/bnb_yellow.svg'),
          require('~/assets/img/ui/ethereum.svg'),
        ];
      }
      const recipient = `${data.recipient.slice(0, 10)}...${data.recipient.slice(-10)}`;
      const tx = `${data.transactionHash.slice(0, 10)}...${data.transactionHash.slice(-10)}`;
      const created = moment(new Date(data.timestamp * 1000)).format('MMMM Do YYYY, h:mm');
      const amount = new BigNumber(data.amount).shiftedBy(-18).toString();
      const status = data.canRedeemed;
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
  async getLPToken() {
    const response = await this.$axios.$get('/v1/pool-liquidity/wqt-wbnb/distribution');
    if (response.ok) {
      return response.result;
    }
    return response;
  },
};
