<template>
  <div class="template">
    <div class="template__container">
      <div class="mobile__container">
        <div class="mobile__header">
          <div>
            <h2 class="mobile__title">
              {{ $t('signIn.welcomeToWorkQuest') }}
            </h2>
          </div>
          <div>
            <h3 class="mobile__subtitle">
              {{ $t('signIn.pleaseSignIn') }}
            </h3>
          </div>
        </div>
      </div>
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
  name: 'AuthLayout',
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
    }),
  },
  methods: {
    toMain() {
      this.$router.push('/sign-in');
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (min-width:1199px) {
    .mobile {
      &__container {
        display: none;
      }
      &__title {
        display: none;
      }
      &__subtitle {
        display: none;
      }
      &__header {
        display: none;
      }
    }
}
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
  }
}

@include _1199 {
  .mobile {
    &__container {
      background: url(/_nuxt/assets/img/app/auth_bg.svg) center center no-repeat;
      display: grid;
      max-height: 100%;
      height: 354px;
      align-content: flex-end;
      width: 100%;
    }
    &__title {
      color: $white;
      font-weight: 700;
      font-size: 34px;
      padding: 0 0 10px 0;
    }
    &__subtitle {
      color: $white;
      font-weight: 400;
      font-size: 16px;
      padding: 0 0 30px 0;
    }
    &__header {
      display: grid;
      grid-template-rows: auto 1fr;
      justify-content: center;
    }
  }
  .template {
    &__logo {
      display: none;
    }
    &__container {
      grid-template-columns: 1fr;
    }
    &__left {
     justify-self: center;
      margin-right: 0;
      grid-template-rows: 1fr;
      max-width: 367px;
      padding-top: 0;
      align-self: flex-start;
    }
    &__right {
      display: none;
    }
  }
}

@include _767 {
  .template {
    &__container {
      grid-template-columns: 1fr;
    }
    &__right {
      display: none;
    }
  }
}

@include _380 {
  .mobile {
    &__container {
      height: 230px;
    }
    &__title {
      padding: 0 0 10px 30px;
    }
    &__subtitle {
      padding: 0 0 30px 30px;
    }
  }
  .template {
    &__left {
      max-width: 312px;
      margin: 20px 0 0 0;
    }
  }
}

</style>
