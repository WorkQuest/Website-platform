import { UserRole, Path } from '~/utils/enums';
// eslint-disable-next-line func-names
export default function ({ store, redirect }) {
  const currentUserRole = store.getters['user/getUserRole'];
  if (currentUserRole !== UserRole.EMPLOYER) {
    return redirect(Path.WORKERS);
  }
  return null;
}
