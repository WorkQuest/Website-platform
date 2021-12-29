import { UserRole, Path } from '~/utils/enums';
// eslint-disable-next-line func-names
export default function ({ store, redirect }) {
  const currentUserRole = store?.state?.user?.userData?.role;
  if (currentUserRole !== UserRole.EMPLOYER) {
    return redirect(Path.ROOT);
  }
  return null;
}
