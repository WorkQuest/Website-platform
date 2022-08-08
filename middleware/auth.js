import { AES, enc } from 'crypto-js';
import { Path, UserStatuses } from '~/utils/enums';
import { createWallet, getIsWalletConnected, initWallet } from '~/utils/wallet';

// eslint-disable-next-line func-names
export default async function ({
  app, redirect, store, route,
}) {
  try {
    const access = app.$cookies.get('access');
    const refresh = app.$cookies.get('refresh');
    const userStatus = app.$cookies.get('userStatus');
    const social = app.$cookies.get('socialNetwork');
    const payload = {
      access,
      refresh,
      userStatus,
      social,
    };

    if (access || refresh) {
      store.commit('user/setTokens', payload);
    }
    if (!access || !app.$cookies.get('userLogin')) {
      await store.dispatch('user/logout', false);
      return redirect(Path.SIGN_IN);
    }
    if (!store.getters['user/getUserData'].id && +userStatus === UserStatuses.Confirmed) {
      await store.dispatch('user/getMainData');
    }
    if ((+userStatus === UserStatuses.NeedSetRole || !store.getters['user/getUserWalletAddress']) && route.path !== Path.ROLE) {
      return redirect(Path.ROLE);
    }

    // Reconnect wallet on refresh page
    if (getIsWalletConnected() === false) {
      const walletAddress = store.getters['user/getUserWalletAddress'];
      if (walletAddress) {
        const sessionKey = sessionStorage.getItem(walletAddress);
        const wal = createWallet(AES.decrypt(sessionKey, window.clientInformation.userAgent)?.toString(enc.Utf8));
        if (wal?.address?.toLowerCase() === walletAddress) {
          initWallet(wal);
        }
      }
    }

    return true;
  } catch (e) {
    console.error('middleware/auth', e);
    await store.dispatch('user/logout', false);
    return redirect(Path.SIGN_IN);
  }
}
