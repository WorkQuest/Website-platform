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
        autocomplete="off"
        @submit.prevent="handleSubmit(signUp)"
      >
        <base-field
          v-model="model.firstName"
          mode="icon"
          :name="$t('meta.firstNameSmall')"
          :placeholder="$t('meta.firstNameBig')"
          rules="signUpRequiredField|alpha|max:15"
          autocomplete="off"
          data-selector="FIRST_NAME"
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
          mode="icon"
          :name="$t('meta.lastNameSmall')"
          :placeholder="$t('meta.lastNameBig')"
          rules="signUpRequiredField|alpha|max:15"
          data-selector="LAST_NAME"
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
          mode="icon"
          :name="$t('signUp.emailSmall')"
          :placeholder="$t('signUp.email')"
          rules="signUpRequiredField|emailValidation"
          autocomplete="username"
          data-selector="EMAIL"
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
          mode="icon"
          :name="$t('signUp.passwordSmall')"
          :placeholder="$t('signUp.password')"
          rules="signUpRequiredPassword|min:8"
          autocomplete="new-password"
          :type="isPasswordVisible ? 'text' : 'password'"
          vid="confirmation"
          data-selector="PASSWORD"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
          <template
            v-if="model.password"
            v-slot:right-absolute
            class="field__block"
          >
            <btn-password-visibility
              :is-password-visible="isPasswordVisible"
              @toggleVisibility="isPasswordVisible = $event"
            />
          </template>
        </base-field>
        <base-field
          v-model="model.passwordConfirm"
          mode="icon"
          :name="$t('signUp.passwordSmall')"
          :placeholder="$t('signUp.confirmPassword')"
          rules="signUpRequiredRepeatPassword|min:8|confirmed:confirmation"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          data-selector="CONFIRM_PASSWORD"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
          <template
            v-if="model.passwordConfirm"
            v-slot:right-absolute
            class="field__block"
          >
            <btn-password-visibility
              :is-password-visible="isPasswordConfirmVisible"
              @toggleVisibility="isPasswordConfirmVisible = $event"
            />
          </template>
        </base-field>
        <div class="auth__action">
          <base-btn
            :disabled="!valid || inProgress"
            data-selector="CREATE"
          >
            {{ $t('signUp.create') }}
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';
import { Layout, Path } from '~/utils/enums';
import { resendEmailLifetime } from '~/utils/сonstants/cookiesLifetime';

export default {
  name: 'SignUp',
  layout: Layout.AUTH,
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
      isPasswordVisible: false,
      isPasswordConfirmVisible: false,
      inProgress: false,

      referralId: null,
    };
  },
  beforeCreate() {
    this.$store.dispatch('user/logout', false);
  },
  mounted() {
    const { ref } = this.$route.query;
    if (ref) this.referralId = ref;
  },
  methods: {
    async signUp() {
      this.inProgress = true;
      this.model.email = this.model.email.trim();
      this.model.firstName = this.model.firstName.trim();
      this.model.lastName = this.model.lastName.trim();
      const payload = {
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        email: this.model.email,
        password: this.model.password,
      };
      if (this.referralId) payload.referralId = this.referralId;
      const response = await this.$store.dispatch('user/signUp', payload);
      if (response.ok) {
        sessionStorage.removeItem('referralId');
        sessionStorage.setItem(
          'resend-timer',
          JSON.stringify({
            timerValue: resendEmailLifetime,
            createdAt: Date.now(),
          }),
        );
        await this.$router.push(Path.SIGN_IN);
        this.ShowModal({
          key: modals.status,
          path: Path.SIGN_IN,
          img: require('~/assets/img/ui/email.svg'),
          title: this.$t('modals.titles.emailConfirmTitle'),
          subtitle: this.$t('registration.emailConfirm'),
        });
      }
      this.inProgress = false;
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
      color: #0083c7;
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
