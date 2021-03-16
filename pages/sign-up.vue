<template>
  <div class="regs">
    <div class="regs__container">
      <div class="regs_return return">
        <div class="return__container">
          <div
            class="back"
            @click="backToMain()"
          />
        </div>
      </div>
      <div class="regs__account account">
        <div class="account__container">
          <div class="account__left" />
          <div class="account__right">
            <div class="account__avatar">
              <div class="account__image">
                <img
                  src="~assets/img/app/avatar_empty.png"
                  alt=""
                >
              </div>
              <base-btn
                class="account__btn"
                :mode="'red'"
              >
                {{ $t('registration.edit') }}
              </base-btn>
            </div>
            <div class="account__fields">
              <ValidationObserver
                v-slot="{ handleSubmit }"
                tag="div"
                class="fields"
              >
                <form
                  action=""
                  @submit.prevent="handleSubmit(signUp)"
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    class="fields__item"
                    tag="div"
                    :name="$t('labels.firstName')"
                    rules="required_if|alpha_spaces"
                  >
                    <label
                      for="firstName"
                      class="fields__text"
                    >
                      {{ $t('labels.firstName') }}
                    </label>
                    <div class="fields__box">
                      <input
                        id="firstName"
                        v-model="model.firstName"
                        :placeholder="$t('placeholders.firstName')"
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
                    :name="$t('labels.lastName')"
                    rules="required_if|alpha_spaces"
                  >
                    <label
                      for="lastName"
                      class="fields__text"
                    >
                      {{ $t('labels.lastName') }}
                    </label>
                    <div class="fields__box">
                      <input
                        id="lastName"
                        v-model="model.lastName"
                        :placeholder="$t('placeholders.lastName')"
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
                    :name="$t('labels.mail')"
                    rules="required_if|email"
                  >
                    <label
                      for="mail"
                      class="fields__text"
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
                          src="~assets/img/ui/mail.png"
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
                      class="fields__text"
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
                  <base-btn
                    :mode="'blue'"
                    @click="handleSubmit(signUp)"
                  >
                    {{ $t('registration.registration') }}
                  </base-btn>
                </form>
              </ValidationObserver>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
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
    signUp() {
      //
    },
  },
};
</script>

<style lang="scss" scoped>
.fields {
  padding-top: 23px;
  max-width: 275px;
  display: grid;
  grid-template-columns: 1fr;
  &__item {
    display: grid;
    grid-template-rows: auto 36px 22px;
  }
  &__text {
    color: #ffffff;
    font-family: 'GothamPro', sans-serif;
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    text-transform: uppercase;
    line-height: normal;
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
    color: #ffffff;
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
  background: url("~assets/img/app/hands.png") center center no-repeat;
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
    background: url("~assets/img/app/account_left.png") no-repeat left center, url("~assets/img/app/account_right.png") no-repeat right top -60px, rgba(#27a860, .9);
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
    padding: 20px 45px;
  }
  &__avatar {
    display: grid;
    grid-template-columns: 82px 85px;
    align-items: flex-end;
    grid-gap: 20px;
  }
}

.return {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: #0c82c3;
  background: linear-gradient(to top, #0c82c3 50%, #1d96dc 50%);
  background-size: 100% 200%;
  background-position: top;
  transition: .5s ease-out;
  &:hover {
    background-position: bottom;
  }
  &__container {
    position: relative;
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    padding: 30px;
  }
}

.back {
  position: absolute;
  width: 32px;
  height: 32px;
  cursor: pointer;
  &:before {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #FFFFFF;
    transform: rotate(45deg);
  }
  &:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #FFFFFF;
    transform: rotate(-45deg);
  }
}

</style>
