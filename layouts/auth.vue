<template>
  <div class="template">
    <div class="template__container">
      <div class="template__left">
        <div
          class="template__logo"
          @click="toMain()"
        >
          <img
            src="~assets/img/app/logo.svg"
            alt="WorkQuest"
          >
          <span>{{ $t('signIn.workQuest') }}</span>
        </div>
        <div class="template__content">
          <nuxt />
        </div>
      </div>
      <div class="template__right">
        <div class="template__slogan">
          <span>{{ $t('signIn.makingMoneyIsFast') }}</span>
        </div>
        <img
          class="template__long"
          src="~assets/img/app/logo_long.svg"
          alt=""
        >
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

export default {
  scrollToTop: true,
  name: 'AuthLayout',
  data: () => ({
    getTokensFromMobileInterval: null,
    accessTokenMobile: null,
    refreshTokenMobile: null,
  }),
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userData: 'user/getUserData',
    }),
  },
  watch: {
    accessTokenMobile: {
      immediate: true,
      async handler() {
        if (this.accessTokenMobile && this.refreshTokenMobile) {
          try {
            const payload = {
              access: this.accessTokenMobile,
              refresh: this.refreshTokenMobile,
            };
            this.$store.commit('user/setTokens', payload);
            await this.$store.dispatch('user/getUserData');
            if (this.userData.role === 'employer') {
              await this.$router.push('/workers');
            } else if (this.userData.role === 'worker') {
              await this.$router.push('/quests');
            } else if (this.userData.status === 2) {
              await this.$router.push('/role');
            }
          } catch (e) {
            console.log(e);
          }
        }
      },
    },
  },
  async mounted() {
    const { access, refresh, userStatus } = this.$route.query;
    if (access && refresh && userStatus) {
      this.$store.commit('user/setTokens', { access, refresh, userStatus });
      if (parseInt(userStatus, 10) === 2) {
        await this.$router.push('/role');
      } else {
        await this.$store.dispatch('user/getUserData');
        if (this.userData.role === 'employer') {
          await this.$router.push('/workers');
        } else if (this.userData.role === 'worker') {
          await this.$router.push('/quests');
        }
      }
    }
    this.getTokensFromMobile();
  },
  beforeDestroy() {
    if (this.getTokensFromMobileInterval) {
      clearInterval(this.getTokensFromMobileInterval);
      this.getTokensFromMobileInterval = null;
    }
  },
  methods: {
    getTokensFromMobile() {
      this.getTokensFromMobileInterval = setInterval(() => {
        this.accessTokenMobile = localStorage.getItem('accessToken');
        this.refreshTokenMobile = localStorage.getItem('refreshToken');
      }, 100);
    },
    toMain() {
      this.$router.push('/sign-in');
    },
  },
};
</script>

<style lang="scss" scoped>
.template {
  &__container {
    min-height: 100vh;
    width: 100%;
    background: #FFFFFF;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  &__left {
    display: grid;
    grid-template-rows: 40px 1fr;
    max-width: 470px;
    width: 100%;
    justify-self: flex-end;
    margin-right: 130px;
    padding-top: 21px;
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
  &__content {
    display: grid;
    align-items: center;
  }
  &__right {
    background:  url("~assets/img/app/auth_bg.svg") center center no-repeat;
    background-size: cover;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-gap: 53px;
  }
  &__long {
    justify-self: flex-end;
  }
  &__slogan {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 55px;
    line-height: 130%;
    color: #FFFFFF;
    padding: 100px 0 0 100px;
    white-space: pre-line;
  }
}
@include _1300 {
  .template {
    &__slogan {
      padding: 50px 0 0 50px;
    }
    &__long {
      display: none;
    }
  }
}

@include _1199 {
  .template {
    &__content {
      align-items: initial;
      padding-top: 30px;
    }
    &__container {
      grid-template-columns: 1fr;
      grid-template-rows: 300px 1fr;
    }
    &__slogan {
      font-size: 32px;
    }
    &__right {
      grid-row: 1/2;
      grid-column: 1/3;
    }
    &__left {
      margin: 0;
      grid-column: 1/3;
      max-width: initial;
      grid-row: 2/3;
      justify-self: initial;
      padding: 20px;
    }
  }
}
</style>
