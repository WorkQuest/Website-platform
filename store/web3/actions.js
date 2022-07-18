import BigNumber from 'bignumber.js';

import {
  error,
  success,
  initWeb3,
  showToast,
  goToChain,
  disconnectWeb3,
  fetchContractData,
  getAccountAddress,
  handleMetamaskStatus,
  unsubscirbeListeners,
} from '~/utils/web3';

import { ERC20 } from '~/abi/index';

import modals from '~/store/modals/modals';

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
BigNumber.config({ EXPONENTIAL_AT: 60 });

export default {
  showToast({ dispatch }, title, text, variant) {
    dispatch('main/showToast', {
      title,
      text,
      variant,
    }, { root: true });
  },

  disconnect({ commit }) {
    disconnectWeb3();
    commit('setIsConnected', false);
    commit('setAccount', {});
    localStorage.removeItem('walletconnect');
    return success();
  },

  async connect({ commit, dispatch, getters }, payload) {
    const isReconnection = payload?.isReconnection;
    const response = await initWeb3(payload);
    if (response.ok) {
      if (!getters.isHandlingMetamaskStatus && !isReconnection) {
        handleMetamaskStatus(() => dispatch('handleMetamaskStatusChanged'));
        commit('setIsHandlingMetamaskStatus', true);
      }
      await commit('setAccount', response.result);
      await commit('setIsConnected', true);
      if (!isReconnection) showToast('Connect to wallet', 'Connected', 'success');
      return true;
    }
    commit('setIsConnected', false);
    showToast('Error connect to wallet', `${response.data}`, 'danger');
    return false;
  },

  async updateAccount({ commit }, newData) {
    commit('setAccount', newData);
  },

  // Only MetaMask
  async connectToMetaMask({ commit, dispatch, getters }, payload) {
    const isReconnection = payload?.isReconnection;
    const response = await initWeb3(payload);
    if (response.ok) {
      if (!getters.isHandlingMetamaskStatus && !isReconnection) {
        handleMetamaskStatus(() => dispatch('handleMetamaskStatusChanged'));
        commit('setIsHandlingMetamaskStatus', true);
      }
      await commit('setAccount', response.result);
      await commit('setIsConnected', true);
    }
  },
  async handleMetamaskStatusChanged({ dispatch }) {
    await dispatch('disconnect');
    await dispatch('connectToMetaMask', { isReconnection: true });
  },

  // TODO Delete
  async checkMetaMaskStatus({ getters, dispatch }, chain) {
    if (!getters.isConnected) {
      if (typeof window.ethereum === 'undefined') {
        localStorage.setItem('metamaskStatus', 'notInstalled');
        this.ShowModal({
          key: modals.status,
          img: '~assets/img/ui/cardHasBeenAdded.svg',
          title: 'Please install Metamask!',
          subtitle: 'Please click install...',
          button: 'Install',
          callback: () => window.open('https://metamask.io/download.html'),
        });
      } else {
        localStorage.setItem('metamaskStatus', 'installed');
        await dispatch('connectToMetaMask');
        await dispatch('goToChain', { chain });
      }
    }
  },

  async fetchTokenInfo({ commit }, tokenAddress) {
    try {
      const [balance, decimals, symbol] = await Promise.all([
        fetchContractData('balanceOf', ERC20, tokenAddress, [getAccountAddress()]),
        fetchContractData('decimals', ERC20, tokenAddress),
        fetchContractData('symbol', ERC20, tokenAddress),
      ]);
      return success({
        balance,
        decimals,
        symbol,
      });
    } catch (e) {
      console.error('Error in fetchTokenInfo:', e);
      return error();
    }
  },

  unsubscribeActions() {
    unsubscirbeListeners();
  },

  async goToChain({ commit }, { chain }) {
    return await goToChain(chain);
  },

  // mobile browser check
  // false - desktop, true - mobile && !metamask
  checkIsMobileMetamaskNeed() {
    if (!this.checkIfMobile()) return false;
    return typeof window.ethereum === 'undefined';
  },
};
