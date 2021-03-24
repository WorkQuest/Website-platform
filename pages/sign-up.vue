<template>
  <div class="auth">
    <div class="auth__container">
      <div class="auth__text auth__text_title">
        <span>{{ $t('signUp.title') }}</span>
      </div>
      <div class="auth__text auth__text_simple">
        <span>{{ $t('signUp.haveAccount') }}</span>
        <n-link
          class="auth__text"
          :exact-active-class="'auth__text_link'"
          to="/sign-in"
        >
          {{ $t('signUp.auth') }}
        </n-link>
      </div>
      <div class="auth__fields">
        <base-field
          v-model="model.firstName"
          :placeholder="$t('signUp.firstName')"
          :mode="'icon'"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/user.svg"
              alt=""
            >
          </template>
        </base-field>
        <base-field
          v-model="model.lastName"
          :placeholder="$t('signUp.lastName')"
          :mode="'icon'"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/user.svg"
              alt=""
            >
          </template>
        </base-field>
        <base-field
          v-model="model.email"
          rules="required|email"
          :name="$t('signUp.email')"
          :placeholder="$t('signUp.email')"
          :mode="'icon'"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/email.svg"
              alt=""
            >
          </template>
        </base-field>
        <base-field
          v-model="model.password"
          :placeholder="$t('signUp.password')"
          :mode="'icon'"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
        </base-field>
        <base-field
          v-model="model.passwordConfirm"
          :placeholder="$t('signUp.confirmPassword')"
          :mode="'icon'"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
        </base-field>
        <div class="auth__action">
          <base-btn>{{ $t('signUp.create') }}</base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  layout: 'auth',
  data() {
    return {
      model: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.auth {
  &__container {
    display: grid;
    grid-template-rows: auto;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    line-height: 130%;
    &_title {
      font-weight: 600;
      font-size: 34px;
      color: $black800;
    }
    &_simple {
      color: #000000;
      font-weight: 300;
      font-size: 16px;
      padding-top: 15px;
    }
    &_link {
      font-weight: 300;
      font-size: 16px;
      padding-top: 15px;
      color: #0083C7;
      text-decoration: underline;
    }
  }
  &__fields {
    padding-top: 40px;
    display: grid;
    grid-template-columns: 1fr;
  }
  &__action {
    padding-top: 30px;
  }
}
</style>
