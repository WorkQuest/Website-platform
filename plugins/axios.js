/* eslint-disable no-param-reassign,consistent-return */
// eslint-disable-next-line func-names
import { Path } from '~/utils/enums';

// eslint-disable-next-line
export default function ({ $axios, store, redirect, app }, inject) {
  $axios.onRequest((config) => {
    if (store.getters['user/isAuth'] && !config.url.includes('digitaloceanspaces.com')) {
      const urlName = config.url.split('/').pop();
      const token = urlName === 'refresh-tokens' ? store.getters['user/refreshToken'] : store.getters['user/accessToken'];
      config.headers.authorization = `Bearer ${token}`;
    }
  });

  let isRefreshing = false;
  let failedQueue = [];

  $axios.onError(async (error) => {
    console.dir(error);
    const originalRequest = error.config;

    if (error.config.url === '/v1/auth/refresh-tokens') {
      await store.dispatch('user/logout', false);
      redirect(Path.SIGN_IN);

      isRefreshing = false;
      failedQueue = [];

      throw error;
    } else if (error.response.status === 401 && !originalRequest._retry) {
      const processQueue = (err, token = null) => {
        failedQueue.forEach((prom) => (err ? prom.reject(err) : prom.resolve(token)));
        failedQueue = [];
      };

      if (isRefreshing) {
        new Promise(((resolve, reject) => { failedQueue.push({ resolve, reject }); }))
          .then((token) => {
            originalRequest.headers.authorization = `Bearer ${token}`;
            return $axios(originalRequest);
          })
          .catch((err) => { Promise.reject(err); });
        throw error;
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(((resolve, reject) => {
        store.dispatch('user/refreshTokens')
          .then(({ result: { access } }) => {
            originalRequest.headers.authorization = `Bearer ${access}`;
            processQueue(null, access);
            resolve($axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .then(() => { isRefreshing = false; });
      }));
    } else if (error.response.data.code === 403000) {
      await store.dispatch('main/showToast', {
        title: app.i18n.t('toasts.error'),
        text: error.response.data.msg,
      });
    } else if (error.response.data.code !== 400010) {
      await store.dispatch('main/showToast', {
        title: app.i18n.t('toasts.error'),
        text: error.response.data.msg,
      });
    }
    throw error;
  });
}
