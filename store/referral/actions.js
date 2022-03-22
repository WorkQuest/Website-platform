import {
  getStyledAmount,
  GetWalletProvider,
} from '~/utils/wallet';
import {
  error,
  fetchContractData,
} from '~/utils/web3';
import * as abi from '~/abi/abi';

export default {
  async fetchRewardBalance({ commit }, userWalletAddress) {
    try {
      const res = await fetchContractData(
        'getRewards',
        abi.WQReferral,
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
  async claimReferralReward() {
    try {
      return await fetchContractData(
        'claim',
        abi.WQReferral,
        process.env.WORKNET_REFERRAL,
        [],
        GetWalletProvider(),
      );
    } catch (e) {
      console.error(`claimReferralReward: ${e}`);
      return error();
    }
  },
  async fetchPaidEventsList({ commit }, config) {
    try {
      const currConfig = config || { params: { limit: 6, offset: 0 } };
      const { data: { result, ok } } = await this.$axios.get('v1/user/me/referral-program/claimed-paid-events', currConfig);

      if (result.events.length) {
        commit('setPaidEventsList', result.events);
      }

      return ok;
    } catch (e) {
      return false;
    }
  },
  async fetchReferralsList({ commit }, config) {
    try {
      const currConfig = config || { params: { limit: 10, offset: 0 } };
      const { data: { result, ok } } = await this.$axios.get('v1/user/me/referral-program/referrals', currConfig);

      if (result.referrals.length) {
        const isNeedRegistration = result.referrals.some((item) => item.referralUser.referralStatus === 'created');
        console.log(isNeedRegistration);

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
      const { data: { result, ok } } = await this.$axios.get('v1/user/me/referral-program/referral/signature/created-referrals');

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
      return await fetchContractData(
        'addReferrals',
        abi.WQReferral,
        process.env.WORKNET_REFERRAL,
        [signature.v, signature.r, signature.s, addresses],
        GetWalletProvider(),
      );
    } catch (e) {
      console.error(`fetchContractData: ${e}`);
      return error();
    }
  },
  async subscribeToReferralEvents({ getters, commit }, userAddress) {
    await this.$wsNotifs.subscribe(`/notifications/referral/${userAddress}`, async (msg) => {
      console.log('subscribeToReferralEvents massage', msg);

      const paidEventsList = JSON.parse(JSON.stringify(getters.getPaidEventsList));
      const referralsList = JSON.parse(JSON.stringify(getters.getReferralsList));
      let referralsListCount = JSON.parse(JSON.stringify(getters.getReferralsListCount));
      const currentPage = getters.getCurrentPage;

      if (msg.type === 'RegisteredAffiliar') {
        console.log('RegisteredAffiliar');
        referralsList.unshift(msg.data);
        referralsListCount = msg.data.count;
        if (paidEventsList.length > 10) {
          paidEventsList.pop();
        }
        commit('setReferralsListCount', referralsListCount);
        commit('setReferralsList', referralsList);
      } else if (msg.type === 'RewardClaimed' && currentPage === 1) {
        paidEventsList.unshift(msg.data);
        if (paidEventsList.length > 10) {
          paidEventsList.pop();
        }
        commit('setPaidEventsList', paidEventsList);
      } else if (msg.type === 'PaidReferral' && currentPage === 1) {
        console.log('PaidReferral');
        paidEventsList.unshift(msg.data);
        if (paidEventsList.length > 10) {
          paidEventsList.pop();
        }
      }
    });
  },
  async unsubscribeToReferralEvents(_, userAddress) {
    await this.$wsNotifs.unsubscribe(`/notifications/referral/${userAddress}`);
  },
  updateCurrentPage({ commit }, page) {
    commit('setCurrentPage', page);
  },
};
