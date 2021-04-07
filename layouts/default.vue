<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__content">
        <div
          v-click-outside="closeAll"
          class="template__header header"
        >
          <div class="header__body">
            <div class="header__left">
              <div
                class="header__logo"
                @click="toMain()"
              >
                <img
                  src="~assets/img/app/logo.svg"
                  alt="WorkQuest"
                >
                <span>WorkQuest</span>
              </div>
              <div
                v-if="role === 'employer'"
                class="header__links"
              >
                <nuxt-link
                  to="/quests"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  Workers
                </nuxt-link>
                <nuxt-link
                  to="/my"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  My quests
                </nuxt-link>
                <nuxt-link
                  to="/wallet"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  Wallet
                </nuxt-link>
              </div>
              <div
                v-if="role === 'worker'"
                class="header__links"
              >
                <nuxt-link
                  to="/quests"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  Quests
                </nuxt-link>
                <nuxt-link
                  to="/my"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  My quests
                </nuxt-link>
                <nuxt-link
                  to="/wallet"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  Wallet
                </nuxt-link>
              </div>
            </div>
            <div
              class="header__right"
            >
              <button class="header__button header__button_locale">
                EN
                <span class="icon-caret_down" />
              </button>
              <button class="header__button">
                <span class="icon-message" />
              </button>
              <button class="header__button header__button_notify">
                <span
                  v-if="notification"
                  class="icon-notification_outline_dot"
                  @click="showNotification()"
                />
                <span
                  v-else
                  class="icon-notification_outline"
                />
                <transition name="fade">
                  <div
                    v-if="isShowNotify"
                    class="notify"
                  >
                    <div class="notify__header">
                      <div class="notify__title">
                        {{ $t('ui.notifications.title') }}
                      </div>
                      <span
                        class="icon-close_small"
                        @click="showNotification()"
                      />
                    </div>
                    <div class="notify__body">
                      <div class="notify__items">
                        <div class="notify__item">
                          1
                        </div>
                        <div class="notify__item">
                          2
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </button>
              <button
                class="header__button header__button_profile"
                @click="showProfile()"
              >
                <span class="icon-hamburger" />
                <transition name="fade">
                  <div
                    v-if="isShowProfile"
                    class="profile"
                  >
                    <div class="profile__header">
                      <div class="profile__avatar">
                        <img
                          src="~assets/img/app/fakeavatar.svg"
                          alt=""
                        >
                      </div>
                      <div class="profile__info">
                        <div class="profile__text">
                          Samantha Sparks
                        </div>
                        <div
                          v-if="role === 'employer'"
                          class="profile__text profile__text_blue"
                        >
                          {{ $t('role.employer') }}
                        </div>
                        <div
                          v-if="role === 'worker'"
                          class="profile__text profile__text_green"
                        >
                          {{ $t('role.worker') }}
                        </div>
                      </div>
                    </div>
                    <div class="profile__items">
                      <nuxt-link
                        v-for="item in profileLinks"
                        :key="`item-${item.title}`"
                        tag="button"
                        class="profile__item"
                        :to="item.path"
                      >
                        {{ item.title }}
                      </nuxt-link>
                      <button
                        class="profile__item profile__item_red"
                        @click="logout()"
                      >
                        {{ $t('ui.profile.logout') }}
                      </button>
                    </div>
                  </div>
                </transition>
              </button>
              <base-btn
                v-if="role === 'employer'"
                class="header__btn"
              >
                {{ $t('layout.create') }}
              </base-btn>
            </div>
          </div>
        </div>
        <nuxt />
      </div>
    </div>
    <transition name="fade">
      <loader v-if="isLoading" />
    </transition>
    <ctm-modal />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'DefaultLayout',
  directives: {
    ClickOutside,
  },
  data() {
    return {
      role: '',
      isShowProfile: false,
      isShowNotify: true,
      notification: 1,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
    }),
    profileLinks() {
      return [
        {
          title: this.$t('ui.profile.myProfile'),
          path: '/profile',
        },
        {
          title: this.$t('ui.profile.settings'),
          path: '/settings',
        },
        {
          title: this.$t('ui.profile.disputes'),
          path: '/disputes',
        },
      ];
    },
  },
  created() {
    const role = this.$cookies.get('role');
    this.role = role;
    if (!role) {
      this.$router.push('/role');
    }
  },
  methods: {
    toMain() {
      this.$router.push('/quests');
    },
    showProfile() {
      this.isShowProfile = !this.isShowProfile;
    },
    showNotification() {
      this.isShowNotify = !this.isShowNotify;
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push('/');
    },
    closeAll() {
      this.isShowProfile = false;
      this.isShowNotify = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.primary {
  height: 100vh;
  overflow-y: auto;
}
.template {
  min-height: 100vh;
  overflow: hidden;
  background: #F7F8FA;
  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 120;
  }
}
.notify {
  position: absolute;
  top: calc(72px + 5px);
  right: calc(100% - 43px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 441px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    border-bottom: 1px solid #F7F8FA;
    span:before {
      color: $shade700 !important;
      font-size: 24px;
    }
  }
  &__title {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 130%;
    color: $black800;
  }
  &__body {

  }
  &__items {
    display: grid;
    grid-template-columns: 1fr;
  }
}
.profile {
  position: absolute;
  top: calc(72px + 5px);
  right: calc(100% - 43px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 223px;
  width: 100%;
  min-height: 235px;
  &__header {
    border-bottom: 1px solid #F7F8FA;
    display: grid;
    grid-template-columns: 40px 1fr;
    padding: 15px;
    grid-gap: 10px;
  }
  &__avatar {
    max-width: 40px;
    max-height: 40px;
    border-radius: 100%;
  }
  &__items {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: flex-start;
  }
  &__item {
    height: 41px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    width: 100%;
    transition: .3s;
    &_red {
      color: $red;
    }
    &:hover {
      background: #F7F8FA;
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    &_blue {
      font-weight: normal;
      font-size: 12px;
      color: $blue;
    }
    &_green {
      font-weight: normal;
      font-size: 12px;
      color: $green;
    }
  }
  &__info {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px;
    text-align: left;
  }
}
.header {
  min-height: 72px;
  background: #FFFFFF;
  box-shadow: 0 1px 0 #E6E9EC;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &__body {
    max-width: 1180px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__left {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-gap: 35px;
  }
  &__link {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black400;
    text-decoration: none;
    &_active {
      color: $black800;
    }
  }
  &__button {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    width: 43px;
    height: 43px;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid $black100;
    }
    span:before {
      color: $black400;
      font-size: 24px;
    }
    &_profile {
      position: relative;
    }
    &_notify {
      position: relative;
    }
    &_locale {
      width: 86px;
      height: 46px;
      span {
        padding-left: 10px;
      }
    }
  }
  &__links {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(3, auto);
    grid-gap: 25px;
  }
  &__right {
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-gap: 10px;
    align-items: center;
  }
  &__btn {
    min-width: 163px;
  }
  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    cursor: pointer;
    span {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: $black700;
    }
  }
}
</style>
