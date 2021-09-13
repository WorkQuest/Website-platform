export default {
  getUserInfoQuests: (state) => state.userInfoQuests || '',
  getAllQuests: (state) => state.allQuests || '',
  getQuest: (state) => state.quest || '',
  getQuestUser: (state) => state.quest?.user || '',
  getQuestUserAvatar: (state) => state.quest?.user?.avatar.url || '',
  getQuestUserCompany: (state) => state.quest?.user?.additionalInfo?.company || '',
  getQuestsLocation: (state) => state.questsLocation || '',
  getCurrentStepEditQuest: (state) => state.currentStepEditQuest || '',
  getCurrentStepCreateQuest: (state) => state.currentStepCreateQuest || '',
  getMapBounds: (state) => state.mapBounds || '',
  getMapCenter: (state) => state.mapCenter || '',
};
