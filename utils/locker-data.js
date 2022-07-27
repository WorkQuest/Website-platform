import { Path } from '~/utils/enums';

export const IS_PLUG = ['master', 'testnet'].includes(process.env.BRANCH);

export const LockedPages = [
  'retirement',
  'retirement/my',
  'staking',
  'staking-id',
  'auction',
  'insuring',
  'insuring-id',
  'lending',
  'lending/my',
  'savings',
  'savings-id',
  'borrow',
];

export const LockedPaths = [
  Path.RETIREMENT,
  Path.STAKING,
  Path.AUCTION,
  Path.INSURING,
  Path.LENDING,
  Path.SAVINGS,
  Path.BORROW,
];
