<template>
  <div class="regs">
    <div class="regs__container">
      <div class="regs__account account">
        <div class="account__container">
          <div class="account__left" />
          <div class="account__right">
            <div class="account__fields">
              <ValidationObserver
                v-slot="{ handleSubmit }"
                tag="div"
                class="fields"
              >
                <form
                  action=""
                  class="regs__field"
                  @submit.prevent="handleSubmit(signIn)"
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    class="fields__item"
                    tag="div"
                    :name="$t('labels.mail')"
                    rules="required_if|email"
                  >
                    <label
                      for="mail"
                      class="fields__text fields__text_label"
                    >
                      {{ $t('labels.mail') }}
                    </label>
                    <div class="fields__box">
                      <input
                        id="mail"
                        v-model="model.email"
                        autocomplete="username"
                        :placeholder="$t('placeholders.mail')"
                        type="text"
                        class="fields__text fields__text_input fields__input"
                      >
                      <div class="fields__icon">
                        <img
                          src="~assets/img/ui/user.png"
                          alt=""
                        >
                      </div>
                    </div>
                    <div
                      v-if="errors[0]"
                      class="fields__error"
                    >
                      {{ errors[0] }}
                    </div>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    class="fields__item"
                    tag="div"
                    :name="$t('labels.password')"
                    rules="required_if|min:8"
                  >
                    <label
                      for="password"
                      class="fields__text fields__text_label"
                    >
                      {{ $t('labels.password') }}
                    </label>
                    <div class="fields__box">
                      <input
                        id="password"
                        v-model="model.password"
                        autocomplete="password"
                        :placeholder="$t('placeholders.password')"
                        type="password"
                        class="fields__text fields__text_input fields__input"
                      >
                      <div class="fields__icon">
                        <img
                          src="~assets/img/ui/password.png"
                          alt=""
                        >
                      </div>
                    </div>
                    <div
                      v-if="errors[0]"
                      class="fields__error"
                    >
                      {{ errors[0] }}
                    </div>
                  </ValidationProvider>
                  <div class="fields__actions">
                    <div class="fields__remember">
                      <input
                        id="remember"
                        type="checkbox"
                      >
                      <label for="remember">
                        {{ $t('login.remember') }}
                      </label>
                    </div>
                    <div class="fields__forgot">
                      <img
                        src="~assets/img/app/next-page.png"
                        alt="->"
                      >
                      {{ $t('login.forgot') }}
                    </div>
                  </div>
                  <base-btn
                    class="account__btn account__btn_login"
                    :mode="'blue'"
                  >
                    {{ $t('login.signIn') }}
                  </base-btn>
                </form>
                <div
                  class="back"
                  @click="backToMain()"
                />
              </ValidationObserver>
            </div>
            <div class="account__media">
              <div class="account__title">
                <span>{{ $t('login.loginWith') }}</span>
              </div>
              <div class="account__items">
                <div class="account__item">
                  <img
                    src="~assets/img/social/FACEBOOK.png"
                    alt=""
                  >
                </div>
                <div class="account__item">
                  <img
                    src="~assets/img/social/GOOGLE_+_.png"
                    alt=""
                  >
                </div>
                <div class="account__item">
                  <img
                    src="~assets/img/social/INSTAGRAM.png"
                    alt=""
                  >
                </div>
                <div class="account__item">
                  <img
                    src="~assets/img/social/TWITTER.png"
                    alt=""
                  >
                </div>
                <div class="account__item">
                  <img
                    src="~assets/img/social/LINKED_IN_.png"
                    alt=""
                  >
                </div>
              </div>
              <base-btn
                :mode="'green'"
                class="account__btn account__btn_create"
                @click="doSignUp()"
              >
                {{ $t('login.create') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  data: () => ({
    model: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  }),
  methods: {
    backToMain() {
      this.$router.push('/');
    },
    doSignUp() {
      this.$router.push('/sign-up');
    },
    async signIn() {
      const { email, password } = this.model;
      const response = await this.$store.dispatch('user/signIn', {
        email,
        password,
      });
      if (response?.ok) {
        const userData = this.$store.dispatch('user/getUserData');
        if (userData.role === 'worker') {
          this.$router.push('/profile');
        }
        if (userData.role === 'employer') {
          this.$router.push('/questors');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fields {
  padding-top: 23px;
  display: grid;
  grid-template-columns: 360px 32px;
  grid-gap: 22px;
  &__item {
    display: grid;
    grid-template-rows: 36px 22px;
  }
  &__forgot {
    cursor: pointer;
    display: flex;
    align-items: center;
    grid-gap: 10px;
    color: #27a860;
    font-family: 'GothamProBlack', sans-serif;
    font-size: 16px;
    font-weight: 400;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    text-transform: uppercase;
    line-height: normal;
  }
  &__remember {
    display: flex;
    grid-gap: 12px;
    label {
      margin: 0;
      display: flex;
      align-items: center;
      color: #20253b;
      font-family: 'GothamProMedium', sans-serif;
      font-size: 16px;
      font-weight: 500;
      font-style: normal;
      letter-spacing: normal;
      text-align: left;
      text-transform: uppercase;
      line-height: normal;
    }
  }
  &__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    grid-gap: 27px;
    padding: 20px 0 30px 0;
  }
  &__text {
    color: #20253b;
    font-family: 'GothamPro', sans-serif;
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    text-transform: uppercase;
    line-height: normal;
    &_bold {
      font-size: 13px;
    }
    // ¯\_(ツ)_/¯ Семантика
    &_label {
      @media screen {
        display: none;
      }
    }
  }
  &__input {
    background: transparent;
    border-radius: 17px;
    border: 2px solid #d0d0d0;
    padding-left: 36px;
    width: 100%;
    height: 100%;
    &::placeholder {
      color: #c7c4c4;
    }
  }
  &__box {
    height: 100%;
    width: 100%;
    position: relative;
  }
  &__icon {
    position: absolute;
    left: 6px;
    top:  5px;
  }
  &__error {
    color: #20253b;
    display: flex;
    align-items: center;
    font-family: 'GothamPro', sans-serif;
    font-size: 12px;
    font-weight: 500;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    line-height: normal;
  }
}

.regs {
  background: url("~assets/img/app/hands_login.png") center center no-repeat;
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  &__container {
    position: relative;
    min-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__account {
    background: url("~assets/img/app/account_left.png") no-repeat left center, rgba(#FFFFFF, 1);
    border-radius: 100px;
    min-height: 520px;
    width: 100%;
    max-width: 1000px;
  }
}

.account {
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  &__right {
    padding: 20px 15px;
  }
  &__media {
    padding-top: 40px;
  }
  &__title {
    color: #20253b;
    white-space: pre-line;
    font-family: 'GothamProBlack', sans-serif;
    font-size: 16px;
    font-weight: 400;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    text-transform: uppercase;
    line-height: normal;
  }
  &__items {
    padding: 30px 0 25px 0;
    display: grid;
    grid-template-columns: repeat(5, 45px);
    grid-gap: 25px;
  }
  &__item {
    cursor: pointer;
  }
  &__btn {
    &_login {
      max-width: 275px;
    }
    &_create {
      max-width: 325px;
    }
  }
}

.back {
  width: 32px;
  height: 32px;
  cursor: pointer;
  position: relative;
  &:before {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #d0d0d0;
    transform: rotate(45deg);
  }
  &:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #d0d0d0;
    transform: rotate(-45deg);
  }
}

@include _991 {
  .regs {
    &__account {
      background: url("~assets/img/app/bg_login_top.png") center top no-repeat, rgba(#FFFFFF, 1);
      display: grid;
      width: initial;
      background-size: contain;
      position: relative;
      margin: 20px 10px;
    }
    &__field {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .account {
    &__container {
      display: grid;
      grid-template-rows: 212px 1fr;
      grid-template-columns: 1fr;
    }
    &__left {
      position: relative;
    }
    &__right {
      padding: 0 20px 50px 20px;
    }
    &__btn {
      &_login {
        max-width: initial;
      }
      &_create {
        max-width: initial;
      }
    }
    &__title {
      text-align: center;
    }
    &__items {
      grid-template-columns: repeat(5, 1fr);
    }
  }
  .fields {
    grid-template-columns: 1fr;
    width: 100%;
    &__remember {
      label {
        font-size: 14px;
      }
    }
    &__item {
      width: 100%;
    }
    &__forgot {
      font-size: 14px;
    }
  }
  .back {
    position: absolute;
    top: 30px;
    right: 70px;
  }
}
</style>
