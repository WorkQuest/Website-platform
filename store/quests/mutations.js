export default {
  setCurrentStepEditQuest(state, data) {
    state.currentStepEditQuest = data;
  },
  setCurrentStepCreateQuest(state, data) {
    state.currentStepCreateQuest = data;
  },
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
  setMapBounds(state, data) {
    state.mapBounds = data;
  },
  setMapCenter(state, data) {
    state.mapCenter = data;
  },
};
