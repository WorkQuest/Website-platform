import moment from 'moment';
import BigNumber from 'bignumber.js';
import { Chains } from '~/utils/enums';

export default {
  async fetchMySwaps({ commit }, { recipientAddress, query }) {
    try {
      const { ok, result } = await this.$axios.$get(`/v1/bridge/recipient/${recipientAddress}/swaps`, {
        params: { ...query },
      });
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
      const swaps = result.swaps.map((swap) => {
        const direction = [
          chainsImg[swap.chainFrom - 1],
          chainsImg[swap.chainTo - 1],
        ];
        return {
          ...swap,
          chain: chainsName[swap.chainTo - 1],
          status: swap.canRedeemed,
          amount: new BigNumber(swap.amount).shiftedBy(-18).toString(),
          direction,
          created: moment(new Date(swap.timestamp * 1000)).format('MMMM Do YYYY, HH:mm'),
        };
      });
      commit('setSwapsData', { count: result.count, swaps });
      return { ok };
    } catch (e) {
      console.error('crosschain/fetchMySwaps', e);
      return { ok: false };
    }
  },

  async resetMySwaps({ commit }) {
    commit('resetSwapsData');
  },

  // async swapsForCrosschain({ commit }, { recipientAddress, query }) {
  //   const items = [];
  //   let response = {};
  //   if (query === false) {
  //     commit('resetSwapsData');
  //     return response;
  //   }
  //   response = await this.$axios.$get(`/v1/crosschain/recipient/${recipientAddress}/swaps?${query || ''}`);
  //   response.result.swaps.forEach((data) => {
  //     const chainsImg = [
  //       require('~/assets/img/ui/WQT.png'),
  //       require('~/assets/img/ui/ethereum.svg'),
  //       require('~/assets/img/ui/bnb_yellow.svg'),
  //     ];
  //     const chainsName = [
  //       Chains.WORKNET,
  //       Chains.ETHEREUM,
  //       Chains.BINANCE,
  //     ];
  //     const direction = [
  //       chainsImg[data.chainFrom - 1],
  //       chainsImg[data.chainTo - 1],
  //     ];
  //     const recipient = `${data.recipient.slice(0, 10)}...${data.recipient.slice(-10)}`;
  //     const tx = `${data.transactionHash.slice(0, 10)}...${data.transactionHash.slice(-10)}`;
  //     const created = moment(new Date(data.timestamp * 1000)).format('MMMM Do YYYY, h:mm');
  //     const amount = new BigNumber(data.amount).shiftedBy(-18).toString();
  //     const status = data.canRedeemed;
  //     const clearData = data.signData;
  //     const chain = chainsName[data.chainTo - 1];
  //     const tableItems = {
  //       chainFrom: data.chainFrom,
  //       chainTo: data.chainTo,
  //       chain,
  //       clearData,
  //       status,
  //       amount,
  //       symbol: data.symbol,
  //       direction,
  //       recipient,
  //       tx,
  //       txFull: data.transactionHash,
  //       created,
  //     };
  //     items.push(tableItems);
  //   });
  //   commit('swapsForCrosschain', items);
  //   return response;
  // },
};
