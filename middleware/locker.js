import { Path } from '~/utils/enums';
import { LockedPages } from '~/utils/locker-data';

// eslint-disable-next-line func-names
export default async function ({ redirect, route }) {
  if (LockedPages.includes(route.name)) {
    redirect(Path.ROOT);
  }
  return null;
}
