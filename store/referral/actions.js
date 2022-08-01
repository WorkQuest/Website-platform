import {
  getStyledAmount,
  GetWalletProvider,
  sendWalletTransaction,
} from '~/utils/wallet';
import {
  error,
  fetchContractData, success,
} from '~/utils/web3';
import { WQReferral } from '~/abi/index';
import { REFERRAL_EVENTS } from '~/utils/сonstants/referral';
import ENV from '~/utils/addresses/index';

export default {
  async fetchRewardBalance({ commit }, userWalletAddress) {
    try {
      const res = await fetchContractData(
        'getRewards',
        WQReferral,
        ENV.WORKNET_REFERRAL,
        [userWalletAddress],
        GetWalletProvider(),
      );
      console.log('get rewards', res, userWalletAddress);
      commit('setReferralReward', res ? getStyledAmount(res) : 0);
      return true;
    } catch (e) {
      console.error(`fetchRewardBalance: ${e}`);
      return error();
    }
  },
  async claimReferralReward({ _ }) {
    try {
      const res = await sendWalletTransaction('claim', {
        abi: WQReferral,
        address: ENV.WORKNET_REFERRAL,
      });
      return success(res);
    } catch (e) {
      console.error(`claimReferralReward: ${e}`);
      return error();
    }
  },
  async fetchPaidEventsList({ commit }, config) {
    try {
      const currConfig = config || { params: { limit: 6, offset: 0 } };
      const { result, ok } = await this.$axios.$get('v1/user/me/referral-program/claimed-paid-events', currConfig);

      if (result.events.length) {
        commit('setPaidEventsList', result.events);
      }

      return ok;
    } catch (e) {
      return false;
    }
  },
  async fetchReferralsList({ commit }) {
    try {
      const { result, ok } = await this.$axios.$get('v1/user/me/referral-program/referrals');

      if (result.referrals.length) {
        const isNeedRegistration = result.referrals.some((item) => item.referralUser.referralStatus === 'created' && item.ratingStatistic);

        commit('setReferralsListCount', result.count);
        commit('setReferralsList', result.referrals);
        commit('setIsNeedRegistration', isNeedRegistration);
      }

      return ok;
    } catch (e) {
      return false;
    }
  },
  async fetchCreatedReferralList({ commit }) {
    try {
      const { result, ok } = await this.$axios.$get('v1/user/me/referral-program/referral/signature/created-referrals');

      if (result) {
        const signature = {};
        signature.v = result.v;
        signature.r = result.r;
        signature.s = result.s;
        commit('setCreatedReferralList', result.addresses);
        commit('setReferralSignature', signature);
      }
      return ok;
    } catch (e) {
      return false;
    }
  },
  async addReferrals({ getters }) {
    const signature = getters.getReferralSignature;
    const addresses = getters.getCreatedReferralList;
    try {
      const res = await sendWalletTransaction('addReferrals', {
        abi: WQReferral,
        address: ENV.WORKNET_REFERRAL,
        data: [signature.v, signature.r, signature.s, addresses],
      });
      return success(res);
    } catch (e) {
      console.error(`addReferrals: ${e}`);
      return error();
    }
  },
  async subscribeToReferralEvents({
    getters, rootGetters, commit, dispatch,
  }, userAddress) {
    try {
      await this.$wsNotifs.subscribe(`/notifications/referral/${userAddress}`, async (msg) => {
        console.log('subscribeToReferralEvents massage', msg);
        const { data: dataMessage } = msg;
        const paidEventsList = JSON.parse(JSON.stringify(getters.getPaidEventsList));
        const referralsList = JSON.parse(JSON.stringify(getters.getReferralsList));
        let referralsListCount = JSON.parse(JSON.stringify(getters.getReferralsListCount));
        const currentPage = getters.getCurrentPage;

        if (msg.action === 'RegisteredAffiliar') {
          referralsList.unshift(dataMessage);
          referralsListCount = dataMessage.count;

          const isNeedRegistration = referralsList.some((item) => item.referralUser.referralStatus === 'created' && item.ratingStatistic);
          commit('setReferralsListCount', referralsListCount);
          commit('setReferralsList', referralsList);
          commit('setIsNeedRegistration', isNeedRegistration);
        } else if (msg.action === REFERRAL_EVENTS.RewardClaimed && currentPage === 1) {
          const userData = rootGetters['user/getUserData'];
          dispatch('main/setLoading', false, { root: true });
          paidEventsList.unshift({
            blockNumber: dataMessage.blockNumber,
            transactionHash: dataMessage.transactionHash,
            affiliate: dataMessage.returnValues.affiliat,
            amount: dataMessage.returnValues.amount,
            timestamp: dataMessage.timestamp || (new Date() / 1000),
            event: dataMessage.event,
            referral: dataMessage.referral || userData.wallet?.address,
            'referralUser.id': dataMessage['referralUser.id'] || userData.id,
            'referralUser.firstName': dataMessage['referralUser.firstName'] || userData.firstName,
            'referralUser.lastName': dataMessage['referralUser.lastName'] || userData.lastName,
            'referralUser.avatar.url': dataMessage['referralUser.avatar.url'] || (userData.avatar && userData.avatar.url),
          });
          if (paidEventsList.length > 10) {
            paidEventsList.pop();
          }
          commit('setPaidEventsList', paidEventsList);
        } else if (msg.action === REFERRAL_EVENTS.PaidReferral && currentPage === 1) {
          const eventData = dataMessage.event;
          paidEventsList.unshift({
            blockNumber: eventData.blockNumber,
            transactionHash: eventData.transactionHash,
            affiliate: eventData.returnValues.affiliat,
            amount: eventData.returnValues.amount,
            timestamp: eventData.timestamp,
            event: eventData.event,
            referral: eventData.returnValues.referral,
            'referralUser.id': dataMessage.referral.id,
            'referralUser.firstName': dataMessage.referral.firstName,
            'referralUser.lastName': dataMessage.referral.lastName,
            'referralUser.avatar.url': dataMessage.referral?.avatar?.url,
          });
          if (paidEventsList.length > 10) {
            paidEventsList.pop();
          }
          commit('setPaidEventsList', paidEventsList);
        }
      });
    } catch (err) {
      console.log('subscribeToReferralEvents err', err);
    }
  },
  async unsubscribeToReferralEvents(_, userAddress) {
    try {
      await this.$wsNotifs.unsubscribe(`/notifications/referral/${userAddress}`);
    } catch (err) {
      console.log('unsubscribeToReferralEvents err', err);
    }
  },
  updateCurrentPage({ commit }, page) {
    commit('setCurrentPage', page);
  },
  setIsNeedRegistration({ commit }, payload) {
    commit('setIsNeedRegistration', payload);
  },
};
