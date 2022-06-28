import { Path } from '~/utils/enums';
import { IS_PLUG, LockedPages } from '~/utils/locker-data';

// eslint-disable-next-line func-names
export default async function ({ redirect, route }) {
  if (IS_PLUG && LockedPages.includes(route.name)) {
    redirect(Path.ROOT);
  }
  return null;
}
