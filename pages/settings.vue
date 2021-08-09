<template>
  <div class="main">
    <div class="main__body">
      <h2 class="page__title">
        {{ $t('settings.settings') }}
      </h2>
      <div
        v-if="userRole === 'worker'"
        class="quests__top"
        :class="[{'top-disabled': isShowInfo === false}]"
      >
        <transition name="fade-fast">
          <div class="page__info">
            <div class="page__grid">
              <div
                class="page__info"
              >
                <div class="page__info">
                  <h2 class="page__info page__info-title">
                    {{ $t('settings.addInfo') }}
                  </h2>
                  <div class="page__info page__info-subtitle">
                    {{ $t('settings.alsoRating') }}
                  </div>
                  <div class="ver-btn__container">
                    <base-btn mode="ver">
                      {{ $t('settings.getVerification') }}
                    </base-btn>
                  </div>
                </div>
              </div>
              <div>
                <img
                  class="higher-level__img"
                  src="~/assets/img/ui/settingsHigherLevel.svg"
                  alt=""
                >
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="page__profile">
        <div class="profile__title">
          {{ $t('settings.profileInfo') }}
        </div>
        <div class="avatar__row">
          <div class="avatar__container">
            <img
              v-if="imageData"
              id="userAvatar"
              class="profile__img"
              :src="imageData"
              alt=""
            >
            <img
              v-if="!imageData"
              id="userAvatarTwo"
              class="profile__img"
              src="~/assets/img/app/avatar_empty.png"
              alt=""
            >
            <label class="user_edit_avatar">
              <div class="icon-edit" />
              <ValidationProvider
                v-slot="{ validate }"
                rules="required|ext:png,jpeg,jpg"
                tag="div"
              >
                <input
                  id="coverUpload"
                  class="edit_avatar"
                  type="file"
                  accept="image/*"
                  @change="processFile($event, validate)"
                >
              </ValidationProvider>
            </label>
          </div>
          <div>
            <span
              v-if="userRole === 'worker'"
              class="profile__status"
            >
              {{ $t('settings.notVerified') }}
              <span class="icon-check_all_big" />
            </span>
            <div>
              <div class="profile__row-data">
                <base-field
                  v-if="firstName"
                  v-model="localUserData.firstName"
                  :placeholder="firstName || $t('settings.nameInput')"
                  mode="icon"
                >
                  <template v-slot:left>
                    <span class="icon-user" />
                  </template>
                </base-field>
                <base-field
                  v-if="lastName"
                  v-model="localUserData.lastName"
                  :placeholder="$t('settings.lastNameInput')"
                  mode="icon"
                >
                  <template v-slot:left>
                    <span class="icon-user" />
                  </template>
                </base-field>
              </div>
              <div class="profile__row-data">
                <VuePhoneNumberInput
                  v-model="localUserData.additionalInfo.firstMobileNumber"
                  class="Phone"
                  error-color="#EB5757"
                  clearable
                  size="lg"
                  show-code-on-list
                  @update="updatedPhone = $event"
                />
                <base-field
                  v-model="localUserData.additionalInfo.address"
                  :placeholder="address || $t('settings.addressInput')"
                  mode="icon"
                  :selector="true"
                  @selector="getAddressInfo(localUserData.additionalInfo.address)"
                >
                  <template v-slot:left>
                    <span class="icon-location" />
                  </template>
                  <template v-slot:selector>
                    <div
                      v-if="addresses.length"
                      class="selector"
                    >
                      <div class="selector__items">
                        <div
                          v-for="(item, i) in addresses"
                          :key="i"
                          class="selector__item"
                          @click="selectAddress(item)"
                        >
                          {{ item.formatted }}
                        </div>
                      </div>
                    </div>
                  </template>
                </base-field>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="userRole === 'employer'"
          class="company__inputs"
        >
          <base-field
            v-model="localUserData.additionalInfo.company"
            :placeholder="company || $t('settings.company')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-Case" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.CEO"
            :placeholder="userCEO || $t('settings.ceo')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-id_card" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.website"
            :placeholder="userWebsite || $t('settings.website')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-Earth" />
            </template>
          </base-field>
        </div>
        <div
          class="profile__row-1col"
        >
          <textarea
            id="textarea"
            v-model="localUserData.additionalInfo.description"
            class="profile__textarea"
            :placeholder="userDesc || $t('settings.userDesc')"
          />
        </div>
        <div
          v-if="userRole === 'worker'"
        >
          <label
            class="knowledge__label"
            for="knowledge"
          >{{ $t('settings.educations') }}</label>
          <div
            v-if="localUserData.additionalInfo.educations.length !==0"
          >
            <div
              v-for="(k, i) in localUserData.additionalInfo.educations"
              :key="k.id"
              class="knowledge__container"
            >
              <base-field
                id="knowledge"
                v-model="localUserData.additionalInfo.educations[i].from"
                type="grey"
                :placeholder="$t('settings.education.from')"
              />
              <div class="knowledge__dash">
                -
              </div>
              <base-field
                v-model="localUserData.additionalInfo.educations[i].to"
                type="grey"
                :placeholder="$t('settings.education.to')"
              />
              <div />
              <base-field
                v-model="localUserData.additionalInfo.educations[i].place"
                type="grey"
                :placeholder="$t('settings.education.educationalInstitution')"
              />
              <div />
              <base-btn @click="deleteKnowledge(i)">
                {{ $t('settings.delete') }}
              </base-btn>
            </div>
          </div>
          <div
            class="knowledge__container"
          >
            <base-field
              v-model="newKnowledge.from"
              type="grey"
              :placeholder="$t('settings.workExps.from')"
            />
            <div class="knowledge__dash">
              -
            </div>
            <base-field
              v-model="newKnowledge.to"
              type="grey"
              :placeholder="$t('settings.workExps.to')"
            />
            <div />
            <base-field
              v-model="newKnowledge.place"
              type="grey"
              :placeholder="$t('settings.workExps.companyName')"
            />
            <div />
            <base-btn @click="addNewKnowledge()">
              {{ $t('settings.add') }}
            </base-btn>
          </div>

          <label
            v-if="userRole === 'worker'"
            class="knowledge__label"
            for="workExp"
          >{{ $t('settings.workExp') }}</label>
          <div
            v-if="localUserData.additionalInfo.workExperiences.length !==0"
          >
            <div
              v-for="(k, i) in localUserData.additionalInfo.workExperiences"
              :key="k.id"
              class="knowledge__container"
            >
              <base-field
                id="workExp"
                v-model="localUserData.additionalInfo.workExperiences[i].from"
                type="grey"
                :placeholder="$t('settings.term')"
              />
              <div class="knowledge__dash">
                -
              </div>
              <base-field
                v-model="localUserData.additionalInfo.workExperiences[i].to"
                type="grey"
                :placeholder="$t('settings.term')"
              />
              <div />
              <base-field
                v-model="localUserData.additionalInfo.workExperiences[i].place"
                type="grey"
                :placeholder="$t('settings.placeOfStudying')"
              />
              <div />
              <base-btn @click="deleteWorkExp(i)">
                {{ $t('settings.delete') }}
              </base-btn>
            </div>
          </div>
          <div class="knowledge__container">
            <base-field
              v-model="newWorkExp.from"
              type="grey"
              :placeholder="$t('settings.term')"
            />
            <div class="knowledge__dash">
              -
            </div>
            <base-field
              v-model="newWorkExp.to"
              type="grey"
              :placeholder="$t('settings.term')"
            />
            <div />
            <base-field
              v-model="newWorkExp.place"
              type="grey"
              :placeholder="$t('settings.placeOfStudying')"
            />
            <div />
            <base-btn @click="addNewWorkExp()">
              {{ $t('settings.add') }}
            </base-btn>
          </div>
        </div>
        <div class="profile__row-4col">
          <base-field
            v-model="localUserData.additionalInfo.socialNetwork.instagram"
            :placeholder="userInstagram || $t('settings.instagramUsername')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-instagram" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.socialNetwork.twitter"
            :placeholder="userTwitter || $t('settings.twitterUsername')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-twitter" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.socialNetwork.linkedin"
            :placeholder="userLinkedin || $t('settings.linkedInUsername')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-LinkedIn" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.socialNetwork.facebook"
            :placeholder="userFacebook || $t('settings.facebookUsername')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-facebook" />
            </template>
          </base-field>
        </div>
        <div class="profile__row-4col">
          <base-btn
            class="btn__save"
            @click="editUserData()"
          >
            {{ $t('settings.save') }}
          </base-btn>
        </div>
      </div>
      <div class="main-white">
        <div
          v-if="userRole === 'worker'"
          class="page__skills"
        >
          <div class="page__badge-skills">
            {{ $t('settings.skills') }}
          </div>
          <div
            v-for="(item, i) in userSkills"
            :key="i"
          >
            <div class="page__badge">
              {{ item.title }}
            </div>
          </div>
          <div class="btn__container">
            <button
              class="btn__plus"
              @click="chooseNecessarySkills()"
            >
              <span class="icon-plus_circle" />
            </button>
          </div>
        </div>
      </div>
      <div class="settings">
        <div class="settings__left">
          <div>{{ $t('settings.settings') }}</div>
          <div>
            <div class="settings__subtitle">
              {{ $t('settings.whoCanSee') }}
            </div>
            <div class="settings__option">
              <input
                id="allUsers"
                name="whoCanSee"
                type="radio"
                class="radio__input"
                value="allUsers"
              >
              <label
                class="label__black"
                for="allUsers"
              >{{ $t('settings.allUsers') }}</label>
            </div>
            <div class="settings__option">
              <input
                id="allInternet"
                name="whoCanSee"
                type="radio"
                class="radio__input"
                value="allInternet"
                checked
              >
              <label
                class="label__black"
                for="allInternet"
              >{{ $t('settings.allInternet') }}</label>
            </div>
            <div class="settings__option">
              <input
                id="onlyWhenSubmittedWork"
                name="whoCanSee"
                type="radio"
                class="radio__input"
                value="onlyWhenSubmittedWork"
              >
              <label
                class="label__black"
                for="onlyWhenSubmittedWork"
              >{{ $t('settings.onlyWhenSubmittedWork') }}</label>
            </div>
          </div>
          <div>
            <div class="settings__subtitle">
              {{ $t('settings.filterAllEmployeeProfiles') }}
            </div>
            <div class="settings__option">
              <input
                id="urgentProposals"
                name="filterAllWorkProposals"
                type="radio"
                class="radio__input"
                value="urgentJobOffers"
              >
              <label
                class="label__black"
                for="urgentProposals"
              >{{ $t('settings.urgentJobOffers') }}</label>
            </div>
            <div class="settings__option">
              <input
                id="onlyImplementation"
                name="filterAllWorkProposals"
                type="radio"
                class="radio__input"
                value="shortTermJobOffers"
              >
              <label
                class="label__black"
                for="onlyImplementation"
              >{{ $t('settings.shortTermJobOffers') }}</label>
            </div>
            <div class="settings__option">
              <input
                id="onlyReady"
                name="filterAllWorkProposals"
                type="radio"
                class="radio__input"
                value="fixedDeliveryJobOffers"
              >
              <label
                class="label__black"
                for="onlyReady"
              >{{ $t('settings.fixedDeliveryJobOffers') }}</label>
            </div>
          </div>
        </div>
        <div class="settings__right">
          <div>{{ $t('settings.settings') }}</div>
          <div>
            <div class="settings_blue">
              <div>{{ $t('settings.changePass') }}</div>
              <div>
                <base-btn @click="modalChangePassword()">
                  {{ $t('settings.change') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>
                {{ $t('settings.enableTwoStepAuth') }}
              </div>
              <div>
                <base-btn
                  class="margin__bottom"
                  @click="disable2FA"
                >
                  {{ $t('meta.disable') }}
                </base-btn>
                <base-btn
                  @click="modalTwoFAAuth()"
                >
                  {{ $t('settings.enable') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>{{ $t('settings.smsVerification') }}</div>
              <div>
                <base-btn
                  @click="showModalEnableSmsVerification"
                >
                  {{ $t('settings.enable') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>{{ $t('settings.changeRole') }}</div>
              <div>
                <base-btn @click="changeRole()">
                  {{ $t('settings.change') }}
                </base-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import VuePhoneNumberInput from 'vue-phone-number-input';
import modals from '~/store/modals/modals';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

Vue.component('vue-phone-number-input', VuePhoneNumberInput);
const { GeoCode } = require('geo-coder');

export default {
  name: 'Settings',
  components: {
    VuePhoneNumberInput,
  },
  data() {
    return {
      updatedPhone: null,
      addresses: [],
      sms: false,
      allRegisterUser: false,
      allPeopleInInternet: false,
      onlyWhenSubmitedWork: false,
      onlyUrgentProposals: false,
      onlyInplemention: false,
      onlyReadyForExecution: false,
      allRegisteredUsers: false,
      isShowInfo: true,
      localUserData: {
        avatarId: null,
        firstName: null,
        lastName: null,
        additionalInfo: {
          firstMobileNumber: null,
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
      },
      avatar_change: {
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
      firstMobileNumder: 'user/getUserFirstMobileNumber',
      secondMobileNumder: 'user/getUserSecondMobileNumber',
      userSkills: 'data/getSkills',
      userInfo: 'data/getUserInfo',
      imageData: 'user/getImageData',
      additionalInfo: 'user/getAdditionalInfo',
      getUserAddress: 'user/getUserAddress',
      status2FA: 'data/get2FAStatus',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.localUserData = {
      avatarId: this.userData.avatarId,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      additionalInfo: JSON.parse(JSON.stringify(this.userData.additionalInfo)),
    };
    this.SetLoader(false);
  },
  methods: {
    disable2FA() {
      this.ShowModal({
        key: modals.disable2FA,
      });
    },
    chooseNecessarySkills() {
      this.ShowModal({
        key: modals.chooseNecessarySkills,
      });
    },
    selectAddress(address) {
      this.localUserData.additionalInfo.address = this.address;
      this.addresses = [];
      this.address = address.formatted;
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
    addNewKnowledge() {
      this.localUserData.additionalInfo.educations.push({ ...this.newKnowledge });
      this.newKnowledge = {
        from: null,
        to: null,
        place: null,
      };
      this.showModalAddEducationOk();
    },
    deleteKnowledge(i) {
      this.localUserData.additionalInfo.educations.splice(i, 1);
    },
    addNewWorkExp() {
      this.localUserData.additionalInfo.workExperiences.push({ ...this.newWorkExp });
      this.newWorkExp = {
        from: null,
        to: null,
        place: null,
      };
      this.showModalAddWorkExpOk();
    },
    deleteWorkExp(i) {
      this.localUserData.additionalInfo.workExperiences.splice(i, 1);
    },
    // eslint-disable-next-line consistent-return
    async processFile(e, validate) {
      const isValid = await validate(e);
      const file = e.target.files[0];
      if (isValid.valid) {
        if (!file) {
          return false;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        this.avatar_change.data = await this.$store.dispatch('user/imageType', { contentType: file.type });
        this.avatar_change.file = file;
        let output = document.getElementById('userAvatar');
        if (!output) {
          output = document.getElementById('userAvatarTwo');
        }
        output.src = URL.createObjectURL(file);
        // eslint-disable-next-line func-names
        output.onload = function () {
          URL.revokeObjectURL(output.src);
        };
        this.showModalImageOk();
        reader.onerror = (evt) => {
          console.error(evt);
        };
      }
    },
    showModalEnableSmsVerification() {
      this.ShowModal({
        key: modals.smsVerification,
      });
    },
    showModalImageOk() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.imageLoadedSuccessful'),
        subtitle: this.$t('modals.pressSaveBtn'),
        path: '/settings',
      });
    },
    showModalAddEducationOk() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.educationAddSuccessful'),
        subtitle: this.$t('modals.pressSaveBtn'),
        path: '/settings',
      });
    },
    showModalAddWorkExpOk() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.workExpAddSuccessful'),
        subtitle: this.$t('modals.pressSaveBtn'),
        path: '/settings',
      });
    },
    showModalSave() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.saved'),
        subtitle: this.$t('modals.userDataHasBeenSaved'),
        path: '/settings',
      });
    },
    modalChangePassword() {
      this.ShowModal({
        key: modals.changePassInSettings,
      });
    },
    modalTwoFAAuth() {
      this.ShowModal({
        key: modals.twoFAAuth,
      });
    },
    isCloseInfo() {
      this.isShowInfo = !this.isShowInfo;
    },
    switch2Fa() {
      this.twoFa = !this.twoFa;
    },
    switchSms() {
      this.sms = !this.sms;
      this.$router.push('/sms-verification');
    },
    async changeRole() {
      this.ShowModal({
        key: modals.changeRoleWarning,
      });
      // try {
      //   const response = await this.$store.dispatch('user/setUserRole');
      //   if (response?.ok) {
      //     console.log('good response');
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
    },
    async changePassword() {
      try {
        this.ShowModal({
          key: modals.changePassword,
        });
      } catch (e) {
        console.log(e);
      }
    },
    async editUserData() {
      const formData = new FormData();
      formData.append('image', this.avatar_change.file);
      try {
        if (this.avatar_change.data.ok) {
          const data = {
            url: this.avatar_change.data.result.url,
            formData: this.avatar_change.file,
            type: this.avatar_change.file.type,
          };
          await this.$store.dispatch('user/setImage', data);
        }
      } catch (error) {
        console.log(error);
      }
      this.localUserData.additionalInfo.firstMobileNumber = this.updatedPhone.formatInternational;
      let payload = {};
      const checkAvatarID = this.avatar_change.data.ok ? this.avatar_change.data.result.mediaId : this.userData.avatarId;
      const additionalInfo = {
        ...this.filterEmpty(this.localUserData.additionalInfo),
        socialNetwork: this.filterEmpty(this.localUserData.additionalInfo.socialNetwork),
      };
      if (this.userRole === 'employer') {
        payload = {
          ...this.localUserData,
          avatarId: checkAvatarID,
          additionalInfo: {
            ...additionalInfo,
            ...{
              educations: undefined,
              workExperiences: undefined,
              skills: undefined,
            },
          },
        };
      } else {
        payload = {
          ...this.localUserData,
          avatarId: checkAvatarID,
          additionalInfo: {
            ...additionalInfo,
            ...{
              company: undefined,
              CEO: undefined,
              website: undefined,
            },
          },
        };
      }
      try {
        await this.$store.dispatch('user/editUserData', payload);
        this.showModalSave();
      } catch (e) {
        console.log(e);
      }
    },
    filterEmpty(obj) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(obj)) {
        if (obj[key] === '') {
          obj[key] = null;
        }
      }
      return obj;
    },
  },
};
</script>

