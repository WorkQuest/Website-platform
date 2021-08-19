<template>
  <ctm-modal-box
    class="claim"
    :title="$t('modals.claim') "
  >
    <div class="claim__content content">
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
      <div class="content__field field">
        <div
          v-if="step===1"
          class="field__header header"
        >
          <div class="header__title">
            {{ $t('modals.bankCard') }}
          </div>
          <div class="header__subtitle">
            {{ cardNumber }}
            <div class="icon-show header__icon" />
          </div>
        </div>
        <div
          v-else
          class="field__header header"
        >
          <div class="header__title">
            {{ $t('modals.walletAddress') }}
          </div>
          <div class="header__subtitle">
            {{ walletAddress }}
          </div>
        </div>
        <div
          v-for="(item, i) in items"
          :key="i"
          class="field__item"
        >
          <div class="field__title">
            {{ item.title }}
          </div>
          <div class="field__subtitle">
            {{ item.subtitle }}
          </div>
        </div>
      </div>
      <div class="сontent__buttons buttons">
        <div class="buttons__group">
          <base-btn
            class="buttons__button"
            mode="outline"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            @click="showTransactionSend"
          >
            {{ $t('meta.confirm') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ModalClaim',
  data() {
    return {
      step: 1,
      walletAddress: '83479B2E7809F7D7C0A9184EEDA74CCF122ABF3147CB4572BDEBD252F8E352A8',
      cardNumber: '**** **** **** 0000',
      items: [
        {
          title: this.$t('modals.amount'),
          subtitle: '15 WUSD',
        },
        {
          title: this.$t('modals.totalFee'),
          subtitle: '$ 0,15',
        },
      ],
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showTransactionSend() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
    nextStep() {
      this.step = 2;
    },
    previousStep() {
      this.step = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.claim{
  max-width: 616px!important;
  &__content{
    padding: 22px 28px 30px 28px!important;
  }
}
.field{
  &__item{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  &__title{
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    margin-bottom: 5px;
  }
  &__subtitle{
    color: $black500;
    font-weight: 500;
    font-size: 14px;
  }
}
.content{
  &__field{
    padding:20px;
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 25px;
  }
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
    margin: 0 20px 0 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 2px solid $blue;
      padding: 0 0 12px 0;
    }
  }
}
.buttons{
  &__group{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
.header{
  &__title{
    font-size: 16px;
    line-height: 130%;
    color: $black800;
  }
  &__subtitle{
    display: flex;
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    color: $black500;
    margin: 5px 0 20px 0;
  }
  &__icon:before{
    font-size: 16px;
    color: $black500;
    vertical-align: middle;
    margin-left: 6px;
  }
}
</style>
