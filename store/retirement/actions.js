import BigNumber from 'bignumber.js';

import moment from 'moment';
import { getWalletAddress, GetWalletProvider } from '~/utils/wallet';
import { PensionHistoryMethods } from '~/utils/enums';
import { WQPensionFund } from '~/abi';
import { error, fetchContractData, success } from '~/utils/web3';

const web3 = GetWalletProvider();

const min = Object.freeze(new BigNumber(0.0001));

export default {
  async getPensionWallet({ _ }) {
    try {
      const myPensionWallet = await fetchContractData('wallets', WQPensionFund, process.env.WORKNET_PENSION_FUND, [getWalletAddress()], web3);
      const {
        unlockDate, fee, amount, createdAt, rewardAllowed, rewardDebt, rewardDistributed,
      } = myPensionWallet;
      const _amount = new BigNumber(amount).shiftedBy(-18);
      let _fee = new BigNumber(fee).shiftedBy(-18);
      if (_fee.isGreaterThan('0') && _fee.isLessThan('0.0000001')) {
        _fee = '>0.0000001';
      } else _fee = _fee.decimalPlaces(8).toString();
      return success({
        rewardAllowed,
        rewardDebt,
        rewardDistributed,
        isCreated: !!createdAt && createdAt !== '0',
        unlockDate: unlockDate ? new Date(unlockDate * 1000) : null,
        fee: _fee,
        amount: _amount.isGreaterThan('0') && _amount.isLessThan(min) ? `>${min.toString()}` : _amount.decimalPlaces(4).toString(),
        fullAmount: _amount.toString(),
      });
    } catch (e) {
      console.error(`PensionWallet: ${e}`);
      return error();
    }
  },
  async getPensionTransactions({ commit, getters }, { method, limit, offset }) {
    try {
      const path = method === PensionHistoryMethods.Update ? 'wallet-update' : method.toLowerCase();
      const res = await this.$axios.get(`/v1/pension-fund/${path}`, {
        params: {
          userAddress: getWalletAddress(),
          limit,
          offset,
        },
      });
      commit('setPensionHistoryData', { method, txs: res.data.result.events, count: res.data.result.count });
    } catch (e) {
      console.error('retirement/getPensionTransactions');
    }
  },
  async pensionGetDefaultData() {
    try {
      const [lockTime, defaultFee] = await Promise.all([
        fetchContractData('lockTime', WQPensionFund, process.env.WORKNET_PENSION_FUND, null, web3),
        fetchContractData('defaultFee', WQPensionFund, process.env.WORKNET_PENSION_FUND, null, web3),
      ]);
      return success({
        defaultFee: new BigNumber(defaultFee.toString()).shiftedBy(-18).toString(),
        lockTime,
      });
    } catch (e) {
      console.error(`PensionDefault: ${e}`);
      return error();
    }
  },
  async pensionGetWalletInfo({ commit, dispatch }) {
    const res = await dispatch('getPensionWallet');
    if (res.ok === false) {
      commit('setPensionWallet', null);
      return;
    }
    commit('setPensionWallet', res.result);
  },
  async pensionUpdateFee({ commit }, fee) {
    try {
      const inst = new web3.eth.Contract(WQPensionFund, process.env.WORKNET_PENSION_FUND);
      fee = new BigNumber(fee).shiftedBy(18).toString();
      const [gasPrice, gasEstimate] = await Promise.all([
        web3.eth.getGasPrice(),
        inst.methods.updateFee.apply(null, [fee]).estimateGas({ from: getWalletAddress() }),
      ]);
      const res = await inst.methods.updateFee(fee).send({
        from: getWalletAddress(),
        gas: gasEstimate,
        gasPrice,
      });
      return success(res);
    } catch (e) {
      console.error(`UpdateFee: ${e}`);
      return error();
    }
  },
  async pensionContribute({ commit }, amount) {
    try {
      const inst = new web3.eth.Contract(WQPensionFund, process.env.WORKNET_PENSION_FUND);
      amount = new BigNumber(amount).shiftedBy(18).toString();
      const data = [getWalletAddress(), amount];
      const [gasPrice, gasEstimate] = await Promise.all([
        web3.eth.getGasPrice(),
        inst.methods.contribute.apply(null, data).estimateGas({ from: getWalletAddress(), to: process.env.WORKNET_PENSION_FUND }),
      ]);
      const res = await inst.methods.contribute(...data).send({
        from: getWalletAddress(),
        gas: gasEstimate,
        gasPrice,
        data,
      });
      return success(res);
    } catch (e) {
      console.error(`Contribute: ${e}`);
      return error();
    }
  },
  async feeContributeWUSD() {
    try {
      const res = await fetchContractData('feePerMonth', WQPensionFund, process.env.WORKNET_PENSION_FUND, null, web3);
      return success(res);
    } catch (e) {
      console.error(`Contribute: ${e}`);
      return error();
    }
  },
  async pensionWithdraw({ commit }, amount) {
    try {
      amount = new BigNumber(amount).shiftedBy(18).toString();
      const inst = new web3.eth.Contract(WQPensionFund, process.env.WORKNET_PENSION_FUND);
      const [gasPrice, gasEstimate] = await Promise.all([
        web3.eth.getGasPrice(),
        inst.methods.withdraw.apply(null, [amount]).estimateGas({ from: getWalletAddress() }),
      ]);
      const res = await inst.methods.withdraw(amount).send({
        from: getWalletAddress(),
        gas: gasEstimate,
        gasPrice,
      });
      return success(res);
    } catch (e) {
      console.error(`Withdraw: ${e}`);
      return error();
    }
  },
  async feeWithdrawWUSD() {
    try {
      const res = await fetchContractData('feeWithdraw', WQPensionFund, process.env.WORKNET_PENSION_FUND, null, web3);
      return success(res);
    } catch (e) {
      console.error(`Contribute: ${e}`);
      return error();
    }
  },
  async pensionStartProgram({ commit, dispatch }, payload) {
    const { firstDeposit, fee, defaultFee } = payload;
    let feeOk = true;
    let depositOk = false;
    const equalsFee = new BigNumber(defaultFee).shiftedBy(-18).isEqualTo(new BigNumber(fee).shiftedBy(-18));
    if (!firstDeposit || !equalsFee) {
      feeOk = await dispatch('pensionUpdateFee', fee);
    }
    if (firstDeposit) depositOk = await dispatch('pensionContribute', firstDeposit);
    else return feeOk;
    return depositOk && feeOk;
  },
  async pensionExtendLockTime() {
    try {
      const inst = new web3.eth.Contract(WQPensionFund, process.env.WORKNET_PENSION_FUND);
      const [gasPrice, gasEstimate] = await Promise.all([
        web3.eth.getGasPrice(),
        inst.methods.extendLockTime.apply(null, []).estimateGas({ from: getWalletAddress() }),
      ]);
      const res = await inst.methods.extendLockTime().send({
        from: getWalletAddress(),
        gas: gasEstimate,
        gasPrice,
      });
      return success(res);
    } catch (e) {
      console.error(`ExtendLockTime: ${e}`);
      return error();
    }
  },
  async subscribeWS({ commit, getters, dispatch }, userAddress) {
    try {
      await this.$wsNotifs.subscribe(`/notifications/pensionFund/${userAddress}`, async (msg) => {
        const pensionHistory = JSON.parse(JSON.stringify(getters.getPensionHistory));
        const {
          data: {
            event, transactionHash, returnValues: {
              amount, timestamp, unlockDate, newFee,
            },
          },
        } = msg;
        let payload = {
          tx: {
            event,
            transactionHash,
            createdAt: moment.unix(timestamp).utc().format(),
            amount,
          },
        };
        let count;
        switch (event) {
          case 'Received':
            payload.method = PensionHistoryMethods.Receive;
            count = pensionHistory[PensionHistoryMethods.Receive].count + 1;
            break;
          case 'Withdraw':
            payload.method = PensionHistoryMethods.Withdraw;
            count = pensionHistory[PensionHistoryMethods.Withdraw].count + 1;
            break;
          case 'WalletUpdated':
            payload.method = PensionHistoryMethods.Update;
            payload.tx = {
              event,
              transactionHash,
              createdAt: moment.utc().format(),
              newFee,
            };
            count = pensionHistory[PensionHistoryMethods.Update].count + 1;
            break;
          default:
            payload = {};
            count = 0;
            break;
        }
        console.log('subscribeWS:', pensionHistory);
        if (pensionHistory[payload.method].txs && pensionHistory[payload.method].txs.length === 10) pensionHistory[payload.method].txs.splice(9, 1);
        pensionHistory[payload.method].txs.unshift(payload.tx);
        await dispatch('pensionGetWalletInfo');
        commit('setPensionHistoryData', { method: payload.method, txs: pensionHistory[payload.method].txs, count });
        await dispatch('main/setLoading', false, { root: true });
      });
    } catch (err) {
      console.error('subscribeWS err', err);
    }
  },
  async unsubscribeWS(_, userAddress) {
    try {
      await this.$wsNotifs.unsubscribe(`/notifications/pensionFund/${userAddress}`);
    } catch (err) {
      console.error('unsubscribeWS err', err);
    }
  },
};
