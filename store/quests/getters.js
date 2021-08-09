export default {

  // Replaced
  getUserInfoQuests: (state) => state.userInfoQuests || '',
  getAllQuests: (state) => state.allQuests || '',
  getQuest: (state) => state.quest || '',
  getQuestUser: (state) => state.quest?.user || '',
  getQuestUserAvatar: (state) => state.quest?.user?.avatar.url || '',
  getQuestUserCompany: (state) => state.quest?.user?.additionalInfo?.company || '',
  getQuestsLocation: (state) => state.questsLocation || '',
  // Experimental
};
