<template>
  <div class="page">
    <div class="confirm">
      <div class="confirm__title">
        {{ $t('securityCheck.confirmAccess') }}
      </div>
      <div class="confirm__text">
        {{ isImportWallet ? $t('createWallet.typeSecretPhrase') : $t('securityCheck.confirmPassToContinue') }}
      </div>
      <ValidationObserver
        v-slot="{ handleSubmit, valid }"
        tag="form"
        @submit.prevent="submit"
      >
        <base-field
          v-if="!isImportWallet"
          v-model="password"
          data-selector="PASSWORD"
          :placeholder="$t('signUp.password')"
          :name="$t('signUp.password')"
          class="confirm__password"
          rules="required_if|min:8"
          :type="isPasswordVisible?'text':'password'"
          vid="confirmation"
        >
          <template
            v-if="password"
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
          v-else
          v-model="mnemonic"
          rules="required|mnemonic"
          data-selector="MNEMONIC"
          :placeholder="$t('createWallet.secretPhrase')"
          :name="$t('createWallet.secretPhrase')"
          :type="isMnemonicVisible?'text':'password'"
        >
          <template
            v-if="mnemonic"
            v-slot:right-absolute
            class="field__block"
          >
            <btn-password-visibility
              :is-password-visible="isMnemonicVisible"
              @toggleVisibility="isMnemonicVisible = $event"
            />
          </template>
        </base-field>
        <div
          v-if="isImportWallet"
          class="confirm__visibility"
        >
          <input
            id="showMnemonic"
            v-model="isShowMnemonic"
            type="checkbox"
            class="confirm__visibility_box"
          >
          <label
            for="showMnemonic"
            class="confirm__visibility_label"
          >
            {{ $t('createWallet.showSecretPhrase') }}
          </label>
        </div>
        <base-btn
          class="confirm__submit"
          data-selector="SUBMIT"
          :disabled="!valid || isLoading"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { connectWithMnemonic, setCipherKey } from '~/utils/wallet';
import { Path } from '~/utils/enums';

export default {
  name: 'Confirm',
  middleware: 'auth',
  data() {
    return {
      password: '',
      context: 'default',
      toDecrypt: null,
      counter: 1,
      tryLimit: 5,
      isPasswordVisible: false,

      isImportWallet: false,
      isShowMnemonic: false,
      mnemonic: '',
      isMnemonicVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userWalletAddress: 'user/getUserWalletAddress',
      callbackLayout: 'wallet/getCallbackLayout',
      isOnlyConfirm: 'wallet/getIsOnlyConfirm',
    }),
  },
  beforeCreate() {
    if (!this.$cookies.get('userLogin')) {
      this.$store.dispatch('user/logout');
      this.$router.push('/sign-in');
    }
  },
  mounted() {
    if (this.isOnlyConfirm) return;
    if (!this.userWalletAddress) {
      this.disconnect();
      return;
    }
    if (this.$cookies.get('socialNetwork')) {
      this.isImportWallet = true;
      return;
    }
    // Try to find mnemonic in storage by user wallet address
    // Checking session storage
    const session = JSON.parse(sessionStorage.getItem('mnemonic'));
    let mnemonic = null;
    if (session) {
      mnemonic = session[this.userWalletAddress];
      if (mnemonic) {
        this.toDecrypt = mnemonic;
        return;
      }
    }
    // Checking local storage
    const storage = JSON.parse(localStorage.getItem('mnemonic'));
    if (!storage) {
      this.disconnect();
      return;
    }
    mnemonic = storage[this.userWalletAddress];
    if (!mnemonic) {
      this.disconnect();
      return;
    }
    this.toDecrypt = mnemonic;
    this.SetLoader(false);
    this.CloseModal();
  },
  methods: {
    allowAccess() {
      this.$nuxt.setLayout(this.callbackLayout);
    },
    async checkPassword() {
      const checked = await this.$store.dispatch('wallet/checkPassword', this.password);
      if (!checked) {
        if (this.counter >= this.tryLimit) {
          this.ShowToast(this.$t('messages.attemptsExceeded'));
          this.disconnect(false);
        } else this.ShowToast(this.$t('messages.invalidPassword'));
        this.counter += 1;
        return false;
      }
      return true;
    },
    async submit() {
      if (this.isImportWallet) {
        this.handleImport();
        return;
      }

      const checked = await this.checkPassword();
      if (!checked) return;

      if (this.isOnlyConfirm) {
        setCipherKey(this.password);
        this.allowAccess();
        return;
      }

      const res = await this.$store.dispatch('wallet/connectWallet', {
        userWalletAddress: this.userWalletAddress,
        userPassword: this.password,
      });
      if (res?.ok) this.allowAccess();
    },
    handleImport() {
      sessionStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('mnemonic')),
        [this.userWalletAddress]: this.mnemonic,
      }));
      if (connectWithMnemonic(this.userWalletAddress)) this.allowAccess();
      else {
        this.ShowToast(this.$t('messages.mnemonic'));
        if (this.counter >= this.tryLimit) {
          this.disconnect(true);
        }
        this.counter += 1;
      }
    },
    disconnect(showMnemonicError = true) {
      if (showMnemonicError) this.ShowToast(this.$t('messages.loginWithSecret'));
      this.$store.dispatch('user/logout');
      this.$store.dispatch('wallet/disconnect');
      this.$nuxt.setLayout('auth');
      this.$router.push(Path.SIGN_IN);
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  background: $black0 !important;
  height: 100vh !important;
  width: 100vw !important;
  padding: 40px
}
.confirm {
  border: 1px solid $blue;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  background: white;
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
  border-radius: 16px;
  &__title {
    font-size: 28px;
    text-align: center;
  }
  &__text {
    margin-top: 20px;
    font-size: 18px;
  }
  &__password {
    margin-top: 20px;
  }
  &__submit {
    margin-top: 20px;
  }

  &__visibility {
    display: flex;
    align-items: center;
    &_label {
      color: $black700;
      margin: 0 0 0 10px !important;
      user-select: none;
    }
    &_box {
      width: 20px !important;
      height: 20px !important;
      cursor: pointer;
    }
  }
}
@include _767 {
  .page {
    padding: 30px !important;
  }
}
</style>
