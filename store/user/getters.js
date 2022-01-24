export default {
  isAuth: (state) => !!(state.tokens.access && state.tokens.refresh),
  accessToken: (state) => state.tokens.access,
  refreshToken: (state) => state.tokens.refresh,
  getUserData: (state) => state.userData,
  getUserWalletAddress: (state) => state.userData?.wallet?.address,
  getStatus2FA: (state) => state.userData?.statusKYC,
  getAnotherUserData: (state) => state.anotherUserData,
  editUserData: (state) => state.userData || '',
  getAdditionalInfo: (state) => state.userData?.additionalInfo?.socialNetwork || '',
  getAdditionalInfoInstagram: (state) => state.userData?.additionalInfo?.socialNetwork?.instagram || '',
  getUserRole: (state) => state.userData?.role,
  getUserCurrentPosition: (state) => state.currentUserPosition || null,
  getImageData: (state) => state.userData?.avatar?.url || null,
  getFirstName: (state) => state.userData?.firstName || '',
  getLastName: (state) => state.userData?.lastName || '',
  getUserCompany: (state) => state.userData?.additionalInfo?.company || '',
  getUserDesc: (state) => state.userData?.additionalInfo?.description || '',
  getUserEducations: (state) => state.userData?.additionalInfo?.educations || '',
  getUserAddress: (state) => state.userData?.additionalInfo?.address || '',
  getUserSecondMobileNumber: (state) => state.userData?.additionalInfo?.secondMobileNumber || '',
  getUserEmail: (state) => state.userData?.email || '',
  getUserCEO: (state) => state.userData?.additionalInfo?.CEO || '',
  getUserWebsite: (state) => state.userData?.additionalInfo?.website || '',
  getUserInstagram: (state) => state.userData?.additionalInfo?.socialNetwork?.instagram || '',
  getUserTwitter: (state) => state.userData?.additionalInfo?.socialNetwork?.twitter || '',
  getUserFacebook: (state) => state.userData?.additionalInfo?.socialNetwork?.facebook || '',
  getUserPortfolios: (state) => state.portfolios,
  getUserPortfolio: (state) => state.medias || '',
  getAllUserReviews: (state) => state.userReviews || '',
  getUser2FA: (state) => state.userEnable2FA || '',
  getUnreadChatsCount: (state) => state.unreadChatsCount,
  getUnreadNotifsCount: (state) => state.unreadNotifsCount,
  getNotificationsList: (state) => state.notifications.list,
  getNotificationsCount: (state) => state.notifications.count,
  getReducedNotifications: (state) => state.reducedNotifications,

};
