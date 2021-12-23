<template>
  <div class="profile">
    <div class="profile__title">
      {{ $t('settings.profileInfo') }}
    </div>
    <div class="profile__personal">
      <div class="profile__personal-items">
        <div
          class="profile__avatar"
        >
          <img
            :src="imageData ? imageData : require('~/assets/img/app/avatar_empty.png')"
            alt="avatar-image"
            class="profile__avatar-img"
          >
          <input
            type="file"
            class="profile__avatar-input"
          >
          <div class="profile__avatar-hover icon-edit" />
        </div>
        <div class="profile__personal-info">
          <verified
            v-if="userRole === 'worker'"
            class="profile__status"
          />
          <div class="profile__row-data">
            <base-field
              v-if="firstName"
              v-model="localUserData.firstName"
              :placeholder="firstName || $t('settings.nameInput')"
              mode="icon"
              :name="$t('settings.firstName')"
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
              :name="$t('settings.lastName')"
            >
              <template v-slot:left>
                <span class="icon-user" />
              </template>
            </base-field>
          </div>
          <div class="profile__row-data">
            <vue-phone-number-input
              v-model="localUserData.additionalInfo.secondMobileNumber"
              class="phone__input"
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
              :placeholder="address || $t('settings.addressInput')"
              rules="max:100"
              mode="icon"
              :selector="isSearchDDStatus"
              :name="$t('settings.address')"
              @selector="getAddressInfo(localUserData.additionalInfo.address)"
            >
              <template v-slot:left>
                <span class="icon-location" />
              </template>
              <template v-slot:selector>
                <div
                  v-if="addresses.length"
                  class="selector"
                  :class="{'selector_hide': isSearchDDStatus === false}"
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
      <div
        v-if="userRole === 'employer'"
        class="profile__company"
      >
        <base-field
          v-model="localUserData.additionalInfo.company"
          :placeholder="company || $t('settings.company')"
          mode="icon"
          rules="max:100"
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
          rules="max:100"
        >
          <template v-slot:left>
            <span class="icon-Earth" />
          </template>
        </base-field>
      </div>
      <textarea
        id="textarea"
        v-model="localUserData.additionalInfo.description"
        class="profile__textarea"
        :placeholder="userDesc || $t('settings.userDesc')"
      />
    </div>
    <!--

    <div
      v-if="userRole === 'worker'"
      class="page__knowledge knowledge"
    >
      <label
        class="knowledge__label"
      >{{ $t('settings.educations') }}</label>
      <div
        v-if="localUserData.additionalInfo.educations.length !==0"
      >
        <div
          v-for="(k, i) in localUserData.additionalInfo.educations"
          :key="k.id"
          class="knowledge__container"
        >
          <div class="knowledge__content">
            <base-field
              v-model="localUserData.additionalInfo.educations[i].from"
              type="grey"
              mode="convertDate"
              class="knowledge__data"
              :disabled="true"
              :placeholder="$t('settings.education.from')"
            />
            <div class="knowledge__dash">
              -
            </div>
            <base-field
              v-model="localUserData.additionalInfo.educations[i].to"
              type="grey"
              mode="convertDate"
              class="knowledge__data"
              :disabled="true"
              :placeholder="$t('settings.education.to')"
            />
          </div>
          <div class="knowledge__content">
            <base-field
              v-model="localUserData.additionalInfo.educations[i].place"
              rules="max:100"
              type="grey"
              class="knowledge__data knowledge__data_big"
              :disabled="true"
              :placeholder="$t('settings.education.educationalInstitution')"
            />
            <base-btn
              class="knowledge__btn"
              @click="deleteKnowledge(i)"
            >
              {{ $t('settings.delete') }}
            </base-btn>
          </div>
        </div>
      </div>
      <ValidationObserver
        ref="observerAddNewKnowledge"
        disabled
      >
        <form
          class="knowledge__container"
          @submit.prevent="addNewKnowledge"
        >
          <div class="knowledge__content">
            <base-field
              v-model="newKnowledge.from"
              :name="$t('settings.workExps.from')"
              type="date"
              class="knowledge__data"
              :placeholder="$t('settings.workExps.from')"
              :rules="`required||between-date:${newKnowledge.from},${newKnowledge.to}`"
              validation-mode="passive"
              @blur="clearError('observerAddNewKnowledge', newKnowledge)"
            />
            <div class="knowledge__dash">
              -
            </div>
            <base-field
              v-model="newKnowledge.to"
              :name="$t('settings.workExps.to')"
              type="date"
              class="knowledge__data"
              :placeholder="$t('settings.workExps.to')"
              :rules="`required||between-date:${newKnowledge.from},${newKnowledge.to}`"
              validation-mode="passive"
              @blur="clearError('observerAddNewKnowledge', newKnowledge)"
            />
          </div>
          <div class="knowledge__content">
            <base-field
              v-model="newKnowledge.place"
              rules="max:100||required"
              :name="$t('settings.education.educationalInstitution')"
              type="grey"
              class="knowledge__data knowledge__data_big"
              :placeholder="$t('settings.education.educationalInstitution')"
              validation-mode="passive"
              @blur="clearError('observerAddNewKnowledge', newKnowledge)"
            />
            <base-btn
              class="knowledge__btn"
              type="submit"
            >
              {{ $t('settings.add') }}
            </base-btn>
          </div>
        </form>
      </ValidationObserver>

      <label
        v-if="userRole === 'worker'"
        class="knowledge__label"
      >{{ $t('settings.workExp') }}</label>
      <div
        v-if="localUserData.additionalInfo.workExperiences.length !==0"
      >
        <div
          v-for="(k, i) in localUserData.additionalInfo.workExperiences"
          :key="k.id"
          class="knowledge__container"
        >
          <div class="knowledge__content">
            <base-field
              v-model="localUserData.additionalInfo.workExperiences[i].from"
              type="gray"
              mode="convertDate"
              class="knowledge__data"
              :disabled="true"
              :placeholder="$t('settings.term')"
            />
            <div class="knowledge__dash">
              -
            </div>
            <base-field
              v-model="localUserData.additionalInfo.workExperiences[i].to"
              type="gray"
              mode="convertDate"
              class="knowledge__data"
              :disabled="true"
              :placeholder="$t('settings.term')"
            />
          </div>
          <div class="knowledge__content">
            <base-field
              v-model="localUserData.additionalInfo.workExperiences[i].place"
              rules="max:100"
              type="grey"
              class="knowledge__data knowledge__data_big"
              :disabled="true"
              :placeholder="$t('settings.workExps.companyName')"
            />
            <base-btn
              class="knowledge__btn"
              @click="deleteWorkExp(i)"
            >
              {{ $t('settings.delete') }}
            </base-btn>
          </div>
        </div>
      </div>
      <ValidationObserver
        ref="observerAddNewWorkExp"
        disabled
      >
        <form
          class="knowledge__container"
          @submit.prevent="addNewWorkExp"
        >
          <div class="knowledge__content">
            <base-field
              v-model="newWorkExp.from"
              type="date"
              class="knowledge__data"
              :placeholder="$t('settings.term')"
              :name="$t('settings.workExps.from')"
              :rules="`required||between-date:${newWorkExp.from},${newWorkExp.to}`"
              validation-mode="passive"
              @blur="clearError('observerAddNewWorkExp', newWorkExp)"
            />
            <div class="knowledge__dash">
              -
            </div>
            <base-field
              v-model="newWorkExp.to"
              type="date"
              class="knowledge__data"
              :placeholder="$t('settings.term')"
              :name="$t('settings.workExps.to')"
              :rules="`required||between-date:${newWorkExp.from},${newWorkExp.to}`"
              validation-mode="passive"
              @blur="clearError('observerAddNewWorkExp', newWorkExp)"
            />
          </div>
          <div class="knowledge__content">
            <base-field
              v-model="newWorkExp.place"
              rules="max:100||required"
              type="grey"
              class="knowledge__data knowledge__data_big"
              :placeholder="$t('settings.workExps.companyName')"
              :name="$t('settings.workExps.companyName')"
              @blur="clearError('observerAddNewWorkExp', newWorkExp)"
            />
            <base-btn
              class="knowledge__btn"
              type="submit"
            >
              {{ $t('settings.add') }}
            </base-btn>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <div class="profile__row-4col">
      <base-field
        v-model="localUserData.additionalInfo.socialNetwork.instagram"
        rules="max:50"
        :placeholder="userInstagram || $t('settings.instagramUsername')"
        mode="icon"
        :name="$t('settings.instagram')"
      >
        <template v-slot:left>
          <span class="icon-instagram" />
        </template>
      </base-field>
      <base-field
        v-model="localUserData.additionalInfo.socialNetwork.twitter"
        :placeholder="userTwitter || $t('settings.twitterUsername')"
        rules="max:50"
        mode="icon"
        :name="$t('settings.twitter')"
      >
        <template v-slot:left>
          <span class="icon-twitter" />
        </template>
      </base-field>
      <base-field
        v-model="localUserData.additionalInfo.socialNetwork.linkedin"
        :placeholder="userLinkedin || $t('settings.linkedInUsername')"
        rules="max:50"
        mode="icon"
        :name="$t('settings.linkedin')"
      >
        <template v-slot:left>
          <span class="icon-LinkedIn" />
        </template>
      </base-field>
      <base-field
        v-model="localUserData.additionalInfo.socialNetwork.facebook"
        :placeholder="userFacebook || $t('settings.facebookUsername')"
        rules="max:50"
        mode="icon"
        :name="$t('settings.facebook')"
      >
        <template v-slot:left>
          <span class="icon-facebook" />
        </template>
      </base-field>
    </div>
    <div
      v-if="userRole === 'employer'"
      class="page__btn page__btn_margin"
    >
      <base-btn
        class="btn__save"
        @click="editUserData"
      >
        {{ $t('settings.save') }}
      </base-btn>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Verified from '~/components/app/pages/settings/Verified.vue';

export default {
  name: 'Profile',
  components: { Verified },
  computed: {
    ...mapGetters({
      imageData: 'user/getImageData',
    }),
  },
  props: {
    localUserData: {
      type: Object,
      default: null,
    },
    addresses: {
      type: Array,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
    background: $white;
    padding: 20px;
    gap: 20px;
    &__personal-items {
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
        display: flex;
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
        display: none;
        position: absolute;
        opacity: 1;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        border-radius: 6px;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        background: white;
    }
    &__personal-info {
        display: grid;
    }
    &__status {
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
        column-gap: 20px
    }
    &__company {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
    }
    &__textarea {
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

</style>
