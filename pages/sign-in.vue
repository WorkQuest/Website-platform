<template>
  <div class="auth">
    <ValidationObserver
      v-if="step === walletState.Default"
      v-slot="{ handleSubmit }"
      class="auth__container"
      data-selector="PAGE-SIGN-IN"
      tag="div"
    >
      <div class="auth__text auth__text_title">
        <span>
          {{ $t('meta.signIn') }}
        </span>
      </div>
      <div class="auth__text auth__text_simple">
        <span>
          {{ $t('meta.account') }}
        </span>
        <nuxt-link
          class="auth__text auth__text_link"
          data-selector="ACTION-BTN-TO-REGISTRATION"
          :to="$options.Path.SIGN_UP"
        >
          {{ $t('meta.btns.registration') }}
        </nuxt-link>
      </div>
      <form
        class="auth__fields"
        action=""
        @submit.prevent="handleSubmit(signIn)"
      >
        <base-field
          v-model="model.email"
          mode="icon"
          :name="$tc('signUp.email')"
          :placeholder="$t('signUp.email')"
          rules="required|email"
          autocomplete="username"
          data-selector="LOGIN"
        >
          <template v-slot:left>
            <img
              :src="$options.images.EMAIL"
              alt=""
            >
          </template>
        </base-field>
        <base-field
          v-model="model.password"
          mode="icon"
          :name="$tc('signUp.password')"
          :placeholder="$t('signUp.password')"
          rules="required_if|min:8"
          autocomplete="current-password"
          :type="isPasswordVisible?'text':'password'"
          vid="confirmation"
          data-selector="PASSWORD"
        >
          <template v-slot:left>
            <img
              :src="$options.images.PASSWORD"
              alt=""
            >
          </template>
          <template
            v-if="model.password"
            v-slot:right-absolute
          >
            <btn-password-visibility
              :is-password-visible="isPasswordVisible"
              @toggleVisibility="isPasswordVisible = $event"
            />
          </template>
        </base-field>
        <div class="auth__tools">
          <base-checkbox
            v-model="remember"
            name="remember"
            :label="$tc('signIn.remember')"
            @input="$store.dispatch('user/setRememberMe', remember)"
          />
          <div
            class="auth__text auth__text_link"
            data-selector="ACTION-BTN-FORGOT-PASSWORD"
            @click="showRestoreModal()"
          >
            {{ $t('meta.btns.forgot') }}
          </div>
        </div>
        <div class="auth__action">
          <base-btn
            :disabled="isLoading"
            data-selector="LOGIN"
          >
            {{ $t('meta.login') }}
          </base-btn>
        </div>
      </form>
      <base-btn
        v-if="isShowBtnResend"
        class="auth__resend"
        data-selector="RESEND-LETTER"
        :disabled="timeLeft > 0"
        @click="resendLetter"
      >
        {{ `Resend the letter ${timeLeft > 0 ? timeLeft : ''}` }}
      </base-btn>
      <div class="auth__text auth__text_wrap">
        {{ $t('signIn.or') }}
      </div>
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
              :src="$options.images.WQ_LOGO"
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
      v-if="step > walletState.Default"
      class="auth__back"
      @click="back"
    >
      <span class="icon-chevron_big_left" />
      <span>
        {{ $t('meta.btns.back') }}
      </span>
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
  createWallet, decryptStringWitheKey, encryptStringWithKey, initWallet, setCipherKey,
} from '~/utils/wallet';
import CreateWallet from '~/components/ui/CreateWallet';
import {
  Path, UserRole, UserStatuses, WalletState,
} from '~/utils/enums';
import { images } from '~/utils/images';

