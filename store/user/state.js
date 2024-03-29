export default () => ({
  currentLang: '',
  twoFACode: '',
  twoFAPassed: false,
  verificationCode: '',
  tokens: {
    access: null,
    refresh: null,
  },
  userData: {
    statusKYC: false,
    id: '',
    avatarId: '',
    firstName: '',
    lastName: '',
    phone: {
      codeRegion: '',
      phone: '',
      fullPhone: '',
    },
    tempPhone: {
      codeRegion: '',
      phone: '',
      fullPhone: '',
    },
    email: '',
    role: '',
    location: {
      longitude: null,
      latitude: null,
    },
    wagePerHour: '',
    additionalInfo: {
      firstMobileNumber: {
        codeRegion: '',
        phone: '',
        fullPhone: '',
      },
      secondMobileNumber: {
        codeRegion: '',
        phone: '',
        fullPhone: '',
      },
      address: '',
      socialNetwork: {
        instagram: '',
        twitter: '',
        linkedin: '',
        facebook: '',
      },
      description: '',
      company: '',
      CEO: '',
      website: '',
      skills: [],
      educations: [],
      workExperiences: [],
      wallet: { address: null },
    },
    avatar: {
      id: '',
      url: '',
      contentType: '',
    },
    ratingStatistic: {
      id: '',
      userId: '',
      reviewCount: 0,
      averageMark: 0,
      status: null,
    },
    questsStatistic: {
      completed: 0,
      opened: 0,
    },
    userSpecializations: [],
    affiliateUser: {
      referralCodeId: '',
    },
  },
  currentUserPosition: null,
  userRole: {},
  imageLink: {},
  secretKey: '',
  confirmCode: '',
  totp: '',
  portfolios: {
    count: 0,
  },
  portfolio: {},
  medias: [],
  userReviews: {},
  userEnable2FA: {},
  userDisable2FA: {},
  user2FA: false,
  anotherUserData: {
    avatar: { url: '' },
    additionalInfo: {
      company: '',
      address: '',
      description: '',
      secondMobileNumber: { fullNumber: '' },
      educations: { length: 0 },
      workExperiences: { length: 0 },
    },
    phone: { fullNumber: '' },
    tempPhone: { fullNumber: '' },
    questsStatistic: { opened: 0 },
    ratingStatistic: { averageMark: 0, reviewCount: 0 },
    role: 'employer',
  },
  statisticData: {
    chatsStatistic: null,
    questsStatistic: null,
    ratingStatistic: null,
  },
  unreadChatsCount: 0,
  unreadNotifsCount: 0,
  notifications: {
    list: [],
    count: 0,
  },
  reducedNotifications: [],
});
