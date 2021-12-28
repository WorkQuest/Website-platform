<template>
  <div class="auth">
    <div
      v-if="step > 1"
      class="auth__back"
      @click="goStep(step - 1)"
    >
      <span class="icon-long_left" /> {{ $t('meta.back') }}
    </div>
    <ValidationObserver
      v-if="step === 1"
      v-slot="{ handleSubmit, valid }"
      tag="div"
      class="auth__container"
    >
      <div class="auth__text auth__text_title">
        <span>{{ $t('signUp.title') }}</span>
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
        @submit.prevent="handleSubmit(goStep(2))"
      >
        <base-field
          v-model="model.firstName"
          :placeholder="$t('signUp.firstName')"
          :mode="'icon'"
          autocomplete="off"
          :name="$t('signUp.firstName')"
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
          :placeholder="$t('signUp.lastName')"
          :mode="'icon'"
          :name="$t('signUp.lastName')"
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
          <base-btn :disabled="!valid">
            {{ $t('meta.next') }}
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
    <CreateWallet
      :step="step"
      @goStep="goStep"
      @submit="signUp"
    >
      <template slot="actionText">
        {{ $t('signUp.create') }}
      </template>
    </CreateWallet>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';
import CreateWallet from '~/components/ui/CreateWallet';
import {
  encryptStringWithKey,
  generateMnemonic,
} from '~/utils/wallet';

export default {
  name: 'SignUp',
  layout: 'auth',
  components: {
    CreateWallet,
  },
  data() {
    return {
      error: '',
      step: 1,
      model: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
      savedMnemonicValue: false,
      mnemonic: '',
      confirmMnemonic: {
        first: '',
        second: '',
      },
      confirmMnemonicData: {
        first: '',
        second: '',
      },
    };
  },
  async mounted() {
    this.mnemonic = generateMnemonic();
    const s = this.mnemonic.split(' ');
    this.confirmMnemonicData = {
      first: s[2],
      second: s[6],
    };
  },
  methods: {
    goStep(step) {
      this.step = step;
    },
    async signUp(wallet) {
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
        const res = await this.$store.dispatch('user/registerWallet', {
          address: wallet.address,
          publicKey: wallet.publicKey,
        });
        if (res.ok) {
          localStorage.setItem('mnemonic', JSON.stringify({
            ...JSON.parse(localStorage.getItem('mnemonic')),
            [wallet.address]: encryptStringWithKey(wallet.mnemonic.phrase, this.model.password),
          }));
          sessionStorage.setItem('mnemonic', JSON.stringify({
            ...JSON.parse(sessionStorage.getItem('mnemonic')),
            [wallet.address]: wallet.mnemonic.phrase,
          }));
          this.showConfirmEmailModal();
        }
      }
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
