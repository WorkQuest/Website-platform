<template>
  <div class="settings">
    <div class="settings__title">
      {{ $t('settings.settings') }}
    </div>
    <ValidationObserver
      ref="settings"
      class="settings__body"
      tag="div"
    >
      <verification-card v-if="userRole === 'worker' && isShowInfo === true" />
      <profile
        :profile="profile"
        :new-education="newEducation"
        :new-work-exp="newWorkExp"
        :avatar-change="avatarChange"
        :validation-error="validationError"
        :is-valid-phone-number="isValidPhoneNumber"
        @click="editUserData"
        @updateSecondPhone="updateSecondPhone($event)"
        @showModalStatus="showModalStatus"
        @checkValidate="checkValidate"
        @updateEducation="addEducation"
      />
      <skills
        v-if="userRole === 'worker'"
        :skills="skills"
        :validation-error="validationError"
        @click="editUserData"
        @checkValidate="checkValidate"
      />
      <advanced @showModalKey="showModalKey" />
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

export default {
  name: 'Settings',
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
        firstPhone: null,
        tempPhone: { codeRegion: null, phone: null, fullPhone: null },
        additionalInfo: {
          secondMobileNumber: { codeRegion: null, phone: null, fullPhone: null },
          address: null,
          socialNetwork: {
            instagram: null, twitter: null, linkedin: null, facebook: null,
          },
          description: null,
          skills: [],
          educations: [],
          workExperiences: [],
          CEO: null,
          company: null,
          website: null,
        },
        location: { longitude: 0, latitude: 0 },
      },
      skills: {
        perHour: 0,
        priorityIndex: -1,
        distantIndex: -1,
        selectedSpecAndSkills: null,
      },
      isShowInfo: true,
      avatarChange: { data: {}, file: {} },
      updatedSecondPhone: { codeRegion: null, phone: null, fullPhone: null },
      validationError: false,
      isValidPhoneNumber: true,
      newEducation: [],
      newWorkExp: [],
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      accessToken: 'sumsub/getSumSubBackendToken',
      filters: 'quests/getFilters',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    if (!this.filters) await this.$store.dispatch('quests/getFilters');
    const addInfo = this.userData.additionalInfo;
    this.profile = {
      avatarId: this.userData.avatarId,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      firstPhone: this.userData.tempPhone || this.userData.phone,
      additionalInfo: {
        secondMobileNumber: {
          codeRegion: this.userData.secondMobileNumber?.codeRegion || null,
          phone: this.userData.secondMobileNumber?.phone || null,
          fullPhone: this.userData.secondMobileNumber?.fullPhone || null,
        },
        address: addInfo.address,
        socialNetwork: {
          instagram: addInfo.socialNetwork.instagram,
          twitter: addInfo.socialNetwork.twitter,
          linkedin: addInfo.socialNetwork.linkedin,
          facebook: addInfo.socialNetwork.facebook,
        },
        description: addInfo.description,
        skills: addInfo.skills,
        educations: addInfo.educations,
        workExperiences: addInfo.workExperiences,
        CEO: addInfo.CEO,
        company: addInfo.company,
        website: addInfo.website,
      },
      location: this.userData.location,
    };
    this.skills = {
      priorityIndex: this.userData.priority,
      distantIndex: this.distantIndexByWorkplace(this.userData.workplace),
      perHour: this.userData.wagePerHour,
      selectedSpecAndSkills: this.userData.userSpecializations || [],
    };
    this.SetLoader(false);
  },
  methods: {
    distantIndexByWorkplace(workplace) {
      if (workplace === 'distance') return 0;
      if (workplace === 'office') return 1;
      if (workplace === 'both') return 2;
      return null;
    },

    // MODALS METHODS
    addEducation(knowledge, data) {
      this.profile.additionalInfo[knowledge === 'newEducation' ? 'educations' : 'workExperiences']
        .push({ ...data });
    },
    modalsStatusTitle(modalMode) {
      const titles = {
        enterPhoneNumber: this.$t('settings.enterPhoneNumber'),
        enterCurrentLocation: this.$t('settings.enterCurrentLocation'),
        imageLoadedSuccessful: this.$t('modals.imageLoadedSuccessful'),
        educationAddSuccessful: this.$t('modals.educationAddSuccessful'),
        workExpAddSuccessful: this.$t('modals.workExpAddSuccessful'),
        saved: this.$t('modals.saved'),
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
      };
      return keys[modalKey];
    },
    showModalKey(modalKey) {
      this.ShowModal({ key: this.modalsKey(modalKey) });
    },
    showModalStatus(modalMode) {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.modalsStatusTitle(modalMode),
        subtitle: this.modalsStatusSubtitles(modalMode),
      });
    },

    // UPDATE PHONE
    updateSecondPhone(value) {
      this.isValidPhoneNumber = value.isValid;
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
      const secondMobileNumber = this.updatedSecondPhone.fullPhone;
      await this.setAvatar();
      if (secondMobileNumber) await this.editProfile(checkAvatarID);
      if (!secondMobileNumber) this.showModalStatus('enterPhoneNumber');
    },

    async checkValidate() {
      const validateEducation = await this.validateKnowledge('education', this.newEducation);
      const validateWorkExp = await this.validateKnowledge('work', this.newWorkExp);
      const validateSettings = await this.$refs.settings.validate();
      if (validateEducation === false
        || validateWorkExp === false
        || validateSettings === false
        || this.isValidPhoneNumber === false) {
        return true;
      }
      this.validationError = false;
      return false;
    },

    async validateKnowledge(observerName, value) {
      const isDirty = Object.keys(value).some((field) => value[field] !== '' && value[field] !== null);
      if (isDirty) return await this.$refs.settings.$children[1].$refs[observerName].validate();
      return true;
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

    async editProfile(checkAvatarID) {
      const {
        instagram, twitter, linkedin, facebook,
      } = this.profile.additionalInfo.socialNetwork;
      let payload = {
        avatarId: checkAvatarID,
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        location: {
          longitude: this.coordinates ? this.coordinates.lng : this.profile.location?.longitude || 0,
          latitude: this.coordinates ? this.coordinates.lat : this.profile.location?.latitude || 0,
        },
        additionalInfo: {
          secondMobileNumber: this.updatedSecondPhone,
          address: this.profile.additionalInfo.address,
          socialNetwork: {
            instagram: instagram || null,
            twitter: twitter || null,
            linkedin: linkedin || null,
            facebook: facebook || null,
          },
        },
      };
      if (this.userRole === 'worker') {
        payload = {
          ...payload,
          additionalInfo: {
            ...payload.additionalInfo,
            secondMobileNumber: this.updatedSecondPhone,
            educations: this.profile.additionalInfo.educations,
            workExperiences: this.profile.additionalInfo.workExperiences,
            description: this.profile.additionalInfo.description || null,
          },
          workplace: this.parseDistantWork(this.skills.distantIndex),
          priority: this.skills.priorityIndex,
          wagePerHour: this.skills.perHour ? this.skills.perHour : this.userData.wagePerHour,
          specializationKeys: this.skills.selectedSpecAndSkills || [],
        };
        await this.editProfileResponse('user/editWorkerData', payload);
      } if (this.userRole === 'employer') {
        payload.additionalInfo = {
          ...payload.additionalInfo,
          description: this.profile.additionalInfo.description || null,
          company: this.profile.additionalInfo.company || null,
          CEO: this.profile.additionalInfo.CEO || null,
          website: this.profile.additionalInfo.website || null,
        };
        await this.editProfileResponse('user/editEmployerData', payload);
      }
    },

    parseDistantWork(index) {
      if (index === 0) return 'distant';
      if (index === 1) return 'office';
      if (index === 2) return 'both';
      return null;
    },

    async editProfileResponse(action, payload) {
      await this.$store.dispatch(action, payload);
      this.showModalStatus('saved');
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
