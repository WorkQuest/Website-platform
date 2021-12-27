<template>
  <div class="profile">
    <div class="profile__title">
      {{ $t("settings.profileInfo") }}
    </div>
    <div class="profile__personal">
      <div class="profile__personal-main">
        <div class="profile__avatar">
          <img
            :src="imageData ? imageData : require('~/assets/img/app/avatar_empty.png')"
            alt="avatar-image"
            class="profile__avatar-img"
          >
          <input
            id="avatar"
            type="file"
            class="profile__avatar-input"
          >
          <label
            class="icon icon-edit profile__avatar-hover"
            for="avatar"
          />
        </div>
        <div class="profile__personal-info">
          <verified
            v-if="userRole === 'worker'"
            class="profile__status"
          />
          <base-field
            v-model="localUserData.firstName"
            :placeholder="localUserData.firstName || $t('settings.nameInput')"
            mode="icon"
            :name="$t('settings.firstName')"
          >
            <template v-slot:left>
              <span class="icon icon-user" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.lastName"
            :placeholder="localUserData.lastName || $t('settings.lastNameInput')"
            mode="icon"
            :name="$t('settings.lastName')"
          >
            <template v-slot:left>
              <span class="icon icon-user" />
            </template>
          </base-field>
          <vue-phone-number-input
            v-model="localUserData.additionalInfo.secondMobileNumber"
            class="profile__phone-input"
            error-color="#EB5757"
            clearable
            show-code-on-list
            required
            size="lg"
            @update="updatedPhone = $event"
          />
          <base-field
            v-model="localUserData.additionalInfo.address"
            v-click-outside="hideSearchDD"
            :placeholder="localUserData.additionalInfo.address || $t('settings.addressInput')"
            rules="max:100"
            mode="icon"
            :selector="isSearchDDStatus"
            :name="$t('settings.address')"
            @focus="isSearchDDStatus = true"
            @selector="getAddressInfo(localUserData.additionalInfo.address)"
          >
            <template v-slot:left>
              <span class="icon icon-location" />
            </template>
            <template v-slot:selector>
              <div
                v-if="addresses.length && isSearchDDStatus"
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
        <div
          v-if="true"
          class="profile__company"
        >
          <base-field
            v-model="localUserData.additionalInfo.company"
            :placeholder="localUserData.additionalInfo.company || $t('settings.company')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon icon-Case" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.ceo"
            :placeholder="localUserData.additionalInfo.ceo || $t('settings.ceo')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon icon-id_card" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.website"
            :placeholder="localUserData.additionalInfo.website || $t('settings.website')"
            mode="icon"
            rules="max:100"
          >
            <template v-slot:left>
              <span class="icon icon-Earth" />
            </template>
          </base-field>
        </div>
        <textarea
          id="textarea"
          v-model="localUserData.additionalInfo.description"
          class="profile__description"
          :placeholder="localUserData.additionalInfo.description || $t('settings.userDesc')"
        />
      </div>
      <div class="profile__knowledge">
        <div
          v-if="true"
          class="profile__knowledge-container"
        >
          <div class="profile__knowledge-title">
            {{ $t("settings.educations") }}
          </div>
          <div
            v-if="localUserData.additionalInfo.educations.length !== 0"
            class="profile__knowledge-added"
          >
            <add-form
              v-for="(education, index) in localUserData.additionalInfo.educations"
              :key="education.id"
              :item="education"
              :is-adding="false"
              @click="deleteKnowledge(localUserData.additionalInfo.educations, index)"
            />
          </div>
          <ValidationObserver
            ref="education"
            tag="div"
            class="profile__validation"
            disabled
          >
            <add-form
              :item="newEducation"
              :is-adding="true"
              :validation-mode="'passive'"
              @click="addNewKnowledge(localUserData.additionalInfo.educations, 'newEducation', 'education', 'education')"
              @blur="clearError(newEducation, 'education')"
            />
          </ValidationObserver>
        </div>
        <div
          v-if="true"
          class="profile__knowledge-container"
        >
          <div
            v-if="true"
            class="profile__knowledge-title"
          >
            {{ $t("settings.workExp") }}
          </div>
          <div
            v-if="localUserData.additionalInfo.workExperiences.length !== 0"
            class="profile__knowledge-added"
          >
            <add-form
              v-for="(work, index) in localUserData.additionalInfo.workExperiences"
              :key="work.id"
              :item="work"
              :is-adding="false"
              @click="deleteKnowledge(localUserData.additionalInfo.workExperiences, index)"
            />
          </div>
          <ValidationObserver
            ref="work"
            tag="div"
            class="profile__validation"
            disabled
          >
            <add-form
              :item="newWorkExp"
              :is-adding="true"
              @click="addNewKnowledge(localUserData.additionalInfo.workExperiences, 'newWorkExp', 'work', 'work')"
              @blur="clearError(newWorkExp, 'work')"
            />
          </ValidationObserver>
        </div>
      </div>
      <div class="profile__socials">
        <base-field
          v-model="localUserData.additionalInfo.socialNetwork.instagram"
          :placeholder="localUserData.additionalInfo.socialNetwork.instagram || $t('settings.instagramUsername')"
          mode="icon"
          :name="$t('settings.instagram')"
        >
          <template v-slot:left>
            <span class="icon icon-instagram" />
          </template>
        </base-field>
        <base-field
          v-model="localUserData.additionalInfo.socialNetwork.twitter"
          :placeholder="localUserData.additionalInfo.socialNetwork.twitter || $t('settings.twitterUsername')"
          mode="icon"
          :name="$t('settings.twitter')"
        >
          <template v-slot:left>
            <span class="icon icon-twitter" />
          </template>
        </base-field>
        <base-field
          v-model="localUserData.additionalInfo.socialNetwork.linkedin"
          :placeholder="localUserData.additionalInfo.socialNetwork.linkedin || $t('settings.linkedInUsername')"
          mode="icon"
          :name="$t('settings.linkedin')"
        >
          <template v-slot:left>
            <span class="icon icon-LinkedIn" />
          </template>
        </base-field>
        <base-field
          v-model="localUserData.additionalInfo.socialNetwork.facebook"
          :placeholder="localUserData.additionalInfo.socialNetwork.facebook || $t('settings.facebookUsername')"
          mode="icon"
          :name="$t('settings.facebook')"
        >
          <template v-slot:left>
            <span class="icon icon-facebook" />
          </template>
        </base-field>
      </div>
      <div
        v-if="true"
        class="profile__save"
      >
        <base-btn
          class="profile__btn"
          @click="$emit('click')"
        >
          {{ $t("settings.save") }}
        </base-btn>
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
import modals from '~/store/modals/modals';

