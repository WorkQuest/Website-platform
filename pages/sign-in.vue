<template>
  <div class="auth">
    <ValidationObserver
      v-if="step === walletState.SignPage"
      v-slot="{ handleSubmit }"
      class="auth__container"
      tag="div"
    >
      <div class="auth__text auth__text_title">
        <span>{{ $t('signIn.title') }}</span>
      </div>
      <div class="auth__text auth__text_simple">
        <span>{{ $t('signIn.account') }}</span>
        <nuxt-link
          class="auth__text auth__text_link"
          to="/sign-up"
        >
          {{ $t('signIn.regs') }}
        </nuxt-link>
      </div>
      <form
        class="auth__fields"
        action=""
        @submit.prevent="handleSubmit(signIn)"
      >
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
        <div class="auth__tools">
          <base-checkbox
            v-model="remember"
            name="remember"
            :label="$t('signIn.remember')"
          />
          <div
            class="auth__text auth__text_link"
            @click="showRestoreModal()"
          >
            {{ $t('signIn.forgot') }}
          </div>
        </div>
        <div class="auth__action">
          <base-btn :disabled="isLoading">
            {{ $t('signIn.login') }}
          </base-btn>
        </div>
        <div class="auth__text auth__text_wrap">
          {{ $t('signIn.or') }}
        </div>
      </form>
      <div class="auth__social">
        <div class="auth__text auth__text_dark">
          {{ $t('signIn.loginWith') }}
        </div>
        <div class="auth__icons">
          <button
            class="auth__btn auth__btn_workQuest"
            @click="showSignWorkQuest()"
          >
            <img
              src="~assets/img/app/logo.svg"
              alt="WorkQuest"
            >
          </button>
          <button
            class="auth__btn auth__btn_google"
            @click="redirectSocialLink('google')"
          >
            <span class="icon-google" />
          </button>
          <button
            class="auth__btn auth__btn_twitter"
            @click="redirectSocialLink('twitter')"
          >
            <span class="icon-twitter" />
          </button>
          <button
            class="auth__btn auth__btn_facebook"
            @click="redirectSocialLink('facebook')"
          >
            <span class="icon-facebook" />
          </button>
          <button
            class="auth__btn auth__btn_LinkedIn"
            @click="redirectSocialLink('linkedin')"
          >
            <span class="icon-LinkedIn" />
          </button>
        </div>
      </div>
    </ValidationObserver>
    <div
      v-if="step > walletState.SignPage"
      class="auth__back"
      @click="back"
    >
      <span class="icon-long_left" /> {{ $t('meta.back') }}
    </div>
    <CreateWallet
      :step="step"
      @goStep="goStep"
      @submit="assignWallet"
      @import="importWallet"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import {
  createWallet, decryptStringWitheKey, encryptStringWithKey,
} from '~/utils/wallet';
import CreateWallet from '~/components/ui/CreateWallet';
import { UserStatuses, WalletState } from '~/utils/enums';

