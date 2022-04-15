<template>
  <ctm-modal-box
    class="loan"
    :title="$t('modals.titles.loan')"
  >
    <div class="loan__content content">
      <validation-observer
        v-slot="{handleSubmit, valid}"
      >
        <div class="content__body">
          <div class="content__field">
            <div class="content__label">
              {{ $t('modals.howMuchTokensWouldYouLikeToLock', { token:'WUSD' }) }}
            </div>
            <div class="content__text content__text_small">
              {{ $t('modals.smallDescriptionForLoan') }}
            </div>
            <base-field
              v-model="quantity"
              class="content__input"
              placeholder="10 WUSD"
              rules="required|decimal"
              data-selector="VALUE-FOR-LOAN"
              :name="$t('modals.quantityField')"
            >
              <template
                v-slot:right-absolute
                class="content__max max"
              >
                <base-btn
                  mode="max"
                  data-selector="MAX-BALANCE"
                  class="max__button"
                  @click="maxBalance()"
                >
                  <span class="max__text">{{ $t('modals.maximum') }}</span>
                </base-btn>
              </template>
            </base-field>
            <div class="content__text">
              {{ $t('modals.tipAbout') }}
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
            :disabled="!valid || quantity <= 0"
            data-selector="SUBMIT"
            @click="handleSubmit(openConfirmDetailsModal)"
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
import { WQLending } from '~/abi/abi';

export default {
  name: 'ModalCreditingLoan',
  data() {
    return {
      selCurrencyID: 1,
      quantity: '',
      debt: '',
      percents: '',
      feeData: 0,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balanceData: 'wallet/getBalanceData',
    }),
    balance() {
      return this.balanceData.WUSD;
    },
  },
  async mounted() {
    await this.$store.dispatch('wallet/getBalance');
    this.feeData = await this.$store.dispatch('crediting/getMethodFee', {
      method: 'deposit',
      abi: WQLending,
      address: process.env.WORKNET_LENDING,
    });
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async openConfirmDetailsModal() {
      const amount = this.quantity;
      const { submit } = this.options;
      this.hide();
      await submit(amount);
    },
    maxBalance() {
      this.quantity = new BigNumber(new BigNumber(this.balance.fullBalance).shiftedBy(18).minus(this.feeData.result.fee)).shiftedBy(-18).toString();
    },
  },
};
</script>

<style lang="scss" scoped>
.max {
  &__button {
    margin-right: 10px !important;
    background-color: transparent !important;
  }
}
.loan {
  max-width: 490px !important;
  height: auto !important;
  padding: 0!important;
  &__content{
    padding: 25px 28px 30px 28px;
  }
}
  .buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 40px;
  }
.content{
  &__field{
    margin-top: 3px;
  }
  &__label {
    margin-bottom: 5px;
  }
  &__text {
    color: #7C838D;
    font-weight: 400;
    font-size: 14px;
    margin-top: 3px;
    &_small {
      margin-bottom:10px;
    }
  }
}
</style>
