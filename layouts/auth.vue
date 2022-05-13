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
import { Path, UserRole, UserStatuses } from '~/utils/enums';

export default {
  name: 'AuthLayout',
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userData: 'user/getUserData',
    }),
  },
  async created() {
    const accessTokenCookies = this.$cookies.get('access');
    if (!accessTokenCookies) return;
    const refreshCookies = this.$cookies.get('refresh');
    const userStatusCookies = this.$cookies.get('userStatus');
    await this.$store.commit('user/setTokens', {
      access: accessTokenCookies,
      refresh: refreshCookies,
      userStatus: userStatusCookies,
    });

    if (this.userData.status === UserStatuses.Confirmed) {
      await this.$store.dispatch('user/getUserData');

      if (this.userData.role === UserRole.EMPLOYER) {
        await this.$router.push(Path.WORKERS);
      } else if (this.userData.role === UserRole.WORKER) {
        await this.$router.push(Path.QUESTS);
      }
    }
  },
  async beforeMount() { // Handle social network auth
    const { access, refresh, userStatus } = this.$route.query;
    if (access && refresh && userStatus) {
      this.$store.commit('user/setTokens', {
        access, refresh, userStatus, social: true,
      });
      await this.$store.dispatch('user/getUserData');

      // To set role or assign wallet
      if (+userStatus === UserStatuses.NeedSetRole || !this.userData?.wallet?.address) {
        this.$cookies.set('userLogin', true, { path: '/' });
        await this.$router.push(Path.ROLE);
        return;
      }

      await this.$store.dispatch('user/getStatistic');
      await this.$store.dispatch('user/getNotifications');

      if (this.userData.role === UserRole.EMPLOYER) {
        await this.$router.push(Path.WORKERS);
      } else if (this.userData.role === UserRole.WORKER) {
        await this.$router.push(Path.QUESTS);
      }
    }
  },
  methods: {
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
