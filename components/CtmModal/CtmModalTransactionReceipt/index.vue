<template>
  <ctm-modal-box
    class="info"
    :title="options.title || $t('modals.txInfo')"
  >
    <div class="info__content content">
      <div class="content__fields">
        <div
          v-for="(item, i) of options.fields"
          :key="i"
          class="field field__item"
        >
          <div class="field__title">
            {{ item.name }}
          </div>
          <div
            class="field__subtitle"
            :class="{field__subtitle_red: !canSend && item.name === $t('wallet.table.trxFee')}"
          >
            {{ item.value }}
            <span v-if="item.symbol">{{ item.symbol }}</span>
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
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!canSend"
            @click="handleSubmit"
          >
            {{ $t('meta.confirm') }}
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
import { TokenSymbols } from '~/utils/enums';

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
    }),
  },
  mounted() {
    const { fields } = this.options;
    if (fields && fields.fee && fields.amount) {
      if (fields.amount.symbol === TokenSymbols.WUSD) { // If we send WUSD
        this.canSend = new BigNumber(fields.amount.value).plus(fields.fee.value).isLessThanOrEqualTo(this.balance.WUSD.fullBalance);
      } else {
        this.canSend = new BigNumber(fields.fee.value).isLessThanOrEqualTo(this.balance.WUSD.fullBalance);
      }
    }
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async handleSubmit() {
      if (!this.canSend) return;
      const { callback, submitMethod } = this.options;
      this.hide();
      this.SetLoader(true);
      const res = await submitMethod();
      if (res?.ok) {
        if (callback) await callback();
        await this.$store.dispatch('modals/show', {
          key: modals.transactionSend,
        });
      }
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>

.field{
  &__item {
    margin-bottom: 10px;
    &:last-child{
      margin-bottom: 0;
    }
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
