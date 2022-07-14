import { Path } from '~/utils/enums';

// eslint-disable-next-line func-names
export default async function ({
  app, redirect, route,
}) {
  const access = app.$cookies.get('access');
  const redirectUrl = sessionStorage.getItem('redirectTo');
  if (!access && [Path.SIGN_IN, Path.ROLE, Path.SIGN_UP, Path.ROOT].includes(route.path) === false) {
    sessionStorage.setItem('redirectTo', route.path);
  } else if (access && redirectUrl) {
    redirect(redirectUrl);
    sessionStorage.removeItem('redirectTo');
  }
}
