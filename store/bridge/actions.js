import BigNumber from 'bignumber.js';

import {
  BlockchainByIndex, BridgeAddresses, BridgeEvents, SwapAddresses,
} from '~/utils/bridge-constants';

import {
  error,
  success,
  showToast,
  getGasPrice,
  getEstimateGas,
  sendTransaction,
  getNativeBalance,
  getTransactionFee,
  fetchContractData,
  getAccountAddress,
  createInstanceWeb3,
  getTransactionCount,
} from '~/utils/web3';

import { WQBridge, ERC20 } from '~/abi/index';
import { Chains } from '~/utils/enums';

/**
 * @property swap.canRedeemed {Boolean}
 * @property swap.chainFrom {Number}
 */
export default {
  async fetchMySwaps({ commit }, { recipientAddress, query }) {
    try {
      const { result } = await this.$axios.$get(`/v1/bridge/recipient/${recipientAddress}/swaps`, {
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
        created: swap.timestamp,
      }));
      commit('setSwapsData', { count: result.count, swaps });
      return success();
    } catch (e) {
      console.error('bridge/fetchMySwaps', e);
      return error();
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
    symbol, toChainIndex, isNative, tokenAddress, bridgeAddress,
  }) {
    try {
      const accountAddress = await getAccountAddress();
      if (isNative) {
        const balance = await getNativeBalance();
        const nonce = await getTransactionCount();
        if (!balance) {
          commit('setToken', { amount: 0 });
          return success();
        }

        const txFee = await getTransactionFee(
          WQBridge,
          bridgeAddress,
          'swap',
          [nonce, toChainIndex, balance, accountAddress, symbol],
          balance,
        );
        commit('setToken', { amount: new BigNumber(balance).shiftedBy(-18).minus(+txFee).toNumber() || 0 });
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
      return error(e.code, 'Error in fetchBalance', e.data);
    }
  },

  async swap({ commit, dispatch }, {
    amount, tokenAddress, bridgeAddress, isNative, symbol, toChainIndex,
  }) {
    try {
      const nonce = await getTransactionCount();
      const accountAddress = await getAccountAddress();
      const value = new BigNumber(amount).shiftedBy(18).toString();
      const data = [nonce, toChainIndex, value, accountAddress, symbol];
      const bridgeInstance = await createInstanceWeb3(WQBridge, bridgeAddress);

      if (isNative) {
        showToast('Swapping', 'Swapping...', 'success');
        const [gasPrice, gas] = await Promise.all([
          getGasPrice(),
          getEstimateGas(null, null, bridgeInstance, 'swap', data, value),
        ]);
        const swapRes = await bridgeInstance.methods.swap(...data).send({
          from: accountAddress,
          value,
          gasPrice,
          gas,
        });
        showToast('Swapping', 'Swapping done', 'success');
        return success(swapRes);
      }

      const allowance = await fetchContractData('allowance', ERC20, tokenAddress, [accountAddress, bridgeAddress]);
      if (new BigNumber(value).isGreaterThan(+allowance)) {
        showToast('Swapping', 'Approving...', 'success');
        const tokenInstance = await createInstanceWeb3(ERC20, tokenAddress);
        const { status } = await tokenInstance.methods.approve(bridgeAddress, value).send({ from: accountAddress });
        if (!status) return error(500, 'Approve was failed');
        showToast('Swapping', 'Approving done', 'success');
      }

      showToast('Swapping', 'Swapping...', 'success');
      const [gasPrice, gas] = await Promise.all([
        getGasPrice(),
        getEstimateGas(null, null, bridgeInstance, 'swap', data),
      ]);
      const swapRes = await bridgeInstance.methods.swap(...data).send({
        from: accountAddress,
        gasPrice,
        gas,
      });
      showToast('Swapping', 'Swapping done', 'success');

      return success(swapRes);
    } catch (e) {
      console.error('Error in swap:', e);
      showToast('Swapping error', e.message, 'danger');
      return error(e.code, 'Error in swap action', e.data);
    }
  },
  async subscribeToBridgeEvents({ commit, getters }, userAddress) {
    try {
      await this.$wsNotifs.subscribe(`/notifications/bridge/${userAddress}`, async (msg) => {
        const {
          event, signData, transactionHash, returnValues: {
            amount, chainFrom, chainTo, sender, timestamp,
          },
        } = msg.data;
        if (event === BridgeEvents.SWAP_INITIALIZED) {
          const swaps = JSON.parse(JSON.stringify(getters.getSwaps));
          if (swaps.length === 10) swaps.splice(9, 1);
          swaps.unshift({
            ...msg.data.returnValues,
            amount: new BigNumber(amount).shiftedBy(-18).toString(),
            chain: BlockchainByIndex[chainTo],
            created: timestamp,
            direction: [
              SwapAddresses.get(BlockchainByIndex[chainFrom]).icon,
              SwapAddresses.get(BlockchainByIndex[chainTo]).icon,
            ],
            signData,
            transactionHash,
            initiator: sender,
            recipient: sender,
            status: true,
          });
          commit('setSwapsData', { count: 10, swaps });
        }
      });
    } catch (err) {
      console.log('subscribeToBridgeEvents err', err);
    }
  },
  async unsubscribeToBridgeEvents(_, userAddress) {
    try {
      await this.$wsNotifs.unsubscribe(`/notifications/bridge/${userAddress}`);
      console.log('unsubscribeToBridgeEvents:', this.$wsNotifs);
    } catch (err) {
      console.log('unsubscribeToBridgeEvents err', err);
    }
  },
};
