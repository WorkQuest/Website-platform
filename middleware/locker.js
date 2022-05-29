import { Path } from '~/utils/enums';

const availablePages = [
  Path.ROLE,
  Path.SIGN_UP,
  Path.SIGN_IN,
  Path.BRIDGE,
  Path.MINING,
  Path.WALLET,
  Path.QUESTS,
  Path.CREATE_QUEST,
  Path.EDIT_QUEST,
  Path.RAISED_VIEWS,
  Path.PROFILE,
  Path.SETTINGS,
  Path.MY_QUESTS,
  Path.WORKERS,
  Path.NOTIFICATIONS,
  Path.MESSAGES,
  Path.SUMSUB,
];

// eslint-disable-next-line func-names
export default async function ({ redirect, route, store }) {
  console.log(route.path);
  if (!availablePages.includes(route.path)) {
    redirect(Path.WALLET);
  }
  return null;
}
