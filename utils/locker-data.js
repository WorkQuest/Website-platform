import { Path } from '~/utils/enums';

export const IS_PLUG = ['master', 'testnet'].includes(process.env.BRANCH);

export const LockedPages = [
  'retirement',
  'retirement/my',
  'staking',
  'staking-id',
  'referral',
  'auction',
  // 'collateral',
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
  Path.REFERRAL,
  Path.AUCTION,
  Path.COLLATERAL,
  Path.INSURING,
  Path.LENDING,
  Path.SAVINGS,
  Path.BORROW,
];
