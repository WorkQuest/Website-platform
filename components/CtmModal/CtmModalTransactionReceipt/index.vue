<template>
  <ctm-modal-box
    class="info"
    :title="options.title || $tc('modals.txInfo')"
  >
    <div class="info__content content">
      <div
        v-if="options.description"
        class="content__description"
      >
        {{ options.description }}
      </div>
      <div class="content__fields">
        <div
          v-for="(item, i) of options.fields"
          :key="i"
          class="content__items-container"
        >
          <div
            v-if="item != null"
            class="item"
          >
            <div class="item__title">
              {{ item.name }}
            </div>
            <div
              class="item__subtitle"
              :class="{field__subtitle_red: !canSend && item.name === $t('wallet.table.trxFee')}"
            >
              {{ item.value }}
              <span v-if="item.symbol">
                {{ item.symbol }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="canSend === false"
        class="info__error error"
      >
        {{ $t('errors.transaction.notEnoughFunds') }}
      </div>
      <div class="content__buttons buttons">
        <div class="buttons__group">
          <base-btn
            class="buttons__button"
            mode="outline"
            data-selector="CANCEL"
            @click="handleCancel"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!canSend"
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
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { TokenSymbols, WalletTokensData } from '~/utils/enums';

export default {
  name: 'TransactionReceipt',
  data() {
    return {
      canSend: true,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balance: 'wallet/getBalanceData',
      selectedNetwork: 'wallet/getSelectedNetwork',
    }),
    nativeTokenSymbol() {
      return WalletTokensData[this.selectedNetwork].tokenList[0].title;
    },
  },
  mounted() {
    const { fields } = this.options;
    const { nativeTokenSymbol } = this;
    const amount = fields?.amount?.value;
    const symbol = fields?.amount?.symbol;
    const fee = fields?.fee?.value;
    const nativeTokenBalance = this.balance[nativeTokenSymbol].fullBalance;

    // If we send WQT
    if (fee && amount && symbol === nativeTokenSymbol) {
      this.canSend = new BigNumber(amount).plus(fee).isLessThanOrEqualTo(nativeTokenBalance);
    } else if (fee) {
      // Only need check transaction fee with user balance
      this.canSend = new BigNumber(fee).isLessThanOrEqualTo(nativeTokenBalance);
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.canSend) return;
      const {
        callback, submitMethod, isShowSuccess, isDontOffLoader,
      } = this.options;
      this.CloseModal();
      this.SetLoader({ isLoading: true });
      if (submitMethod) {
        const res = await submitMethod();
        if (res?.ok) {
          if (callback) await callback();
          if (isShowSuccess) {
            this.ShowModal({ key: modals.transactionSend });
          }
        }
      }
      if (!isDontOffLoader) this.SetLoader(false);
    },
    async handleCancel() {
      const { cancelMethod } = this.options;
      this.CloseModal();
      if (cancelMethod) cancelMethod();
    },
  },
};
</script>

<style lang="scss" scoped>

.item {
  margin-bottom: 15px;
  &:last-child{
    margin-bottom: 0;
  }
  &__title {
    color: $black500;
  }
  &__subtitle{
    &_red {
      color: $red;
    }
  }
}
.error {
  color: $red;
  font-size: 12px;
  margin: 10px 0;
}
.content{
  padding: 0 28px 30px 28px!important;
  &__description {
    color: $black500;
  }
  &__fields {
    margin-top: 20px;
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
