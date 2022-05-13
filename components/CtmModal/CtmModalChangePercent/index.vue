<template>
  <ctm-modal-box
    class="percent"
    :title="$tc('modals.titles.changePercent')"
  >
    <div class="percent__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        class="content__validator"
      >
        <div class="content__text">
          {{ $t('modals.changePercentDesc') }}
        </div>
        <div
          class="content__field"
          @keydown.delete="ChangeCaretPosition( $refs.percentInput)"
        >
          <div class="content__title">
            {{ $t('modals.currentPercentTitle') }}
          </div>
          <base-field
            ref="percentInput"
            :value="amount"
            :placeholder="$tc('meta.units.percentsCount', 15)"
            class="content__input"
            :name="$tc('modals.currentPercentErr')"
            data-selector="PENSION-PERCENT"
            rules="required|min_percent:1|max_percent:99|zeroFail|notMoreDecimalPlaces"
            @input="calcPensionPercent"
          />
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            data-selector="CANCEL"
            mode="outline"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            data-selector="SUBMIT"
            class="buttons__button"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(updateFee)"
          >
            {{ $t('meta.btns.submit') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { WQPensionFund } from '~/abi/index';
import { getWalletAddress } from '~/utils/wallet';
import { TokenSymbols } from '~/utils/enums';

export default {
  name: 'ModalApplyForAPension',
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
  methods: {
    async updateFee() {
      const { updateMethod } = this.options;
      this.CloseModal();
      this.SetLoader(true);

      const [txFee] = await Promise.all([
        this.$store.dispatch('wallet/getContractFeeData', {
          method: 'updateFee',
          abi: WQPensionFund,
          contractAddress: process.env.WORKNET_PENSION_FUND,
          data: [new BigNumber(this.amount.substr(0, this.amount.length - 1)).shiftedBy(18).toString()],
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      if (!txFee?.ok || +this.balanceData.WUSD.balance === 0) {
        await this.$store.dispatch('main/showToast', {
          text: this.$t('errors.transaction.notEnoughFunds'),
        });
        this.SetLoader(false);
        return;
      }

      const fields = {
        from: { name: this.$t('meta.fromBig'), value: getWalletAddress() },
        to: { name: this.$t('meta.toBig'), value: process.env.WORKNET_PENSION_FUND },
        fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WUSD },
      };

      this.ShowModal({
        key: modals.transactionReceipt,
        fields,
        submitMethod: async () => await this.$store.dispatch('wallet/pensionUpdateFee', this.amount.substr(0, this.amount.length - 1)),
        callback: updateMethod,
      });
      this.SetLoader(false);
    },
    showPercentIsChanged() {
      this.ShowModalSuccess({
        title: this.$t('modals.percentIsChanged'),
        subtitle: this.$t('modals.percentIsChangedText'),
      });
    },
    calcPensionPercent(value) {
      this.amount = this.CalcPercent(value);
      this.ChangeCaretPosition(this.$refs.percentInput);
    },
  },
};
</script>

<style lang="scss" scoped>

.percent {
  padding: 0 !important;
  max-width: 487px !important;

  &__content {
    padding: 0 28px 30px 28px !important;
  }
}

.content {
  &__text {
    margin: 22px 0 15px 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    color: $black600
  }

  &__title {
    margin-bottom: 4px;
  }

  &__buttons {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 10px;
  }
}
</style>
