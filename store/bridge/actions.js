import moment from 'moment';
import BigNumber from 'bignumber.js';
import { BlockchainByIndex, BridgeAddresses, SwapAddresses } from '~/utils/bridge-constants';
import { error, sendTransaction, showToast } from '~/utils/web3';
import * as abi from '~/abi/abi';

export default {
  async fetchMySwaps({ commit }, { recipientAddress, query }) {
    try {
      const { ok, result } = await this.$axios.$get(`/v1/bridge/recipient/${recipientAddress}/swaps`, {
        params: { ...query },
      });
      const swaps = result.swaps.map((swap) => ({
        ...swap,
        status: swap.canRedeemed,
        chain: BlockchainByIndex[swap.chainTo],
        direction: [
          SwapAddresses.get(BlockchainByIndex[swap.chainFrom]).icon,
          SwapAddresses.get(BlockchainByIndex[swap.chainTo]).icon,
        ],
        amount: new BigNumber(swap.amount).shiftedBy(-18).toString(),
        created: moment(new Date(swap.timestamp * 1000)).format('MMMM Do YYYY, HH:mm'),
      }));
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

  async redeemSwap({ commit }, { signData, chainTo }) {
    const bridgeAddress = BridgeAddresses[BlockchainByIndex[chainTo]];
    try {
      showToast('Redeeming', 'Redeem...', 'success');
      return await sendTransaction('redeem', {
        abi: abi.WQBridge,
        address: bridgeAddress,
        data: signData,
        userAddress: signData[3],
      });
    } catch (e) {
      console.log(e);
      showToast('Redeeming', `${e.message}`, 'warning');
      return error(500, 'redeem error', e);
    }
  },
};
