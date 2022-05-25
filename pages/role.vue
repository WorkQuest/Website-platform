<template>
  <div class="confirm">
    <div
      class="role"
      :class="{role_hidden: step !== walletState.Default}"
    >
      <div
        v-if="step === walletState.Default"
        class="role__back"
        @click="toSign"
      >
        <span class="icon-chevron_big_left" /><span>{{ $t('meta.btns.back') }}</span>
      </div>
      <div class="role__title">
        {{ $t('role.choose') }}
      </div>
      <div class="role__cards">
        <div
          ref="left"
          class="role__card role__card_left"
          @mouseenter="showLeftChoose = true"
          @mouseleave="showLeftChoose = false"
          @click="showPrivacy('employer')"
        >
          <div class="role__content">
            <div class="role__top">
              <div class="role__text role__text_title">
                {{ $t('role.employer') }}
              </div>
              <div class="role__text role__text_desc">
                {{ $t('role.employerWant') }}
              </div>
            </div>
            <div
              :class="[{'role__bottom_show': showLeftChoose === true}]"
              class="role__bottom role__bottom_left"
            >
              <div class="role__text role__text_desc">
                {{ $t('role.chooseThis') }}
              </div>
              <div class="role__arrow role__arrow_left">
                <span class="icon-short_right" />
              </div>
            </div>
          </div>
          <img
            class="role__image"
            src="~assets/img/app/employer.png"
            alt=""
          >
        </div>
        <div
          ref="right"
          class="role__card role__card_right"
          @mouseenter="showRightChoose = true"
          @mouseleave="showRightChoose = false"
          @click="showPrivacy('worker')"
        >
          <div class="role__content">
            <div class="role__top">
              <div class="role__text role__text_title role__text_light">
                {{ $t('role.worker') }}
              </div>
              <div class="role__text role__text_desc role__text_light">
                {{ $t('role.workerWant') }}
              </div>
            </div>
            <div
              class="role__bottom role__bottom_right"
              :class="[{'role__bottom_show': showRightChoose === true}]"
            >
              <div class="role__text role__text_desc role__text_light">
                {{ $t('role.chooseThis') }}
              </div>
              <div class="role__arrow role__arrow_right">
                <span class="icon-short_right" />
              </div>
            </div>
          </div>
          <img
            class="role__image"
            src="~assets/img/app/worker.png"
            alt=""
          >
        </div>
      </div>
    </div>
    <div
      v-if="step > walletState.Default"
      class="wallet-step"
    >
      <div
        v-if="step !== walletState.ImportOrCreate && step !== walletState.Default"
        class="wallet-step__back"
        @click="stepBack"
      >
        <span class="icon-chevron_big_left" /><span>{{ $t('meta.btns.back') }}</span>
      </div>
      <CreateWallet
        :step="step"
        :main-color-dark="false"
        :disabled="isLoading"
        @goStep="goStep"
        @submit="assignWallet"
        @import="assignWallet"
      >
        <template slot="actionText">
          {{ $t('signUp.create') }}
        </template>
      </CreateWallet>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import {
  Path, UserRole, UserStatuses, WalletState,
} from '~/utils/enums';
import CreateWallet from '~/components/ui/CreateWallet';
import {
  encryptStringWithKey, getCipherKey, initWallet,
} from '~/utils/wallet';

