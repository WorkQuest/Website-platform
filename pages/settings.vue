<template>
  <div class="main">
    <div class="main__body">
      <h2 class="page__title">
        {{ $t('settings.settings') }}
      </h2>
      {{ userData }}
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
                >
                <button @click="isCloseInfo()">
                  <span
                    class="icon-close_big icon__close"
                    :class="{'icon_close_closed' : isShowInfo }"
                  />
                </button>
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
              class="profile__img"
              src="~/assets/img/temp/photo.jpg"
            >
            <label class="user_edit_avatar">
              <div class="icon-edit" />
              <ValidationProvider
                v-slot="{ Validator }"
                rules="required|ext:png,jpeg,jpg,gif,mp3,mp4,ai"
                tag="div"
              >
                <input
                  id="coverUpload"
                  class="edit_avatar"
                  type="file"
                  accept="image/*"
                  @change="processFile($event, Validator)"
                >
              </ValidationProvider>
            </label>
            <!--            <button class="user_edit_avatar">-->
            <!--              <div class="icon-edit" />-->
            <!--            </button>-->
            <!--            <img-->
            <!--              class="profile__img_hover"-->
            <!--              src="~/assets/img/icons/user.svg"-->
            <!--            >-->
          </div>
          <div>
            <span class="profile__status">
              {{ $t('settings.notVerified') }}
              <span class="icon-check_all_big" />
            </span>
            <div class="profile__row-3col">
              <base-field
                v-model="name_input"
                :placeholder="userData.firstName || $t('settings.nameInput')"
                mode="icon"
              >
                <template v-slot:left>
                  <span class="icon-user" />
                </template>
              </base-field>
              <base-field
                v-model="address1_input"
                :placeholder="userData.additionalInfo.address || $t('settings.addressInput')"
                mode="icon"
              >
                <template v-slot:left>
                  <span class="icon-location" />
                </template>
              </base-field>
              <base-field
                v-model="address2_input"
                :placeholder="userData.additionalInfo.address || $t('settings.addressInput')"
                mode="icon"
              >
                <template v-slot:left>
                  <span class="icon-location" />
                </template>
              </base-field>
              <base-field
                v-model="lastname_input"
                :placeholder="userData.lastName || $t('settings.lastNameInput')"
                mode="icon"
              >
                <template v-slot:left>
                  <span class="icon-user" />
                </template>
              </base-field>
              <base-field
                v-model="tel1_input"
                :placeholder="userData.additionalInfo.firstMobileNumber || $t('settings.telInput')"
                mode="icon"
              >
                <template v-slot:left>
                  <span class="icon-phone" />
                </template>
              </base-field>
              <base-field
                v-model="tel2_input"
                :placeholder="userData.additionalInfo.secondMobileNumber || $t('settings.telInput')"
                mode="icon"
              >
                <template v-slot:left>
                  <span class="icon-phone" />
                </template>
              </base-field>
            </div>
          </div>
        </div>
        <div
          v-if="userRole === 'employer'"
          class="company__inputs"
        >
          <base-field
            v-model="company_input"
            :placeholder="userData.additionalInfo.company || $t('settings.amazon')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-Case" />
            </template>
          </base-field>
          <base-field
            v-model="ceo_input"
            :placeholder="userData.additionalInfo.CEO || $t('settings.ceo')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-id_card" />
            </template>
          </base-field>
          <base-field
            v-model="site_input"
            :placeholder="userData.additionalInfo.website || $t('settings.amazon_com')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-Earth" />
            </template>
          </base-field>
        </div>
        <div
          v-if="userRole === 'worker'"
          class="profile__row-1col"
        >
          <textarea
            id="textarea"
            v-model="bio_input"
            class="profile__textarea"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel"
          />
        </div>
        <label
          class="knowledge__label"
          for="knowledge"
        >{{ $t('settings.knowledge') }}</label>
        <div class="knowledge__container">
          <base-field
            id="knowledge"
            v-model="knowledgeTerm1__input"
            type="grey"
            :placeholder="$t('settings.term')"
          />
          <div class="knowledge__dash">
            -
          </div>
          <base-field
            v-model="knowledgeTerm2__input"
            type="grey"
            :placeholder="$t('settings.term')"
          />
          <div />
          <base-field
            v-model="knowledgePlace__input"
            type="grey"
            :placeholder="$t('settings.placeOfStudying')"
          />
          <div />
          <base-btn>{{ $t('settings.add') }}</base-btn>
        </div>

        <label
          class="knowledge__label"
          for="workExp"
        >Work experience</label>
        <div class="knowledge__container">
          <base-field
            id="workExp"
            v-model="workExpTerm1__input"
            type="grey"
            :placeholder="$t('settings.term')"
          />
          <div class="knowledge__dash">
            -
          </div>
          <base-field
            v-model="workExpTerm2__input"
            type="grey"
            :placeholder="$t('settings.term')"
          />
          <div />
          <base-field
            v-model="workExpVacancy__input"
            type="grey"
            :placeholder="$t('settings.vacancy')"
          />
          <div />
          <base-btn>{{ $t('settings.add') }}</base-btn>
        </div>
        <div class="profile__row-4col">
          <!-- :placeholder="userData.additionalInfo.socialNetwork.instagram || $t('settings.socialInput')" -->
          <base-field
            v-model="inst_input"
            :placeholder="$t('settings.socialInput')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-instagram" />
            </template>
          </base-field>
          <!-- :placeholder="userData.additionalInfo.socialNetwork.twitter || $t('settings.socialInput')" -->
          <base-field
            v-model="twitt_input"
            :placeholder="$t('settings.socialInput')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-twitter" />
            </template>
          </base-field>
          <!-- :placeholder="userData.additionalInfo.socialNetwork.linkedin || $t('settings.socialInput')"-->
          <base-field
            v-model="in_input"
            :placeholder="$t('settings.socialInput')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-LinkedIn" />
            </template>
          </base-field>
          <!-- :placeholder="userData.additionalInfo.socialNetwork.facebook || $t('settings.socialInput')" -->
          <base-field
            v-model="facebook_input"
            :placeholder="$t('settings.socialInput')"
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
      <div
        v-if="userRole === 'worker'"
        class="page__skills"
      >
        <div class="main-white">
          <div class="page__badge-skills">
            {{ $t('settings.skills') }}
          </div>
          <div
            v-for="(item, i) in userInfo.skills"
            :key="i"
          >
            <div class="page__badge">
              {{ item.title }}
            </div>
          </div>
          <div class="btn__container">
            <div class="btn__plus">
              <span class="icon-plus_circle" />
            </div>
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
                checked
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
              {{ $t('settings.filterAllWorkProposals') }}
            </div>
            <div class="settings__option">
              <input
                id="urgentProposals"
                name="filterAllWorkProposals"
                type="radio"
                class="radio__input"
                value="urgentProposals"
              >
              <label
                class="label__black"
                for="urgentProposals"
              >{{ $t('settings.urgentProposals') }}</label>
            </div>
            <div class="settings__option">
              <input
                id="onlyImplementation"
                name="filterAllWorkProposals"
                type="radio"
                class="radio__input"
                value="onlyImplementation"
                checked
              >
              <label
                class="label__black"
                for="onlyImplementation"
              >{{ $t('settings.onlyImplementation') }}</label>
            </div>
            <div class="settings__option">
              <input
                id="onlyReady"
                name="filterAllWorkProposals"
                type="radio"
                class="radio__input"
                value="onlyReady"
              >
              <label
                class="label__black"
                for="onlyReady"
              >{{ $t('settings.onlyReady') }}</label>
            </div>
            <div class="settings__option">
              <input
                id="allRegistered"
                name="filterAllWorkProposals"
                type="radio"
                class="radio__input"
                value="allRegistered"
              >
              <label
                class="label__black"
                for="allRegistered"
              >{{ $t('settings.allRegistered') }}</label>
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
                <base-btn @click="modalTwoFAAuth()">
                  {{ $t('settings.enable') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>{{ $t('settings.smsVerification') }}</div>
              <div>
                <base-btn>
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
import { mapGetters } from 'vuex';
import { Validator } from 'vee-validate';
import modals from '~/store/modals/modals';

export default {
  name: 'Settings',
  data() {
    return {
      knowledgeTerm1__input: '',
      knowledgeTerm2__input: '',
      knowledgePlace__input: '',
      workExpTerm1__input: '',
      workExpTerm2__input: '',
      workExpVacancy__input: '',
      sms: false,
      allRegisterUser: false,
      allPeopleInInternet: false,
      onlyWhenSubmitedWork: false,
      onlyUrgentProposals: false,
      onlyInplemention: false,
      onlyReadyForExecution: false,
      allRegisteredUsers: false,
      bio_input: '',
      name_input: '',
      address1_input: '',
      address2_input: '',
      email_input: '',
      lastname_input: '',
      tel1_input: '',
      tel2_input: '',
      company_input: '',
      ceo_input: '',
      site_input: '',
      inst_input: '',
      twitt_input: '',
      in_input: '',
      facebook_input: '',
      isShowInfo: true,
      avatar_change: {},
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      userInfo: 'data/getUserInfo',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    // eslint-disable-next-line consistent-return
    async processFile(e, validate) {
      const isValid = await validate(e);
      const file = e.target.files[0];
      this.avatar_change = file;
      document.getElementById('coverUpload').value = null;
      if (isValid.valid) {
        const MAX_SIZE = 20e6; // макс размер - тут 2мб
        if (!file) {
          return false;
        }
        if (file.size > MAX_SIZE) {
          this.errorModal(this.$tc('nft.text.maxFileSize', MAX_SIZE / 1e6));
          return false;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        const item = {};
        // eslint-disable-next-line no-shadow
        reader.onload = async (e) => {
          item.data = e.target.result;
          this.model.cover.base64 = item.data;
        };
        reader.onerror = (evt) => {
          console.error(evt);
        };
      } else {
        // this.$store.dispatch('modals/show', {
        //   key: 'status',
        //   status: 'error',
        //   title: this.$t('components.uploader.errors.title'),
        //   text: this.$t('components.uploader.errors.type'),
        // });
      }
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
      try {
        const response = await this.$store.dispatch('user/setUserRole');
        if (response?.ok) {
          console.log('good response');
        }
        console.log(response);
      } catch (e) {
        console.log(e);
      }
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
      const payload = {
        avatarId: null,
        firstName: this.name_input || null,
        lastName: this.lastname_input || null,
        additionalInfo: {
          firstMobileNumber: this.tel1_input || null,
          secondMobileNumber: this.tel2_input || null,
          address: this.adress1_input || null,
          socialNetwork: {
            instagram: this.inst_input || null,
            twitter: this.twitt_input || null,
            linkedin: this.in_input || null,
            facebook: this.facebook_input || null,
          },
          company: this.company_input || null,
          CEO: this.ceo_input || null,
          website: this.site_input || null,
        },
      };
      try {
        await this.$store.dispatch('user/editUserData', payload);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

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
    width: 46%;
    align-content: center;
    display: flex;
    justify-content: flex-end;
    margin: 0 24px 0 0;
  }
  &__plus {
    justify-content: flex-end;
    align-items: center;
    display: flex;
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
  &-close_big::before {
    content: "\e948";
    color: #2e3a59;
    font-size: 26px;
  }
  &__close {
    position: absolute;
    bottom: 155px;
    right: 25px;
    z-index: 2;
    &_closed {
      display: none;
    }
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
  top: -50%;
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
    max-height: 207px;
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
    grid-column: 4/5;
    margin-bottom: 20px;
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
    @include main-white;
    justify-content: flex-start;
    border-radius: 6px;
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
    width: 100%;
    height: 100%;
    max-height: 151px;
    max-width: 151px;
    border-radius: 6px;
  }
  &__row-1col {
    @extend .profile;
    grid-template-columns: 1fr;
    margin: 0 20px 0 20px;
    width: 100%;
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
    max-height: 207px;
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
    margin: 0 0 10px 0;
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
      margin: 0 20px 10px 20px;
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
  .icon {
    &__close {
      bottom: 154px;
      right: 10px;
    }
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
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px 10px;
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
  .icon {
    &__close {
      bottom: 167px;
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
  .btn {
    &__save {
      grid-column: 1/5;
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
  .profile {
    &__img {
      margin: 20px 0 20px 0;
    }
  }
  .icon {
    &__close {
      bottom: 155px;
      right: 5px;
    }
  }
}
@include _480 {
  .icon {
    &__close {
      bottom: 177px;
    }
  }
}

@include _380 {
  .icon {
    &__close {
      bottom: 195px;
      right: 5px;
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
