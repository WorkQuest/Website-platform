<template>
  <div
    v-click-outside="hideSidebar"
    class="app"
  >
    <div class="header">
      <div class="header__container">
        <div class="header__body">
          <n-link
            tag="div"
            class="header__logo"
            to="/about"
          >
            <img
              class="logo"
              src="~assets/img/app/logo.svg"
              alt=""
            >
          </n-link>
          <div class="header__info">
            <div
              class="header__route"
              :class="{'header__route_avatar': avatar}"
            >
              <div
                v-if="avatar"
                class="header__avatar"
              >
                <img
                  :src="avatar"
                  alt=""
                >
              </div>
              <div class="header__route">
                <div class="header__title">
                  {{ title }}
                </div>
                <div class="header__sub">
                  {{ subTitle }}
                </div>
              </div>
            </div>
          </div>
          <div class="header__links">
            <n-link
              v-for="(item, i) in headerLinks"
              :key="`link-${i}`"
              class="header__link"
              exact-active-class="header__link_active"
              :to="item.path"
            >
              <div class="header__icon">
                <img
                  :src="item.icon"
                  alt=""
                >
              </div>
            </n-link>
            <div
              class="header__toggle"
              @click="toggleSidebar()"
            >
              <img
                src="~assets/img/ui/burger.png"
                alt=""
              >
            </div>
          </div>
        </div>
      </div>
      <div class="header__bottom">
        <n-link
          v-for="(item, i) in headerLinks"
          :key="`link-${i}`"
          class="header__link"
          exact-active-class="header__link_active"
          :to="item.path"
        >
          <div class="header__icon">
            <img
              :src="item.icon"
              alt=""
            >
          </div>
        </n-link>
        <div
          class="header__toggle header__toggle_mobile"
          @click="toggleSidebar()"
        >
          <img
            src="~assets/img/ui/burger.png"
            alt=""
          >
        </div>
      </div>
    </div>
    <div
      v-if="isShowSidebar"
      class="sidebar"
    >
      <div class="sidebar__container">
        <div
          class="sidebar__links"
        >
          <button
            v-for="item in sidebarLinks"
            :key="item.title"
            class="sidebar__link"
            @click.prevent="toggleSidebar()"
          >
            {{ item.title }}
          </button>
          <div class="sidebar__bottom">
            <div
              class="sidebar__link sidebar__link_out"
              @click="doLogout()"
            >
              Log out
            </div>
            <div class="sidebar__contact">
              <a
                class="sidebar__mail"
                target="_blank"
                href="mailto:feedback@workquest.co"
              ><span>{{ $t('about.contact') }}:</span> feedback@workquest.co</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'Header',
  directives: {
    ClickOutside,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowSidebar: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
    }),
    headerLinks() {
      return [
        {
          icon: require('~/assets/img/ui/home.svg'),
          path: '/about',
        },
        {
          icon: require('~/assets/img/ui/notification.svg'),
          path: '/temp',
        },
        {
          icon: require('~/assets/img/ui/settings.svg'),
          path: '/profile',
        },
      ];
    },
    sidebarLinks() {
      return [
        {
          title: 'ABOUT  SERVICE',
          path: '/profile',
        },
        {
          title: 'DETAILED INFORMATION',
          path: '/about',
        },
        {
          title: 'WORK HISTORY',
          path: '/about',
        },
        {
          title: 'DEPOSIT',
          path: '/about',
        },
        {
          title: 'TERMS AND CONDITIONS',
          path: '/about',
        },
        {
          title: 'PRIVACY POLICY',
          path: '/about',
        },
      ];
    },
  },
  methods: {
    toggleSidebar() {
      this.isShowSidebar = !this.isShowSidebar;
    },
    doLogout() {
      this.$store.dispatch('user/logOut');
      this.$router.push('/');
    },
    hideSidebar() {
      this.isShowSidebar = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  background: #FFFFFF;
  width: 100%;
  height: 124px;
  box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
  border-radius: 0 0 50px 50px;
  &__container {
    height: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }
  &__body {
    height: 100%;
    display: grid;
    grid-template-columns: 200px 1fr 1fr;
  }
  &__logo {
    background-color: #20253b;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 200px;
    border-radius: 0 0 30px 30px;
    cursor: pointer;
  }
  &__title {
    font-family: 'GothamProMedium', sans-serif;
    color: #000000;
    font-size: 27px;
    font-weight: 500;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
    text-align: left;
  }
  &__sub {
    color: #27a860;
    font-family: 'GothamProMedium', sans-serif;
    font-size: 15px;
    font-weight: 500;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
    text-align: left;
  }
  &__info {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 20px;
  }
  &__route {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    &_avatar {
      display: grid;
      grid-template-columns: 50px 1fr;
    }
  }
  &__links {
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  &__link {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    width: 80px;
    padding-bottom: 20px;
    border-radius: 0 0 30px 30px;
    &_active {
      background: #0c82c3;
      .header {
        &__icon {
          filter: invert(1);
        }
      }
    }
  }
  &__toggle {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    width: 80px;
    padding-bottom: 30px;
    cursor: pointer;
    &_mobile {
      padding-bottom: 18px;
    }
  }
  &__bottom {
    display: none;
  }
}

.sidebar {
  &__contact {
    display: grid;
    text-align: right;
    span {
      text-align: right;
      color: #FFFFFF;
    }
  }
  &__bottom {
    align-self: flex-start;
    display: grid;
    grid-gap: 10px;
    width: 100%;
  }
  &__mail {
    color: #FFFFFF;
  }
  &__container {
    z-index: 1000;
    min-height: 100vh;
    width: calc(100vw - 70%);
    background-color: #283f79;
    box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
  }
  &__links {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
    padding-right: 50px;
    align-items: center;
    justify-content: center;
  }
  &__link {
    font-family: 'GothamProBlack', sans-serif;
    font-size: 26px;
    font-weight: 400;
    text-transform: uppercase;
    text-align: right;
    line-height: normal;
    color: #ffffff;
    cursor: pointer;
    text-decoration: none;
    &:last-child {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 40px;
    }
    &_out {
      font-size: 24px;
    }
  }
}
.app {
  z-index: 100;
}

@include _575 {
  .logo {
    max-width: 75px;
  }
  .sidebar {
    &__contact {
      grid-template-columns: 1fr;
      padding-left: 10px;
      span {
        text-align: left;
      }
    }
    &__bottom {
      padding-bottom: 40px;
    }
    &__container {
      width: calc(100vw - 20%);
      grid-template-rows: auto;
    }
    &__links {
      padding-right: 20px;
      grid-template-rows: 50px;
    }
    &__link {
      font-size: 18px;
    }
  }
  .header {
    height: 100px;
    &__body {
      grid-template-columns: 140px 1fr;
      padding-left: 20px;
    }
    &__route {
      grid-gap: 10px;
      &_avatar {
        grid-template-columns: 30px 1fr;
        grid-gap: 10px;
      }
    }
    &__info {
      padding-bottom: 30px;
    }
    &__sub {
      font-size: 13px;
    }
    &__links {
      display: none;
    }
    &__link {
      border-radius: 40px 40px 0 0;
      width: 90px;
      padding-bottom: 10px;
    }
    &__icon {
      img {
        max-width: 40px;
        max-height: 40px;
      }
    }
    &__logo {
      border-radius: 0 0 50px 50px;
    }
    &__container {
      background: #FFFFFF;
      width: 100%;
      box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
      border-radius: 0 0 50px 50px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      height: 100px;
    }
    &__title {
      font-size: 20px;
    }
    &__bottom {
      padding-left: 20px;
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      background: #FFFFFF;
      width: 100%;
      height: 60px;
      z-index: 1000;
      box-shadow: 0 0 7px rgba(0, 7, 5, 0.3);
      //border-radius: 40px 40px 0 0;
    }
  }
}

</style>