<style lang="scss" scoped>

.margin {
  &__bottom {
    margin-bottom: 10px;
  }
}

.selector {
  @include box;
  width: 100%;
  z-index: 140;
  &__items {
    background: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
  &__item {
    @include text-simple;
    padding: 15px 20px;
    background: #FFFFFF;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    cursor: pointer;
    transition: .3s;
    &:hover {
      background: #F3F7FA;
    }
  }
}

.knowledge {
  &__container {
    display: grid;
    grid-template-columns: 5fr 28px 5fr 28px 7fr 28px 2fr;
    margin: 0 19px 10px 20px;
    max-height: 44px;
  }
  &__dash {
    display: flex;
    height: 44px;
    align-items: center;
    justify-content: center;
  }
  &__label {
    margin: 20px 0 15px 20px;
  }
}

.ver-btn {
  &__container {
    display: flex;
    margin: 20px;
    width: 250px;
  }
}

.company {
  &__inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px 20px;
    margin: 0 20px 0 20px;
  }
}

.top-disabled {
  display: none;
}

.radio {
  &__input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: 1px solid $blue;
    cursor: pointer;
    &:checked {
      background: radial-gradient($blue 50%, rgba(255, 0, 0, 0) 55%);
    }
  }
}

.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
  &:disabled+label {
    &::before {
      background-color: #e9ecef;
    }
  }
  &:focus:not(:checked)+label {
    &::before {
      border-color: #80bdff;
    }
  }
  &:focus+label {
    &::before {
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
  &:not(:disabled) {
    &:active+label {
      &::before {
        background-color: #b3d7ff;
        border-color: #b3d7ff;
      }
    }
  }
  &:not(:disabled) {
    :not(:checked)+label {
      :hover::before {
        border-color: #b3d7ff;
      }
    }
  }
  &:checked+label {
    &::before {
      border-color: #0b76ef;
      background-color: #0b76ef;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
    }
  }
  &+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
    &::before {
      content: '';
      display: inline-block;
      width: 1.5em;
      height: 1.5em;
      flex-shrink: 0;
      flex-grow: 0;
      border: 1px solid #adb5bd;
      border-radius: 0.25em;
      margin-right: 0.5em;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 50% 50%;
    }
  }
}

