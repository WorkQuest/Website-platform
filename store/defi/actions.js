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
  async getTokensDayData({ commit }, query) {
    const response = await this.$axios.$get(`/v1/liquidity/tokenDay?${query || ''}`);
    commit('setTokensDayData', response.result);
    return response;
  },
  async getTokensData({ commit }, query) {
    const response = await this.$axios.$get(`/v1/liquidity/tokenDay?${query || ''}`);
    commit('setTokensData', response.result);
    return response;
  },
  async getSwapsData({ commit }, query) {
    const response = await this.$axios.$get(`/v1/liquidity/swaps?${query || ''}`);
    commit('setSwapsData', response.result);
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
        created,
      };
      items.push(tableItems);
    });
    commit('swapsForCrosschain', items);
    return response;
  },
};
