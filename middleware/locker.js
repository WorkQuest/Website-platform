import { Path } from '~/utils/enums';

const availablePages = [
  Path.ROLE,
  Path.SIGN_UP,
  Path.SIGN_IN,
  Path.BRIDGE,
  Path.MINING,
  Path.PROFILE,
  Path.SETTINGS,
];

// eslint-disable-next-line func-names
export default async function ({ redirect, route }) {
  if (!availablePages.includes(route.path)) {
    redirect(Path.SETTINGS);
  }
  return null;
}
