import {
  getStyledAmount,
  GetWalletProvider,
  sendWalletTransaction,
} from '~/utils/wallet';
import {
  error,
  fetchContractData,
} from '~/utils/web3';
import { WQReferral } from '~/abi/index';
import { REFERRAL_EVENTS } from '~/utils/сonstants/referral';

export default {
  async fetchRewardBalance({ commit }, userWalletAddress) {
    try {
      const res = await fetchContractData(
        'getRewards',
        WQReferral,
        process.env.WORKNET_REFERRAL,
        [userWalletAddress],
        GetWalletProvider(),
      );
      commit('setReferralReward', res ? getStyledAmount(res) : 0);
      return true;
    } catch (e) {
      console.error(`fetchRewardBalance: ${e}`);
      return error();
    }
  },
  async claimReferralReward(_, userAddress) {
    try {
      const payload = {
        abi: WQReferral,
        address: process.env.WORKNET_REFERRAL,
        userAddress,
      };
      return await sendWalletTransaction('claim', payload);
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
        const isNeedRegistration = result.referrals.some((item) => item.referralUser.referralStatus === 'created');

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
  async addReferrals({ getters }, userAddress) {
    const signature = getters.getReferralSignature;
    const addresses = getters.getCreatedReferralList;
    try {
      const payload = {
        abi: WQReferral,
        address: process.env.WORKNET_REFERRAL,
        data: [signature.v, signature.r, signature.s, addresses],
        userAddress,
      };
      return await sendWalletTransaction('addReferrals', payload);
    } catch (e) {
      console.error(`addReferrals: ${e}`);
      return error();
    }
  },
  async subscribeToReferralEvents({ getters, commit }, userAddress) {
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

          const isNeedRegistration = referralsList.some((item) => item.referralUser.referralStatus === 'created');
          commit('setReferralsListCount', referralsListCount);
          commit('setReferralsList', referralsList);
          commit('setIsNeedRegistration', isNeedRegistration);
        } else if ((msg.action === REFERRAL_EVENTS.RewardClaimed || msg.action === REFERRAL_EVENTS.PaidReferral) && currentPage === 1) {
          paidEventsList.unshift({
            blockNumber: dataMessage.blockNumber,
            transactionHash: dataMessage.transactionHash,
            referral: dataMessage.referral,
            affiliate: dataMessage.affiliate,
            amount: dataMessage.returnValues.affiliat,
            timestamp: dataMessage.timestamp,
            event: dataMessage.event,
            'referralUser.id': dataMessage['referralUser.id'] || '-',
            'referralUser.firstName': dataMessage['referralUser.firstName'] || '-',
            'referralUser.lastName': dataMessage['referralUser.lastName'] || '-',
            'referralUser.avatar.url': dataMessage['referralUser.lastName'],
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
};
