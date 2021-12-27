<template>
  <div class="settings">
    <div class="settings__title">
      {{ $t('settings.settings') }}
    </div>
    <div class="settings__body">
      <verification-card
        v-if="userRole === 'worker' && isShowInfo === true"
      />
      <profile
        :addresses="addresses"
        :local-user-data="localUserData"
      />
      <skills />
      <advanced />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { GeoCode } from 'geo-coder';
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
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isSearchDDStatus: true,
      specCount: 0,
      perHour: 0,
      selectedSpecAndSkills: [],
      priorityIndex: -1,
      distantIndex: -1,
      updatedPhone: null,
      addresses: [],
      isSms: false,
      isShowInfo: true,
      localUserData: {
        avatarId: null,
        firstName: null,
        lastName: null,
        skillFilters: null,
        additionalInfo: {
          secondMobileNumber: null,
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
        location: {
          longitude: 0,
          latitude: 0,
        },
      },
      avatarChange: {
        data: {},
        file: {},
      },
      newKnowledge: {
        from: null,
        to: null,
        place: null,
      },
      newWorkExp: {
        from: null,
        to: null,
        place: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      firstName: 'user/getFirstName',
      lastName: 'user/getLastName',
      address: 'user/getUserAddress',
      company: 'user/getUserCompany',
      userCEO: 'user/getUserCEO',
      userDesc: 'user/getUserDesc',
      userWorkExp: 'user/getUserWorkExp',
      userEducations: 'user/getUserEducations',
      userWebsite: 'user/getUserWebsite',
      userInstagram: 'user/getUserInstagram',
      userTwitter: 'user/getUserTwitter',
      userLinkedin: 'user/getUserLinkedin',
      userFacebook: 'user/getUserFacebook',
      secondMobileNumber: 'user/getUserSecondMobileNumber',
      imageData: 'user/getImageData',
      additionalInfo: 'user/getAdditionalInfo',
      getUserAddress: 'user/getUserAddress',
      applicantStatus: 'sumsub/getApplicantStatus',
      accessToken: 'sumsub/getSumSubBackendToken',
      status2FA: 'user/getStatus2FA',
      filters: 'quests/getFilters',
    }),
    userSpecializations() {
      return this.userData.userSpecializations || [];
    },
    distantWork() {
      return [
        this.$t('settings.distantWork.distantWork'),
        this.$t('settings.distantWork.workInOffice'),
        this.$t('settings.distantWork.bothVariant'),
      ];
    },
    priority() {
      return [
        this.$t('priority.all'),
        this.$t('priority.employee.low'),
        this.$t('priority.employee.normal'),
        this.$t('priority.employee.urgent'),
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    if (!this.filters) await this.$store.dispatch('quests/getFilters');
    this.localUserData = {
      avatarId: this.userData.avatarId,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      additionalInfo: JSON.parse(JSON.stringify(this.userData.additionalInfo)),
      location: this.userData.location,
    };
    this.priorityIndex = this.userData.priority;
    this.distantIndex = this.distantIndexByWorkplace(this.userData.workplace);
    await this.perHourData();
    this.SetLoader(false);
  },
  methods: {
    distantIndexByWorkplace(workplace) {
      if (workplace === 'distance') return 0;
      if (workplace === 'office') return 1;
      if (workplace === 'both') return 2;
      return null;
    },
    parseDistantWork(index) {
      if (index === 0) return 'distant';
      if (index === 1) return 'office';
      if (index === 2) return 'both';
      return null;
    },
    updateSelectedSkills(specAndSkills) {
      this.selectedSpecAndSkills = specAndSkills;
    },
    async perHourData() {
      this.perHour = await this.userData.wagePerHour;
    },
    getApplicantStatus() {
      try {
        this.$store.dispatch('sumsub/applicantStatus', this.accessToken.userId);
      } catch (e) {
        console.log(e);
      }
    },
    goToSumSub() {
      this.$router.push('/sumsub');
    },
    selectAddress(address) {
      this.localUserData.additionalInfo.address = address.formatted;
      this.addresses = [];
    },
    async getAddressInfo(address) {
      let response = [];
      const geoCode = new GeoCode('google', { key: process.env.GMAPKEY });
      try {
        if (address.length) {
          response = await geoCode.geolookup(address);
          this.addresses = JSON.parse(JSON.stringify(response));
          this.coordinates = JSON.parse(JSON.stringify({ lng: response[0].lng, lat: response[0].lat }));
        }
      } catch (e) {
        console.log(e);
      }
    },

    // eslint-disable-next-line consistent-return
    async processFile(e, validate) {
      const isValid = await validate(e);
      const reader = new FileReader();
      const file = e.target.files[0];
      if (isValid.valid) {
        if (!file) {
          return false;
        }
        reader.readAsDataURL(file);
        this.avatarChange.data = await this.$store.dispatch('user/imageType', { contentType: file.type });
        this.avatarChange.file = file;
        let output = document.getElementById('userAvatar');
        const modalMode = 'imageLoadedSuccessful';
        if (!output) {
          output = document.getElementById('userAvatarTwo');
        }
        output.src = URL.createObjectURL(file);
        // eslint-disable-next-line func-names
        output.onload = function () {
          URL.revokeObjectURL(output.src);
        };
        this.showModalStatus(modalMode);
        reader.onerror = (evt) => {
          console.error(evt);
        };
      }
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
      this.ShowModal({
        key: this.modalsKey(modalKey),
      });
    },
    showModalStatus(modalMode) {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.modalsStatusTitle(modalMode),
        subtitle: this.modalsStatusSubtitles(modalMode),
      });
    },
    async changeRole() {
      this.showModalKey('changeRoleWarning');
    },
    async checkPhoneNumber() {
      if (this.updatedPhone.formatInternational) {
        this.localUserData.additionalInfo.secondMobileNumber = this.updatedPhone.formatInternational.replace(/\s/g, '');
      } if (!this.updatedPhone.formatInternational) {
        this.localUserData.additionalInfo.secondMobileNumber = '';
      }
    },
    async validateExperienceForm(observerName, value) {
      const isDirty = Object.keys(value).some((field) => value[field] !== '' && value[field] !== null);
      if (isDirty) {
        return await this.$refs[observerName].validate();
      }
      return true;
    },

    async editUserData() {
      const validateKnowledge = await this.validateExperienceForm('observerAddNewKnowledge', this.newKnowledge);
      const validateWorkExp = await this.validateExperienceForm('observerAddNewWorkExp', this.newWorkExp);
      const validateSettingsForm = await this.$refs.observerCheckForm.validate();
      if (validateKnowledge === false || validateWorkExp === false || validateSettingsForm === false) {
        return;
      }

      const checkAvatarID = this.avatarChange.data.ok ? this.avatarChange.data.result.mediaId : this.userData.avatarId;
      const { secondMobileNumber } = this.localUserData.additionalInfo;
      await this.setAvatar();
      await this.checkPhoneNumber();
      if (secondMobileNumber) {
        await this.editProfile(checkAvatarID);
      }
      if (!secondMobileNumber) this.showModalStatus('enterPhoneNumber');
    },
    async setAvatar() {
      const formData = new FormData();
      formData.append('image', this.avatarChange.file);
      try {
        if (this.avatarChange.data.ok) {
          const data = {
            url: this.avatarChange.data.result.url,
            formData: this.avatarChange.file,
            type: this.avatarChange.file.type,
          };
          await this.$store.dispatch('user/setImage', data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async editProfile(checkAvatarID) {
      const {
        instagram, twitter, linkedin, facebook,
      } = this.localUserData.additionalInfo.socialNetwork;
      let payload = {
        avatarId: checkAvatarID,
        firstName: this.localUserData.firstName,
        lastName: this.localUserData.lastName,
        location: {
          longitude: this.coordinates ? this.coordinates.lng : this.localUserData.location?.longitude || 0,
          latitude: this.coordinates ? this.coordinates.lat : this.localUserData.location?.latitude || 0,
        },
        additionalInfo: {
          secondMobileNumber: this.localUserData.additionalInfo.secondMobileNumber,
          address: this.localUserData.additionalInfo.address,
          socialNetwork: {
            instagram: instagram !== '' ? instagram : null,
            twitter: twitter !== '' ? twitter : null,
            linkedin: linkedin !== '' ? linkedin : null,
            facebook: facebook !== '' ? facebook : null,
          },
        },
      };
      if (this.userRole === 'worker') {
        payload.additionalInfo = {
          ...payload.additionalInfo,
          educations: this.localUserData.additionalInfo.educations,
          workExperiences: this.localUserData.additionalInfo.workExperiences,
          description: this.localUserData.additionalInfo.description,
        };
        payload = {
          ...payload,
          workplace: this.parseDistantWork(this.distantIndex),
          priority: this.priorityIndex,
          wagePerHour: this.perHour ? this.perHour : this.userData.wagePerHour,
          specializationKeys: this.selectedSpecAndSkills || null,
        };
        await this.editProfileResponse('user/editWorkerData', payload);
      } if (this.userRole === 'employer') {
        payload.additionalInfo = {
          ...payload.additionalInfo,
          description: this.localUserData.additionalInfo.description,
          company: this.localUserData.additionalInfo.company,
          CEO: this.localUserData.additionalInfo.CEO,
          website: this.localUserData.additionalInfo.website,
        };
        await this.editProfileResponse('user/editEmployerData', payload);
      }
    },
    async editProfileResponse(action, payload) {
      try {
        await this.$store.dispatch(action, payload);
        this.showModalStatus('saved');
      } catch (e) {
        console.log(e);
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
/*
@include _1199 {
  .main-white {
    margin: 0 20px;
  }
  .quests {
    &__top {
      margin: 0 20px;
    }
  }
  .page {
    &__title {
      margin: 20px 0 20px 20px;
    }
    &__spec {
      margin: 0 0 10px 20px;
    }
    &__badge {
      text-align: center;
    }
    &__profile {
      margin: 20px;
    }
    &__info {
      &-title {
        font-size: 20px;
      }
    }
  }
  .settings {
    margin: 20px;
  }
}
@include _991 {
  .knowledge {
    padding: 20px;
    &__container {
      flex-direction: column;
      margin: 20px 0;
      grid-gap: 10px;
      max-height: 100%;
    }
    &__content {
      width: 100%;
    }
    &__label {
      margin: 10px 0;
    }
  }
  .settings {
    grid-auto-rows: auto auto;
    grid-template-columns: 5fr;
  }
  .page {
    &__grid {
      grid-template-columns: 1fr;
    }
    &__info {
      &-title {
        margin: 5px 20px 0 20px;
      }
    }
  }
  .profile {
    &__row-3col {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .higher {
    &-level {
      &__img {
        display: none;
      }
    }
  }
}

@include _767 {
  .page {
    &__skills {
      .block {
        &__skill-spec {
          width: 100%;
        }
        &__specialization {
          display: flex;
          flex-direction: row;
        }
      }
    }
    &__btn {
      padding: 0;
      .btn__save {
        width: 100%;
      }
    }
  }

  .specialization {
    &__btn {
      &_remove {
        margin-top: 0;
        width: 100%;
      }
    }
  }
  .skills {
    &__btn-add {
      width: 100%;
      margin-top: 0;
    }
    &__block {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 50px;
    }
    &__add-info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
  .avatar {
    &__row {
      margin: 20px 20px 0 20px;
      flex-direction: column;
    }
    &__container {
      justify-self: center;
    }
  }
  .company {
    &__inputs {
      grid-template-columns: 1fr;
      grid-gap: 0;
    }
  }
  .page {
    &__info {
      max-height: 100%;
    }
  }
  .profile {
    &__row-3col {
      grid-template-columns: 1fr;
    }
    &__row-4col {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr;
      max-height: 100%;
    }
    &__row-data {
      &_big {
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: 1fr;
        grid-gap: 20px;
      }
    }
  }

  .settings {
    grid-template-columns: 1fr;
    &__left {
      padding: 20px 0 20px 20px;
    }
  }
}

@include _575 {
  .page {
    &__skills {
      .block {
        &__specialization {
          flex-direction: column;
        }
      }
    }
  }
  .knowledge {
    &__container {
      width: 100%;
    }
  }
  .avatar {
    &__row {
      grid-template-columns: 1fr;
    }
  }
  .main-white {
    display: grid;
    grid-template-columns: 1fr;
  }
  .btn {
    &__container {
      width: initial;
      justify-content: center;
      margin: 0 0 10px;
    }
    &__container-right {
      margin: 0 20px;
      justify-content: center;
    }
  }
  .page {
    &__info-title {
      font-size: 18px;
    }
  }
  .settings {
    &_blue {
      grid-template-columns: 1fr;
      padding: 10px;
      grid-gap: 10px;
    }
  }
}
@include _480 {
  .knowledge {
    &__data {
      width: 150px;
      &_big {
        width: 100% !important;
      }
    }
    &__btn {
      width: 30%;
    }
  }
  .btn {
    &__save {
      margin-bottom: 20px;
    }
  }
}

@include _380 {
  .knowledge {
    &__data {
      width: 120px;
    }
  }
  .btn {
    &__save {
      margin-bottom: 20px;
    }
  }
  .option {
    &__title {
      padding: 0 10px 0 16px;
      font-size: 14px;
    }
  }
  .user {
    grid-template-columns: 11fr 1fr;
  }
  .icons {
    padding: 16px 0 0 16px;
  }
}
@include _350 {
  .knowledge {
    &__data {
      width: 90px;
    }
  }
} */
</style>
