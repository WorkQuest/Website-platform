<template>
  <div class="auth">
    <div
      v-if="step > 1"
      class="auth__back"
      @click="goStep(step - 1)"
    >
      <span class="icon-long_left" /> {{ $t('signUp.back') }}
    </div>
    <ValidationObserver
      v-if="step === 1"
      v-slot="{ handleSubmit, valid }"
      tag="div"
      class="auth__container"
    >
      <div
        class="auth__text auth__text_title"
      >
        <span>{{ $t('signUp.title') }}</span>
      </div>
      <div class="auth__text auth__text_simple">
        <span>{{ $t('signUp.haveAccount') }}</span>
        <n-link
          class="auth__text auth__text_link"
          to="/sign-in"
        >
          {{ $t('signUp.auth') }}
        </n-link>
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
            {{ $t('signUp.next') }}
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
    <ValidationObserver
      v-if="step === 2"
      v-slot="{ handleSubmit }"
      class="auth__container"
    >
      <div
        class="auth__text auth__text_title"
      >
        {{ $t('signUp.savePhrase') }}
      </div>
      <form
        class="auth__fields"
        @submit.prevent="handleSubmit(goStep(3))"
      >
        <div class="auth__mnemonic">
          {{ mnemonic }}
          <button
            v-clipboard:copy="mnemonic"
            v-clipboard:success="ClipboardSuccessHandler"
            v-clipboard:error="ClipboardErrorHandler"
            type="button"
          >
            <span class="icon-copy auth__mnemonic_copy" />
          </button>
        </div>
        <div class="auth__confirm-phrase">
          <input
            id="savedMnemonic"
            v-model="savedMnemonicValue"
            type="checkbox"
            class="auth__confirm-phrase_box"
          >
          <label
            for="savedMnemonic"
            class="auth__confirm-phrase_label"
          >
            {{ $t('signUp.keptPhrase') }}
          </label>
        </div>

        <div class="auth__action">
          <base-btn :disabled="!savedMnemonicValue">
            {{ $t('signUp.next') }}
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
    <ValidationObserver
      v-if="step === 3"
      v-slot="{ handleSubmit, valid }"
      class="auth__container"
    >
      <div class="auth__text auth__text_title">
        {{ $t('signUp.confirmSecretPhrase') }}
      </div>
      <form
        class="auth__fields"
        @submit.prevent="handleSubmit(signUp)"
      >
        <base-field
          v-model="confirmMnemonic.first"
          :rules="`required|is:${confirmMnemonicData.first}`"
          :placeholder="$t('signUp.typeSecret', { a: 3 })"
          :name="$t('signUp.secret', { a: 3 })"
        />
        <base-field
          v-model="confirmMnemonic.second"
          :rules="`required|is:${confirmMnemonicData.second}`"
          :placeholder="$t('signUp.typeSecret', { a: 7 })"
          :name="$t('signUp.secret', { a: 7 })"
        />
        <div class="auth__action">
          <base-btn :disabled="!valid">
            {{ $t('signUp.create') }}
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';
import {
  createWallet,
  encryptStringWithKey,
  decryptStringWitheKey,
  generateMnemonic,
} from '~/utils/wallet';

export default {
  name: 'SignUp',
  layout: 'auth',
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
    this.SetLoader(true);
    this.mnemonic = generateMnemonic();
    const s = this.mnemonic.split(' ');
    this.confirmMnemonicData = {
      first: s[2],
      second: s[6],
    };
    this.SetLoader(false);

    // const toEncrypt = this.mnemonic;
    // const encrypt = encryptStringWithKey(toEncrypt, 'secret');
    // console.log(toEncrypt, ' >>>>> ', encrypt.toString());
    // const decrypt = decryptStringWitheKey(encrypt, 'secret');
    // console.log('>>>', decrypt);
  },
  methods: {
    goStep(step) {
      this.step = step;
    },
    async signUp() {
      console.log('all ok');
      const wallet = createWallet(this.mnemonic);
      console.log('>>> WALLET:', wallet);
      const data = {};
      data.publicKey = wallet.publicKey;
      data.privateKey = wallet.privateKey;
      data.address = wallet.address;

      // try {
      //   const payload = {
      //     firstName: this.model.firstName,
      //     lastName: this.model.lastName,
      //     email: this.model.email,
      //     password: this.model.password,
      //   };
      //   const response = await this.$store.dispatch('user/signUp', payload);
      //   if (response?.ok) {
    // localStorage.setItem('mnemonic', encryptStringWithKey(this.mnemonic, this.model.password));
    // this.$cookies.set('mnemonic', this.mnemonic);
      //     this.showConfirmEmailModal();
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
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
