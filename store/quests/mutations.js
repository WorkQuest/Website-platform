export default {
  setRespondOnQuest(state, data) {
    state.respondOnQuest = data;
  },
  setChatInviteOnQuest(state, data) {
    state.chatInfoInviteOnQuest = data;
  },
  setQuestListForInvitation(state, data) {
    state.questListForInvitation = data;
  },
  setEmployeeList(state, { count, users }) {
    state.employeeList = users;
    state.employeeCount = count;
  },
  setCurrentWorker(state, data) {
    state.currentWorker = data;
  },
  setInfoDataMode(state, data) {
    state.infoDataMode = data;
  },
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
  setResponses(state, { result, responded, invited }) {
    state.responses = result;
    state.responded = responded;
    state.invited = invited;
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
  setFilters(state, data) {
    state.filters = data;
  },
  setSelectedSpecializationsFilters(state, data) {
    state.selectedSpecializationsFilters = data;
  },
  setSelectedPriceFilter(state, data) {
    state.selectedPriceFilter = data;
  },
};
