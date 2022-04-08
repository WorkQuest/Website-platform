import moment from 'moment';
import BigNumber from 'bignumber.js';
import { Chains } from '~/utils/enums';

export default {

  async swapsForCrosschain({ commit }, { recipientAddress, query }) {
    const items = [];
    let response = {};
    if (query === false) {
      commit('swapsForCrosschain', items);
      return response;
    }
    response = await this.$axios.$get(`/v1/bridge/recipient/${recipientAddress}/swaps?${query || ''}`);
    response.result.swaps.forEach((data) => {
      const chainsImg = [
        require('~/assets/img/ui/WQT.png'),
        require('~/assets/img/ui/ethereum.svg'),
        require('~/assets/img/ui/bnb_yellow.svg'),
      ];
      const chainsName = [
        Chains.WORKNET,
        Chains.ETHEREUM,
        Chains.BINANCE,
      ];
      const direction = [
        chainsImg[data.chainFrom - 1],
        chainsImg[data.chainTo - 1],
      ];
      const recipient = `${data.recipient.slice(0, 10)}...${data.recipient.slice(-10)}`;
      const tx = `${data.transactionHash.slice(0, 10)}...${data.transactionHash.slice(-10)}`;
      const created = data.timestamp;
      const amount = new BigNumber(data.amount).shiftedBy(-18).toString();
      const status = data.canRedeemed;
      const clearData = data.signData;
      const chain = chainsName[data.chainTo - 1];
      const tableItems = {
        chainFrom: data.chainFrom,
        chainTo: data.chainTo,
        chain,
        clearData,
        status,
        amount,
        symbol: data.symbol,
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
