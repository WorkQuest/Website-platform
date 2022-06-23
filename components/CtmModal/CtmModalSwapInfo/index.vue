<template>
  <ctm-modal-box
    class="info"
    :title="$tc('modals.titles.swapInfo')"
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
            data-selector="CANCEL"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            data-selector="CONFIRM"
            @click="sendTransaction"
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
import { Chains } from '~/utils/enums';
import { getChainIdByChain } from '~/utils/web3';

export default {
  name: 'ModalSwapInfo',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/isConnected',
      account: 'web3/getAccount',
    }),
    info() {
      return [
        {
          title: this.$t('modals.bridge'),
          subtitle: this.options.networks,
        },
        {
          title: this.$t('modals.amount'),
          subtitle: this.options.amount,
        },
        {
          title: this.$t('modals.senderAddress'),
          subtitle: this.options.fromNetwork === Chains.WORKNET
            ? this.convertToBech32('wq', this.options.recipient) : this.options.recipient,
        },
        {
          title: this.$t('modals.recipientAddress'),
          subtitle: this.options.toNetwork === Chains.WORKNET
            ? this.convertToBech32('wq', this.options.recipient) : this.options.recipient,
        },
      ];
    },
  },
  watch: {
    async isConnected(val) {
      const id = +getChainIdByChain(this.options?.from?.chain);
      if (val && this.account.netId !== id) {
        await this.CloseModal();
        this.ShowToast(this.$t('modals.incorrectChain'));
      }
    },
  },
  methods: {
    async sendTransaction() {
      const { submit } = this.options;
      await submit();
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
