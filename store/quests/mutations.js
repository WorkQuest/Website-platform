export default {
  setRespondOnQuest(state, data) {
    state.respondOnQuest = data;
  },
  setChatInviteOnQuest(state, data) {
    state.chatInfoInviteOnQuest = data;
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
  setQuestData(state, data) {
    state.questData = data;
  },
  setStarredQuests(state, data) {
    state.starredQuests = data;
  },
  setResponses(state, { responded, invited }) {
    state.responded = responded;
    state.invited = invited;
  },
  setResponseToQuest(state, { responded, invited }) {
    if (responded) state.responded.push(responded);
    if (invited) state.invited.push(invited);
  },
  setResponsesMy(state, data) {
    state.responsesMy = data;
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
  setAvailableQuests(state, data) {
    state.availableQuests = data;
  },
  setMarkOnQuestInList(state, result) {
    state.allQuests.quests.forEach((item) => {
      if (item.id === result.questId) item.yourReview = result;
    });
  },
  setMarkOnQuestSingle(state, result) {
    state.quest.yourReview = result;
  },
};
