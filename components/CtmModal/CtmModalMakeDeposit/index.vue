<template>
  <ctm-modal-box
    class="deposit"
    :title="$tc('modals.titles.deposit')"
  >
    <div class="deposit__content content">
      <validation-observer v-slot="{handleSubmit, validated, passed, invalid}">
        <div class="content__field">
          <div class="content__text">
            {{ $t('modals.depositAmount') }}
          </div>
          <base-field
            v-model="amount"
            placeholder="3 500"
            data-selector="DEPOSIT-AMOUNT"
            class="content__input"
            :rules="`required|decimal|is_not:0|max_value:${balanceData.WUSD.fullBalance}|decimalPlaces:18`"
            :name="$tc('modals.depositAmountField')"
            @input="replaceDot"
          />
        </div>
        <div class="content__buttons">
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
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(toDepositReceipt)"
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
import { tokenMap, TokenSymbols } from '~/utils/enums';

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
    async toDepositReceipt() {
      const { updateMethod } = this.options;
      const { amount, balanceData } = this;
      const newAmount = new BigNumber(amount).shiftedBy(18).toString();
      console.log(balanceData);
      this.CloseModal();
      this.SetLoader(true);
      const allowance = await this.$store.dispatch('wallet/getAllowance', {
        tokenAddress: tokenMap[TokenSymbols.WUSD],
        spenderAddress: process.env.WORKNET_PENSION_FUND,
      });
      console.log('allowance:', allowance, 'newAmount:', newAmount);
      if (+allowance < +newAmount) {
        await this.$store.dispatch('wallet/approve', {
          tokenAddress: tokenMap[TokenSymbols.WUSD],
          spenderAddress: process.env.WORKNET_PENSION_FUND,
          amount: newAmount,
        });
      } else {
        this.SetLoader(false);
      }
      const [txFee] = await Promise.all([
        this.$store.dispatch('wallet/getContractFeeData', {
          method: 'contribute',
          abi: WQPensionFund,
          contractAddress: process.env.WORKNET_PENSION_FUND,
          data: [getWalletAddress(), newAmount],
          recipient: process.env.WORKNET_PENSION_FUND,
        }),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      if (!txFee?.ok || +balanceData.WUSD.balance === 0) {
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
        amount: { name: this.$t('modals.amount'), value: amount, symbol: TokenSymbols.WUSD },
      };
      this.ShowModal({
        key: modals.transactionReceipt,
        fields,
        submitMethod: async () => await this.$store.dispatch('retirement/pensionContribute', amount),
        callback: updateMethod,
      });
      this.SetLoader(false);
    },
    showPensionIsRegisteredModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.depositIsDone'),
        subtitle: '',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  max-width: 495px !important;

  &__content {
    padding: 0 28px 30px 28px !important;
  }
}

.content {
  &__field {
    margin: 15px 0 0 0;
  }

  &__buttons {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 2px;
  }

  &__text {
    margin: 22px 0 4px 0;
    font-size: 16px;
    line-height: 130%;
  }
}

</style>
