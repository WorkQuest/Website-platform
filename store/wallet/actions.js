import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import {
  connectWallet,
  createQuest,
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
  transfer, transferToken, getTransferFeeData, getCreateQuestFeeData, hashText, getEditQuestFeeData,
} from '~/utils/wallet';
import abi from '~/abi/index';
import { QuestMethods, TokenSymbols } from '~/utils/enums';

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
    if (!nuxt) console.error('Need to set nuxt ref');
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

  /** QUESTS */
  /** EMPLOYER */
  async createQuest({ commit }, {
    cost, depositAmount, description, nonce,
  }) {
    return await createQuest(cost, depositAmount, description, nonce);
  },
  async getCreateQuestFeeData({ commit }, {
    cost, depositAmount, description, nonce,
  }) {
    return await getCreateQuestFeeData(cost, depositAmount, description, nonce);
  },
  async getEditQuestFeeData({ commit }, {
    contractAddress, description, cost, depositAmount,
  }) {
    return await getEditQuestFeeData(contractAddress, description, cost, depositAmount || null);
  },

  async getFeeDataJobMethod({ commit }, {
    method, contractAddress, data,
  }) {
    return await getContractFeeData(method, abi.WorkQuest, contractAddress, data);
  },
  async editQuest({ commit }, {
    contractAddress, cost, description, depositAmount = 0,
  }) {
    const hash = hashText(description);
    const _cost = new BigNumber(cost).shiftedBy(18).toString();
    if (depositAmount) { // Пополнение
      const _depositAmount = new BigNumber(depositAmount).shiftedBy(18).toString();
      return await editQuest(contractAddress, _cost, _depositAmount, description);
    }
    return await fetchJobMethod(contractAddress, QuestMethods.EditJob, [hash, _cost]);
  },
  // Отмена/Удаление квеста
  async cancelJob({ commit }, contractAddress) {
    return await fetchJobMethod(contractAddress, QuestMethods.CancelJob);
  },
  // Пригласить воркера на квест
  async assignJob({ commit }, { contractAddress, workerAddress }) {
    return await fetchJobMethod(contractAddress, QuestMethods.AssignJob, [workerAddress]);
  },
  // Принять результат работы воркера
  async acceptJobResult({ commit }, contractAddress) {
    return await fetchJobMethod(contractAddress, QuestMethods.AcceptJobResult);
  },
  async arbitration({ commit }, contractAddress) { // employer отменил (reject) результат работы или прошло 3 дня с момента начала verification
    return await fetchJobMethod(contractAddress, QuestMethods.Arbitration);
  },

  /** WORKER */
  // Отклонить приглашение на квест
  async declineJob({ commit }, contractAddress) {
    return await fetchJobMethod(contractAddress, QuestMethods.DeclineJob);
  },
  // Принять и начать квест
  async acceptJob({ commit }, contractAddress) {
    return await fetchJobMethod(contractAddress, QuestMethods.AcceptJob);
  },
  // Отправить результат работы на проверку employer'у
  async verificationJob({ commit }, contractAddress) { // worker отправляет квест на проверку
    return await fetchJobMethod(contractAddress, QuestMethods.VerificationJob);
  },

  // Арбитр
  /* async arbitrationRework({ commit }, contractAddress) { // арбитр возвращает квест в статус выполнения
    return await fetchJobMethod(contractAddress, 'arbitrationRework');
  },
  async arbitrationDecreaseCost({ commit }, { contractAddress, _forfeit }) {
    return await fetchJobMethod(contractAddress, 'arbitrationDecreaseCost', [_forfeit]);
  },
  async arbitrationRejectWork({ commit }, contractAddress) {
    return await fetchJobMethod(contractAddress, 'arbitrationRejectWork');
  }, */
};
