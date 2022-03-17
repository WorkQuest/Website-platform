import {
  getStyledAmount,
  GetWalletProvider,
} from '~/utils/wallet';
import {
  fetchContractData,
} from '~/utils/web3';
import * as abi from '~/abi/abi';

export default {
  async fetchRewardBalance({ commit }, userWalletAddress) {
    const res = await fetchContractData(
      'getRewards',
      abi.WQReferral,
      process.env.WORKNET_REFERRAL,
      [userWalletAddress],
      GetWalletProvider(),
    );
    commit('setReferralReward', res ? getStyledAmount(res) : 0);
  },
  async claimReferralReward() {
    return await fetchContractData(
      'claim',
      abi.WQReferral,
      process.env.WORKNET_REFERRAL,
      [],
      GetWalletProvider(),
    );
  },
  async fetchPaidEventsList({ commit, dispatch }, config) {
    try {
      const currConfig = config || { params: { limit: 6, offset: 0 } };
      const { data: { result, ok } } = await this.$axios.get(`${process.env.BASE_URL}${process.env.WORKNET_REFERRAL_URL}claimed-paid-events`, currConfig);

      if (result.events.length) {
        commit('setPaidEventsList', result.events);
      }

      return ok;
    } catch (e) {
      return false;
    }
  },
  async fetchReferralsList({ commit, dispatch }, config) {
    try {
      const currConfig = config || { params: { limit: 10, offset: 0 } };
      const { data: { result, ok } } = await this.$axios.get(`${process.env.BASE_URL}${process.env.WORKNET_REFERRAL_URL}referrals`, currConfig);

      if (result.referrals.length) {
        commit('setReferralsList', result.referrals);
      }

      return ok;
    } catch (e) {
      return false;
    }
  },
};
