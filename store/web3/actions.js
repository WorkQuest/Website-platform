import {
  initWeb3,
  createInstance,
  initWeb3Contract,
  disconnectWeb3,
  startPingingMetamask,
} from '~/utils/web3';
import * as abi from '~/abi/abi';

export default {
  disconnect({ commit }) {
    disconnectWeb3();
    commit('setIsConnected', false);
    commit('clearTokens');
    commit('clearAccount');
  },
  async startPingingMetamask({ dispatch }) {
    await startPingingMetamask(() => {
      dispatch('disconnect');
    });
  },
  async connect({ commit, dispatch }) {
    const response = await initWeb3();
    if (response.ok) {
      dispatch('startPingingMetamask');
      commit('setAccount', response.result);
      commit('setIsConnected', true);
    } else {
      console.log('Web3 connect error', response);
      commit('setIsConnected', false);
      dispatch('main/showToast', {
        title: 'Error',
        text: `${response.data}`,
        variant: 'danger',
      }, { root: true });
    }
  },

  async initWETHToken({ commit }) {
    const [abs, address] = [abi.ERC20, process.env.WETH_TOKEN];
    const instance = await createInstance(abs, address);

    const payload = {
      address,
      instance,
    };
    commit('setWETHToken', payload);
  },

  async initWeb3ExampleContract({ commit }) {
    const [abs, address] = [abi.EXAMPLE_WEB3, process.env.EXAMPLE_WEB3_ADDRESS];
    const instance = await initWeb3Contract(abs, address);
    const [symbol, decimals] = await Promise.all([
      instance.methods.symbol().call(),
      instance.methods.decimals().call(),
    ]);

    const payload = {
      symbol,
      address,
      decimals: +decimals,
      instance,
    };
    commit('setWeb3ExampleToken', payload);
  },
};
