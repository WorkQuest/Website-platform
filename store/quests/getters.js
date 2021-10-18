export default {
  getWorkersList: (state) => state.workersList || {},
  getCurrentWorker: (state) => state.currentWorker || {},
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
  getMapBounds: (state) => state.mapBounds || '',
  getMapCenter: (state) => state.mapCenter || '',
  getResponsesToQuest: (state) => state.responses.responses || '',
  getResponsesData: (state) => state.responses || '',
  getResponsesMy: (state) => state.responsesMy || '',
};