export default {
  name: 'SignIn',
  layout: 'auth',
  components: {
    CreateWallet,
  },
  data() {
    return {
      addressAssigned: false,
      userAddress: null,
      step: WalletState.SignPage,
      model: {
        email: '',
        password: '',
      },
      remember: false,
      userStatus: null,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      isLoading: 'main/getIsLoading',
    }),
    walletState() {
      return WalletState;
    },
  },
  beforeDestroy() {
    if (!this.addressAssigned) {
      this.$store.dispatch('user/logout');
    }
  },
  methods: {
    back() {
      if (this.step === WalletState.ImportOrCreate) {
        this.step = WalletState.SignPage;
        return;
      }
      if (this.step === WalletState.ImportMnemonic) {
        this.step = !this.userAddress ? WalletState.ImportOrCreate : WalletState.SignPage;
        return;
      }
      if (this.step === WalletState.SaveMnemonic) {
        this.step = WalletState.ImportOrCreate;
        return;
      }
      if (this.step === WalletState.ConfirmMnemonic) {
        this.step = WalletState.SaveMnemonic;
      }
    },
    goStep(step) {
      this.step = step;
    },
    async signIn() {
      if (this.isLoading) return;
      this.SetLoader(true);
      this.model.email = this.model.email.trim();
      const { email, password } = this.model;
      const response = await this.$store.dispatch('user/signIn', {
        email,
        password,
      });
      if (response?.ok) {
        this.userStatus = response.result.userStatus;
        if (this.userStatus === UserStatuses.Unconfirmed && !sessionStorage.getItem('confirmToken')) { // Unconfirmed account w/o confirm token
          await this.$store.dispatch('main/showToast', {
            title: this.$t('registration.emailConfirmTitle'),
            text: this.$t('registration.emailConfirm'),
          });
          this.SetLoader(false);
          return;
        }

        const { address } = response.result;

        // Wallet is not assigned to this account
        if (!address) {
          this.step = WalletState.ImportOrCreate;
          this.SetLoader(false);
          return;
        }
        this.userAddress = address.toLowerCase();

        // Wallet assigned, checking storage
        const sessionData = JSON.parse(sessionStorage.getItem('mnemonic'));
        const storageData = JSON.parse(localStorage.getItem('mnemonic'));
        if (!sessionData && !storageData) {
          this.step = WalletState.ImportMnemonic;
          this.SetLoader(false);
          return;
        }

        const sessionMnemonic = sessionData ? sessionData[address.toLowerCase()] : null;
        const storageMnemonic = storageData ? storageData[address.toLowerCase()] : null;
        if (!sessionMnemonic && !storageMnemonic) {
          this.step = WalletState.ImportMnemonic;
          this.SetLoader(false);
          return;
        }

        // Check in session if exists
        if (sessionMnemonic) {
          const wallet = createWallet(sessionMnemonic);
          if (wallet && wallet.address.toLowerCase() === this.userAddress) {
            this.saveToStorage(wallet);
            this.redirectUser();
            this.SetLoader(false);
            return;
          }
        }

        // Check in storage
        if (storageMnemonic) {
          const mnemonic = decryptStringWitheKey(storageMnemonic, this.model.password);
          const wallet = createWallet(mnemonic);
          if (wallet && wallet.address.toLowerCase() === this.userAddress) {
            this.saveToStorage(wallet);
            this.redirectUser();
            this.SetLoader(false);
            return;
          }
        }

        // Session & Storage invalid mnemonics
        await this.$store.dispatch('main/showToast', {
          title: this.$t('toasts.error'),
          text: this.$t('messages.mnemonic'),
        });
        // Reset mnemonic for address -> importing
        this.saveToStorage({ address: this.userAddress, mnemonic: {} });
        this.step = WalletState.ImportMnemonic;
      }
      this.SetLoader(false);
    },
    async assignWallet(wallet) {
      const res = await this.$store.dispatch('user/registerWallet', {
        address: wallet.address.toLowerCase(),
        publicKey: wallet.publicKey,
      });
      if (res.ok) {
        this.saveToStorage(wallet);
        this.redirectUser();
        return;
      }
      if (res.code === 400011) {
        // На данный mnemonic уже привязан какой-то аккаунт
        await this.$store.dispatch('main/showToast', {
          title: this.$t('toasts.error'),
          text: this.$t('messages.mnemonic'),
        });
      }
    },
    async importWallet(wallet) {
      // Correct phrase, but not assigned to this account
      if (!this.userAddress) {
        await this.assignWallet(wallet);
        return;
      }
      // All ok
      if (wallet.address.toLowerCase() === this.userAddress) {
        this.saveToStorage(wallet);
        this.redirectUser();
        return;
      }
      // Phrase not assigned to this account
      await this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        text: this.$t('messages.mnemonic'),
      });
    },
    saveToStorage(wallet) {
      localStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(localStorage.getItem('mnemonic')),
        [wallet.address.toLowerCase()]: encryptStringWithKey(wallet.mnemonic.phrase, this.model.password),
      }));
      sessionStorage.setItem('keys', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('keys')),
        [wallet.address.toLowerCase()]: wallet.privateKey,
      }));
      sessionStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('mnemonic')),
        [wallet.address.toLowerCase()]: wallet.mnemonic.phrase,
      }));
      this.$store.dispatch('wallet/connectWallet', { userAddress: wallet.address, userPassword: this.model.password });
    },
    redirectUser() {
      this.$store.dispatch('wallet/setUserAddress', this.userAddress);
      this.addressAssigned = true;
      this.$cookies.set('userLogin', true);
      // redirect to confirm access if token exists & unconfirmed account
      const confirmToken = JSON.parse(sessionStorage.getItem('confirmToken'));
      if (this.userStatus === UserStatuses.Unconfirmed && confirmToken) {
        this.$router.push(`/confirm/?token=${confirmToken}`);
        return;
      }
      sessionStorage.removeItem('confirmToken');
      if (this.userData.role === 'employer') {
        this.$router.push('/workers');
      } else if (this.userData.role === 'worker') {
        this.$router.push('/quests');
      } else if (this.userStatus === UserStatuses.NeedSetRole) {
        this.$router.push('/role');
      }
    },
    async redirectSocialLink(socialNetwork) {
      window.location = `${process.env.BASE_URL}v1/auth/login/${socialNetwork}`;
    },
    showRestoreModal() {
      this.ShowModal({
        key: modals.restore,
      });
    },
    showSignWorkQuest() {
      this.ShowModal({
        key: modals.signWorkQuest,
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
      cursor: pointer;
    }
    &_wrap {
      font-weight: normal;
      color: $black400;
      font-size: 16px;
      line-height: 130%;
      padding: 15px 0;
    }
    &_dark {
      color: $black700;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
    }
  }
  &__social {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__fields {
    padding-top: 40px;
    display: grid;
    grid-template-columns: 1fr;
  }
  &__action {
    padding-top: 40px;
  }
  &__icons {
    display: grid;
    grid-template-columns: repeat(5, 40px);
    grid-gap: 30px;
  }
  &__tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__btn {
    transition: .5s;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: #0083C7;
    }
    &:hover {
      span:before {
        background: white;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    &_instagram {
      span:before {
        font-size: 18px;
        background: linear-gradient(180deg, #C540F3 0%, #FF8C05 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    &_twitter {
      span:before {
        font-size: 18px;
        color: #24CAFF;
      }
    }
    &_google {
      span:before {
        font-size: 18px;
        color: #094EFF;
      }
    }
    &_facebook {
      span:before {
        font-size: 18px;
        color: #3B67D7;
      }
    }
    &_LinkedIn {
      span:before {
        font-size: 18px;
        color: #0A7EEA;
      }
    }
    &_workQuest {
      img {
        width: 60%;
      }
    }
  }
}

@include _1199 {
  .auth {
    &__icons {
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 15px;
    }
    &__text {
      &_title {
        font-size: 28px;
      }
      &_wrap {
        text-align: center;
      }
      &_dark {
        display: none;
      }
    }
  }
}
@include _575 {
  .auth {
    &__icons {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
