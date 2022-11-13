export const initialProfileState = {
  profile: {
    avatarId: null,
    firstName: null,
    lastName: null,
    skillFilters: null,
    firstPhone: { codeRegion: null, phone: null, fullPhone: null },
    tempPhone: { codeRegion: null, phone: null, fullPhone: null },
    additionalInfo: {
      secondMobileNumber: { codeRegion: null, phone: null, fullPhone: null },
      address: null,
      socialNetwork: {
        instagram: null,
        twitter: null,
        linkedin: null,
        facebook: null,
      },
      description: null,
      skills: [],
      educations: [],
      workExperiences: [],
      CEO: null,
      company: null,
      website: null,
    },
    locationFull: {
      location: {
        longitude: 0,
        latitude: 0,
      },
      locationPlaceName: '',
    },
  },
  skills: {
    perHour: 0,
    priorityIndex: -1,
    distantIndex: -1,
    payPeriodIndex: -1,
    selectedSpecAndSkills: null,
  },
  avatarChange: { data: {}, file: {} },
  updatedSecondPhone: { codeRegion: null, phone: null, fullPhone: null },
  updatedFirstPhone: { codeRegion: null, phone: null, fullPhone: null },
  validationError: false,
  isValidPhoneNumber: true,
  isValidSecondPhoneNumber: true,
  newEducation: [],
  newWorkExp: [],
  valRefs: {},
  profileVisibilitySetting: {},

  prevSkills: [],
  isChanged: false,
};

export default { initialProfileState };
