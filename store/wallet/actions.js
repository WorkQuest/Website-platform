import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import {
  connectWallet, createQuest, depositCostToQuestContract,
  disconnect,
  fetchContractData, fetchJobMethod, getAccountQuests,
  getBalance,
  getIsWalletConnected,
  getStyledAmount,
  setWalletAddress,
  transfer, transferToken,
} from '~/utils/wallet';
import abi from '~/abi/index';
import { TokenSymbols } from '~/utils/enums';

export default {
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
      balance: res.result.balance,
      fullBalance: res.result.fullBalance,
    });
  },
  async getBalanceWQT({ commit }, userAddress) {
    const value = await fetchContractData('balanceOf', abi.ERC20, process.env.WQT_TOKEN, [userAddress]);
    commit('setBalance', {
      symbol: TokenSymbols.WQT,
      balance: getStyledAmount(value),
      fullBalance: getStyledAmount(value, true),
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
  /**
   * Send transfer for WQT token
   * @param commit
   * @param recipient
   * @param value
   */
  async transferWQT({ commit }, { recipient, value }) {
    return await transferToken(recipient, value);
  },

  /* QUESTS */
  /**
   * @param commit
   * @param payload { cost & description }
   */
  async createQuest({ commit }, payload) {
    return await createQuest(payload);
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
