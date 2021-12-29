import {
  connectWallet, disconnect, getBalance, getIsWalletConnected, setWalletAddress,
} from '~/utils/wallet';

export default {
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
   * @param userPassword
   */
  connectWallet({ commit, getters }, userPassword) {
    const res = connectWallet(getters.userAddress, userPassword);
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
  async getBalance() {
    return await getBalance();
  },
};
