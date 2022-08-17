<template>
  <div
    ref="templateScroll"
    class="primary"
  >
    <div class="primary__template template">
      <div class="template__content">
        <div
          v-click-outside="closeLocale"
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
                <span class="header__text">WorkQuest</span>
              </div>
            </div>
            <div class="header__right">
              <div
                class="header__button header__button_locale"
                @click="showLocale()"
              >
                <span
                  v-if="currentLocale"
                  class="header__button_locale-name"
                >
                  {{ currentLocale.toUpperCase() }}
                </span>
                <span v-else>
                  {{ $t('ui.locals.en').toUpperCase() }}
                </span>
                <span class="icon icon-caret_down" />
                <transition name="fade">
                  <ul
                    v-if="isShowLocale"
                    class="locale"
                  >
                    <li
                      v-for="item in locales"
                      :key="item.localeText"
                      class="locale__item"
                      :class="[{'locale__item_active' : currentLocale === item.localeText}]"
                      @click="setLocale(item)"
                    >
                      <img
                        :src="require(`assets/img/lang/${item.localeSrc}`)"
                        :alt="item.localeText"
                        class="locale__icon"
                      >
                      <span class="locale__text">
                        {{ item.localeText.toUpperCase() }}
                      </span>
                    </li>
                  </ul>
                </transition>
              </div>
              <base-btn
                class="header__btn"
                @click="$router.push('/sign-in')"
              >
                {{ $t('meta.signIn') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div
          v-show="isShowBluePanel"
          class="blue-panel"
        />
        <div
          class="template__main"
          :class="{'template__main_blue-panel': isShowBluePanel}"
        >
          <nuxt />
        </div>
        <Footer
          class="template__footer"
          @clickOnLogo="toMain"
        />
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
import moment from 'moment';
import { DeFiBluePanelPathNames, Path } from '~/utils/enums';

export default {
  name: 'GuestLayout',
  middleware: ['guest', 'locker'],
  directives: { ClickOutside },
  data() {
    return {
      isShowLocale: false,
      currentLocale: '',
    };
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      isLoading: 'main/getIsLoading',
      connections: 'main/notificationsConnectionStatus',
    }),
    locales() {
      return this.$i18n.locales.map((item) => ({
        localeSrc: `${item}.svg`,
        localeText: this.$t(`ui.locals.${item}`),
      }));
    },
    isShowBluePanel() { // for DeFi pages
      return DeFiBluePanelPathNames.includes(this.$route.name);
    },
  },
  watch: {
    $route() {
      this.$refs.templateScroll.scrollTop = 0;
      this.closeLocale();
    },
  },
  async created() {
    if (!this.isAuth && !this.connections.notifsConnection) await this.$wsNotifs.connect(null);
    window.addEventListener('resize', this.userWindowChange);
  },
  destroyed() {
    window.removeEventListener('resize', this.userWindowChange);
  },
  methods: {
    setLocale(item) {
      this.currentLocale = item.localeText;
      this.$i18n.setLocale(item.localeText);
      moment.locale(item.localeText);
    },
    userWindowChange() {
      this.isShowLocale = false;
    },
    toMain() {
      this.$router.push(Path.SIGN_IN);
    },
    showLocale() {
      this.isShowLocale = !this.isShowLocale;
    },
    closeLocale() {
      this.isShowLocale = false;
    },
  },
};
</script>
<style lang="scss" scoped>

.hidden {
  display: none;
}

.icon {
  font-size: 20px;
  color: $shade700;
  &-chevron_right {
    transition: .1s;
    visibility: hidden;
  }
}

.blue-panel {
  @include blue-panel;
}

.primary {
  height: 100vh;
  overflow-y: auto;
}
.template {
  min-height: 100vh;
  background: $black0;
  &__content {
    display: grid;
    grid-template-rows: 72px 1fr auto;
    min-height: 100vh;
  }
  &__main {
    display: grid;
    padding-bottom: 80px;
    transition: 1s;
    width: 100%;

    &_blue-panel {
      position: relative;
      max-width: 1180px;
      width: 100%;
      margin: 30px auto 80px auto;
    }
  }
}

.header {
  position: sticky;
  top: 0;
  z-index: 99999;
  min-height: 72px;
  background: $white;
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
  &__button {
    @include text-simple;
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    cursor: pointer;
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
    .icon-caret_down {
      color: $black400;
      font-size: 24px;
    }
    &_locale {
      width: 86px;
      height: 46px;
    }
    &_locale-name {
      padding-left: 10px;
    }
  }
  &__right {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 10px;
    align-items: center;
  }
  &__btn {
    min-width: 143px;
  }
  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    cursor: pointer;
    span {
      @include text-simple;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: $black700;
    }
  }
}

.locale {
  position: absolute;
  top: 73px;
  background: $white;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  z-index: 10000000;
  padding: 15px 20px;
  &__item {
    width: 46px;
    display: flex;
    align-items: center;
    opacity: 0.7;
    &_active {
      opacity: 1;
    }
    &:hover {
      opacity: 1;
    }
  }
  &__item:not(:last-child) {
    margin-bottom: 15px;
  }
  &__icon {
    display: block;
    margin-right: 10px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
  }
  &__text {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
  }
}

@include _1199 {
  .header {
    &__button_menu {
      display: flex;
    }
    &__body {
      margin: 0 20px 0 20px;
    }
  }
}

@include _991 {
  .template {
    &__content {
      grid-template-rows: 72px 1fr auto;
    }
  }
}

@include _575 {
  .header {
    &__body {
      margin: 0 10px;
    }
    &__logo {
      span {
        display: none;
      }
    }
    &__left {
      grid-gap: 15px;
    }
    &__right {
      grid-gap: 10px;
    }
  }
}

@include _350 {
  .header {
    &__btn {
      min-width: 130px;
    }
    &__button {
      &_locale {
        width: 55px;
      }
    }
  }
}
</style>
