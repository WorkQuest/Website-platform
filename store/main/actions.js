import { LoaderModes, LoaderStatusLocales } from '~/utils/loader';

export default {
  setLoading({ commit }, payload) {
    if (typeof payload === 'boolean') {
      commit('setLoading', payload);
      commit('setStatusText', null);
      return;
    }
    const {
      isLoading, statusText, loaderMode, loaderProgress, isHiderBackground,
    } = payload;
    commit('setLoading', isLoading);
    commit('setStatusText', statusText || $nuxt.$t(LoaderStatusLocales.pleaseWaitTx));
    commit('setLoaderMode', loaderMode || LoaderModes.default);
    commit('setLoaderProgress', loaderProgress || 0);
    commit('setIsLoaderBackgroundHider', isHiderBackground);
  },
  setIsLoaderBackgroundHider({ commit }, value) {
    commit('setIsLoaderBackgroundHider', value);
  },
  setLoaderMode({ commit }, value) {
    commit('setLoaderMode', value);
  },
  setLoaderProgress({ commit }, value) {
    commit('setLoaderProgress', value);
  },
  setProjects({ commit }, value) {
    commit('setProjects', value);
  },
  async getApiData({ dispatch }) {
    await dispatch('rate/getRate', null, { root: true });
  },
  showToast(app, value) {
    this._vm.$bvToast.toast(value.text, {
      title: value.title || 'Error',
      variant: 'warning',
      solid: true,
      toaster: 'b-toaster-bottom-right',
      appendToast: true,
      toastClass: 'custom-toast-width',
      bodyClass: 'custom-toast-width',
    });
  },
};
