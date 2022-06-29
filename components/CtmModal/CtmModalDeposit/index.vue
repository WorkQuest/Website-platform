<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.deposit')"
  >
    <div class="ctm-modal__content">
      <div
        class="step-panel"
        :class="{'hide': step === 3}"
      >
        <div
          class="step-panel__step"
          :class="[{'step-panel__step_active': step === 'wallet'}, {'hide': step === 3}]"
          @click="step = 'wallet'"
        >
          {{ $t('wallet.walletAddress') }}
        </div>
        <div
          class="step-panel__step"
          :class="[{'step-panel__step_active': step === 'bank'}, {'hide': step === 3}]"
          @click="step = 'bank'"
        >
          {{ $t('meta.bankCard') }}
        </div>
      </div>
      <div
        v-if="step === 'wallet'"
        class="step__container"
      >
        <deposit-wallet-address />
      </div>
      <div
        v-if="step === 'bank'"
        class="step__container"
      >
        <bank-card />
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import DepositWalletAddress from '~/components/CtmModal/CtmModalDeposit/DepositWalletAddress';
import bankCard from '~/components/CtmModal/CtmModalDeposit/BankCard';

export default {
  name: 'ModalDeposit',
  components: { bankCard, DepositWalletAddress },
  data() {
    return {
      amountInput: '',
      cardNumberInput: '',
      dateInput: '',
      cvvInput: '',
      step: 'wallet',
      code: '0xf376g...G7f3g8b',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    nextStep() {
      this.step += 1;
    },
    // TODO: Зарефакторить!
    showSuccessCopied() {
      this.ShowModal({
        key: modals.status,
        img: require('assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.textCopy'),
      });
    },
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.icon {
  &-copy:before {
    content: "\e996";
    color: $blue;
    font-size: 20px;
  }
}

.code {
  &__container {
    display: flex;
    border: 1px solid $black0;
    border-radius: 6px;
    justify-content: space-between;
    padding: 12px;
    margin: 33px 0 0 0;
  }
  &__text {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
}

.hide {
  display: none;
}

.grid {
  &__2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
    align-items: flex-end;
    grid-gap: 10px;
  }
  &__3col {
    display: grid;
    grid-template-columns: 6fr 1fr 6fr;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.step {
  &-three {
    &__text {
      @include text-simple;
      font-weight: 400;
      font-size: 16px;
      color: $black500;
      &_blue {
        @extend .step-three__text;
        color: $blue;
      }
    }
  }
  &__container {
    &_grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.step-panel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  &__step {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 10px 0 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 1px solid $blue;
      padding: 0 0 12px 0;
    }
  }
}

.ctm-modal {
  &__content-field {
    margin: 15px 0 0 0;
  }
  &__equal {
    margin: 0 0 35px 10px;
  }
  &__fake-input {
    font: inherit;
    height: 46px;
    padding: 10px 20px;
    width: 100%;
    color: #B1B3B8;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid $black0;
    margin-bottom: 23px;
  }
}

.ctm-modal {
  @include modalKit;
}

.input {
  &_white {
    border-radius: 6px;
    border: 1px solid $black0;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    background-color: $white;
    resize: none;
    &::placeholder {
      color: $black800;
    }
  }
}
.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }
  &__wrapper {
  }
}

.messageSend {
  max-width: 380px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
}
.icon-share_outline {
  color: $black100;
  font-size: 24px;
}
</style>