export default {
  name: 'Role',
  layout: 'role',
  middleware: 'auth',
  components: {
    CreateWallet,
  },
  data() {
    return {
      step: WalletState.Default,
      showLeftChoose: false,
      showRightChoose: false,
      isLoginWithSocialNetwork: this.$cookies.get('socialNetwork'),
      isWalletAssigned: false,
      isClearOnDestroy: true,
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
  created() {
    window.addEventListener('beforeunload', this.clearCookies);
  },
  async beforeMount() {
    const userStatus = this.$cookies.get('userStatus');
    if (!this.userData.id && +userStatus === UserStatuses.Confirmed) await this.$store.dispatch('user/getUserData');
    if (this.userData.wallet?.address && userStatus === UserStatuses.Confirmed) {
      this.isWalletAssigned = true;
      this.isClearOnDestroy = false;
      await this.redirectUser();
      return;
    }
    if (+userStatus === UserStatuses.Confirmed && !this.userData?.wallet?.address) {
      this.step = WalletState.ImportOrCreate;
      if (getCipherKey() == null && !this.isLoginWithSocialNetwork) {
        this.isClearOnDestroy = false;
        await this.$store.dispatch('wallet/confirmPassword', { nuxt: this.$nuxt, callbackLayout: 'role' });
      }
    }
  },
  async mounted() {
    const { left, right } = this.$refs;
    left.addEventListener('mouseover', () => right.classList.add('role__card_minimized'));
    left.addEventListener('mouseleave', () => right.classList.remove('role__card_minimized'));
    right.addEventListener('mouseover', () => left.classList.add('role__card_minimized'));
    right.addEventListener('mouseleave', () => left.classList.remove('role__card_minimized'));
  },
  beforeDestroy() {
    if (!this.isClearOnDestroy || this.isWalletAssigned) return;
    this.$store.dispatch('user/logout', false);
  },
  methods: {
    clearCookies() {
      this.$cookies.remove('access');
      this.$cookies.remove('refresh');
      this.$cookies.remove('userLogin');
      this.$cookies.remove('userStatus');
    },
    toSign() {
      this.$store.dispatch('user/logout');
      this.$router.push(Path.SIGN_IN);
    },
    goStep(nextStep) {
      this.step = nextStep;
    },
    stepBack() {
      if (this.step === WalletState.ImportMnemonic || this.step === WalletState.SaveMnemonic) this.step = WalletState.ImportOrCreate;
      else this.step -= 1;
    },
    showPrivacy(role) {
      this.ShowModal({
        key: modals.privacy,
        isSocialNetwork: this.isLoginWithSocialNetwork,
        callback: () => this.goToAssignWallet(),
        role,
      });
    },
    goToAssignWallet() {
      this.isClearOnDestroy = true;
      this.step = WalletState.ImportOrCreate;
    },
    async redirectUser() {
      await this.$store.dispatch('user/getUserData');
      window.removeEventListener('beforeunload', this.clearCookies);
      if (this.userData.role === UserRole.EMPLOYER) await this.$router.push(Path.WORKERS);
      else if (this.userData.role === UserRole.WORKER) await this.$router.push(Path.QUESTS);
    },
    async assignWallet(wallet) {
      this.isClearOnDestroy = false;
      this.SetLoader(true);
      const res = await this.$store.dispatch('user/registerWallet', {
        address: wallet.address.toLowerCase(),
        publicKey: wallet.publicKey,
      });
      if (!res.ok) {
        this.SetLoader(false);
        if (res.msg.includes('Wallet already exists')) {
          return;
        }
        this.isClearOnDestroy = true;
        await this.$store.dispatch('user/logout');
        await this.$router.push(Path.SIGN_IN);
        return;
      }
      this.isWalletAssigned = true;
      initWallet(wallet.address.toLowerCase(), wallet.privateKey);
      if (this.isLoginWithSocialNetwork) {
        await this.redirectUser();
        this.SetLoader(false);
        return;
      }
      localStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(localStorage.getItem('mnemonic')),
        [wallet.address.toLowerCase()]: encryptStringWithKey(wallet.mnemonic.phrase, getCipherKey()),
      }));
      sessionStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('mnemonic')),
        [wallet.address.toLowerCase()]: wallet.mnemonic.phrase,
      }));
      await this.redirectUser();
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  &__container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    align-items: flex-end;
  }
  &__back {
    padding: 10px 0 0 33px;
    width: 100%;
    max-width: 60px;
  }
}
.icon-chevron_big_left:before {
  content: "\ea4d";
  color: $black500;
  font-size: 25px;
}
.confirm {
  width: 100%;
}
.wallet-step {
  max-width: 800px;
  background: $white;
  margin: 0 auto;
  border-radius: 16px;
  padding: 20px;
  box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.1);

  &__back {
    padding-bottom: 10px;
    cursor: pointer;
    display: table-cell;
    color: $black700;
    & > span:before {
      color: $black700;
      vertical-align: middle;
      font-size: 18px;
      margin-right: 5px;
    }
  }
}
.role {
  width: 100%;
  &_hidden {
    display: none;
  }
  &__back {
    padding-bottom: 10px;
    cursor: pointer;
    display: table-cell;
    font-size: 18px;
    color: $black0;
    & > span:before {
      color: $black0;
      vertical-align: middle;
      font-size: 18px;
      margin-right: 5px;
    }
  }
  &__title {
    padding-bottom: 30px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 34px;
    line-height: 130%;
    color: #FFFFFF;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 30px;
  }
  &__image {
    transition: .2s;
    will-change: transform;
    position: absolute;
    top: 0;
    right: -90px;
    bottom: 0;
    height: 100%;
    z-index: -1;
  }
  &__card {
    transition: .2s;
    will-change: transform;
    min-height: 400px;
    cursor: pointer;
    filter: drop-shadow(0px 47.1676px 61.4131px rgba(10, 27, 61, 0.078707))
    drop-shadow(0px 26.7219px 32.8344px rgba(10, 27, 61, 0.0629546))
    drop-shadow(0px 14.4955px 18.4067px rgba(10, 27, 61, 0.0598272))
    drop-shadow(0px 6.96225px 9.77565px rgba(10, 27, 61, 0.0584222))
    drop-shadow(0px 2.43911px 4.06787px rgba(10, 27, 61, 0.0492837));
    -webkit-filter: drop-shadow(0px 47.1676px 61.4131px rgba(10, 27, 61, 0.078707))
    drop-shadow(0px 26.7219px 32.8344px rgba(10, 27, 61, 0.0629546))
    drop-shadow(0px 14.4955px 18.4067px rgba(10, 27, 61, 0.0598272))
    drop-shadow(0px 6.96225px 9.77565px rgba(10, 27, 61, 0.0584222))
    drop-shadow(0px 2.43911px 4.06787px rgba(10, 27, 61, 0.0492837));
    border-radius: 6px;
    background-size: cover;
    overflow: hidden;
    position: relative;
    &_minimized {
      width: 75% !important;
    }
    &_right {
      width: 100%;
      background-image: url("~assets/img/app/role_dots.svg");
      background-color: $green;
      justify-self: flex-end;
      &:hover {
        width: 125% !important;
        .role {
          &__image {
            right: 0;
          }
        }
      }
    }
    &_left {
      width: 100%;
      background-image: url("~assets/img/app/role_dots_light.svg");
      background-color: $black100;
      justify-self: flex-start;
      &:hover {
        width: 125% !important;
        .role {
          &__image {
            right: -1px;
          }
        }
      }
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 30px 10px 40px 30px;
  }
  &__bottom {
    display: flex;
    &_show {
      opacity: 1 !important;
    }
    &_left {
      display: flex;
      opacity: 0;
    }
    &_right {
      display: flex;
      opacity: 0;
    }
  }
  &__arrow {
    padding-left: 10px;
    &_left {
      span:before {
        color: $black800;
      }
    }
    &_right {
      span:before {
        color: #FFFFFF;
      }
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    &_title {
      font-weight: 600;
      font-size: 45px;
      line-height: 130%;
      color: $black800;
      padding-bottom: 8px;
    }
    &_desc {
      font-weight: normal;
      font-size: 16px;
      line-height: 145%;
      color: $black800;
      max-width: 210px;
    }
    &_light {
      color: #FFFFFF;
    }
  }
}

@include _991 {
  .role {
    &__text_title {
      font-size: 28px;
    }
    &__text_desc {
      font-size: 16px;
      max-width: 220px;
    }
    &__cards {
      grid-template-columns: 1fr;
      grid-gap: 20px;
    }
    &__image {
      right: -122px;
    }
    &__card {
      &_minimized {
        width: 100% !important;
      }
      &_right:hover {
        width: 100% !important;
        .role {
          &__image {
            right: -140px;
          }
        }
      }
      &_left:hover {
        width: 100% !important;
        .role {
          &__image {
            right: -84px;
          }
        }
      }
    }
  }
}
</style>
