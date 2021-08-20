<template>
  <ctm-modal-box
    class="withdrawal"
    :title="$t('modals.withdrawal')"
  >
    <div class="withdrawal__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__step">
          <div
            class="content__panel"
            :class="{'content__panel_active': step === 1}"
            @click="previousStep"
          >
            {{ $t('modals.walletAddress') }}
          </div>
          <div
            class="content__panel"
            :class="{'content__panel_active': step === 2}"
            @click="nextStep"
          >
            {{ $t('wallet.bankCard') }}
          </div>
        </div>
        <div
          v-if="step === 1"
          class="content__container"
        >
          <div class="content__input input">
            <span class="input__title">
              {{ $t('modals.walletAddress') }}
            </span>
            <base-field
              v-model="walletAddress"
              class="input__field"
              :placeholder="'Enter address'"
              rules="required"
              :name="$t('modals.walletAddressField')"
            />
          </div>
          <div class="content__input input">
            <span class="input__title">
              {{ $t('modals.amount') }}
            </span>
            <base-field
              v-model="amount"
              class="input__field"
              :placeholder="'Enter amount'"
              rules="required|numeric"
              :name="$t('modals.amountField')"
            >
              >
              <template
                v-slot:right-absolute
                class="content__max max"
              >
                <base-btn
                  mode="max"
                  class="max__button"
                >
                  <span class="max__text">{{ $t('modals.maximum') }}</span>
                </base-btn>
              </template>
            </base-field>
          </div>
        </div>
        <div
          v-if="step === 2"
          class="content__container"
        >
          <div>
            <img
              alt="card"
              src="~assets/img/ui/creditCard.svg"
              class="content__card"
            >
          </div>
          <div class="content__text">
            {{ $t('modals.addYourCard') }}
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            :mode="'outline'"
            class="buttons__action"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            v-if="step=== 1"
            class="buttons__action"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(showWithdrawInfo)"
          >
            {{ $t('meta.confirm') }}
          </base-btn>
          <base-btn
            v-if="step=== 2"
            class="buttons__action"
            @click="showAddingCard"
          >
            {{ $t('modals.addCard') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ModalTakeWithdrawal',
  data() {
    return {
      walletAddress: '',
      amount: '',
      step: 1,
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showWithdrawInfo() {
      this.ShowModal({
        key: modals.withdrawInfo,
        title: this.$t('modals.withdrawInfo'),
      });
    },
    showAddingCard() {
      this.ShowModal({
        key: modals.addingCard,
        branch: 'withdraw',
      });
    },
    nextStep() {
      this.step = 2;
    },
    previousStep() {
      this.step = 1;
      this.amount = '';
      this.walletAddress = '';
    },
  },
};
</script>

<style lang="scss" scoped>

.withdrawal{
  max-width: 616px !important;
  padding: 0!important;
  &__content{
    padding: 22px 28px 30px 28px!important;
  }
}
.buttons {
  display: flex;
  justify-content: space-between;
  &__action{
    width: 271px!important;
  }
}

.input{
  &__field{
    margin-top: 5px;
  }
}
.content{
  &__step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  &__panel{
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 20px 15px 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 2px solid $blue;
      padding: 0 0 12px 0;
    }
  }
  &__buttons{
    margin-top: 2px;
  }
  &__card{
    margin: 25px auto 40px;
  }
  &__text {
      font-size: 16px;
      line-height: 130%;
      color: #D8DFE3;
      text-align: center;
      margin-bottom: 25px;
  }
}
.grid{
  &__title{
    margin: 15px 5px 0 0;
  }
}
.max{
  &__button{
    margin-right: 10px!important;
  }
}
</style>
