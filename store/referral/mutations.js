export default {
  setReferralReward(state, reward) {
    state.referralReward = reward;
  },
  setPaidEventsList(state, events) {
    state.paidEventsList = events;
  },
  setReferralsList(state, list) {
    state.referralsList = list;
  },
  setReferralsListCount(state, count) {
    state.referralsListCount = count;
  },
  setCreatedReferralList(state, list) {
    state.createdReferralList = list;
  },
  setReferralSignature(state, signature) {
    state.referralSignature = signature;
  },
  setCurrentPage(state, page) {
    state.currentPage = page;
  },
  setIsNeedRegistration(state, boolean) {
    state.isNeedRegistration = boolean;
  },
};