export default {
  name: 'SignIn',
  layout: 'auth',
  images,
  Path,
  components: {
    CreateWallet,
  },
  data() {
    return {
      isShowBtnResend: false,
      timer: null,
      timeLeft: 60,
      addressAssigned: false,
      userWalletAddress: null,
      step: WalletState.Default,
      model: { email: '', password: '', totp: '' },
      remember: false,
      userStatus: null,
      isLoginWithSocial: false,
      userAddress: '',
      isPasswordVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      isLoading: 'main/getIsLoading',

      connections: 'main/notificationsConnectionStatus',
    }),
    walletState() {
      return WalletState;
    },
  },
  watch: {
    timeLeft(time) {
      if (time === 0) this.stopTimer();
    },
  },
  created() {
    window.addEventListener('beforeunload', this.clearCookies);
    const { token } = this.$route.query;
    if (token) sessionStorage.setItem('confirmToken', String(token));
  },
  async mounted() {
    this.continueTimer();
    this.isLoginWithSocial = this.$cookies.get('socialNetwork');
    const access = this.$cookies.get('access');
    const refresh = this.$cookies.get('refresh');
    const userStatus = this.$cookies.get('userStatus');
    if (+userStatus === UserStatuses.Confirmed && access) await this.redirectUser();
    if (this.isLoginWithSocial && access && +userStatus === UserStatuses.Confirmed) {
      this.SetLoader(true);
      await this.$store.dispatch('user/getUserData');
      this.userWalletAddress = this.userData?.wallet?.address;
      this.SetLoader(false);
      if (!this.userWalletAddress) return;
      this.step = WalletState.ImportMnemonic;
      this.$store.commit('user/setTokens', {
        access,
        refresh,
        userStatus,
        social: this.isLoginWithSocial,
      });
    }
    if (sessionStorage.getItem('confirmToken')) this.ShowToast(this.$t('messages.loginToContinue'), ' ');
    const isRef = this.$router.history._startLocation.includes('ref');
    if (isRef) {
      const ref = this.$router.history._startLocation.replace('/?ref=', '');
      sessionStorage.setItem('referralId', ref);
    }
  },
  async beforeDestroy() {
    if (!this.addressAssigned && !this.$cookies.get('access') && !this.$cookies.get('userStatus')) {
      const refId = sessionStorage.getItem('referralId');
      await this.$store.dispatch('user/logout', false);
      if (refId?.length) {
        sessionStorage.setItem('referralId', refId);
      }
    }
  },
  methods: {
    stopTimer() {
      clearTimeout(this.timer);
      this.$cookies.remove('timerSec');
      this.$cookies.remove('isStartedTimer');
    },
    resetTimer() {
      this.timeLeft = 60;
    },
    continueTimer() {
      const currentSec = Date.now() / 1000;
      const timerSec = this.$cookies.get('timerSec');
      const isStartedTimer = this.$cookies.get('isStartedTimer');
      if (isStartedTimer && currentSec && timerSec) {
        if (timerSec > currentSec) this.stopTimer();
        else if (currentSec && timerSec) {
          const timeDifference = currentSec - timerSec;
          if (timeDifference >= 0 <= 60) this.timeLeft = timeDifference.toFixed();
          else if (timeDifference > 60) this.resetTimer();
        }
        this.startTimer();
      }
    },
    startTimer() {
      const timerSec = this.$cookies.get('timerSec');
      if (!timerSec) this.$cookies.set('timerSec', Date.now() / 1000);
      this.isShowBtnResend = true;
      this.$cookies.set('isStartedTimer', true, { maxAge: 60 });
      this.timer = setInterval(() => {
        this.timeLeft -= 1;
      }, 1000);
    },
    clearCookies() {
      if (this.userData.id) return;
      this.$cookies.remove('access');
      this.$cookies.remove('refresh');
      this.$cookies.remove('userLogin');
      this.$cookies.remove('userStatus');
    },
    back() {
      if (this.step === WalletState.ImportOrCreate) {
        this.step = WalletState.Default;
        return;
      }
      if (this.step === WalletState.ImportMnemonic) {
        if (this.isLoginWithSocial) {
          this.step = WalletState.Default;
          this.$store.dispatch('user/logout');
        } else this.step = !this.userWalletAddress ? WalletState.ImportOrCreate : WalletState.Default;
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

    showConfirmEmailModal() {
      this.ShowModal({
        key: modals.emailConfirm,
      });
    },

    async resendLetter() {
      this.SetLoader(true);
      this.model.email = this.model.email.trim();
      if (this.model.email) {
        this.resetTimer();
        await this.$store.dispatch('user/resendEmail', { email: this.model.email });
        await this.$store.dispatch('main/showToast', {
          title: this.$t('registration.emailConfirmTitle'),
          text: this.$t('registration.emailConfirm'),
        });
        this.startTimer();
      }
      this.SetLoader(false);
    },
    async signIn() {
      if (this.isLoading) return;
      this.SetLoader(true);
      this.model.email = this.model.email.trim();
      const { email, password } = this.model;
      const payload = {
        email,
        password,
      };
      const { ok, result } = await this.$store.dispatch('user/signIn', payload);
      if (ok) {
        this.$cookies.set('userStatus', result.userStatus);
        this.userStatus = result.userStatus;
        this.userAddress = result.address;
        if (result.totpIsActive) {
          await this.ShowModal({
            key: modals.securityCheck,
            actionMethod: async () => await this.nextStepAction(),
          });
        } else {
          await this.nextStepAction();
        }
      }
      this.SetLoader(false);
    },
    async nextStepAction() {
      const confirmToken = sessionStorage.getItem('confirmToken');
      // Unconfirmed account w/o confirm token
      if (this.userStatus === UserStatuses.Unconfirmed && !confirmToken) {
        this.startTimer();
        await this.$store.dispatch('main/showToast', {
          title: this.$t('registration.emailConfirmTitle'),
          text: this.$t('registration.emailConfirm'),
        });
        this.SetLoader(false);
        return;
      }

      // Redirect to confirm account
      if (confirmToken) {
        setCipherKey(this.model.password);
        await this.redirectUser();
        this.SetLoader(false);
        return;
      }

      // Wallet is not assigned to this account
      if (!this.userAddress) {
        setCipherKey(this.model.password);
        this.$cookies.set('userLogin', true, { path: Path.ROOT });
        await this.$router.push(Path.ROLE);
        this.SetLoader(false);
        return;
      }
      this.userWalletAddress = this.userAddress.toLowerCase();

      // Wallet assigned, checking storage
      const sessionData = JSON.parse(sessionStorage.getItem('mnemonic'));
      const storageData = JSON.parse(localStorage.getItem('mnemonic'));
      if (!sessionData && !storageData) {
        this.step = WalletState.ImportMnemonic;
        this.SetLoader(false);
        return;
      }

      const sessionMnemonic = sessionData ? sessionData[this.userAddress.toLowerCase()] : null;
      const storageMnemonic = storageData ? storageData[this.userAddress.toLowerCase()] : null;
      if (!sessionMnemonic && !storageMnemonic) {
        this.step = WalletState.ImportMnemonic;
        this.SetLoader(false);
        return;
      }

      // Check in session if exists
      if (sessionMnemonic) {
        const wallet = createWallet(sessionMnemonic);
        if (wallet && wallet.address.toLowerCase() === this.userWalletAddress) {
          this.saveToStorage(wallet);
          await this.redirectUser();
          this.SetLoader(false);
          return;
        }
      }

      // Check in storage
      if (storageMnemonic) {
        const mnemonic = decryptStringWitheKey(storageMnemonic, this.model.password);
        const wallet = createWallet(mnemonic);
        if (wallet && wallet.address.toLowerCase() === this.userWalletAddress) {
          this.saveToStorage(wallet);
          await this.redirectUser();
          this.SetLoader(false);
          return;
        }
      }

      // Session & Storage invalid mnemonics
      await this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        text: this.$t('messages.mnemonic'),
      });
      this.step = WalletState.ImportMnemonic;
    },
    async assignWallet(wallet) {
      const res = await this.$store.dispatch('user/registerWallet', {
        address: wallet.address.toLowerCase(),
        publicKey: wallet.publicKey,
      });
      if (res.ok) {
        this.saveToStorage(wallet);
        await this.redirectUser();
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
      if (!this.userWalletAddress) {
        await this.assignWallet(wallet);
        return;
      }

      // All ok
      if (wallet.address.toLowerCase() === this.userWalletAddress) {
        this.saveToStorage(wallet);
        await this.redirectUser();
        return;
      }
      // Phrase not assigned to this account
      await this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        text: this.$t('messages.mnemonic'),
      });
    },
    saveToStorage(wallet) {
      initWallet(wallet.address, wallet.privateKey);
      if (!this.isLoginWithSocial) {
        localStorage.setItem('mnemonic', JSON.stringify({
          ...JSON.parse(localStorage.getItem('mnemonic')),
          [wallet.address.toLowerCase()]: encryptStringWithKey(wallet.mnemonic.phrase, this.model.password),
        }));
      }
      sessionStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('mnemonic')),
        [wallet.address.toLowerCase()]: wallet.mnemonic.phrase,
      }));
      this.$store.dispatch('wallet/connectWallet', { userWalletAddress: wallet.address, userPassword: this.model.password });
    },
    async redirectUser() {
      this.addressAssigned = true;
      this.$cookies.set('userLogin', true, { path: Path.ROOT });
      // redirect to confirm access if token exists & unconfirmed account
      const confirmToken = sessionStorage.getItem('confirmToken');
      if ((this.userStatus === UserStatuses.Unconfirmed || !this.userAddress) && confirmToken) {
        await this.$router.push(`${Path.ROLE}/?token=${confirmToken}`);
        return;
      }
      sessionStorage.removeItem('confirmToken');
      if (!this.userData.id) await this.$store.dispatch('user/getUserData');

      // this is necessary for the case when the user was in the guest layout and then decided to log in
      // $wsNotifs was connected on guest layout without token, it will be reconnect in header with token
      if (this.connections.notifsConnection) await this.$wsNotifs.disconnect();

      if (this.userData.role === UserRole.EMPLOYER) await this.$router.push(Path.WORKERS);
      else if (this.userData.role === UserRole.WORKER) await this.$router.push(Path.QUESTS);
    },
    async redirectSocialLink(socialNetwork) {
      window.location = `${process.env.BASE_URL}v1/auth/login/main/${socialNetwork}`;
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
  &__resend {
    margin-top: 10px;
  }
  &__back-btn {
    cursor: pointer;
    display: table-cell;
    color: $black700;
    & > span {
      color: $black700;
      vertical-align: middle;
      font-size: 18px;
      &:not(:last-of-type) {
        margin-right: 5px;
      }
    }
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
    background: $black0;
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
