<template>
  <ctm-modal-box
    class="confirm"
    :title="$t('modals.titles.confirmDetails')"
  >
    <div class="confirm__content content">
      <div class="content__field field">
        <div
          v-for="(item, i) in abouts"
          :key="i"
          class="field__body"
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
        <base-btn
          class="buttons__button"
          mode="outline"
          data-selector="CANCEL"
          @click="hide"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          data-selector="SUBMIT"
          @click="openStatusModal"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { getGasPrice, getWalletAddress } from '~/utils/wallet';
import * as abi from '~/abi/abi';
import { tokenMap, TokenSymbols } from '~/utils/enums';

export default {
  name: 'ModalConfirmDetails',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    abouts() {
      return this.options.receiptData;
    },
    symbol() {
      return this.options.payload.data[4];
    },
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async openStatusModal() {
      this.SetLoader(true);
      const res = await this.actionCheck();
      this.SetLoader(false);
      if (res) {
        const {
          dataForStatusModal: {
            img,
            title,
            subtitle,
            path,
          },
        } = this.options;
        this.ShowModal({
          key: modals.status,
          img,
          title,
          subtitle,
          path,
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.transactionFail'),
          recipient: '',
          subtitle: this.$t('modals.errors.error'),
        });
      }
    },
    async actionCheck() {
      switch (this.options.mode) {
        case 'borrow':
          // eslint-disable-next-line no-case-declarations
          const res1 = await this.setTokenPrice();
          // eslint-disable-next-line no-case-declarations
          const payload = {
            symbol: this.symbol,
            spenderAddress: process.env.BORROWING,
            value: this.options.payload.value,
          };
          // eslint-disable-next-line no-case-declarations
          const res2 = await this.$store.dispatch('wallet/approveRouter', payload);
          if (res1 && res2) {
            return await this.$store.dispatch('crediting/sendBorrow', this.options.payload);
          }
          return false;
        default:
          return true;
      }
    },
    async setTokenPrice() {
      const date = Date.now().toString();
      const timestamp = date.substr(0, date.length - 3);
      const price = '10000000000000000000000'; // TODO price
      const v = '0x25';
      const r = '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d';
      const s = '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0';
      const resultGasSetTokenPrice = await getGasPrice(abi.WQOracle, process.env.WORKNET_ORACLE, 'setTokenPriceUSD', [timestamp, price, v, r, s, this.symbol]);
      if (resultGasSetTokenPrice.gas && resultGasSetTokenPrice.gasPrice) {
        const setTokenPriceData = {
          gasPrice: resultGasSetTokenPrice.gasPrice,
          gas: resultGasSetTokenPrice.gas,
          timestamp,
          price,
          v,
          r,
          s,
        };
        const payload = { currency: this.symbol };
        const { ok } = await this.$store.dispatch('crediting/setTokenPrice', { payload, setTokenPriceData });
        return ok;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>

.confirm {
  max-width: 490px !important;
  height: auto;
  &__content {
    padding: 22px 28px 30px 28px!important;
  }
}
.content{
  &__field {
    background-color: $black0;
    border-radius: 5px;
    padding: 20px;
    display: grid;
    gap: 20px;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
.field{
  &__title{
    font-size: 16px;
    font-weight: 400;
    color: #353C47;
  }
  &__subtitle {
    color: $black500;
    font-weight: 500;
    font-size: 14px;
  }
}
</style>
