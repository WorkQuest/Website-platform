// eslint-disable-next-line func-names
export default async function ({
  store, error, redirect, app, route,
}) {
  try {
    const hasAccess = !!app.$cookies.get('access');
    const hasRefresh = !!app.$cookies.get('refresh');
    const isEmailConfirmed = app.$cookies.get('status');
    const { role } = store.getters['user/getUserData'];
    console.log(role);
    if (!hasAccess || !hasRefresh || isEmailConfirmed === 0) {
      return redirect('/sign-in');
    }
    if (!role && (hasAccess || hasRefresh)) {
      await store.dispatch('user/getUserData');
    }
    return true;
  } catch (e) {
    console.log(e);
    await store.commit('user/logOut');
    return redirect('/sign-in');
  }
}
