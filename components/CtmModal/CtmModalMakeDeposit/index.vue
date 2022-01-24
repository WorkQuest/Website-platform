<template>
  <ctm-modal-box
    class="deposit"
    :title="$t('modals.depositTitle')"
  >
    <div class="deposit__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__field">
          <div class="content__text">
            {{ $t('modals.depositAmount') }}
          </div>
          <base-field
            v-model="amount"
            :placeholder="'3 500'"
            class="content__input"
            :rules="`required|decimal|is_not:0|max_bn:${balanceData.WUSD.fullBalance}|decimalPlaces:18`"
            :name="$t('modals.depositAmountField')"
            @input="replaceDot"
          />
        </div>
        <div class="content__buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(toDepositReceipt)"
          >
            {{ $t('meta.submit') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { WQPensionFund } from '~/abi/abi';
import { getWalletAddress } from '~/utils/wallet';
import { TokenSymbols } from '~/utils/enums';

export default {
  name: 'ModalMakeDeposit',
  data() {
    return {
      amount: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balanceData: 'wallet/getBalanceData',
    }),
  },
  mounted() {
    this.$store.dispatch('wallet/getBalance');
  },
  methods: {
    replaceDot() {
      this.amount = this.amount.replace(/,/g, '.');
    },
    hide() {
      this.CloseModal();
    },
    async toDepositReceipt() {
      const { updateMethod } = this.options;
      this.hide();
      this.SetLoader(true);
      const [txFee] = await Promise.all([
        this.$store.dispatch('wallet/getContractFeeData', {
          method: 'contribute',
          _abi: WQPensionFund,
          contractAddress: process.env.PENSION_FUND,
          data: [getWalletAddress()],
          amount: this.amount,
          recipient: process.env.PENSION_FUND,
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);

      if (!txFee?.ok || this.balanceData.WUSD.balance === '0') {
        await this.$store.dispatch('main/showToast', {
          text: this.$t('errors.transaction.notEnoughFunds'),
        });
        this.SetLoader(false);
        return;
      }

      const fields = {
        from: { name: this.$t('modals.fromAddress'), value: getWalletAddress() },
        to: { name: this.$t('modals.toAddress'), value: process.env.PENSION_FUND },
        fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WUSD },
        amount: { name: this.$t('modals.amount'), value: this.amount, symbol: TokenSymbols.WUSD },
      };
      this.ShowModal({
        key: modals.transactionReceipt,
        fields,
        submitMethod: async () => await this.$store.dispatch('wallet/pensionContribute', this.amount),
        callback: updateMethod,
      });
      this.SetLoader(false);
    },
    showPensionIsRegisteredModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.depositIsDone'),
        subtitle: this.$t('modals.pensionIsRegisteredText'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  max-width: 495px !important;
  &__content {
    padding: 0 28px 30px 28px!important;
  }
}
.content{
  &__field {
    margin: 15px 0 0 0;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 2px;
  }
  &__text{
    margin: 22px 0 4px 0;
    font-size: 16px;
    line-height: 130%;
  }
}

</style>
