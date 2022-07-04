<template>
  <div
    class="profile"
    data-selector="COMPONENT-PROFILE"
  >
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
            :src="imageData ? imageData : $options.images.EMPTY_AVATAR"
            alt="avatar-image"
            class="profile__avatar-img"
          >
          <input
            id="avatar"
            class="profile__avatar-input"
            type="file"
            accept="image/*"
            data-selector="ACTION-BTN-UPLOAD-PROFILE-IMAGE"
            @change="processFile($event, validate)"
          >
          <label
            class="icon icon-edit profile__avatar-hover"
            for="avatar"
          />
        </ValidationProvider>
        <div class="profile__personal-info">
          <StatusKYC class="profile__status" />
          <base-field
            v-for="main in mainInputs"
            :key="main.index"
            v-model="profile[main.model]"
            :data-selector="main.model"
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
            v-model="profile.locationFull.locationPlaceName"
            v-click-outside="hideSearchDD"
            :placeholder="$t('settings.addressInput')"
            data-selector="ADDRESS"
            rules="max:100|required"
            mode="icon"
            :selector="isSearchDDStatus"
            :name="$t('meta.addressSmall')"
            @focus="isSearchDDStatus = true"
            @blur="checkValidate"
            @selector="getAddressInfo(profile.locationFull.locationPlaceName)"
          >
            <template v-slot:left>
              <span class="icon icon-location" />
            </template>
            <template v-slot:selector>
              <div
                v-if="addresses.length && isSearchDDStatus"
                class="profile__selector selector"
                data-selector="ADDRESS-SELECTOR"
              >
                <div
                  class="selector__items"
                  data-selector="ADDRESS-SELECTOR-ADDRESSES"
                >
                  <div
                    v-for="(item, i) in addresses"
                    :key="i"
                    :data-selector="`ADDRESS-SELECTOR-ADDRESS-${i}`"
                    class="selector__item"
                    @click="selectAddress(item)"
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
              data-selector="MAIN-PHONE-FIELD"
              :default-country-code="firstPhone.codeRegion"
              :error="!isValidPhoneNumber"
              class="profile__phone-input"
              error-color="#EB5757"
              clearable
              show-code-on-list
              required
              size="sm"
              color="#ccc"
              @update="updateFirstPhone($event)"
            />
            <span
              v-if="!isValidPhoneNumber"
              class="profile__error"
            >
              {{ $t('messages.invalidPhone') }}
            </span>
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
              data-selector="SECOND-PHONE-FIELD"
              :error="!isValidSecondPhoneNumber"
              :default-country-code="secondPhoneNumber.codeRegion"
              error-color="#EB5757"
              clearable
              show-code-on-list
              size="sm"
              @update="updateSecondPhone($event)"
            />
            <span
              v-if="!isValidSecondPhoneNumber"
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
            :data-selector="company.model"
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
        <div
          class="profile__description"
        >
          <base-textarea
            id="textarea"
            v-model="profile.additionalInfo.description"
            rules="max:650"
            :placeholder="$t('settings.userDesc')"
            data-selector="DESCRIPTION-FIELD"
            :name="$t('modals.description')"
            class="profile__description-textarea"
          />
          <span class="profile__error" />
        </div>
      </div>
      <div
        v-show="userRole === UserRole.WORKER"
        data-selector="PROFILE-EDUCATION-&-WORK-EXP"
        class="profile__knowledge"
      >
        <div
          data-selector="PROFILE-EDUCATION"
          class="profile__knowledge-container"
        >
          <div class="profile__knowledge-title">
            {{ $t("meta.educations") }}
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
              :data-selector="`ACTION-BTN-ADD-EDUCATION-${newEducation.place}`"
              @click="addNewKnowledge(profile.additionalInfo.educations, 'newEducation', 'education', 'education')"
              @blur="clearError(newEducation ? newEducation
                : profile.additionalInfo.educations[profile.additionalInfo.educations.length - 1], 'education')"
            />
          </ValidationProvider>
        </div>
        <div
          data-selector="PROFILE-WORK-EXP"
          class="profile__knowledge-container"
        >
          <div class="profile__knowledge-title">
            {{ $t("settings.workExp") }}
          </div>
          <div
            v-if="getWorkExp"
            class="profile__knowledge-added"
          >
            <add-form
              v-for="(work, i) in profile.additionalInfo.workExperiences"
              :key="work.id"
              :item="work"
              :data-selector="`ACTION-BTN-DELETE-WORK-EXP-${i}`"
              :is-adding="false"
              @click="deleteKnowledge(profile.additionalInfo.workExperiences, i)"
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
              :data-selector="`ACTION-BTN-ADD-WORK-EXP-${newWorkExp.place}`"
              @click="addNewKnowledge(profile.additionalInfo.workExperiences, 'newWorkExp', 'work', 'work')"
              @blur="clearError(newWorkExp ? newWorkExp
                : profile.additionalInfo.workExperiences[profile.additionalInfo.workExperiences.length - 1], 'work')"
            />
          </ValidationProvider>
        </div>
      </div>
      <div
        class="profile__socials"
        data-selector="SOCIALS"
      >
        <base-field
          v-for="social in socials"
          :key="social.index"
          v-model="profile.additionalInfo.socialNetwork[social.model]"
          :data-selector="social.model"
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
          data-selector="SAVE-CHANGES"
          @click="$emit('click')"
        >
          {{ $t("meta.btns.save") }}
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
import StatusKYC from './StatusKYC.vue';
import AddForm from './AddForm.vue';
import { UserRole } from '~/utils/enums';
import { images } from '~/utils/images';

