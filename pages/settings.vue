<template>
  <div
    class="settings"
    data-selector="PAGE-SETTINGS"
  >
    <div class="settings__title">
      {{ $t('meta.settings') }}
    </div>
    <ValidationObserver
      ref="settings"
      class="settings__body"
      tag="div"
    >
      <verification-card v-if="userData.statusKYC === 0" />
      <profile
        :profile="profile"
        :new-education="newEducation"
        :new-work-exp="newWorkExp"
        :avatar-change="avatarChange"
        :validation-error="validationError"
        :is-valid-phone-number="isValidPhoneNumber"
        :is-valid-second-phone-number="isValidSecondPhoneNumber"
        @click="editUserData"
        @updateFirstPhone="updateFirstPhone($event)"
        @updateSecondPhone="updateSecondPhone($event)"
        @showModalStatus="showModalStatus"
        @checkValidate="checkValidate"
        @updateEducation="addEducation"
        @updateFullAddress="updateFullAddress"
        @validationRef="validationRefs"
      />
      <skills
        v-if="userRole === $options.UserRole.WORKER"
        :skills="skills"
        :validation-error="validationError"
        @click="editUserData"
        @checkValidate="checkValidate"
        @updateSelectedSkills="updateSelectedSkills"
      />
      <advanced
        id="2FA"
        @updateVisibility="updateVisibility($event)"
        @showModalKey="showModalKey"
      />
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import VerificationCard from '~/components/app/pages/settings/VerificationCard.vue';
import Profile from '~/components/app/pages/settings/Profile.vue';
import Skills from '~/components/app/pages/settings/Skills.vue';
import Advanced from '~/components/app/pages/settings/Advanced.vue';
import {
  PayPeriodsIndex, RatingStatus, UserRole, WorkplaceIndex,
} from '~/utils/enums';
import { LocalNotificationAction } from '~/utils/notifications';
import { images } from '~/utils/images';
import { prepareProfileData, getProfileSkills, checkIfFieldsChanged } from './settings/utils';
import { initialProfileState } from './settings/constants';

