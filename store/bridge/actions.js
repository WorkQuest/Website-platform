import moment from 'moment';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { BlockchainByIndex, BridgeAddresses, SwapAddresses } from '~/utils/bridge-constants';
import {
  createInstanceWeb3,
  error,
  fetchContractData,
  fetchNativeBalance,
  getAccountAddress, getGasPrice, getNativeBalance,
  getStakingDataByType, getTransactionCount, getTransactionFee,
  sendTransaction,
  showToast,
  success,
} from '~/utils/web3';
import { WQBridge, ERC20 } from '~/abi/abi';
import { StakingTypes } from '~/utils/enums';

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
      const response = await sendTransaction('redeem', {
        abi: WQBridge,
        address: bridgeAddress,
        data: signData,
        userAddress: signData[3],
      });
      return success(response);
    } catch (e) {
      console.log(e);
      showToast('Redeeming', `${e.message}`, 'warning');
      return error(500, 'redeem error', e);
    }
  },

  async fetchBalance({ commit }, {
    token, toChainIndex, isNative, tokenAddress, bridgeAddress,
  }) {
    try {
      const accountAddress = await getAccountAddress();
      if (isNative) {
        const balance = await getNativeBalance();
        const nonce = await getTransactionCount();
        const txFee = await getTransactionFee(
          WQBridge,
          bridgeAddress,
          'swap',
          [nonce, toChainIndex, balance, accountAddress, token],
          balance,
        );
        commit('setToken', { amount: new BigNumber(balance).shiftedBy(-18).minus(txFee.result).toNumber() });
      } else {
        const [decimal, amount] = await Promise.all([
          fetchContractData('decimals', ERC20, tokenAddress),
          fetchContractData('balanceOf', ERC20, tokenAddress, [accountAddress]),
        ]);
        commit('setToken', {
          decimal,
          amount: new BigNumber(+amount).shiftedBy(-decimal).toString(),
        });
      }
      return success();
    } catch (e) {
      console.error(e);
      return error(e.code, 'Error in fetchBalance', e.data);
    }
  },
};