export default {
  name: 'SettingsProfile',
  images,
  components: { StatusKYC, AddForm },
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
    isValidSecondPhoneNumber: {
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
          rules: 'required||max:15||alpha_spaces_dash',
          placeholder: 'settings.nameInput',
          name: 'meta.firstNameSmall',
          icon: 'icon-user',
          isDisabled: false,
        },
        {
          model: 'lastName',
          rules: 'required||max:15||alpha_spaces_dash',
          placeholder: 'settings.lastNameInput',
          name: 'meta.lastNameSmall',
          icon: 'icon-user',
          isDisabled: false,
        },
        {
          model: 'email',
          name: 'meta.placeholders.email',
          rules: 'max:100||email',
          placeholder: 'meta.placeholders.mail',
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
    profileSecondPhone() {
      const { secondMobileNumber } = this.profile.additionalInfo;
      return {
        codeRegion: secondMobileNumber?.codeRegion,
        phone: secondMobileNumber?.phone,
        fullPhone: secondMobileNumber?.fullPhone,
      };
    },
    profileFirstPhone() {
      const { firstPhone } = this.profile;
      return {
        codeRegion: firstPhone?.codeRegion,
        phone: firstPhone?.phone,
        fullPhone: firstPhone?.fullPhone,
      };
    },
  },
  watch: {
    profile() {
      this.secondPhoneNumber = this.profileSecondPhone;
      this.firstPhone = this.profileFirstPhone;
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
    selectAddress(address) {
      this.profile.locationFull.locationPlaceName = address.formatted;
      this.addresses = [];
      this.$emit('updateFullAddress', address);
    },
    async getAddressInfo(keyword) {
      try {
        if (keyword.length) {
          this.addresses = await this.geoCode.geolookup(keyword);
        } else this.addresses = [];
      } catch (e) {
        this.addresses = [];
        console.error('Geo look up is failed', e);
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
    height: 114px;
  }
  &__description-textarea::v-deep {
    .ctm-field__textarea {
      height: 114px;
    }
  }
  &__error {
    color: $errorText;
    font-size: 12px;
    min-height: 23px;
  }
  &__knowledge-title {
    margin-bottom: 15px;
  }
  &__socials {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 20px;
  }
  &__save {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    span {
      color: $errorText;
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
        background: $black0;
      }
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

@include _1199 {
  .profile__socials {
    grid-template-columns: repeat(2, 1fr);
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