export default {
  name: 'Profile',
  components: { Verified, AddForm },
  directives: {
    ClickOutside,
  },
  props: {
    localUserData: {
      type: Object,
      default: null,
    },
    addresses: {
      type: Array,
      default: () => {},
    },
    newEducation: {
      type: Object,
      default: null,
    },
    newWorkExp: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isSearchDDStatus: false,
    };
  },
  computed: {
    ...mapGetters({
      imageData: 'user/getImageData',
      userRole: 'user/getUserRole',
    }),
  },

  methods: {
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
    hideSearchDD() {
      this.isSearchDDStatus = false;
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
    showModalStatus(modalMode) {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.modalsStatusTitle(modalMode),
        subtitle: this.modalsStatusSubtitles(modalMode),
      });
    },
    async addNewKnowledge(knowledgeArray, newKnowledge, observerName, modalMsg) {
      const validate = await this.$refs[observerName].validate();
      if (validate) {
        knowledgeArray.push({ ...this[newKnowledge] });
        this[newKnowledge] = {
          from: '',
          to: '',
          place: '',
        };
        this.showModalStatus(modalMsg === 'education' ? 'educationAddSuccessful' : 'workExpAddSuccessful');
        this.$refs[observerName].reset();
      }
    },
    deleteKnowledge(knowledgeArray, index) {
      knowledgeArray.splice(index, 1);
    },
    clearError(value, observerName) {
      const isClear = Object.keys(value).every(
        (field) => value[field] === '' || value[field] === null,
      );
      if (isClear) {
        this.$refs[observerName].reset();
      }
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
    padding: 10px 10px 0 10px;
    margin: 0;
    border-radius: 6px;
    height: 114px;
    width: 100%;
    border: 0;
    background-color: $black0;
    resize: none;
    &::placeholder {
      color: $black200;
    }
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
    justify-content: flex-end;
  }
  &__btn {
    max-width: 250px;
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
    }
    &__btn {
      max-width: none;
    }
  }
}
</style>
