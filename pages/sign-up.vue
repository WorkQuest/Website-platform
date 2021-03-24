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
        <base-field />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  layout: 'auth',
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
}
</style>
