// eslint-disable-next-line func-names
export default async function ({ app, redirect, store }) {
  try {
    const access = app.$cookies.get('access');
    const refresh = app.$cookies.get('refresh');
    const userStatus = app.$cookies.get('userStatus');
    const userData = store.getters['user/getUserData'];
    const payload = {
      access,
      refresh,
      userData,
    };
    // let privatePage;
    // switch (window.location.pathname) {
    //   case '/crosschain':
    //     privatePage = false;
    //     break;
    //   case '/mining':
    //     privatePage = false;
    //     break;
    //   case '/mining/ETH':
    //     privatePage = false;
    //     break;
    //   case '/mining/BNB':
    //     privatePage = false;
    //     break;
    //   default:
    //     privatePage = true;
    //     break;
    // }
    // if (privatePage) {
    if (access && refresh) {
      store.commit('user/setTokens', payload);
    }
    if (!access || !refresh) {
      return redirect('/sign-in');
    }
    if (!Object.keys(userData).length) {
      await store.dispatch('user/getUserData');
    }
    if (userStatus === 2) {
      return redirect('/role');
    }
    // }
    return true;
  } catch (e) {
    console.log(e);
    await store.dispatch('user/logout');
    return redirect('/sign-in');
  }
}
