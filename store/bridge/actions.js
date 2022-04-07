import moment from 'moment';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { BlockchainByIndex, BridgeAddresses, SwapAddresses } from '~/utils/bridge-constants';
import {
  error, fetchContractData, getAccountAddress, getStakingDataByType, sendTransaction, showToast, success,
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

  async fetchBalance({ commit }, { token, chainTo }) {
    let payload = {};
    const isNative = localStorage.getItem('miningPoolId') === token;
    const { tokenAddress, stakingAddress } = await getStakingDataByType(StakingTypes.CROSS_CHAIN, token);
    const accountAddress = await getAccountAddress();
    if (isNative) {
      const { ethereum } = window;
      const web3 = new Web3(ethereum);
      let balance = await web3.eth.getBalance(accountAddress);
      const inst = new web3.eth.Contract(WQBridge, stakingAddress);
      const nonce = await web3.eth.getTransactionCount(accountAddress);
      const swapData = [nonce, chainTo, balance, accountAddress, token];
      const [gasPrice, gasEstimate] = await Promise.all([
        web3.eth.getGasPrice(),
        inst.methods.swap.apply(null, swapData).estimateGas({ from: accountAddress, value: balance }),
      ]);
      balance = new BigNumber(balance).shiftedBy(-18).toString();
      const amountGas = new BigNumber(gasPrice).multipliedBy(gasEstimate).shiftedBy(-18).toString();
      const amountMinusGasAmount = new BigNumber(balance).minus(amountGas).toNumber();
      payload = {
        tokenAmount: amountMinusGasAmount,
        token,
      };
    } else {
      const [tokenDecimal, tokenSymbol, tokenValue] = await Promise.all([
        fetchContractData('decimals', ERC20, tokenAddress),
        fetchContractData('symbol', ERC20, tokenAddress),
        fetchContractData('balanceOf', ERC20, tokenAddress, [accountAddress]),
      ]);
      payload = {
        tokenAmount: new BigNumber(+tokenValue).shiftedBy(-tokenDecimal).toString(),
        tokenSymbol,
      };
    }
    commit('setCrosschainTokensData', payload);
    return payload;
  },
};
