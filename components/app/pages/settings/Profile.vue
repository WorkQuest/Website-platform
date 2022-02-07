<template>
  <div class="profile">
    <div class="profile__title">
      {{ $t("settings.profileInfo") }}
    </div>
    <div class="profile__personal">
      <div class="profile__personal-main">
        <ValidationProvider
          v-slot="{ validate }"
          rules="ext:png,jpeg,jpg"
          tag="div"
          class="profile__avatar"
        >
          <img
            id="userAvatar"
            :src="imageData ? imageData : require('~/assets/img/app/avatar_empty.png')"
            alt="avatar-image"
            class="profile__avatar-img"
          >
          <input
            id="avatar"
            class="profile__avatar-input"
            type="file"
            accept="image/*"
            @change="processFile($event, validate)"
          >
          <label
            class="icon icon-edit profile__avatar-hover"
            for="avatar"
          />
        </ValidationProvider>
        <div class="profile__personal-info">
          <verified class="profile__status" />
          <base-field
            v-for="main in mainInputs"
            :key="main.index"
            v-model="profile[main.model]"
            :rules="main.rules"
            :placeholder="$t(main.placeholder)"
            mode="icon"
            :disabled="main.isDisabled"
            :name="$t(main.name)"
            @blur="checkValidate"
          >
            <template v-slot:left>
              <span :class="['icon', main.icon]" />
            </template>
          </base-field>
          <base-field
            v-model="profile.additionalInfo.address"
            v-click-outside="hideSearchDD"
            :placeholder="$t('settings.addressInput')"
            rules="max:100|required"
            mode="icon"
            :selector="isSearchDDStatus"
            :name="$t('settings.address')"
            @focus="isSearchDDStatus = true"
            @blur="checkValidate"
            @selector="getAddressInfo(profile.additionalInfo.address)"
          >
            <template v-slot:left>
              <span class="icon icon-location" />
            </template>
            <template v-slot:selector>
              <div
                v-if="addresses.length && isSearchDDStatus"
                class="profile__selector selector"
              >
                <div class="selector__items">
                  <div
                    v-for="(item, i) in addresses"
                    :key="i"
                    class="selector__item"
                    @click="selectAddress(item, i)"
                  >
                    {{ item.formatted }}
                  </div>
                </div>
              </div>
            </template>
          </base-field>
          <div class="profile__phone-input">
            <label
              v-if="userRole === UserRole.EMPLOYER"
              for="phone1"
            >
              {{ $t('settings.mainPhoneNumber') }}
            </label>
            <vue-phone-number-input
              id="phone1"
              v-model="firstPhone.fullPhone"
              :default-country-code="firstPhone.codeRegion"
              :error="!isValidPhoneNumber"
              class="profile__phone-input"
              error-color="#EB5757"
              clearable
              show-code-on-list
              required
              size="lg"
              color="#ccc"
              @update="updateFirstPhone($event)"
            />
          </div>
          <div class="profile__phone-input">
            <label
              v-if="userRole === UserRole.EMPLOYER"
              for="phone2"
            >
              {{ $t('settings.additionalPhoneNumber') }}
            </label>
            <vue-phone-number-input
              v-if="userRole === UserRole.EMPLOYER"
              id="phone2"
              v-model="secondPhoneNumber.fullPhone"
              :default-country-code="secondPhoneNumber.codeRegion"
              error-color="#EB5757"
              clearable
              show-code-on-list
              size="lg"
              @update="updateSecondPhone($event)"
            />
            <span
              v-if="!isValidPhoneNumber"
              class="profile__error"
            >
              {{ $t('messages.invalidPhone') }}
            </span>
          </div>
        </div>
        <div
          v-if="userRole === UserRole.EMPLOYER"
          class="profile__company"
        >
          <base-field
            v-for="company in companyInputs"
            :key="company.index"
            v-model="profile.additionalInfo[company.model]"
            :rules="company.rules"
            :placeholder="$t(company.placeholder)"
            mode="icon"
            :name="$t(company.name)"
          >
            <template v-slot:left>
              <span :class="['icon', company.icon]" />
            </template>
          </base-field>
        </div>
        <ValidationProvider
          v-slot="{ errors }"
          tag="div"
          class="profile__description"
          rules="max:650"
        >
          <textarea
            id="textarea"
            v-model="profile.additionalInfo.description"
            :placeholder="$t('settings.userDesc')"
            class="profile__description-textarea"
            :class="{ 'profile__description-textarea_error': errors[0] }"
          />
          <span class="profile__error">
            {{ errors[0] }}
          </span>
        </ValidationProvider>
      </div>
      <div
        v-show="userRole === UserRole.WORKER"
        class="profile__knowledge"
      >
        <div class="profile__knowledge-container">
          <div class="profile__knowledge-title">
            {{ $t("settings.educations") }}
          </div>
          <div
            v-if="getEducation"
            class="profile__knowledge-added"
          >
            <add-form
              v-for="(education, index) in profile.additionalInfo.educations"
              :key="education.id"
              :item="education"
              :is-adding="false"
              @click="deleteKnowledge(profile.additionalInfo.educations, index)"
            />
          </div>
          <ValidationProvider
            ref="education"
            tag="div"
            class="profile__validation"
          >
            <add-form
              :item="newEducation"
              :is-adding="true"
              :placeholder="$t('settings.education.educationalInstitution')"
              @click="addNewKnowledge(profile.additionalInfo.educations, 'newEducation', 'education', 'education')"
              @blur="clearError(newEducation ? newEducation
                : profile.additionalInfo.educations[profile.additionalInfo.educations.length - 1], 'education')"
            />
          </ValidationProvider>
        </div>
        <div class="profile__knowledge-container">
          <div class="profile__knowledge-title">
            {{ $t("settings.workExp") }}
          </div>
          <div
            v-if="getWorkExp"
            class="profile__knowledge-added"
          >
            <add-form
              v-for="(work, index) in profile.additionalInfo.workExperiences"
              :key="work.id"
              :item="work"
              :is-adding="false"
              @click="deleteKnowledge(profile.additionalInfo.workExperiences, index)"
            />
          </div>
          <ValidationProvider
            ref="work"
            tag="div"
            class="profile__validation"
          >
            <add-form
              :item="newWorkExp"
              :is-adding="true"
              :placeholder="$t('settings.workExps.companyName')"
              @click="addNewKnowledge(profile.additionalInfo.workExperiences, 'newWorkExp', 'work', 'work')"
              @blur="clearError(newWorkExp ? newWorkExp
                : profile.additionalInfo.workExperiences[profile.additionalInfo.workExperiences.length - 1], 'work')"
            />
          </ValidationProvider>
        </div>
      </div>
      <div class="profile__socials">
        <base-field
          v-for="social in socials"
          :key="social.index"
          v-model="profile.additionalInfo.socialNetwork[social.model]"
          :rules="social.rules"
          :placeholder="$t(social.placeholder)"
          mode="icon"
          :name="$t(social.name)"
        >
          <template v-slot:left>
            <span :class="['icon', social.icon]" />
          </template>
        </base-field>
      </div>
      <div
        v-if="userRole === UserRole.EMPLOYER"
        class="profile__save"
      >
        <base-btn
          class="profile__btn"
          @click="$emit('click')"
        >
          {{ $t("settings.save") }}
        </base-btn>
        <span v-if="validationError">
          {{ $t('messages.formError') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { GeoCode } from 'geo-coder';
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import Verified from '~/components/app/pages/settings/Verified.vue';
import AddForm from './AddForm.vue';
import { UserRole } from '~/utils/enums';

export default {
  name: 'SettingsProfile',
  components: { Verified, AddForm },
  directives: {
    ClickOutside,
  },
  props: {
    avatarChange: {
      type: Object,
      default: () => {},
    },
    profile: {
      type: Object,
      default: () => {},
    },
    validationError: {
      type: Boolean,
      default: false,
    },
    isValidPhoneNumber: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedAddressIndex: null,
      geoCode: null,
      firstPhone: { codeRegion: 'RU', phone: null, fullPhone: null },
      secondPhoneNumber: { codeRegion: 'RU', phone: null, fullPhone: null },
      newEducation: { from: '', to: '', place: '' },
      newWorkExp: { from: '', to: '', place: '' },
      isSearchDDStatus: false,
      addresses: [],
      coordinates: { lng: '', lat: '', address: '' },
      mainInputs: [
        {
          model: 'firstName',
          rules: 'required||max:50',
          placeholder: 'settings.nameInput',
          name: 'settings.firstName',
          icon: 'icon-user',
          isDisabled: false,
        },
        {
          model: 'lastName',
          rules: 'required||max:50',
          placeholder: 'settings.lastNameInput',
          name: 'settings.lastName',
          icon: 'icon-user',
          isDisabled: false,
        },
        {
          model: 'email',
          name: 'placeholders.email',
          rules: 'max:100||email',
          placeholder: 'placeholders.mail',
          icon: 'icon-mail',
          isDisabled: true,
        },
      ],
      companyInputs: [
        {
          model: 'company',
          rules: 'max:100',
          placeholder: 'settings.company',
          name: 'settings.companyName',
          icon: 'icon-Case',
        },
        {
          model: 'CEO',
          rules: 'max:100',
          placeholder: 'settings.ceo',
          name: 'settings.ceoName',
          icon: 'icon-id_card',
        },
        {
          model: 'website',
          rules: 'max:100',
          placeholder: 'settings.website',
          name: 'settings.websiteName',
          icon: 'icon-Earth',
        },
      ],
      socials: [
        {
          model: 'instagram',
          rules: 'max:50',
          placeholder: 'settings.instagramUsername',
          name: 'settings.instagram',
          icon: 'icon-instagram',
        },
        {
          model: 'twitter',
          rules: 'max:50',
          placeholder: 'settings.twitterUsername',
          name: 'settings.twitter',
          icon: 'icon-twitter',
        },
        {
          model: 'linkedin',
          rules: 'max:50',
          placeholder: 'settings.linkedInUsername',
          name: 'settings.linkedin',
          icon: 'icon-LinkedIn',
        },
        {
          model: 'facebook',
          rules: 'max:50',
          placeholder: 'settings.facebookUsername',
          name: 'settings.facebook',
          icon: 'icon-facebook',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      imageData: 'user/getImageData',
      userRole: 'user/getUserRole',
    }),
    UserRole() {
      return UserRole;
    },
    getEducation() {
      return this.profile.additionalInfo.educations.length !== 0;
    },
    getWorkExp() {
      return this.profile.additionalInfo.workExperiences.length !== 0;
    },
  },
  watch: {
    profile: {
      deep: true,
      handler() {
        this.secondPhoneNumber = {
          codeRegion: this.profile?.additionalInfo?.secondMobileNumber?.codeRegion,
          phone: this.profile?.additionalInfo?.secondMobileNumber?.phone,
          fullPhone: this.profile?.additionalInfo?.secondMobileNumber?.fullPhone,
        };
        this.firstPhone = {
          codeRegion: this.profile.firstPhone?.codeRegion,
          phone: this.profile.firstPhone?.phone,
          fullPhone: this.profile.firstPhone?.fullPhone,
        };
      },
    },
  },
  mounted() {
    this.geoCode = new GeoCode('google', {
      key: process.env.GMAPKEY,
      lang: this.$i18n?.localeProperties?.code || 'en-US',
    });
    this.validationRefs();
  },
  methods: {
    // UPDATE AVATAR
    // eslint-disable-next-line consistent-return
    async processFile(e, validate) {
      const isValid = await validate(e);
      const reader = new FileReader();
      const file = e.target.files[0];
      if (isValid.valid) {
        if (!file) return false;
        reader.readAsDataURL(file);
        this.avatarChange.data = await this.$store.dispatch('user/imageType', { contentType: file.type });
        this.avatarChange.file = file;
        let output = document.getElementById('userAvatar');
        const modalMode = 'imageLoadedSuccessful';
        if (!output) output = document.getElementById('userAvatarTwo');
        output.src = URL.createObjectURL(file);
        // eslint-disable-next-line func-names
        output.onload = function () { URL.revokeObjectURL(output.src); };
        this.$emit('showModalStatus', modalMode);
        reader.onerror = (evt) => { console.error(evt); };
      }
    },

    // UPDATE PHONE NUMBERS
    updateSecondPhone(value) {
      this.$emit('updateSecondPhone', value);
    },
    updateFirstPhone(value) {
      this.$emit('updateFirstPhone', value);
    },
    validationRefs() {
      this.$emit('validationRef', { work: this.$refs.work, education: this.$refs.education });
    },

    // GEOPOSITION METHODS
    selectAddress(address, i) {
      this.selectedAddressIndex = i;
      this.profile.additionalInfo.address = address.formatted;
      this.addresses = [];
      this.$emit('updateCoordinates', this.coordinates);
    },
    async getAddressInfo(address) {
      try {
        if (address.length) {
          this.addresses = await this.geoCode.geolookup(address);
          if (this.selectedAddressIndex) {
            this.coordinates = {
              lng: this.addresses[this.selectedAddressIndex].lng,
              lat: this.addresses[this.selectedAddressIndex].lat,
              address: this.addresses[this.selectedAddressIndex].formatted,
            };
          } else {
            this.coordinates = { lng: this.addresses[0].lng, lat: this.addresses[0].lat, address: this.addresses[0].formatted };
          }
        } else this.addresses = [];
      } catch (e) {
        this.addresses = [];
        console.error('Geo look up is failed', e);
        await this.$store.dispatch('main/showToast', {
          text: 'Address is not correct',
        });
      }
    },
    hideSearchDD() {
      this.isSearchDDStatus = false;
    },

    // ADD KNOWLEDGE METHODS
    async addNewKnowledge(knowledgeArray, newKnowledge, observerName, modalMsg) {
      this.$emit('updateEducation', newKnowledge, this[newKnowledge]);
      this[newKnowledge] = { from: '', to: '', place: '' };
      const modalMode = modalMsg === 'education' ? 'educationAddSuccessful' : 'workExpAddSuccessful';
      this.$emit('showModalStatus', modalMode);
      this.$refs[observerName].reset();
    },
    deleteKnowledge(knowledgeArray, index) {
      knowledgeArray.splice(index, 1);
    },
    clearError(value, observerName) {
      const isClear = Object.keys(value).every((field) => value[field] === '' || value[field] === null);
      if (isClear) this.$refs[observerName].reset();
    },
    checkValidate() {
      this.$emit('checkValidate');
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
  display: grid;
  background: $white;
  padding: 20px;
  gap: 20px;
  border-radius: 6px;
  &__personal {
    display: grid;
    gap: 20px;
  }
  &__personal-main {
    display: grid;
    grid-template-columns: 1fr 7fr;
    grid-gap: 20px;
  }
  &__avatar {
    position: relative;
    height: 151px;
    width: 151px;
  }
  &__avatar:hover > &__avatar-hover {
    opacity: 1;
  }
  &__avatar-img {
    height: 151px;
    width: 151px;
    border-radius: 6px;
    object-fit: cover;
  }
  &__avatar-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
  }
  &__avatar-hover {
    display: flex;
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    background: white;
    transition: opacity 0.3s;
  }
  &__personal-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
  }
  &__status {
    grid-column-start: 1;
    grid-column-end: 3;
    max-width: 159px;
    padding: 8px 13px;
    display: flex;
    background: $blue;
    color: $white;
    border-radius: 36px;
    max-height: 34px;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  &__row-data {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
  }
  &__company {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    grid-column-start: 1;
    grid-column-end: 3;
  }
  &__description {
    display: grid;
    grid-column-start: 1;
    grid-column-end: 3;
    &::placeholder {
      color: $black200;
    }
  }
  &__description-textarea {
    background-color: $black0;
    resize: none;
    padding: 10px 10px 0 10px;
    margin: 0;
    border-radius: 6px;
    height: 114px;
    border: 1px solid transparent;
    &_error {
      border: 1px solid red
    }
  }
  &__error {
    color: #bb5151;
    font-size: 12px;
    min-height: 23px;
  }
  &__knowledge-title {
    margin-bottom: 15px;
  }
  &__socials {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 20px;
  }
  &__save {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    span {
      color: #bb5151;
      font-size: 14px;
      min-height: 23px;
      width: 250px;
      text-align: center;
      }
    }
  &__btn {
    max-width: 250px;
  }
  .selector {
    &__items {
      padding: 10px;
      background-color: $black0;
      border-radius: 5px;
      border: 1px solid $blue;
      cursor: pointer;
    }
  }
}

.icon {
  font-size: 25px;
  &::before {
    color: $blue;
    align-items: center;
  }
}

@include _991 {
  .profile {
    &__personal-info {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    &__phone-input {
      margin-bottom: 20px;
    }
  }
}

@include _767 {
  .profile {
    &__company {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
}

@include _575 {
  .profile {
    border-radius: 0;
    &__personal-main {
      display: block;
    }
    &__avatar {
      margin: 0 auto 10px;
    }
    &__status {
      margin: 0 auto 10px;
    }
    &__socials {
      grid-template-columns: 1fr;
    }
    &__save {
      width: 100%;
      span {
        width: 100%;
      }
    }
    &__btn {
      max-width: none;
    }
  }
}
</style>