.label {
  padding: 0 0 0 10px;
  font-weight: 500;
  font-size: 16px;
  color: $white;
  &__black {
    @extend .label;
    color: $black800;
  }
}

.btn {
  &__container {
    justify-content: center;
    align-content: center;
    display: flex;
  }
  &__plus {
    justify-content: flex-end;
    align-items: center;
    display: flex;
    transition: .5s;
    &:hover {
      transform: scale(1.08);
    }
  }
}
.icon {
  font-size: 25px;
  color: $blue;
  align-items: center;
  &__gradient {
    color: transparent;
    -webkit-background-clip: text;
    background-image: linear-gradient(135deg, #0083C7 0%, #00AA5B 100%);
  }
  &-check_all_big:before {
    @extend .icon;
    content: "\ea00";
    color: $white;
    padding: 0 0 0 10px;
  }
  &-Lock:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\ea24";
  }
  &-user_pin:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e908";
  }
  &-caret_right:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\ea4a";
    color: $black200;
  }
  &-data:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e914";
  }
  &-group_alt:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e900";
  }
  &-home_alt_check:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e961";
  }
  &-credit_card:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\ea0e";
  }
  &-Case:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e9ff";
  }
  &-line_chart_up:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e9cb";
  }
  &-settings:before {
    @extend .icon;
    content: "\ea34";
  }
  &-chevron_big_right:before {
    @extend .icon;
    content: "\ea4e";
    color: $black200;
  }
  &-plus_circle:before {
    @extend .icon;
    content: "\e9a6";
  }
  &-Case:before {
    @extend .icon;
    content: "\e9ff";
  }
  &-id_card:before {
    @extend .icon;
    content: "\e902";
  }
  &-Earth:before {
    @extend .icon;
    content: "\ea11";
  }
  &-facebook:before {
    @extend .icon;
    content: "\e9e5";
  }
  &-LinkedIn::before {
    @extend .icon;
    content: "\e9ed";
  }
  &-twitter::before {
    @extend .icon;
    content: "\e9fa";
  }
  &-instagram::before {
    @extend .icon;
    content: "\e9ea";
  }
  &-phone::before {
    @extend .icon;
    content: "\ea2d";
  }
  &-mail::before {
    @extend .icon;
    content: "\ea27";
  }
  &-location::before {
    @extend .icon;
    content: "\ea23";
  }
  &-user::before {
    @extend .icon;
    content: "\e90c";
  }
  &-edit {
    position: absolute;
    top: 50%;
    margin-right: -50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &-edit::before {
    @extend .icon;
    content: "\e997"
  }
}
.user_edit_avatar {
  opacity: 0;
  width: 40px;
  height: 40px;
  background: #F7F8FA;
  position: relative;
  top: -60%;
  left: 35%;
  border-radius: 6px;
  -moz-transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}
