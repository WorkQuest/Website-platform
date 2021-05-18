<template>
  <div class="main">
    <div class="main__body">
      <h2 class="page__title">
        {{ $t('settings.settings') }}
      </h2>
      <div
        v-if="isShowInfo"
        class="quests__top"
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
                  <div class="info__toggle">
                    <base-checkbox
                      v-model="isShowInfo"
                      :label="$t('settings.dontShow')"
                    />
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
          <div>
            <img
              class="profile__img"
              src="~/assets/img/temp/photo.jpg"
            >
          </div>
          <div class="profile__row-3col">
            <base-field
              v-model="name_input"
              :placeholder="$t('settings.nameInput')"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-user" />
              </template>
            </base-field>
            <base-field
              v-model="adress1_input"
              :placeholder="$t('settings.addressInput')"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-location" />
              </template>
            </base-field>
            <base-field
              v-model="adress2_input"
              :placeholder="$t('settings.addressInput')"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-mail" />
              </template>
            </base-field>
            <base-field
              v-model="lastname_input"
              :placeholder="$t('settings.lastNameInput')"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-user" />
              </template>
            </base-field>
            <base-field
              v-model="tel1_input"
              :placeholder="$t('settings.telInput')"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-phone" />
              </template>
            </base-field>
            <base-field
              v-model="tel2_input"
              :placeholder="$t('settings.telInput')"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-phone" />
              </template>
            </base-field>
          </div>
        </div>
        <div class="profile__row-1col">
          <textarea
            id="textarea"
            v-model="bio_input"
            class="profile__textarea"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel"
          />
        </div>
        <div class="profile__row-4col">
          <base-field
            v-model="inst_input"
            :placeholder="$t('settings.socialInput')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-instagram" />
            </template>
          </base-field>
          <base-field
            v-model="twitt_input"
            :placeholder="$t('settings.socialInput')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-twitter" />
            </template>
          </base-field>
          <base-field
            v-model="in_input"
            :placeholder="$t('settings.socialInput')"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-LinkedIn" />
            </template>
          </base-field>
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
        <div class="btn__container-right">
          <base-btn
            class="btn__save"
          >
            {{ $t('settings.save') }}
          </base-btn>
        </div>
      </div>
      <div class="page__skills">
        <div class="main-white">
          <div class="page__badge-skills">
            {{ $t('settings.skills') }}
          </div>
          <span
            v-for="(item, i) in badges"
            :key="i"
          >
            <div class="page__badge">
              {{ item.name }}
            </div>
          </span>
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
              <base-checkbox
                :name="allRegisterUser"
                :value="allRegisterUser"
                :type="'default'"
                :label="$t('settings.allUsers')"
              />
            </div>
            <div class="settings__option">
              <base-checkbox
                :name="allPeopleInInternet"
                :value="allPeopleInInternet"
                :type="'default'"
                :label="$t('settings.allInternet')"
              />
            </div>
            <div class="settings__option">
              <base-checkbox
                :name="onlyWhenSubmitedWork"
                :value="onlyWhenSubmitedWork"
                :type="'default'"
                :label="$t('settings.onlyWhenSubmittedWork')"
              />
            </div>
          </div>
          <div>
            <div class="settings__subtitle">
              {{ $t('settings.whoCanSee') }}
            </div>
            <div class="settings__option">
              <base-checkbox
                :name="onlyUrgentProposals"
                :value="onlyUrgentProposals"
                :type="'default'"
                :label="$t('settings.urgentProposals')"
              />
            </div>
            <div class="settings__option">
              <base-checkbox
                :name="onlyInplemention"
                :value="onlyInplemention"
                :type="'default'"
                :label="$t('settings.onlyImplementation')"
              />
            </div>
            <div class="settings__option">
              <base-checkbox
                :name="onlyReadyForExecution"
                :value="onlyReadyForExecution"
                :type="'default'"
                :label="$t('settings.onlyReady')"
              />
            </div>
            <div class="settings__option">
              <base-checkbox
                :name="allRegisteredUsers"
                :value="allRegisteredUsers"
                :type="'default'"
                :label="$t('settings.allRegistered')"
              />
            </div>
          </div>
        </div>
        <div class="settings__right">
          <div>{{ $t('settings.settings') }}</div>
          <div class="">
            <div class="settings_blue">
              <div>{{ $t('settings.changePass') }}</div>
              <div>
                <base-btn
                  class=""
                >
                  {{ $t('settings.change') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>{{ $t('settings.enableTwoStepAuth') }}</div>
              <div class="">
                <base-btn
                  class=""
                >
                  {{ $t('settings.enable') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>{{ $t('settings.smsVerification') }}</div>
              <div>
                <base-btn
                  class=""
                >
                  {{ $t('settings.enable') }}
                </base-btn>
              </div>
            </div>
            <div class="settings_blue">
              <div>Change role</div>
              <div>
                <base-btn
                  class=""
                >
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
export default {
  name: 'Settings',
  data() {
    return {
      allRegisterUser: false,
      allPeopleInInternet: false,
      onlyWhenSubmitedWork: false,
      onlyUrgentProposals: false,
      onlyInplemention: false,
      onlyReadyForExecution: false,
      allRegisteredUsers: false,
      bio_input: '',
      name_input: '',
      adress1_input: '',
      adress2_input: '',
      lastname_input: '',
      tel1_input: '',
      tel2_input: '',
      inst_input: '',
      twitt_input: '',
      in_input: '',
      facebook_input: '',
      isShowInfo: true,
      badges: [
        {
          name: 'Painting works',
        },
        {
          name: 'Painting works',
        },
        {
          name: 'Painting works',
        },
        {
          name: 'Painting works',
        },
      ],
    };
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    isCloseInfo() {
      this.isShowInfo = !this.isShowInfo;
    },
  },
};
</script>

<style lang="scss" scoped>

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

.icon-plus_circle:before {
  content: "\e9a6";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon-facebook:before {
  content: "\e9e5";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon-LinkedIn::before {
  content: "\e9ed";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon-twitter::before {
  content: "\e9fa";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon-instagram::before {
  content: "\e9ea";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon-phone::before {
  content: "\ea2d";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon-mail::before {
  content: "\ea27";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon-location::before {
  content: "\ea23";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon-user::before {
  content: "\e90c";
  font-size: 20px;
  color: $blue;
  align-items: center;
}

.icon__close {
  position: absolute;
  bottom: 155px;
  right: 25px;
  z-index: 2;
  &_closed {
    display: none;
  }
}

.icon-close_big::before {
  content: "\e948";
  color: #2e3a59;
  font-size: 26px;
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
    display: flex;
  }
}
.btn {
  &__container-right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin: 0 20px 0 -20px;
    padding: 0 0 20px 0;
  }
  &__save {
    width: 100%;
    max-width: 250px;
    display: grid;
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
    font-family: 'Inter', sans-serif;
    font-style: normal;
    &_title  {
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
    margin: 50px 0 21px 20px;
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
    justify-content: start;
    border-radius: 6px;
  }
}
.profile {
  &__img {
    width: 100%;
    height: 100%;
    max-height: 115px;
    max-width: 115px;
    border-radius: 6px;
    margin: 20px;
  }
  &__row-1col {
    display: grid;
    grid-template-columns: 96.5%;
    margin: 0 20px 0 20px;
    justify-content: space-between;
    width: 100%;
    max-width: 1180px;
  }
  &__row-3col {
    display: grid;
    grid-template-columns: 32% 32% 32%;
    margin: 20px 20px 0 20px;
    justify-content: space-between;
    width: 100%;
    max-width: 1180px;
  }
  &__row-4col {
    display: grid;
    grid-template-columns: 24% 24% 24% 24%;
    margin: 20px 20px 0 20px;
    justify-content: space-between;
    max-width: 1180px;
  }
  &__textarea {
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 114px;
    width: 100%;
    border: 0;
    background-color: $black0;
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
  grid-template-columns: 40% 60%;
  &_blue {
    padding: 10px 20px 10px 20px;
    margin: 20px 0 20px 0;
    background: rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    display: grid;
    grid-template-columns: 60% 40%;
    align-items: center;
  }
  &__option {
    padding: 5px 0 5px 0;
  }
  &__subtitle {
    margin: 15px 0;
    color: $black500;
    font-size: 16px;
  }
  &__left {
    @include main-white;
    justify-content: start;
    border-radius: 6px;
    margin: 20px 0 0 0;
    padding: 20px;
    width: 97%;
    display: flex;
    flex-direction: column;
  }
  &__right {
    @include main-white;
    justify-content: start;
    border-radius: 6px;
    margin: 20px 0 0 0;
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
.page {
  &__grid {
    display: grid;
    grid-template-columns: 50% 50%;
  }
  &__title {
    margin: 20px 0 20px 0;
  }
  &__profile {
    @include main-white;
    justify-content: start;
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
    grid-template-columns: 50% 50%;
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
    height:34px;
    margin: 10px;
    padding: 5px;
    color: $blue;
    &-skills {
      padding: 15px;
    }
  }
  &__skills {
    height: 64px;
  }
}
</style>
