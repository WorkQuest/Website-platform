export const AUCTION_CARDS_LIMIT = 12;

export const LotsStatuses = {
  INACTIVE: 0,
  STARTED: 1,
  BOUGHT: 2,
  CANCELED: 3,
};

export const LOWER_BOUND_COST = {
  develop: 0.999,
  testnet: 0.999,
  master: 0.999,
}[process.env.BRANCH];

export const UPPER_BOUND_COST = {
  develop: 1.01,
  testnet: 1.01,
  master: 1.01,
}[process.env.BRANCH];