.avatar__container:hover .user_edit_avatar{
  opacity: 1;
}
.icons {
  padding: 16px 0 16px 16px;
}
.checkbox {
  &__label::before {
    color: $white;
  }
}

.higher-level {
  &__img {
    z-index: 1;
    height: 100%;
    width: 100%;
    max-height: 253px;
    padding: 0 0 0 30px;
  }
}

.avatar {
  &__row {
    display: grid;
    grid-template-columns: 151px 1fr;
    grid-gap: 20px;
    margin: 20px;
  }
  &__container {
    height: 151px;
  }
}
.btn {
  width: 100%;
  &__container-right {
    @extend .btn;
    display: flex;
    justify-content: flex-end;
    margin: 0 20px 0 -20px;
    padding: 0 0 20px 0;
  }
  &__save {
    @extend .btn;
    margin-bottom: 20px;
    grid-column: 5/17;
  }
}
.quests {
  &__cards {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    padding-top: 20px;
  }
  &__top {
    position: relative;
    min-height: 160px;
  }
  &__search {
    position: absolute;
    max-width: 1180px;
    height: 83px;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1200;
    @include box;
  }
  &__content {
    display: flex;
    justify-content: center;
  }
  &__body {
    padding-top: 30px;
    max-width: 1180px;
    width: 100%;
    height: 100%;
    &_wrap {
      padding-top: 10px;
    }
  }
  &__text {
    @include text-simple;
    font-style: normal;
    &_title  {
      @extend .quests__text;
      font-weight: 500;
      font-size: 25px;
      line-height: 130%;
      color: $black800;
    }
  }
  &__tags {
    padding-top: 30px;
    max-width: 1180px;
  }
  &__tools {
    padding-top:  20px;
  }
}

