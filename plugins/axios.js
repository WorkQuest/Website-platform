/* eslint-disable no-param-reassign,consistent-return */
// eslint-disable-next-line func-names
export default function ({
  $axios, store, app, redirect,
}, inject) {
  $axios.onRequest((config) => {
    // if (store.getters['user/isAuth']) {
    //   const urlName = config.url.split('/').pop();
    //   const token = urlName === 'refresh-tokens' ? store.getters['user/refreshToken'] : store.getters['user/accessToken'];
    //   config.headers.authorization = `Bearer ${token}`;
    // }
    const token = app.$cookies.get('access');
    config.headers.authorization = `Bearer ${token}`;
  });
  // eslint-disable-next-line no-unused-vars
  $axios.onError(async (error) => {
    console.dir(error);
    const originalRequest = error.config;
    if (error.config.url === '/v1/auth/refresh-tokens') {
      //
    } else if (error.response.status === 401) {
      // app.$tokensRefresher.refreshTokens();
      // await store.dispatch('user/refreshTokens');
      // return $axios(originalRequest);
      await store.dispatch('user/logOut');
      redirect('/');
    } else if (error.response.data.code !== 400010) {
      store.dispatch('main/showToast', error);
    }
    throw error;
  });
}
