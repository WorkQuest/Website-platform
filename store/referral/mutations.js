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
  addReferralsList(state, list) {
    state.referralsList = [
      ...state.referralsList,
      ...list,
    ];
  },
  setUnregisteredReferralsCount(state, count) {
    state.unregisteredReferralsCount = count;
  },
  setUnregisteredReferralsList(state, list) {
    state.unregisteredReferralsList = list;
  },
  addUnregisteredReferralsList(state, list) {
    state.unregisteredReferralsList = [
      ...state.unregisteredReferralsList,
      ...list,
    ];
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
};