.info {
  &__toggle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 50px 0 21px 9px;
  }
}

.checkbox {
  &__label {
    color: $white;
  }
}

.main {
  @include main;
  &-white {
    @include main;
    background: $white;
    background: #FFFFFF;
    margin: 0 0 20px 0;
    border-radius: 6px;
    justify-content: center;
  }
  &__body {
    max-width: 1180px;
    height: 100%;
  }
}
.profile {
  display: grid;
  justify-content: space-between;
  max-width: 1180px;
  &__status {
    max-width: 159px;
    margin: 0 0 10px 0;
    padding: 8px 13px;
    display: flex;
    background: $blue;
    color: $white;
    border-radius: 36px;
  }
  &__img {
    height: 151px;
    width: 151px;
    border-radius: 6px;
    object-fit: cover;
  }
  &__row-1col {
    @extend .profile;
    grid-template-columns: 1fr;
    margin: 0 20px 0 20px;
    width: 100%;
  }
  &__row-data {
    @extend .profile;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-gap: 0 20px;
  }
  &__row-3col {
    @extend .profile;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 0 20px;
    width: 100%;
  }
  &__row-4col {
    @extend .profile;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px 20px;
    margin: 31px 20px 0 20px;
    max-height: 63px;
  }
  &__textarea {
    padding: 10px 10px 0 10px;
    border-radius: 6px;
    margin: 11px 40px 20px 0;
    height: 114px;
    border: 0;
    background-color: #F7F8FA;
    resize: none;

    &::placeholder {
      color: $black200;
    }
  }
  &__title {
    margin: 20px 0 0 20px;
    padding: 20px 0 0 0;
  }
}
.settings {
  display: grid;
  grid-template-columns: 5fr 7fr;
  grid-gap: 20px;
  &_blue {
    padding: 10px 20px 10px 20px;
    margin: 20px 0 20px 0;
    background: rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: center;
  }
  &__option {
    padding: 5px 0 0 0;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  &__subtitle {
    margin: 7px 0;
    color: $black500;
    font-size: 16px;
  }
  &__left {
    @include main-white;
    display: flex;
    justify-content: center;
    background-color: #fff;
    border-radius: 6px;
    padding: 0 0 20px 20px;
    flex-direction: column;
  }
  &__right {
    @include main-white;
    justify-content: flex-start;
    border-radius: 6px;
    margin: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
}
.page {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  &__title {
    margin: 20px 0 20px 0;
    font-weight: 500;
    font-size: 25px;
    color: $black800;
  }
  &__profile {
    @include main-white;
    justify-content: flex-start;
    border-radius: 6px;
    margin: 20px 0 20px 0;
    display: inherit;
  }
  &__checkbox {
    margin: 50px 0 20px 20px;
    display: flex;
    flex-direction: row;
  }
  &__part {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    &_left {
      display: grid;
    }
    &_right {
      display: grid;
    }
  }
  &__info {
    background-color: #0083C7;
    border-radius: 6px;
    color: $white;
    max-height: 253px;
    &-title {
      margin: 20px 0 0 20px;
      font-size: 25px;
      font-weight: 500;
    }
    &-subtitle {
      margin: 10px 0 0 20px;
      font-size: 16px;
      font-weight: 400;
    }
  }
  &__badge {
    background: rgba(0, 131, 199, 0.1);
    border-radius: 44px;
    margin: 10px;
    color: $blue;
    padding: 5px 6px;
    display: flex;
    text-align: center;
    &-skills {
      padding: 15px;
    }
  }
  &__skills {
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    max-width: 1180px;
    width: 100%;
    justify-content: flex-start;
    //padding: 0 20px 0 0;
  }
}
.option {
  &__title {
    padding: 0 0 0 16px;
  }
  &__arrow {
    display: flex;
    align-content: center;
    justify-content: flex-end;
    padding: 0 16px 23px 0;
  }
}

.instruments {
  &__title {
    @include text-simple;
    font-size: 16px;
    color: $black800;
    margin: 15px 0 15px 0;
  }
}
.user {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 0 16px;
  &__name {
    padding: 10px 0 0 0;
    @include text-simple;
    font-size: 16px;
    font-weight: 600;
    color: $white;
  }
  &__icon {
    padding: 10px 0 0 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}
.arrow {
  &-left {
    display: flex;
    justify-content: flex-end;
  }
}
.card {
  &__level {
    padding: 60px 0 0 16px;
    &_higher {
      border-radius: 3px;
      text-align: center;
      width: 100%;
      max-width: 115px;
      background: #F6CF00;
      color: $white;
    }
  }
}
.instrument {
  display: grid;
  grid-template-columns: 1fr 6fr 1fr;
  background-color: $black100;
  border-radius: 6px;
  height: 100%;
  padding: 10px;
  margin: 15px 0 0 0;
  align-items: center;
  &__title {
    @include text-simple;
    color:$black600;
    font-weight: 400;
    font-size: 16px;
  }
}
.edit_avatar {
  width: 100%;
  height: 100%;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
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
    &__skills {
      margin: 0 0 10px 20px;
    }
    &__badge {
      text-align: center;
    }
    &__profile {
      margin: 20px;
    }
  }
  .settings {
    margin: 20px;
  }
}
@include _991 {
  .knowledge {
    &__container {
      grid-template-columns: 5fr 28px 5fr 0;
      max-height: 100%;
    }
  }
  .settings {
    grid-auto-rows: auto auto;
    grid-template-columns: 5fr;
  }
  .page {
    &__grid {
      grid-template-columns: 11fr 1fr;
    }
  }
  .profile {
    &__row-3col {
      grid-template-columns: repeat(2, 1fr);
    }
    &__row-4col {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr;
      max-height: 100%;
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
  .avatar {
    &__row {
      margin: 20px 20px 0 20px;
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
  .avatar {
    &__row {
      flex-direction: column;
    }
    &__container {
      justify-self: center;
    }
  }
  .profile {
    &__row-3col {
      grid-template-columns: 1fr;
    }
    &__row-4col {
      grid-template-columns: 1fr;
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
  .profile {
    &__row-data {
      grid-template-columns: 1fr;
      grid-gap: 20px;
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
  .main-white {
    width: calc(98vw - 71px);
  }
  .btn {
    &__save {
      margin-bottom: 20px;
      grid-column: 5/14;
    }
  }
}

@include _380 {
  .btn {
    &__save {
      margin-bottom: 20px;
      grid-column: 5/14;
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
</style>
