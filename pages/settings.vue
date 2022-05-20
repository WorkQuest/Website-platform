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

export default {
  name: 'Settings',
  UserRole,
  components: {
    VerificationCard, Profile, Skills, Advanced,
  },
  data() {
    return {
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
    };
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
    WorkplaceIndex() {
      return WorkplaceIndex;
    },
    isEmployer() {
      return this.userRole === UserRole.EMPLOYER;
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
    this.profile = {
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
        skills: addInfo.skills,
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
    };
    this.skills = {
      priorityIndex: userData.priority,
      distantIndex: WorkplaceIndex.indexOf(userData.workplace),
      payPeriodIndex: PayPeriodsIndex.indexOf(userData.payPeriod),
      perHour: userData.costPerHour,
      selectedSpecAndSkills: userData.userSpecializations || [],
    };

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
      this.profile.locationFull.location.longitude = +address.lng;
      this.profile.locationFull.location.latitude = +address.lat;
      this.profile.locationFull.locationPlaceName = address.formatted;
    },

    // MODALS METHODS
    addEducation(knowledge, data) {
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
      this.ShowModal({ key: this.modalsKey(modalKey) });
    },
    showModalStatus(modalMode) {
      this.ShowModal({
        key: modals.status,
        img: require(`~/assets/img/ui/${modalMode === 'error' ? 'error' : 'questAgreed'}.svg`),
        title: this.modalsStatusTitle(modalMode),
        subtitle: this.modalsStatusSubtitles(modalMode),
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
      const checkAvatarID = this.avatarChange.data.ok ? this.avatarChange.data.result.mediaId : this.userData.avatarId;
      const firstMobileNumber = +this.updatedFirstPhone.fullPhone;
      await this.setAvatar();
      if (firstMobileNumber) await this.editProfile(checkAvatarID);
      if (!firstMobileNumber) this.showModalStatus('enterPhoneNumber');
    },

    async updateVisibility({ visibilityUser, restrictionRankingStatus }) {
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

    editProfileRoute() {
      return this.isEmployer ? 'editEmployerData' : 'editWorkerData';
    },

    async editProfile(checkAvatarID) {
      const addInfo = this.profile.additionalInfo;
      const {
        instagram, twitter, linkedin, facebook,
      } = addInfo.socialNetwork;
      const payload = {
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
      await this.editProfileResponse(`user/${this.editProfileRoute()}`, !this.isEmployer ? {
        ...payload,
        additionalInfo: {
          ...payload.additionalInfo,
          educations: addInfo.educations,
          workExperiences: addInfo.workExperiences,
          description: addInfo.description || null,
        },
        workplace: WorkplaceIndex[this.skills.distantIndex],
        payPeriod: PayPeriodsIndex[this.skills.payPeriodIndex] || this.userData.payPeriod,
        priority: this.skills.priorityIndex,
        costPerHour: this.skills.perHour || this.userData.costPerHour,
        specializationKeys: this.skills.selectedSpecAndSkills || [],
      } : {
        ...payload,
        additionalInfo: {
          ...payload.additionalInfo,
          description: addInfo.description || null,
          company: addInfo.company || null,
          CEO: addInfo.CEO || null,
          website: addInfo.website || null,
        },
      });
      await this.$store.dispatch('user/getUserData');
    },

    async editProfileResponse(action, payload) {
      const result = await this.$store.dispatch(action, payload);
      this.showModalStatus(result ? 'saved' : 'error');
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
