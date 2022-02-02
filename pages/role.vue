<template>
  <div class="confirm">
    <div
      class="role"
      :class="{role_hidden: step !== walletState.Default}"
    >
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
        v-if="step !== walletState.ImportOrCreate || step === walletState.Default"
        class="wallet-step__back"
        @click="goStep(step - 1)"
      >
        <span class="icon-chevron_big_left" /><span>{{ $t('meta.back') }}</span>
      </div>
      <CreateWallet
        :step="step"
        :main-color-dark="false"
        @goStep="goStep"
        @submit="assignWallet"
      >
        <template slot="actionText">
          {{ $t('signUp.create') }}
        </template>
      </CreateWallet>
    </div>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';
import { WalletState } from '~/utils/enums';
import CreateWallet from '~/components/ui/CreateWallet';

export default {
  name: 'Role',
  layout: 'role',
  components: {
    CreateWallet,
  },
  data() {
    return {
      step: WalletState.Default,
      showLeftChoose: false,
      showRightChoose: false,
    };
  },
  computed: {
    walletState() {
      return WalletState;
    },
  },
  async mounted() {
    const { left, right } = this.$refs;
    left.addEventListener('mouseover', () => right.classList.add('role__card_minimized'));
    left.addEventListener('mouseleave', () => right.classList.remove('role__card_minimized'));
    right.addEventListener('mouseover', () => left.classList.add('role__card_minimized'));
    right.addEventListener('mouseleave', () => left.classList.remove('role__card_minimized'));
  },
  methods: {
    goStep(step) {
      if (this.step === WalletState.ImportMnemonic) this.step = WalletState.ImportOrCreate;
      else if (this.step === WalletState.SaveMnemonic) this.step = WalletState.ImportOrCreate;
      else this.step = step;
    },
    async assignWallet(wallet) {
      console.log(wallet);
    },
    showPrivacy(role) {
      // this.ShowModal({
      //   key: modals.privacy,
      //   role,
      // });

      // TODO: move from privacy modal to create wallet
      this.step = WalletState.ImportOrCreate;
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
    & > span {
      vertical-align: middle;
      font-size: 18px;
      &:not(:last-of-type) {
        margin-right: 5px;
      }
    }
  }
}
.role {
  width: 100%;
  &_hidden {
    display: none;
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
  }
  &__card {
    transition: .2s;
    will-change: transform;
    min-height: 400px;
    cursor: pointer;
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

@include _1199 {
  .role {
    &__title {
      margin: 0 20px;
    }
    &__cards {
      margin: 0 20px;
    }
  }
  .confirm {
    margin: 0 20px;
  }
}
@include _767 {
  .role {
    &__text_title {
      font-size: 20px;
    }
    &__text_desc {
      font-size: 16px;
      max-width: 140px;
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
