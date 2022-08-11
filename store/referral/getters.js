export default {
  getReferralReward: (state) => state.referralReward,
  getPaidEventsList: (state) => state.paidEventsList,
  getReferralsList: (state) => state.referralsList,
  getReferralsListCount: (state) => state.referralsListCount,
  getUnregisteredReferralsList: (state) => state.unregisteredReferralsList,
  getUnregisteredReferralsCount: (state) => state.unregisteredReferralsCount,
  getCreatedReferralList: (state) => state.createdReferralList,
  getReferralSignature: (state) => state.referralSignature,
  getCurrentPage: (state) => state.currentPage,
};
