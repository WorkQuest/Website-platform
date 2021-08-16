export default {

  // Replaced
  setAllQuests(state, data) {
    state.allQuests = data;
  },
  setQuest(state, data) {
    state.quest = data;
  },
  setUserQuests(state, data) {
    state.userInfoQuests = data;
  },
  setQuestsLocation(state, data) {
    state.questsLocation = data;
  },

  // Experimental
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
