export default {
  getChatInfoInviteOnQuest: (state) => state.chatInfoInviteOnQuest,
  getQuestListForInvitation: (state) => state.questListForInvitation || {},
  getWorkersList: (state) => state.workersList,
  getCurrentWorker: (state) => state.currentWorker,
  getUserSpecializations: (state) => state.currentWorker?.userSpecializations,
  getQuestsStatistic: (state) => state.currentWorker?.questsStatistic,
  getRatingStatistic: (state) => state.currentWorker?.ratingStatistic,
  getCurrentWorkerAddInfo: (state) => state.currentWorker.additionalInfo || {},
  getInfoDataMode: (state) => state.infoDataMode || '',
  getUserInfoQuests: (state) => state.userInfoQuests || '',
  getAllQuests: (state) => state.allQuests || '',
  getQuest: (state) => state.quest || '',
  getQuestUser: (state) => state.quest?.user || '',
  getQuestUserAvatar: (state) => state.quest?.user?.avatar?.url || null,
  getQuestUserCompany: (state) => state.quest?.user?.additionalInfo?.company || '',
  getQuestsLocation: (state) => state.questsLocation || '',
  getCurrentStepEditQuest: (state) => state.currentStepEditQuest || '',
  getCurrentStepCreateQuest: (state) => state.currentStepCreateQuest || '',
  getMapBounds: (state) => state.mapBounds,
  getMapCenter: (state) => state.mapCenter || '',
  getResponsesToQuest: (state) => state.responses.responses || '',
  getResponsesData: (state) => state.responses || '',
  getResponsesMy: (state) => state.responsesMy || '',
  getRespondOnQuest: (state) => state.respondOnQuest,
  getFilters: (state) => state.filters,
  getSelectedSpecializationsFilters: (state) => state.selectedSpecializationsFilters,
  getSelectedPriceFilter: (state) => state.selectedPriceFilter,
};
