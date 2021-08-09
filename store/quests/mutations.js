export default {
  setAllQuests(state, data) {
    state.allQuests = data;
  },
  setUserQuests(state, data) {
    state.userInfoQuests = data;
  },

  setQuestData(state, data) {
    state.questData = data;
  },
  setStarredQuests(state, data) {
    state.starredQuests = data;
  },
  setResponses(state, data) {
    state.responses = data;
  },
  setResponsesMy(state, data) {
    state.responsesMy = data;
  },
};
