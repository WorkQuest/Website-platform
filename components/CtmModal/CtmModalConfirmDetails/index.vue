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
      currentPrice: 'oracle/getCurrentPrice',
    }),
    abouts() {
      return this.options.receiptData;
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
      if (res.ok) {
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
          const checkTokenPrice = await this.setTokenPrice();
          // eslint-disable-next-line no-case-declarations
          const {
            payload: {
              value, symbol, nonce, fundIndex, duration,
            },
          } = this.options;
          // eslint-disable-next-line no-case-declarations
          const approveAllowed = await this.$store.dispatch('wallet/approveRouter', {
            symbol,
            spenderAddress: process.env.BORROWING,
            value,
          });
          if (checkTokenPrice && approveAllowed) {
            return await this.$store.dispatch('crediting/sendMethod', {
              value,
              data: [
                nonce,
                new BigNumber(value).multipliedBy(18).toFixed(),
                fundIndex,
                duration,
                symbol,
              ],
              method: 'borrow',
              type: 'borrowing',
            });
          }
          return false;
        case 'savings':
          return true;
        default:
          return false;
      }
    },
    async setTokenPrice() {
      const {
        nonce, prices, v, r, s, symbols,
      } = this.currentPrice; // TODO price
      const resultGasSetTokenPrices = await getGasPrice(abi.WQOracle, process.env.WORKNET_ORACLE, 'setTokenPricesUSD', [nonce, v, r, s, prices, symbols]);
      if (resultGasSetTokenPrices.gas && resultGasSetTokenPrices.gasPrice) {
        const { ok } = await this.$store.dispatch('crediting/setTokenPrices', {
          gasPrice: resultGasSetTokenPrices.gasPrice,
          gas: resultGasSetTokenPrices.gas,
          timestamp: nonce,
          v,
          r,
          s,
          prices,
          symbols,
        });
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
