<template>
  <ctm-modal-box
    class="pension"
    :title="$t('pension.applyForAPension')"
  >
    <div class="pension__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__percent">
          <div class="content__title">
            {{ $t('modals.depositPercentFromAQuest') }}
          </div>
          <base-field
            v-model="depositPercentFromAQuest"
            :placeholder="$tc('modals.percentsCount', 13)"
            class="content__input"
            :name="$t('modals.depositPercent')"
            rules="required|percent|decimalPlaces:18"
          />
        </div>
        <div class="content__amount">
          <div class="content__title">
            {{ $t('modals.firstDepositAmount') }}
          </div>
          <base-field
            v-model="firstDepositAmount"
            :placeholder="$tc('pension.WUSDCount', 130)"
            class="content__input"
            :name="$t('modals.firstDepositAmountField')"
            rules="decimal"
          />
          <div class="content__text">
            {{ $t('modals.firstDepositText') }}
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="invalid || inProgress"
            @click="handleSubmit(submitPensionRegistration)"
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
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { getWalletAddress } from '~/utils/wallet';
import { WQPensionFund } from '~/abi/abi';
import { TokenSymbols } from '~/utils/enums';

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
    this.depositPercentFromAQuest = this.options.defaultFee;
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async submitPensionRegistration() {
      const { defaultFee } = this.options;
      this.inProgress = true;
      let txFee;
      const equalsFee = new BigNumber(defaultFee).shiftedBy(-18).isEqualTo(new BigNumber(this.depositPercentFromAQuest).shiftedBy(-18));
      if (!this.firstDepositAmount || !equalsFee) {
        const [fee] = await Promise.all([
          this.$store.dispatch('wallet/getContractFeeData', {
            method: 'updateFee',
            _abi: WQPensionFund,
            contractAddress: process.env.PENSION_FUND,
            data: [new BigNumber(this.depositPercentFromAQuest).shiftedBy(18).toString()],
          }),
          this.$store.dispatch('wallet/getBalance'),
        ]);
        txFee = fee;
      } else if (this.firstDepositAmount) {
        const [fee] = await Promise.all([
          this.$store.dispatch('wallet/getContractFeeData', {
            method: 'contribute',
            _abi: WQPensionFund,
            contractAddress: process.env.PENSION_FUND,
            data: [getWalletAddress()],
            amount: this.firstDepositAmount,
            recipient: process.env.PENSION_FUND,
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
        from: { name: this.$t('modals.fromAddress'), value: getWalletAddress() },
        to: { name: this.$t('modals.toAddress'), value: process.env.PENSION_FUND },
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
            fee: this.depositPercentFromAQuest,
            firstDeposit: this.firstDepositAmount,
            defaultFee,
          });
          if (ok) {
            this.showPensionIsRegisteredModal();
          }
        },
      });
    },
    showPensionIsRegisteredModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/document.svg'),
        title: this.$t('modals.pensionIsRegistered'),
        subtitle: this.$t('modals.pensionIsRegisteredText'),
        path: '/pension/my',
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.pension{
  max-width: 487px !important;
  &__content {
    padding: 22px 28px 30px 28px!important;
  }
}
.content{
  &__text {
    color: $black500;
    font-weight: 400;
    font-size: 14px;
  }
  &__buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
  &__title{
    margin-bottom: 4px;
    font-size: 16px;
    line-height: 130%;
  }
}
</style>
