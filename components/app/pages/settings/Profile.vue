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
          <verified
            v-if="userRole === 'worker'"
            class="profile__status"
          />
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
            rules="max:100||required"
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
              v-if="userRole === 'employer'"
              for="phone1"
            >
              {{ $t('settings.mainPhoneNumber') }}
            </label>
            <vue-phone-number-input
              id="phone1"
              v-model="secondPhoneNumber.fullPhone"
              :default-country-code="secondPhoneNumber.codeRegion"
              :error="!isValidPhoneNumber"
              error-color="#EB5757"
              clearable
              show-code-on-list
              required
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
          <div
            v-if="userRole === 'employer'"
            class="profile__phone-input"
          >
            <label for="phone2">
              {{ $t('settings.additionalPhoneNumber') }}
            </label>
            <vue-phone-number-input
              id="phone2"
              v-model="firstPhone"
              class="profile__phone-input"
              error-color="#EB5757"
              size="lg"
              color="#ccc"
              disabled
            />
          </div>
        </div>
        <div
          v-if="userRole === 'employer'"
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
        v-if="userRole === 'worker'"
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
            :mode="'passive'"
          >
            <add-form
              :item="newEducation"
              :is-adding="true"
              @click="addNewKnowledge(profile.additionalInfo.educations, 'newEducation', 'education', 'education')"
              @blur="clearError(newEducation, 'education')"
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
            :mode="'passive'"
          >
            <add-form
              :item="newWorkExp"
              :is-adding="true"
              @click="addNewKnowledge(profile.additionalInfo.workExperiences, 'newWorkExp', 'work', 'work')"
              @blur="clearError(newWorkExp, 'work')"
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
        v-if="userRole === 'employer'"
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
      firstPhone: null,
      secondPhoneNumber: { codeRegion: 'RU', phone: null, fullPhone: null },
      newEducation: { from: '', to: '', place: '' },
      newWorkExp: { from: '', to: '', place: '' },
      isSearchDDStatus: false,
      addresses: [],
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
          codeRegion: this.profile?.additionalInfo?.secondMobileNumber?.codeRegion || null,
          phone: null,
          fullPhone: this.profile?.additionalInfo?.secondMobileNumber?.fullPhone || null,
        };
        if (this.userRole === 'employer') this.firstPhone = this.profile.firstPhone.phone || null;
      },
    },
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

    // GEOPOSITION METHODS
    selectAddress(address) {
      this.profile.additionalInfo.address = address.formatted;
      this.addresses = [];
    },
    async getAddressInfo(address) {
      let response = [];
      const geoCode = new GeoCode('google', { key: process.env.GMAPKEY });
      if (address.length) {
        response = await geoCode.geolookup(address);
        this.addresses = JSON.parse(JSON.stringify(response));
        this.coordinates = JSON.parse(JSON.stringify({ lng: response[0].lng, lat: response[0].lat }));
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
      console.log(knowledgeArray);
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
    border-radius: 0px;
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
