<template>
  <ctm-modal-box
    class="info"
    :title="$t('modals.titles.swapInfo')"
  >
    <div class="info__content content">
      <div class="content__field field">
        <div
          v-for="(item, i) in info"
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
      <div class="content__buttons buttons">
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
import modals from '~/store/modals/modals';

export default {
  name: 'ModalSwapInfo',
  data() {
    return {
      miningPoolId: localStorage.getItem('miningPoolId'),
      metamaskStatus: localStorage.getItem('metamaskStatus'),
      sourceAddressInd: 0,
      targetAddressInd: 1,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/isConnected',
    }),
    getCardNumber() {
      return (this.options.cardNumber);
    },
    info() {
      return [
        {
          title: this.$t('modals.crosschain'),
          subtitle: this.options.crosschain,
        },
        {
          title: this.$t('modals.amount'),
          subtitle: this.options.amount,
        },
        {
          title: this.$t('modals.senderAddress'),
          subtitle: this.options.recepient,
        },
        {
          title: this.$t('modals.recepientAddress'),
          subtitle: this.options.recepient,
        },
        // {
        //   title: this.$t('modals.worknetFee'),
        //   subtitle: this.options.worknetFee,
        // },
        // {
        //   title: this.$t('modals.binanceFee'),
        //   subtitle: this.options.binanceFee,
        // },
      ];
    },
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async showTransactionSend() {
      this.SetLoader(true);
      await this.connectToMetamask();
      const optionsData = this.options;
      this.hide();
      const swapObj = await this.$store.dispatch('web3/swapWithBridge', {
        _decimals: 18,
        _amount: optionsData.amountInt,
        chain: optionsData.chain,
        chainTo: optionsData.toChain,
        userAddress: optionsData.recepientFull,
        recipient: optionsData.recepientFull,
        symbol: optionsData.tokenName,
      });
      this.ShowModal({
        key: modals.status,
        img: swapObj.code === 500 ? require('~/assets/img/ui/warning.svg') : require('~/assets/img/ui/success.svg'),
        title: swapObj.code === 500 ? this.$t('modals.transactionFail') : this.$t('modals.transactionSent'),
        recipient: '',
        txHash: swapObj.tx,
        chainTo: optionsData.toChain,
        subtitle: '',
      });
      this.SetLoader(false);
    },
    async connectToMetamask() {
      if (!this.isConnected) {
        await this.$store.dispatch('web3/connect');
      }
    },
    async checkPool() {
      return await this.$store.dispatch('web3/goToChain', { chain: this.options.chain });
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
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 25px;
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
