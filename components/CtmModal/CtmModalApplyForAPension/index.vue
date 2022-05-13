<template>
  <ctm-modal-box
    class="pension"
    :title="$tc('modals.titles.applyForAPension')"
  >
    <div class="pension__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div
          class="content__percent"
          @keydown.delete="ChangeCaretPosition( $refs.percentInput)"
        >
          <div class="content__title">
            {{ $t('modals.depositPercentFromAQuest') }}
          </div>
          <base-field
            ref="percentInput"
            :value="depositPercentFromAQuest"
            :placeholder="$tc('meta.units.percentsCount', 13)"
            class="content__input"
            data-selector="DEPOSIT-PERCENT"
            :name="$tc('modals.depositPercent')"
            rules="required|min_percent:0.01|max_percent:99|zeroFail|notMoreDecimalPlaces"
            @input="calcPensionPercent"
          />
        </div>
        <div class="content__amount">
          <div class="content__title">
            {{ $t('modals.firstDepositAmount') }}
          </div>
          <base-field
            v-model="firstDepositAmount"
            :placeholder="$tc('meta.coins.count.WUSDCount', 130)"
            class="content__input"
            data-selector="FIRST-DEPOSIT-AMOUNT"
            :name="$tc('modals.firstDepositAmountField')"
            rules="decimal:18|notMoreDecimalPlaces|greaterThanZero|zeroFail|notMoreDecimalPlaces"
          />
          <div class="content__text">
            {{ $t('modals.firstDepositText') }}
          </div>
        </div>
        <div class="content__buttons buttons">
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
            data-selector="SUBMIT"
            :disabled="invalid || inProgress"
            @click="handleSubmit(submitPensionRegistration)"
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
import { getWalletAddress } from '~/utils/wallet';
import { WQPensionFund } from '~/abi/index';
import { TokenSymbols } from '~/utils/enums';
import { images } from '~/utils/images';

export default {
  name: 'ModalApplyForAPension',
  data() {
    return {
      depositPercentFromAQuest: '',
      firstDepositAmount: '',
      inProgress: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balanceData: 'wallet/getBalanceData',
    }),
  },
  mounted() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
    this.depositPercentFromAQuest = `${this.options.defaultFee}%`;
  },
  methods: {
    async submitPensionRegistration() {
      const { defaultFee } = this.options;
      this.inProgress = true;
      let txFee;
      const equalsFee = new BigNumber(defaultFee).shiftedBy(-18).isEqualTo(new BigNumber(this.depositPercentFromAQuest.substr(0, this.depositPercentFromAQuest.length - 1)).shiftedBy(-18));
      if (!this.firstDepositAmount || !equalsFee) {
        const [fee] = await Promise.all([
          this.$store.dispatch('wallet/getContractFeeData', {
            method: 'updateFee',
            abi: WQPensionFund,
            contractAddress: process.env.WORKNET_PENSION_FUND,
            data: [new BigNumber(this.depositPercentFromAQuest.substr(0, this.depositPercentFromAQuest.length - 1)).shiftedBy(18).toString()],
          }),
          this.$store.dispatch('wallet/getBalance'),
        ]);
        txFee = fee;
      } else if (this.firstDepositAmount) {
        const [fee] = await Promise.all([
          this.$store.dispatch('wallet/getContractFeeData', {
            method: 'contribute',
            abi: WQPensionFund,
            contractAddress: process.env.WORKNET_PENSION_FUND,
            data: [getWalletAddress()],
            amount: this.firstDepositAmount,
            recipient: process.env.WORKNET_PENSION_FUND,
          }),
          this.$store.dispatch('wallet/getBalance'),
        ]);
        txFee = fee;
      }

      if (!txFee?.ok || this.balanceData.WUSD.balance === 0) {
        await this.$store.dispatch('main/showToast', {
          text: this.$t('errors.transaction.notEnoughFunds'),
        });
        this.inProgress = false;
        return;
      }

      const fields = {
        from: { name: this.$t('meta.fromBig'), value: getWalletAddress() },
        to: { name: this.$t('meta.toBig'), value: process.env.WORKNET_PENSION_FUND },
        fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WUSD },
      };
      if (this.firstDepositAmount) {
        fields.amount = { name: this.$t('modals.amount'), value: this.firstDepositAmount, symbol: TokenSymbols.WUSD };
      }

      this.ShowModal({
        key: modals.transactionReceipt,
        fields,
        submitMethod: async () => {
          const ok = await this.$store.dispatch('wallet/pensionStartProgram', {
            fee: this.depositPercentFromAQuest.substr(0, this.depositPercentFromAQuest.length - 1),
            firstDeposit: this.firstDepositAmount,
            defaultFee,
          });
          if (ok) this.showPensionIsRegisteredModal();
        },
      });
    },
    showPensionIsRegisteredModal() {
      this.ShowModal({
        key: modals.status,
        img: images.DOCUMENT,
        title: this.$t('modals.pensionIsRegistered'),
        subtitle: this.$t('modals.pensionIsRegisteredText'),
        path: '/pension/my',
      });
    },
    calcPensionPercent(value) {
      this.depositPercentFromAQuest = this.CalcPercent(value);
      this.ChangeCaretPosition(this.$refs.percentInput);
    },
  },
};
</script>

<style lang="scss" scoped>

.pension {
  max-width: 487px !important;

  &__content {
    padding: 22px 28px 30px 28px !important;
  }
}

.content {
  &__text {
    color: $black500;
    font-weight: 400;
    font-size: 14px;
  }

  &__buttons {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }

  &__title {
    margin-bottom: 4px;
    font-size: 16px;
    line-height: 130%;
  }
}
</style>
