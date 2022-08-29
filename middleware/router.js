import { RouterNames } from '~/utils/enums';

const notAvailableRoutes = [
  RouterNames.SIGN_IN,
  RouterNames.ROLE,
  RouterNames.SIGN_UP,
  RouterNames.RESTORE,
  RouterNames.ROOT,
];

// eslint-disable-next-line func-names
export default async function ({
  app, redirect, route,
}) {
  const access = app.$cookies.get('access');
  const redirectUrl = sessionStorage.getItem('redirectTo');
  if (!access && !notAvailableRoutes.includes(route.name)) {
    sessionStorage.setItem('redirectTo', route.path);
  } else if (access && redirectUrl) {
    redirect(redirectUrl);
    sessionStorage.removeItem('redirectTo');
  }
}
