import { Path } from '~/utils/enums';

export const IS_PLUG = ['master', 'testnet'].includes(process.env.BRANCH);

export const IS_PLUG_PROD = process.env.BRANCH === 'master';

export const LockedProdPages = [
  'collateral',
  'auction',
];

export const LockedProdPaths = [
  Path.COLLATERAL,
  Path.AUCTION,
];

export const LockedPages = [
  'retirement',
  'retirement/my',
  'staking',
  'staking-id',
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
  Path.INSURING,
  Path.LENDING,
  Path.SAVINGS,
  Path.BORROW,
];
