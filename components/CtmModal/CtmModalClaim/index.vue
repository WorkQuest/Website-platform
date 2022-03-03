<template>
  <ctm-modal-box
    class="claim"
    :title="$t('modals.claim')"
  >
    <div class="claim__content content">
      <!--      Вывод на банковскую карту -->
      <!--      <div class="content__step">-->
      <!--        <div-->
      <!--          class="content__panel"-->
      <!--          :class="{'content__panel_active': step === 1}"-->
      <!--          @click="previousStep"-->
      <!--        >-->
      <!--          {{ $t('modals.walletAddress') }}-->
      <!--        </div>-->
      <!--        <div-->
      <!--          class="content__panel"-->
      <!--          :class="{'content__panel_active': step === 2}"-->
      <!--          @click="nextStep"-->
      <!--        >-->
      <!--          {{ $t('meta.bankCard') }}-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="content__field field">
        <div
          v-if="step===1"
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
          v-else
          class="field__header header"
        >
          <div class="header__title">
            {{ $t('meta.bankCard') }}
          </div>
          <div
            class="header__subtitle"
            @click="showNumber"
          >
            {{ getCardNumber }}
            <base-btn
              mode="max"
              selector="MAX"
              class="header__button"
            >
              <div
                class="header__icon"
                :class="{'icon-show': isCardNumberVisible, 'icon-hide': !isCardNumberVisible}"
              />
            </base-btn>
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
            selector="CANCEL"
            @click="hide"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            selector="CONFIRM"
            @click="showTransactionSend"
          >
            {{ $t('meta.btns.confirm') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalClaim',
  data() {
    return {
      isCardNumberVisible: false,
      step: 1,
      walletAddress: '...',
      items: [],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    getCardNumber() {
      const str = this.options.cardNumber || '0000000000000000';
      if (this.isCardNumberVisible) {
        return `${str.slice(0, 4)} ${str.slice(4, 8)} ${str.slice(8, 12)} ${str.slice(12)}`;
      }
      let star = [];
      for (let i = 0; i < str.length; i += 1) {
        if (i < str.length - 4) { star.push('*'); } else {
          star.push(str[i]);
        }
      }
      star = star.join('');
      return `${star.slice(0, 4)} ${star.slice(4, 8)} ${star.slice(8, 12)} ${star.slice(12)}`;
    },
  },
  async mounted() {
    this.walletAddress = await this.$store.dispatch('web3/getAccountAddress');
    this.items = [
      {
        title: this.$t('modals.amount'),
        subtitle: `${this.options.rewardAmount} ${this.options.tokenSymbol}`,
      },
      {
        title: this.$t('modals.totalFee'),
        subtitle: `${this.options.txFee}`,
      },
    ];
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async showTransactionSend() {
      const { stakingType, updateMethod } = this.options;
      this.hide();
      this.SetLoader(true);
      await this.$store.dispatch('web3/claimRewards', { stakingType });
      if (updateMethod) await updateMethod();
      this.SetLoader(false);
    },
    nextStep() {
      this.step = 2;
    },
    previousStep() {
      this.step = 1;
    },
    showNumber() {
      this.isCardNumberVisible = !this.isCardNumberVisible;
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
    line-height: 125%;
    color: $black500;
    margin: 5px 0 20px 0;
    cursor: pointer;
  }
  &__icon:before{
    font-size: 16px;
    color: $black500;
    margin-left: 6px;
    line-height: 120%;
  }
  &__button{
    width: 18px!important;
    height: 18px!important;
  }
}
</style>
