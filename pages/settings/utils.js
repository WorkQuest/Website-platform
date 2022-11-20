import { PayPeriodsIndex, WorkplaceIndex } from '~/utils/enums';

export const getProfileSkills = (userData) => ({
  perHour: userData.costPerHour,
  priorityIndex: userData.priority,
  distantIndex: WorkplaceIndex.indexOf(userData.workplace),
  payPeriodIndex: PayPeriodsIndex.indexOf(userData.payPeriod),
  selectedSpecAndSkills: userData?.userSpecializations || [],
});

export const prepareProfileData = (userData, secondNumber, addInfo) => ({
  avatarId: userData.avatarId,
  firstName: userData.firstName,
  lastName: userData.lastName,
  email: userData.email,
  firstPhone: {
    codeRegion: userData.phone?.codeRegion || userData.tempPhone?.codeRegion,
    phone: userData.phone?.phone || userData.tempPhone?.phone,
    fullPhone: userData.phone?.fullPhone || userData.tempPhone?.fullPhone,
  },
  additionalInfo: {
    secondMobileNumber: {
      codeRegion: secondNumber?.codeRegion || null,
      phone: secondNumber?.phone || null,
      fullPhone: secondNumber?.fullPhone || null,
    },
    socialNetwork: {
      instagram: addInfo.socialNetwork.instagram,
      twitter: addInfo.socialNetwork.twitter,
      linkedin: addInfo.socialNetwork.linkedin,
      facebook: addInfo.socialNetwork.facebook,
    },
    description: addInfo.description,
    skills: getProfileSkills(userData),
    educations: addInfo.educations ? addInfo.educations.slice() : [],
    workExperiences: addInfo.workExperiences ? addInfo.workExperiences.slice() : [],
    CEO: addInfo.CEO,
    company: addInfo.company,
    website: addInfo.website,
  },
  locationFull: {
    location: {
      longitude: userData.location?.longitude || 0,
      latitude: userData.location?.latitude || 0,
    },
    locationPlaceName: userData.locationPlaceName,
  },
});

export const checkIfFieldsChanged = (userData, profile, skills) => userData.firstName !== profile.firstName
  || userData.lastName !== profile.lastName
  || userData.additionalInfo.description !== profile.additionalInfo.description
  || userData.locationPlaceName !== profile.locationFull.locationPlaceName
  || userData.additionalInfo.educations?.length !== profile.additionalInfo.educations?.length
  || userData.additionalInfo.workExperiences?.length !== profile.additionalInfo.workExperiences?.length
  || skills.distantIndex !== profile.additionalInfo.skills.distantIndex
  || skills.payPeriodIndex !== profile.additionalInfo.skills.payPeriodIndex
  || skills.priorityIndex !== profile.additionalInfo.skills.priorityIndex
  || skills.perHour !== profile.additionalInfo.skills.perHour
  || skills.selectedSpecAndSkills?.length !== profile.additionalInfo.skills?.selectedSpecAndSkills?.length
  || userData.additionalInfo.company !== profile.additionalInfo.company
  || userData.additionalInfo.CEO !== profile.additionalInfo.CEO
  || userData.additionalInfo.website !== profile.additionalInfo.website;

export default { prepareProfileData, getProfileSkills, checkIfFieldsChanged };
