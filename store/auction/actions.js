import BigNumber from 'bignumber.js';
import {
  error,
  success,
} from '~/utils/web3';
import { createInstance } from '~/utils/wallet';
import { WQAuction } from '~/abi';
import ENV from '~/utils/addresses/index';
import { Path } from '~/utils/enums';
import { AUCTION_CARDS_LIMIT } from '~/utils/сonstants/auction';

let callbackWS = null;

const LotsStatuses = {
  INACTIVE: 0,
  STARTED: 1,
  BOUGHT: 2,
  CANCELED: 3,
};

const AuctionEvents = {
  BOUGHT: 'Bought',
  STARTED: 'Started',
  CANCELED: 'Canceled',
  LIQUIDATED: 'Liquidated',
  NOT_LIQUIDATED: 'NotLiquidated',
};

/**
 * @property $axiosLiquidator
 */
export default {
  /**
   *
   * @param commit
   * @param getters
   * @param params
   * @param lotStatus
   * @param sort
   * @property liquidityValue - amount for liquidation
   * @property priceValue - lot price
   * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchLots({ commit, rootGetters, dispatch }, { lotStatus, params, sort }) {
    try {
      if (LotsStatuses.BOUGHT === lotStatus) return dispatch('fetchBoughtLots', { params, sort });

      const end_point = {
        [LotsStatuses.INACTIVE]: '/auction/lots/auctionLiquidity',
        [LotsStatuses.STARTED]: '/auction/lots/auctionStarted',
      }[lotStatus];
      const { result: { count, auction } } = await this.$axiosLiquidator.$get(end_point, {
        params: {
          ...params,
          'sort[createdAt]': sort,
        },
      });

      const balanceData = rootGetters['wallet/getBalanceData'];
      commit('setLots', {
        count,
        lots: auction.map((item) => {
          let symbolDecimals = balanceData[item.symbol].decimals;
          if (symbolDecimals === 6) symbolDecimals += symbolDecimals;
          return {
            ...item,
            _collateral: Number(new BigNumber(item.collateral).shiftedBy(-symbolDecimals)),
            _liquidityValue: Number(new BigNumber(item.liquidityValue).shiftedBy(-18).toFixed(4, 1)),
            _price: Number(new BigNumber(item.priceValue).shiftedBy(-18).toFixed(4, 1)),
          };
        }),
      });
      return success();
    } catch (e) {
      console.error('auction/fetchLots', e);
      return error();
    }
  },

  async clearLots({ commit }) {
    commit('setLots', { count: 0, lots: [] });
  },

  async fetchBoughtLots({ commit, rootGetters }, { params, sort }) {
    try {
      const { result: { count, auction } } = await this.$axiosLiquidator.$get('/auction/lots/auctionBought', {
        params: {
          ...params,
          'sort[timestamp]': sort,
        },
      });

      const balanceData = rootGetters['wallet/getBalanceData'];

      const lots = [];
      auction.forEach((item) => {
        const { symbol, lotBuyed } = item;
        lots.push(...lotBuyed.map((lot) => {
          const {
            cost, buyer, amount, timestamp, transactionHash,
          } = lot;

          const symbolDecimals = balanceData[symbol].decimals;
          // if (+symbolDecimals === 6) symbolDecimals += symbolDecimals;
          return {
            ...item,
            buyer,
            timestamp,
            transactionHash,
            lotAmount: Number(new BigNumber(amount).shiftedBy(-symbolDecimals).toFixed(4, 1)),
            lotPrice: Number(new BigNumber(cost).shiftedBy(-18).toFixed(4, 1)),
          };
        }));
      });

      commit('setLots', { count, lots });

      return success();
    } catch (e) {
      console.error('auction/fetchBoughtLots', e);
      return error();
    }
  },

  async fetchAuctionsDuration({ commit }) {
    try {
      /**
       * @property auctionDuration - method of WQ auction
       */
      const [USDT_DURATION, USDC_DURATION, ETH_DURATION, BNB_DURATION] = await Promise.all(
        [
          ENV.WORKNET_USDT_AUCTION,
          ENV.WORKNET_USDC_AUCTION,
          ENV.WORKNET_ETH_AUCTION,
          ENV.WORKNET_BNB_AUCTION,
        ].map((auction) => createInstance(WQAuction, auction).methods.auctionDuration().call()),
      );

      commit('setDuration', {
        USDT: USDT_DURATION,
        USDC: USDC_DURATION,
        ETH: ETH_DURATION,
        BNB: BNB_DURATION,
      });
      return success();
    } catch (e) {
      console.error('auction/fetchAuctionsDuration', e);
      return error();
    }
  },

  async setCallbackWS(_, callback) {
    callbackWS = callback;
  },

  async subscribeWS({
    commit, getters, rootGetters, dispatch,
  }) {
    try {
      let timeoutId = null;
      let isLoadingByWS = false;

      const addLotToArray = (lot) => {
        const array = JSON.parse(JSON.stringify(getters.getLots));
        const count = JSON.parse(JSON.stringify(getters.getLotsCount));
        const balanceData = rootGetters['wallet/getBalanceData'];
        let symbolDecimals = balanceData[lot.symbol].decimals;

        if (getters.getCurrentTab === LotsStatuses.BOUGHT) {
          /**
           * @property lotBuyed - its array of all buy events for current lot, first item is newest event
           */
          const {
            cost, buyer, amount, timestamp, transactionHash,
          } = lot.lotBuyed[0];

          array.unshift({
            ...lot,
            buyer,
            timestamp,
            transactionHash,
            lotAmount: Number(new BigNumber(amount).shiftedBy(-symbolDecimals).toFixed(4, 1)),
            lotPrice: Number(new BigNumber(cost).shiftedBy(-18).toFixed(4, 1)),
          });
          if (array.length > AUCTION_CARDS_LIMIT) array.splice(array.length - 1, 1);

          commit('setLots', {
            count: count + 1,
            lots: array,
          });
        } else {
          if (symbolDecimals === 6) symbolDecimals += symbolDecimals;

          lot = {
            ...lot,
            _collateral: Number(new BigNumber(lot.collateral).shiftedBy(-symbolDecimals)),
            _liquidityValue: Number(new BigNumber(lot.liquidityValue).shiftedBy(-18).toFixed(4, 1)),
            _price: Number(new BigNumber(lot.priceValue).shiftedBy(-18).toFixed(4, 1)),
          };

          // find lot in array and update it
          const isUpdatedLot = array.some((item, i) => {
            if (+item.index === +lot.index && item.symbol === lot.symbol) {
              array[i] = { ...lot };
              return true;
            }
            return false;
          });

          if (!isUpdatedLot) {
            array.unshift(lot);
            if (array.length > AUCTION_CARDS_LIMIT) array.splice(array.length - 1, 1);

            commit('setLots', {
              count: count + 1,
              lots: array,
            });
          }
        }
      };

      const removeLotFromArray = (lot) => {
        const array = JSON.parse(JSON.stringify(getters.getLots));
        const count = JSON.parse(JSON.stringify(getters.getLotsCount));
        let indexLot = null;

        array.some((item, i) => {
          indexLot = (lot.index === item.index && lot.symbol === item.symbol) ? i : null;
          return lot.id === item.id;
        });
        if (indexLot === null) return;

        array.splice(indexLot, 1);
        commit('setLots', {
          lots: array,
          count: count - 1,
        });
      };

      await this.$wsNotifs.subscribe(`${Path.NOTIFICATIONS}/loan-auction`, async ({ action, data: lot }) => {
        const currentTab = getters.getCurrentTab;

        // it need for understanding, that loader was initialized by user
        const loaderText = rootGetters['main/getLoaderStatusText'];
        if (!loaderText && !timeoutId) {
          isLoadingByWS = true;
          dispatch('main/setLoading', true, { root: true });
        }
        switch (action) {
          case (AuctionEvents.NOT_LIQUIDATED): {
            if (currentTab !== LotsStatuses.INACTIVE) break;
            removeLotFromArray(lot);
            break;
          }
          case (AuctionEvents.LIQUIDATED): {
            if (currentTab !== LotsStatuses.INACTIVE) break;
            addLotToArray(lot);
            break;
          }
          case (AuctionEvents.STARTED): {
            if (currentTab === LotsStatuses.INACTIVE) {
              removeLotFromArray(lot);
            } else if (currentTab === LotsStatuses.STARTED) {
              addLotToArray(lot);
            }
            break;
          }
          case (AuctionEvents.BOUGHT):
          case (AuctionEvents.CANCELED): {
            if ([LotsStatuses.BOUGHT, LotsStatuses.CANCELED].includes(currentTab)) {
              addLotToArray(lot);
            } else if (currentTab === LotsStatuses.STARTED) {
              removeLotFromArray(lot);
            }

            break;
          }
          default: {
            console.log(action, ' by subscription "loan-auction"');
            break;
          }
        }

        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (isLoadingByWS || !loaderText) {
            dispatch('main/setLoading', false, { root: true });
            timeoutId = null;
          }

          if (callbackWS) {
            callbackWS();
            callbackWS = null;
          }
        }, 200);
      });
    } catch (err) {
      console.error('auction/subscribeWS', err);
    }
  },

  async unsubscribeWS(_) {
    try {
      await this.$wsNotifs.unsubscribe(`${Path.NOTIFICATIONS}/loan-auction`);
    } catch (err) {
      console.error('auction/unsubscribeWS', err);
    }
  },
};
