<template>
  <ctm-modal-box
    class="info"
    :title="options.title || $tc('modals.titles.withdrawInfo')"
  >
    <div class="info__content content">
      <div class="content__field field">
        <div
          v-if="options.cardNumber"
          class="field__header header"
        >
          <div class="header__title">
            {{ $t('meta.bankCard') }}
          </div>
          <div
            class="header__subtitle"
            data-selector="SHOW-NUMBER"
            @click="showNumber"
          >
            {{ getCardNumber }}
            <base-btn
              mode="max"
              data-selector="MAX"
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
          v-if="options.recipientAddress"
          class="field__header header"
        >
          <div class="header__title">
            {{ $t(options.recipientAddress) }}
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
            data-selector="CANCEL"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            data-selector="CONFIRM"
            @click="handleSubmit"
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
import modals from '~/store/modals/modals';

export default {
  name: 'ModalDepositInfo',
  data() {
    return {
      isCardNumberVisible: false,
      walletAddress: null,
      items: [
        { title: this.$t('modals.amount'), subtitle: 'WUSD' },
        { title: this.$t('modals.totalFee'), subtitle: '$ 0,15' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    getCardNumber() {
      const str = this.options.cardNumber;
      if (this.isCardNumberVisible) {
        return `${str.slice(0, 4)} ${str.slice(4, 8)} ${str.slice(8, 12)} ${str.slice(12)}`;
      }
      let star = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < str.length; i++) {
        if (i < str.length - 4) { star.push('*'); } else {
          star.push(str[i]);
        }
      }
      star = star.join('');
      return `${star.slice(0, 4)} ${star.slice(4, 8)} ${star.slice(8, 12)} ${star.slice(12)}`;
    },
  },
  mounted() {
    this.walletAddress = this.options.walletAddress;
    this.items[0].subtitle = this.options.amount;
    this.items[1].subtitle = this.options.txFee;
  },
  methods: {
    async handleSubmit() {
      this.ShowModal({ key: modals.transactionSend });
    },
    showNumber() {
      this.isCardNumberVisible = !this.isCardNumberVisible;
    },
  },
};
</script>

<style lang="scss" scoped>

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
  padding: 0 28px 30px 28px!important;
  &__field{
    padding: 20px 20px 20px;
    background-color: $black0;
    border-radius: 5px;
    margin-top: 25px;
    margin-right: 13px;
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
    cursor: pointer;
  }
  &__icon:before{
    font-size: 16px;
    color: $black500;
    vertical-align: middle;
    margin-left: 6px;
  }
  &__button{
    width: 16px!important;
    height: 16px!important;
  }
}
</style>