export default {
  name: 'Settings',
  UserRole,
  components: {
    VerificationCard, Profile, Skills, Advanced,
  },
  data() {
    return initialProfileState;
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      accessToken: 'sumsub/getSumSubBackendToken',
      filters: 'quests/getFilters',
      secondNumber: 'user/getUserSecondMobileNumber',
      localNotifications: 'notifications/getLocalNotifications',
    }),
    isEmployer() {
      return this.userRole === UserRole.EMPLOYER;
    },
    isDont2FAToEdit() {
      return this.userData?.neverEditedProfileFlag;
    },
  },
  async mounted() {
    this.SetLoader(true);
    if (!this.filters) await this.$store.dispatch('quests/getFilters');
    if (!this.profile.firstName) await this.$store.dispatch('user/getUserData');
    const addInfo = this.userData.additionalInfo;
    const { userData, secondNumber, scrollToId } = this;
    scrollToId();
    const { employerProfileVisibilitySetting, workerProfileVisibilitySetting } = userData;
    this.prevSkills = userData.userSpecializations?.map((item) => item.path) || [];
    this.profile = prepareProfileData(userData, secondNumber, addInfo);

    this.skills = getProfileSkills(userData);

    if (this.isEmployer && employerProfileVisibilitySetting) {
      const { arrayRatingStatusCanRespondToQuest, arrayRatingStatusInMySearch } = employerProfileVisibilitySetting;
      this.profileVisibilitySetting = {
        ratingStatusCanRespondToQuest: arrayRatingStatusCanRespondToQuest,
        ratingStatusInMySearch: arrayRatingStatusInMySearch,
      };
    } else if (workerProfileVisibilitySetting) {
      const { arrayRatingStatusCanInviteMeOnQuest, arrayRatingStatusInMySearch } = workerProfileVisibilitySetting;
      this.profileVisibilitySetting = {
        ratingStatusCanInviteMeOnQuest: arrayRatingStatusCanInviteMeOnQuest,
        ratingStatusInMySearch: arrayRatingStatusInMySearch,
      };
    }
    this.SetLoader(false);

    this.$root.$on('roleChanged', async () => {
      this.SetLoader(true);
      await this.$store.dispatch('user/getUserData');
      this.SetLoader(false);
    });

    if (this.isDont2FAToEdit) {
      this.ShowModal({
        key: modals.status,
        img: images.WARNING,
        title: this.$t('modals.titles.attention'),
        subtitle: this.$t('settings.2faInfo'),
      });
    }
  },
  methods: {
    scrollToId() {
      if (this.$route.hash) {
        const id = this.$route.hash.slice(1);
        const element = document.getElementById(id);
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    validationRefs(data) {
      this.valRefs = data;
      return this.valRefs;
    },
    updateFullAddress(address) {
      this.isChanged = true;
      this.profile.locationFull.location.longitude = +address.lng;
      this.profile.locationFull.location.latitude = +address.lat;
      this.profile.locationFull.locationPlaceName = address.formatted;
    },
    updateSelectedSkills(specAndSkills) {
      this.isChanged = true;
      this.skills.selectedSpecAndSkills = specAndSkills;
    },

    // MODALS METHODS
    addEducation(knowledge, data) {
      this.isChanged = true;
      const { educations, workExperiences } = this.profile.additionalInfo;
      if (knowledge === 'newEducation') {
        this.newEducation = [];
        this.newEducation.push({ ...data });
        this.profile.additionalInfo.educations = educations.concat(this.newEducation);
      } else {
        this.newWorkExp = [];
        this.newWorkExp.push({ ...data });
        this.profile.additionalInfo.workExperiences = workExperiences.concat(this.newWorkExp);
      }
    },
    modalsStatusTitle(modalMode) {
      const titles = {
        enterPhoneNumber: this.$t('settings.enterPhoneNumber'),
        enterCurrentLocation: this.$t('settings.enterCurrentLocation'),
        imageLoadedSuccessful: this.$t('modals.imageLoadedSuccessful'),
        educationAddSuccessful: this.$t('modals.educationAddSuccessful'),
        workExpAddSuccessful: this.$t('modals.workExpAddSuccessful'),
        saved: this.$t('modals.titles.saved'),
        error: this.$t('modals.errors.error'),
      };
      return titles[modalMode];
    },
    modalsStatusSubtitles(modalMode) {
      const subtitles = {
        enterPhoneNumber: this.$t('modals.pressSaveBtn'),
        enterCurrentLocation: this.$t('modals.pressSaveBtn'),
        imageLoadedSuccessful: this.$t('modals.pressSaveBtn'),
        educationAddSuccessful: this.$t('modals.pressSaveBtn'),
        workExpAddSuccessful: this.$t('modals.pressSaveBtn'),
        saved: this.$t('modals.userDataHasBeenSaved'),
        error: this.$t('modals.errors.error'),
      };
      return subtitles[modalMode];
    },
    modalsKey(modalKey) {
      const keys = {
        disable2FA: modals.disable2FA,
        chooseNecessarySkills: modals.chooseNecessarySkills,
        changePassInSettings: modals.changePassInSettings,
        twoFAAuth: modals.twoFAAuth,
        smsVerification: modals.smsVerification,
        changeRoleWarning: modals.changeRoleWarning,
        neededToEnable2FA: modals.neededToEnable2FA,
      };
      return keys[modalKey];
    },
    showModalKey(modalKey) {
      this.isChanged = true;
      this.ShowModal({ key: this.modalsKey(modalKey) });
    },
    showModalStatus(modalMode, msg) {
      this.ShowModal({
        key: modals.status,
        img: require(`~/assets/img/ui/${modalMode === 'error' ? 'error' : 'questAgreed'}.svg`),
        title: this.modalsStatusTitle(modalMode),
        subtitle: msg || this.modalsStatusSubtitles(modalMode),
      });
    },

    // UPDATE PHONE
    updateFirstPhone(value) {
      this.isValidPhoneNumber = value.isValid;
      this.updatedFirstPhone = {
        phone: value?.nationalNumber || null,
        fullPhone: value?.formatInternational ? value.formatInternational.replace(/\s/g, '') : null,
        codeRegion: value?.countryCode || null,
      };
    },

    updateSecondPhone(value) {
      this.isValidSecondPhoneNumber = !value.nationalNumber || value.isValid;
      this.updatedSecondPhone = {
        phone: value?.nationalNumber || null,
        fullPhone: value?.formatInternational ? value.formatInternational.replace(/\s/g, '') : null,
        codeRegion: value?.countryCode || null,
      };
    },

    // UPDATE USER INFO METHODS
    async editUserData() {
      if (await this.checkValidate()) {
        this.validationError = true;
        return;
      }

      // check changed fields
      this.checkChangedFields();
      if (!this.isChanged) return;

      const editProfile = async (securityCode) => {
        const checkAvatarID = this.avatarChange.data.ok ? this.avatarChange.data.result.mediaId : this.userData.avatarId;
        const firstMobileNumber = +this.updatedFirstPhone.fullPhone;
        await this.setAvatar();
        if (firstMobileNumber) await this.editProfile(checkAvatarID, securityCode);
        if (!firstMobileNumber) this.showModalStatus('enterPhoneNumber');
      };

      if (this.isDont2FAToEdit) {
        await editProfile();
        return;
      }
      if (!this.userData.totpIsActive) {
        this.ShowModal({ key: modals.neededToEnable2FA });
        return;
      }
      this.ShowModal({
        key: modals.securityCheck,
        isOnlySubmit: true,
        actionMethod: async (securityCode) => await editProfile(securityCode),
      });

      // return to initial value
      this.isChanged = false;
    },

    checkChangedFields() {
      const isMainFieldsChanged = checkIfFieldsChanged(this.userData, this.profile, this.skills);

      if (isMainFieldsChanged) {
        this.isChanged = true;
        return;
      }

      Object.values(this.updatedSecondPhone).forEach((item) => {
        this.isChanged = !!item;
      });

      if (this.isChanged) return;

      this.isChanged = Object.keys({ ...this.updatedFirstPhone, ...this.userData.tempPhone })
        .some((key) => this.updatedFirstPhone?.[key] !== this.userData.phone?.[key])
        || Object.keys({ ...this.userData.additionalInfo.socialNetwork, ...this.profile.additionalInfo.socialNetwork })
          .some((key) => this.userData.additionalInfo.socialNetwork[key] !== this.profile.additionalInfo.socialNetwork[key]);
    },

    async updateVisibility({ visibilityUser, restrictionRankingStatus }) {
      this.isChanged = true;
      const formatWithDefaultVal = (arr) => (arr.length === 0 ? [RatingStatus.AllStatuses] : arr);
      this.profileVisibilitySetting[this.isEmployer
        ? 'ratingStatusCanRespondToQuest'
        : 'ratingStatusCanInviteMeOnQuest'
      ] = formatWithDefaultVal(visibilityUser);
      this.profileVisibilitySetting.ratingStatusInMySearch = formatWithDefaultVal(restrictionRankingStatus);
    },
    async checkValidate() {
      const validateEducation = this.isEmployer ? true : await this.validateKnowledge('education',
        this.newEducation.length > 0 ? this.newEducation : 'validated');
      const validateWorkExp = this.isEmployer ? true : await this.validateKnowledge('work',
        this.newWorkExp.length > 0 ? this.newWorkExp : 'validated');
      const validateSettings = await this.$refs.settings.validate();
      if (!validateSettings || !validateEducation || !validateWorkExp || !this.isValidPhoneNumber || !this.isValidSecondPhoneNumber) return true;
      this.validationError = false;
      return false;
    },

    async validateKnowledge(observerName, value) {
      if (value === 'validated') return true;
      const isDirty = Object.keys(value).some((field) => value[field] !== '' && value[field] !== null);
      if (observerName === 'education' && isDirty) return this.valRefs.education.validate();
      if (observerName === 'work' && isDirty) return this.valRefs.work.validate();
      return false;
    },

    async setAvatar() {
      const formData = new FormData();
      formData.append('image', this.avatarChange.file);
      if (this.avatarChange.data.ok) {
        await this.$store.dispatch('user/setImage', {
          url: this.avatarChange.data.result.url,
          formData: this.avatarChange.file,
          type: this.avatarChange.file.type,
        });
      }
    },

    async editProfile(checkAvatarID, securityCode) {
      const addInfo = this.profile.additionalInfo;
      const {
        instagram, twitter, linkedin, facebook,
      } = addInfo.socialNetwork;
      const payload = {
        totpCode: undefined,
        avatarId: checkAvatarID,
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        phoneNumber: {
          codeRegion: this.updatedFirstPhone.codeRegion || null,
          phone: this.updatedFirstPhone.phone || null,
          fullPhone: this.updatedFirstPhone.fullPhone || null,
        },
        locationFull: {
          location: {
            longitude: this.profile.locationFull.location?.longitude || this.userData.location?.longitude,
            latitude: this.profile.locationFull.location?.latitude || this.userData.location?.latitude,
          },
          locationPlaceName: this.profile.locationFull.locationPlaceName || this.userData.locationPlaceName,
        },
        additionalInfo: {
          secondMobileNumber: {
            codeRegion: this.updatedSecondPhone?.codeRegion ? this.updatedSecondPhone?.codeRegion : null,
            phone: this.updatedSecondPhone?.phone ? this.updatedSecondPhone?.phone : null,
            fullPhone: this.updatedSecondPhone?.fullPhone ? this.updatedSecondPhone?.fullPhone : null,
          },
          socialNetwork: {
            instagram: instagram || null,
            twitter: twitter || null,
            linkedin: linkedin || null,
            facebook: facebook || null,
          },
        },
        profileVisibility: { ...this.profileVisibilitySetting },
      };
      if (!this.updatedSecondPhone.fullPhone) payload.additionalInfo.secondMobileNumber = null;

      if (this.isEmployer) await this.editEmployerData(payload, addInfo, securityCode);
      else await this.editWorkerData(payload, addInfo, securityCode);
      // TODO del after fixes on back, need to check that all updated info is came
      await this.$store.dispatch('user/getUserData');
    },

    async editEmployerData(payload, addInfo, securityCode) {
      const { ok, msg } = await this.$store.dispatch('user/editEmployerData', {
        totpCode: securityCode,
        profile: {
          ...payload,
          additionalInfo: {
            ...payload.additionalInfo,
            description: addInfo.description || null,
            company: addInfo.company || null,
            CEO: addInfo.CEO || null,
            website: addInfo.website || null,
          },
        },
      });

      this.showModalStatus(ok ? 'saved' : 'error', msg);
    },

    async editWorkerData(payload, addInfo, securityCode) {
      const { ok, msg } = await this.$store.dispatch('user/editWorkerData', {
        totpCode: securityCode,
        profile: {
          ...payload,
          additionalInfo: {
            ...payload.additionalInfo,
            educations: addInfo.educations,
            workExperiences: addInfo.workExperiences,
            description: addInfo.description || null,
          },
          workplace: WorkplaceIndex[this.skills.distantIndex] || null,
          payPeriod: PayPeriodsIndex[this.skills.payPeriodIndex] || this.userData.payPeriod,
          priority: this.skills.priorityIndex,
          costPerHour: this.skills.perHour || this.userData.costPerHour,
          specializationKeys: this.skills.selectedSpecAndSkills || [],
        },
      });

      this.showModalStatus(ok ? 'saved' : 'error', msg);

      // Notification: offers by selected new skills
      if (!this.EqualsArrays(this.skills.selectedSpecAndSkills, this.prevSkills)) {
        await this.$store.dispatch('notifications/createLocalNotification', {
          message: this.$t('ui.notifications.viewOffersBySpecs'),
          actionBtn: this.$t('meta.btns.view'),
          action: LocalNotificationAction.QUESTS_SPECS,
        });
      }
    },

  },
};
</script>

<style lang="scss" scoped>
.settings {
  @include main;
    display: grid;
    justify-items: center;
    grid-template-columns: 1fr;
    gap: 20px;
    margin: 20px 0 41px;
  &__title {
    max-width: 1180px;
    width: 100%;
    font-family: Inter, Arial, sans-serif;
    font-weight: 500;
    font-size: 25px;
    line-height: 32px;
    color: $black800;
  }
  &__body {
    display: grid;
    gap: 20px;
  }
}
@include _1199 {
  .settings {
    margin: 20px 20px 41px;
  }
}
@include _575 {
  .settings {
    margin: 20px 0 41px;
    width: 100%;
  }
}
</style>
