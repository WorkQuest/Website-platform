import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import {
  connectWallet,
  createQuest,
  depositCostToQuestContract,
  disconnect,
  fetchJobMethod,
  getAccountQuests,
  getBalance,
  getContractFeeData,
  fetchContractData,
  getIsWalletConnected,
  getStyledAmount,
  setWalletAddress,
  getWalletAddress,
  transfer, transferToken, getTransferFeeData, getCreateQuestFeeData,
} from '~/utils/wallet';
import abi from '~/abi/index';
import { TokenSymbols } from '~/utils/enums';

export default {
  async getTransactions({ commit }, params) {
    try {
      const res = await this.$axios({ url: `/account/${getWalletAddress()}/txs`, baseURL: process.env.WQ_EXPLORER, params });
      commit('setTransactions', res.data.result.txs);
      commit('setTransactionsCount', res.data.result.count);
    } catch (e) {
      commit('setTransactions', []);
      commit('setTransactionsCount', 0);
    }
  },
  async checkPassword({ commit }, password) {
    try {
      const res = await this.$axios.$post('/v1/auth/validate-password', { password });
      if (res.ok) {
        return res.result.isValid;
      }
      return false;
    } catch (e) {
      return false;
    }
  },
  /**
   * Check wallet is connected
   * @returns boolean
   */
  checkWalletConnected({ commit, getters }, { nuxt, callbackLayout }) {
    const connected = getIsWalletConnected();
    if (!connected) {
      if (callbackLayout) commit('setCallbackLayout', callbackLayout);
      nuxt.setLayout('confirmPassword');
    } else {
      commit('setIsWalletConnected', true);
    }
  },
  /**
   * Connect wallet with password
   * Use when checkWalletConnected from confirmPassword modal
   * @param commit
   * @param getters
   * @param userAddress
   * @param userPassword
   */
  connectWallet({ commit }, { userAddress, userPassword }) {
    const res = connectWallet(userAddress, userPassword);
    if (res?.ok) commit('setIsWalletConnected', true);
    return res;
  },
  disconnect() {
    disconnect();
  },
  setUserAddress({ commit }, userAddress) {
    commit('setUserAddress', userAddress);
    setWalletAddress(userAddress);
  },
  setSelectedToken({ commit }, token) {
    commit('setSelectedToken', token);
  },
  async getBalance({ commit }) {
    const res = await getBalance();
    commit('setBalance', {
      symbol: TokenSymbols.WUSD,
      balance: res.ok ? res.result.balance : 0,
      fullBalance: res.ok ? res.result.fullBalance : 0,
    });
  },
  async getBalanceWQT({ commit }, userAddress) {
    const res = await fetchContractData('balanceOf', abi.ERC20, process.env.WQT_TOKEN, [userAddress]);
    commit('setBalance', {
      symbol: TokenSymbols.WQT,
      balance: res.ok ? getStyledAmount(res.result) : 0,
      fullBalance: res.ok ? getStyledAmount(res.result, true) : 0,
    });
  },
  /**
   * Send transfer
   * @param recipient
   * @param value
   */
  async transfer({ commit }, { recipient, value }) {
    return await transfer(recipient, value);
  },
  async getTransferFeeData({ commit }, { recipient, value }) {
    return await getTransferFeeData(recipient, value);
  },
  /**
   * Send transfer for WQT token
   * @param commit
   * @param recipient
   * @param value
   */
  async transferWQT({ commit }, { recipient, value }) {
    return await transferToken(recipient, value);
  },

  /**
   * Get Fee Data from contract method
   * @param commit
   * @param method
   * @param _abi
   * @param contractAddress
   * @param recipient
   * @param value
   * @returns {Promise<{result: *, ok: boolean}|{msg: string, code: number, data: null, ok: boolean}|undefined>}
   */
  async getContractFeeData({ commit }, {
    method, _abi, contractAddress, recipient, value,
  }) {
    return await getContractFeeData(method, _abi, contractAddress, value, recipient);
  },

  /* QUESTS */
  /**
   * @param commit
   * @param payload { cost & depositAmount & description }
   */
  async createQuest({ commit }, payload) {
    return await createQuest(payload);
  },
  async getCreateQuestFeeData({ commit }, { cost, depositAmount, description }) {
    return await getCreateQuestFeeData(cost, depositAmount, description);
  },
  async editQuest({ commit }, { contractAddress, cost, description }) {
    const hash = ethers.utils.formatBytes32String(description.slice(0, 31));
    const _cost = new BigNumber(cost).shiftedBy(18).toString();
    return await fetchJobMethod(contractAddress, 'editJob', [_cost, hash]);
  },
  async cancelJob({ commit }, contractAddress) { // employer cancel quest
    return await fetchJobMethod(contractAddress, 'cancelJob');
  },
  async getQuests() {
    return await getAccountQuests();
  },
  async getQuestCost({ commit }, contractAddress) {
    return await fetchContractData('cost', abi.WorkQuest, contractAddress);
  },
  async getQuestInfo({ commit }, contractAddress) {
    return await fetchContractData('getInfo', abi.WorkQuest, contractAddress);
  },
  async depositCostToQuestContract({ commit }, { contractAddress, amount }) {
    return await depositCostToQuestContract(contractAddress, amount);
  },
  async assignJob({ commit }, { contractAddress, workerAddress }) { // employer invites worker to job
    return await fetchJobMethod(contractAddress, 'assignJob', [workerAddress]);
  },
  async declineJob({ commit }, contractAddress) { // worker отклоняет квест
    return await fetchJobMethod(contractAddress, 'declineJob');
  },
  async acceptJob({ commit }, contractAddress) { // worker принимает
    return await fetchJobMethod(contractAddress, 'acceptJob');
  },
  async processJob({ commit }, contractAddress) { // worker начинает (вызывается сразу после acceptJob)
    return await fetchJobMethod(contractAddress, 'processJob');
  },
  async verificationJob({ commit }, contractAddress) { // worker отправляет квест на проверку
    return await fetchJobMethod(contractAddress, 'verificationJob');
  },
  async acceptJobResult({ commit }, contractAddress) {
    return await fetchJobMethod(contractAddress, 'acceptJobResult');
  },
  async arbitration({ commit }, contractAddress) { // employer отменил (reject) результат работы или прошло 3 дня с момента начала verification
    return await fetchJobMethod(contractAddress, 'arbitration');
  },
  async arbitrationRework({ commit }, contractAddress) { // арбитр возвращает квест в статус выполнения
    return await fetchJobMethod(contractAddress, 'arbitrationRework');
  },
  async arbitrationDecreaseCost({ commit }, { contractAddress, _forfeit }) {
    return await fetchJobMethod(contractAddress, 'arbitrationDecreaseCost', [_forfeit]);
  },
  async arbitrationRejectWork({ commit }, contractAddress) {
    return await fetchJobMethod(contractAddress, 'arbitrationRejectWork');
  },
};
