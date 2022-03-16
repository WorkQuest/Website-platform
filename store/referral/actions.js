import {
  getStyledAmount,
  GetWalletProvider,
} from '~/utils/wallet';
import {
  fetchContractData,
} from '~/utils/web3';
import * as abi from '~/abi/abi';

export default {
  async fetchRewardBalance({ commit }) {
    const res = await fetchContractData(
      'referralBonus',
      abi.WQReferral,
      process.env.WORKNET_REFERRAL,
      [],
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
