import { Path } from '~/utils/enums';

const availablePages = [
  'role',
  'sign-up',
  'sign-in',
  'bridge',
  'mining',
  'mining-id',
  'profile-id',
  'settings',
  'index',
];

// eslint-disable-next-line func-names
export default async function ({ redirect, route }) {
  if (!availablePages.includes(route.name)) {
    redirect(Path.SETTINGS);
  }
  return null;
}
