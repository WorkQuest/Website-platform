<template>
  <div class="auth">
    <ValidationObserver
      v-if="step === $options.WalletState.Default"
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
          ref="email"
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
          ref="password"
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
        v-if="!hiddenResend"
        class="auth__resend"
        :class="{auth__resend_hidden : disableResend && hiddenResend}"
        data-selector="RESEND-LETTER"
        :disabled="disableResend"
        @click="resendLetter"
      >
        {{ `${$t('meta.btns.resendEmail')} ${resendTimer}` }}
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
      v-if="step > $options.WalletState.Default"
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
  Path,
  Layout,
  UserRole,
  WalletState,
  UserStatuses,
} from '~/utils/enums';
import { images } from '~/utils/images';
import { accessLifetime, resendEmailLifetime } from '~/utils/сonstants/cookiesLifetime';

export default {
  name: 'SignIn',
  layout: Layout.AUTH,
  WalletState,
  images,
  Path,
  components: {
    CreateWallet,
  },
  data() {
    return {
      hiddenResend: true,
      disableResend: true,
      isStartedTimer: false,
      timerValue: resendEmailLifetime,
      timer: null,
      addressAssigned: false,
      userWalletAddress: null,
      step: WalletState.Default,
      model: { email: '', password: '', totp: '' },
      remember: false,
      userStatus: '',
      userAddress: '',
      isLoginWithSocial: false,
      isPasswordVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      isLoading: 'main/getIsLoading',
      connections: 'main/notificationsConnectionStatus',
    }),
    resendTimer() {
      const { timerValue, isStartedTimer } = this;
      return isStartedTimer ? this.$tc('meta.units.seconds', this.DeclOfNum(timerValue), { count: timerValue }) : '';
    },
  },
  created() {
    // for old cipher
    localStorage.removeItem('mnemonic');
    sessionStorage.removeItem('mnemonic');

    window.addEventListener('beforeunload', this.beforeunload);
    const { token } = this.$route.query;
    if (token) sessionStorage.setItem('confirmToken', String(token));
  },
  async mounted() {
    const access = this.$cookies.get('access');
    const refresh = this.$cookies.get('refresh');
    this.userStatus = this.$cookies.get('userStatus');
    if (+this.userStatus === UserStatuses.Confirmed && access) await this.redirectUser();

    this.continueTimer();
    this.isLoginWithSocial = this.$cookies.get('socialNetwork');
    if (this.isLoginWithSocial && access && refresh && +this.userStatus === UserStatuses.Confirmed) {
      this.SetLoader(true);
      await this.$store.dispatch('user/getUserData');
      this.userWalletAddress = this.userData?.wallet?.address;
      this.SetLoader(false);
      if (!this.userWalletAddress) return;
      this.step = WalletState.ImportMnemonic;
      this.$store.commit('user/setTokens', {
        access,
        refresh,
        userStatus: +this.userStatus,
        social: this.isLoginWithSocial,
      });
    }

    if (sessionStorage.getItem('confirmToken')) this.ShowToast(this.$t('messages.loginAfterRegistration'), ' ');
  },
  async beforeDestroy() {
    if (this.isStartedTimer) {
      sessionStorage.setItem('resend-timer', JSON.stringify({
        timerValue: this.timerValue,
        createdAt: Date.now(),
      }));
    }
    if (!this.addressAssigned && !this.$cookies.get('access') && !this.$cookies.get('userStatus')) {
      await this.$store.dispatch('user/logout', false);
    }
  },
  methods: {
    beforeunload() {
      if (this.isStartedTimer) {
        sessionStorage.setItem('resend-timer', JSON.stringify({
          timerValue: this.timerValue,
          createdAt: Date.now(),
        }));
        this.hiddenResend = true;
      } else sessionStorage.removeItem('resend-timer');
      this.clearCookies();
    },
    clearTimer() {
      sessionStorage.removeItem('resend-timer');
      this.timerValue = resendEmailLifetime;
      clearInterval(this.timerId);
      this.isStartedTimer = false;
      this.disableResend = false;
    },
    continueTimer() {
      this.timer = JSON.parse(sessionStorage.getItem('resend-timer'));
      if (!this.timer || !this.$cookies.get('access')) return;
      this.hiddenResend = false;
      this.timer.timerValue -= (this.$moment().diff(this.timer.createdAt) / 1000).toFixed(0);
      if (this.timer.timerValue <= 0) {
        this.clearTimer();
        return;
      }
      this.timerValue = this.timer.timerValue;
      this.startTimer();
    },
    startTimer() {
      if (this.isStartedTimer) return;

      this.timer = {
        timerValue: resendEmailLifetime,
        createdAt: Date.now(),
      };
      sessionStorage.setItem('resend-timer', JSON.stringify(this.timer));
      this.timerId = setInterval(() => {
        if (this.timerId && this.timerValue === 0) this.clearTimer();
        this.timerValue -= 1;
      }, 1000);

      this.hiddenResend = false;
      this.isStartedTimer = true;
      this.disableResend = true;
    },
    clearCookies() {
      const mnemonicInLocalStorage = JSON.parse(localStorage.getItem('wal'));
      const isWalletInMnemonicList = mnemonicInLocalStorage && mnemonicInLocalStorage[this.userWalletAddress];
      if (this.isLoginWithSocial
        || (this.userData.id && (isWalletInMnemonicList || localStorage.getItem('wal')))) {
        return;
      }
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
        } else {
          this.step = !this.userWalletAddress ? WalletState.ImportOrCreate : WalletState.Default;
        }
        this.$store.dispatch('user/logout');
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

    async resendLetter() {
      this.model.email = this.model.email.trim();
      const { email, password } = this.model;
      if (!email.trim() || !password) {
        this.ShowToast(this.$tc('signIn.enterEmail'));
        return;
      }
      if (!this.$cookies.get('access')) {
        const payload = {
          email,
          password,
        };
        await this.$store.dispatch('user/signIn', { payload });
      }
      if (this.$cookies.get('access')) {
        await this.$store.dispatch('user/resendEmail', { email });
        this.ShowToast(this.$t('registration.emailConfirmNewLetter'), this.$t('registration.emailConfirmTitle'));
        this.startTimer();
      }
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
      const { ok, result } = await this.$store.dispatch('user/signIn', {
        params: payload,
        isRemember: this.remember,
      });
      if (ok) {
        this.$cookies.set('userStatus', result.userStatus, { path: Path.ROOT, maxAge: accessLifetime });
        this.userStatus = result.userStatus;
        this.userAddress = result.address;
        if (result.totpIsActive) {
          await this.ShowModal({
            key: modals.securityCheck,
            isForLogin: true,
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
        this.timer = JSON.parse(sessionStorage.getItem('resend-timer'));
        if (!this.timer) {
          this.timer = {
            timerValue: this.timerValue,
            createdAt: Date.now(),
          };
          sessionStorage.setItem('resend-timer', JSON.stringify(this.timer));
        }
        this.continueTimer();
        this.ShowToast(this.$t('registration.emailConfirm'), this.$t('registration.emailConfirmTitle'));
        this.SetLoader(false);
        return;
      }

      // Confirmation account
      if (confirmToken && this.userStatus === UserStatuses.Unconfirmed) {
        setCipherKey(this.model.password);
        const confirmRes = await this.$store.dispatch('user/confirm', {
          confirmCode: sessionStorage.getItem('confirmToken'),
        });
        if (confirmRes.ok) {
          this.userStatus = UserStatuses.NeedSetRole;
          await this.redirectUser();
        } else {
          this.timer = JSON.parse(sessionStorage.getItem('resend-timer'));
          if (!this.timer) {
            this.timer = {
              timerValue: this.timerValue,
              createdAt: Date.now(),
            };
            sessionStorage.setItem('resend-timer', JSON.stringify(this.timer));
          }
          this.continueTimer();
          this.ShowToast(this.$t('meta.wrongToken'), this.$t('registration.emailConfirmTitle'));
        }
        this.SetLoader(false);
        return;
      }

      // Wallet is not assigned to this account
      if (!this.userAddress) {
        setCipherKey(this.model.password);
        this.$cookies.set('userLogin', true, { path: Path.ROOT, maxAge: accessLifetime });
        await this.$router.push(Path.ROLE);
        this.SetLoader(false);
        return;
      }
      this.userWalletAddress = this.userAddress.toLowerCase();

      // Wallet assigned
      const storageData = JSON.parse(localStorage.getItem('wal'));
      if (!storageData) {
        this.step = WalletState.ImportMnemonic;
        this.SetLoader(false);
        return;
      }

      const key = this.userAddress.toLowerCase();
      const storageMnemonic = storageData ? storageData[key] : null;
      if (!storageMnemonic) {
        this.step = WalletState.ImportMnemonic;
        this.SetLoader(false);
        return;
      }
      if (storageMnemonic) {
        const mnemonic = decryptStringWitheKey(storageMnemonic, this.model.password);
        const wallet = createWallet(mnemonic);
        if (wallet?.address?.toLowerCase() === this.userWalletAddress) {
          this.saveToStorage(wallet);
          await this.redirectUser();
          this.SetLoader(false);
          return;
        }
      }

      // Session & Storage invalid mnemonics
      this.ShowToast(this.$t('messages.mnemonic'), this.$t('toasts.error'));
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
        this.ShowToast(this.$t('messages.mnemonic'), this.$t('toasts.error'));
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
        console.log('saving');
        return;
      }
      // Phrase not assigned to this account
      this.ShowToast(this.$t('messages.mnemonic'), this.$t('toasts.error'));
    },
    saveToStorage(wallet) {
      initWallet(wallet);
      const key = wallet.address.toLowerCase();
      if (!this.isLoginWithSocial) {
        localStorage.setItem('wal', JSON.stringify({
          ...JSON.parse(localStorage.getItem('wal')),
          [key]: encryptStringWithKey(wallet.mnemonic.phrase, this.model.password),
        }));
      }
      this.$store.dispatch('wallet/connectWallet', { userWalletAddress: wallet.address, userPassword: this.model.password });
    },
    async redirectUser() {
      this.addressAssigned = true;
      this.$cookies.set('userLogin', true, { path: Path.ROOT, maxAge: accessLifetime });

      if (this.userStatus === UserStatuses.NeedSetRole) {
        await this.$router.push(Path.ROLE);
        return;
      }

      sessionStorage.removeItem('confirmToken');
      if (!this.userData.id) await this.$store.dispatch('user/getUserData');

      // this is necessary for the case when the user was in the guest layout and then decided to log in
      // $wsNotifs was connected on guest layout without token, it will be reconnect in header with token
      if (this.connections.notifsConnection) await this.$wsNotifs.disconnect();
      const mnemonicInLocalStorage = JSON.parse(localStorage.getItem('wal'));
      const isWalletInMnemonicList = mnemonicInLocalStorage && mnemonicInLocalStorage[this.userData.wallet.address];
      if (!isWalletInMnemonicList && !this.isLoginWithSocial) return;
      const redirectTo = sessionStorage.getItem('redirectTo');
      if (redirectTo) {
        await this.$router.push(redirectTo);
        sessionStorage.removeItem('redirectTo');
        return;
      }
      if (this.userData.role === UserRole.EMPLOYER) await this.$router.push(Path.WORKERS);
      else if (this.userData.role === UserRole.WORKER) await this.$router.push(Path.QUESTS);
    },
    async redirectSocialLink(socialNetwork) {
      // TODO while not fixed twitter
      if (socialNetwork === 'twitter' && process.env.BRANCH !== 'develop') {
        this.ComingSoon();
        return;
      }
      window.location = `${this.ENV.BASE_URL}v1/auth/login/main/${socialNetwork}`;
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
    &_hidden {
      display: none;
    }
  }
  &__back {
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
