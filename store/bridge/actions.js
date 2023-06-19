import BigNumber from 'bignumber.js';

import { Chains, Path, TokenSymbols } from '~/utils/enums';
import {
  BlockchainByIndex, BlockchainIndex, BridgeAddresses, BridgeEvents, SwapAddresses,
} from '~/utils/сonstants/bridge';

import {
  error,
  success,
  showToast,
  getEstimateGas,
  getNativeBalance,
  getTransactionFee,
  fetchContractData,
  createInstance,
  getTransactionCount,
} from '~/utils/web3';

import { WQBridge, ERC20 } from '~/abi/index';

/**
 * @property swap.canRedeemed {Boolean}
 * @property swap.chainFrom {Number}
 */
export default {
  async fetchMySwaps({ commit, rootGetters }, { recipientAddress, query }) {
    try {
      const { result } = await this.$axios.$get(`/v1/bridge/recipient/${recipientAddress}/swaps`, {
        params: { ...query },
      });
      const swaps = result.swaps.map((swap) => {
        const tokenData = rootGetters['wallet/getBalanceData'][swap.symbol];

        let { decimals } = tokenData;
        if ([TokenSymbols.USDT, TokenSymbols.USDC].includes(swap.symbol)) {
          const bscChainIdx = BlockchainIndex[Chains.BINANCE];
          if (+swap.chainFrom === bscChainIdx) {
            decimals = 6;
          } else if (+swap.chainTo === bscChainIdx) {
            decimals = 18;
          }
        }

        return {
          ...swap,
          status: swap.canRedeemed,
          chain: BlockchainByIndex[swap.chainTo],
          direction: [
            SwapAddresses.get(BlockchainByIndex[swap.chainFrom])?.icon,
            SwapAddresses.get(BlockchainByIndex[swap.chainTo])?.icon,
          ],
          amount: new BigNumber(swap.amount).shiftedBy(-decimals || -18).toString(),
          created: swap.timestamp,
        };
      });
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

  async redeemSwap({ commit }, {
    signData, chainTo, provider, accountAddress,
  }) {
    console.log(`signData${signData}`);
    console.log(`chainTo${chainTo}`);
    console.log(`provider${provider}`);
    console.log(`accountAddress${accountAddress}`);

    try {
      showToast('Redeeming', 'Redeem...', 'success');

      const bridgeAddress = BridgeAddresses[BlockchainByIndex[chainTo]];
      const inst = new provider.eth.Contract(WQBridge, bridgeAddress);
      const data = inst.methods.redeem.apply(null, signData).encodeABI();
      const [gasPrice, gasEstimate] = await Promise.all([
        provider.eth.getGasPrice(),
        inst.methods.redeem.apply(null, signData).estimateGas({ from: accountAddress }),
      ]);

      const res = await provider.eth.sendTransaction({
        to: bridgeAddress,
        from: accountAddress,
        data,
        gasPrice,
        gas: gasEstimate,
      });

      return success(res);
    } catch (e) {
      console.error('bridge/redeem', e);
      const isAlreadyRedeemed = e.message.includes('Swap is not empty state or duplicate transaction');
      showToast('Redeeming', isAlreadyRedeemed ? $nuxt.$t('toasts.alreadyRedeemed') : `${e.message}`, 'warning');
      return error(500, e.message, e);
    }
  },

  /**
   * For SWAP logic
   * @param commit
   * @param dispatch
   * @param getters
   * @param accountAddress
   * @param symbol
   * @param toChainIndex
   * @param isNative
   * @param tokenAddress
   * @param bridgeAddress
   * @param provider
   * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchBalance({
    commit, dispatch, getters,
  }, {
    accountAddress, symbol, toChainIndex, isNative, tokenAddress, bridgeAddress, provider,
  }) {
    try {
      if (!provider) {
        console.error('web3/fetchBalance provider undefined');
        return error();
      }
      if (isNative) {
        const [balance, nonce] = await Promise.all([
          getNativeBalance(accountAddress, provider),
          getTransactionCount(accountAddress, provider),
        ]);

        if (new BigNumber(balance).isEqualTo(0)) {
          commit('setToken', { amount: 0 });
          return success();
        }

        const txFee = await getTransactionFee(
          accountAddress,
          WQBridge,
          bridgeAddress,
          'swap',
          [nonce, toChainIndex, balance, accountAddress, symbol],
          balance,
          provider,
        );
        const tokenBalance = new BigNumber(balance).shiftedBy(-18).minus(+txFee);
        commit('setToken', { amount: tokenBalance.isLessThan(0) ? 0 : tokenBalance.toNumber() });
      } else {
        const [decimals, amount] = await Promise.all([
          fetchContractData('decimals', ERC20, tokenAddress, [], provider),
          fetchContractData('balanceOf', ERC20, tokenAddress, [accountAddress], provider),
        ]);
        commit('setToken', {
          symbol,
          decimals: Number(decimals),
          decimalsForSubmit: Number(decimals),
          amount: new BigNumber(+amount).shiftedBy(-decimals).toString(),
        });
      }
      return success();
    } catch (e) {
      return error(e.code, 'Error in fetchBalance', e.data);
    }
  },

  async swap({ commit, dispatch }, {
    amount, decimals, tokenAddress, bridgeAddress, isNative, symbol, toChainIndex, provider, accountAddress,
  }) {
    try {
      if (!provider) {
        return error(-1, 'Provider is not connected');
      }

      const nonce = await getTransactionCount(accountAddress, provider);
      const value = new BigNumber(amount).shiftedBy(decimals).toString();
      const data = [nonce, toChainIndex, value, accountAddress, symbol];

      const bridgeInstance = new provider.eth.Contract(WQBridge, bridgeAddress);

      if (!isNative) {
        const allowance = await fetchContractData('allowance', ERC20, tokenAddress, [accountAddress, bridgeAddress], provider);
        if (new BigNumber(value).isGreaterThan(+allowance)) {
          showToast('Swapping', 'In progress…', 'success');
          const tokenInstance = createInstance(ERC20, tokenAddress);
          const { status } = await tokenInstance.methods.approve(bridgeAddress, value).send({ from: accountAddress });
          if (!status) return error(500, 'Approve was failed');
          showToast('Swapping', 'Success!', 'success');
        }
      }

      const [gasPrice, gas] = await Promise.all([
        provider.eth.getGasPrice(),
        getEstimateGas(null, null, bridgeInstance, 'swap', data, isNative ? value : null),
      ]);

      showToast('Swapping', 'Swapping...', 'success');
      const swapRes = await bridgeInstance.methods.swap(...data).send({
        from: accountAddress,
        value: isNative ? value : null,
        gasPrice,
        gas,
      });
      showToast('Swapping', 'Swapping done', 'success');

      return success(swapRes);
    } catch (e) {
      console.error('Error in swap:', e);
      showToast('Swapping error', e.message, 'danger');
      return error(e.code, e.message, e.data);
    }
  },
  async subscribeWS({ commit, getters, rootGetters }, userAddress) {
    try {
      await this.$wsNotifs.subscribe(`${Path.NOTIFICATIONS}${Path.BRIDGE}/${userAddress}`, async (msg) => {
        const swaps = JSON.parse(JSON.stringify(getters.getSwaps));
        let swapsCount = JSON.parse(JSON.stringify(getters.getSwapsCount));
        const {
          event, signData, transactionHash, returnValues: {
            amount, chainFrom, chainTo, sender, timestamp,
          },
        } = msg.data;
        if (event === BridgeEvents.SWAP_INITIALIZED) {
          if (swaps.length === 10) swaps.splice(9, 1);
          const { symbol } = msg.data.returnValues;

          const tokenData = rootGetters['wallet/getBalanceData'][symbol];
          let { decimals } = tokenData;
          if ([TokenSymbols.USDT, TokenSymbols.USDC].includes(symbol)) {
            const ethId = BlockchainIndex[Chains.ETHEREUM];
            if (+chainFrom === BlockchainIndex[Chains.BINANCE] || +chainFrom === ethId) {
              decimals = 6;
            } else if (+chainTo !== ethId) {
              decimals = 18;
            }
          }

          swaps.unshift({
            ...msg.data.returnValues,
            amount: new BigNumber(amount).shiftedBy(-decimals || -18).toString(),
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
          swapsCount += 1;
        } else if (event === BridgeEvents.SWAP_REDEEMED) {
          const { returnValues } = msg.data;
          swaps.some((item) => {
            if (
              +item.nonce === +returnValues.nonce
              && +item.chainFrom === +returnValues.chainFrom
              && +item.chainTo === +returnValues.chainTo
            ) {
              item.status = false;
              item.canRedeemed = false;
              return true;
            }
            return false;
          });
        }
        commit('setSwapsData', { count: swapsCount, swaps });
      });
    } catch (err) {
      console.error('subscribeWS err', err);
    }
  },
  async unsubscribeWS(_, userAddress) {
    try {
      await this.$wsNotifs.unsubscribe(`${Path.NOTIFICATIONS}${Path.BRIDGE}/${userAddress}`);
    } catch (err) {
      console.error('unsubscribeWS err', err);
    }
  },
};
