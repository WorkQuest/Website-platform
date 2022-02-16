import moment from 'moment';
import BigNumber from 'bignumber.js';

export default {

  async swapsForCrosschain({ commit }, { recipientAddress, query }) {
    const items = [];
    let response = {};
    if (query === false) {
      commit('swapsForCrosschain', items);
      return response;
    }
    // TODO delete https://app-ver1.workquest.co/api,
    // response = await this.$axios.$get(`/v1/bridge/recipient/${recipientAddress}/swaps?${query || ''}`);
    response = await this.$axios.$get(`https://app-ver1.workquest.co/api/v1/bridge/recipient/${recipientAddress}/swaps?${query || ''}`);
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
};
