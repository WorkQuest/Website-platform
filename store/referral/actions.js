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
};
