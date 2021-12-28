import { connectWallet, getWallet, isWalletConnected } from '~/utils/wallet';

export default {
  /**
   * Check wallet is connected
   * @returns boolean
   */
  checkWalletConnected({ commit }, nuxt) {
    const connected = isWalletConnected();
    if (!connected) {
      nuxt.setLayout('confirmPassword');
    }
  },
  /**
   * Connect wallet with password
   * Use when checkWalletConnected from confirmPassword modal
   * @param getters
   * @param userPassword
   */
  connectWallet({ getters }, userPassword) {
    connectWallet(getters.userAddress, userPassword);
  },
  getAccountAddress() {
    return getWallet().address;
  },
};
