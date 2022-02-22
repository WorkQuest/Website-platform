<template>
  <div class="auth">
    <ValidationObserver
      v-slot="{ handleSubmit, valid }"
      tag="div"
      class="auth__container"
    >
      <div class="auth__text auth__text_title">
        <span>{{ $t('meta.signUp') }}</span>
      </div>
      <div class="auth__text auth__text_simple">
        <span>{{ $t('signUp.haveAccount') }}</span>
        <nuxt-link
          class="auth__text auth__text_link"
          to="/sign-in"
        >
          {{ $t('signUp.auth') }}
        </nuxt-link>
      </div>
      <form
        class="auth__fields"
        action=""
        @submit.prevent="signUp"
      >
        <base-field
          v-model="model.firstName"
          :placeholder="$t('meta.firstNameBig')"
          :mode="'icon'"
          autocomplete="off"
          :name="$t('meta.firstNameBig')"
          rules="required_if|alpha_spaces"
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
          :placeholder="$t('meta.lastNameBig')"
          :mode="'icon'"
          :name="$t('meta.lastNameBig')"
          rules="required_if|alpha_spaces"
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
          autocomplete="username"
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
          :name="$t('signUp.password')"
          autocomplete="current-password"
          rules="required_if|min:8"
          type="password"
          vid="confirmation"
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
          type="password"
          :name="$t('signUp.confirmPassword')"
          rules="required_if|min:8|confirmed:confirmation"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
        </base-field>
        <div class="auth__action">
          <base-btn :disabled="!valid || isLoading">
            {{ $t('signUp.create') }}
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { Path } from '~/utils/enums';

export default {
  name: 'SignUp',
  layout: 'auth',
  data() {
    return {
      error: '',
      model: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
    }),
  },
  methods: {
    async signUp() {
      this.SetLoader(true);
      this.model.email = this.model.email.trim();
      this.model.firstName = this.model.firstName.trim();
      this.model.lastName = this.model.lastName.trim();
      const payload = {
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        email: this.model.email,
        password: this.model.password,
      };
      const response = await this.$store.dispatch('user/signUp', payload);
      if (response.ok) {
        this.showConfirmEmailModal();
        await this.$router.push(Path.SIGN_IN);
      }
      this.SetLoader(false);
    },
    showConfirmEmailModal() {
      this.ShowModal({
        key: modals.emailConfirm,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.auth {
  &__back {
    cursor: pointer;
  }
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
      padding-left: 5px;
      font-weight: 300;
      font-size: 16px;
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
  &__mnemonic {
    position: relative;
    padding: 10px 40px 10px 10px;
    background: $grey;
    border-radius: 12px;
    font-weight: 500;
    min-height: 50px;
    &_copy {
      position: absolute;
      right: 10px;
      top: 25%;
      height: 100%;
      font-size: 28px;
      cursor: pointer;
      &:hover::before {
        color: $blue;
    }
    }
  }
  &__confirm-phrase {
    margin-top: 20px;
    display: flex;
    align-items: center;
    &_label {
      margin: 0 0 0 10px !important;
    }
    &_box {
      width: 20px !important;
      height: 20px !important;
    }
  }
}
@include _1199 {
  .auth {
    &__text {
      &_title {
        font-size: 28px;
      }
    }
  }
}
</style>
