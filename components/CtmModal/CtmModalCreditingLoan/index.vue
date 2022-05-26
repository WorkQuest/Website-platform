<template>
  <ctm-modal-box
    class="loan"
    :title="$tc('modals.titles.loan')"
  >
    <div class="loan__content content">
      <validation-observer
        v-slot="{handleSubmit, valid}"
      >
        <div class="content__body">
          <div class="content__field">
            <div class="content__label">
              {{ $t('modals.howMuchTokensWouldYouLikeToLock', {token: $t('meta.coins.wusd')}) }}
            </div>
            <div class="content__text content__text_small">
              {{ $t('modals.smallDescriptionForLoan') }}
            </div>
            <base-field
              v-model="quantity"
              class="content__input"
              :placeholder="$tc('meta.coins.count.WUSDCount', 100)"
              rules="required|decimal:18|greaterThanZero|zeroFail"
              data-selector="VALUE-FOR-LOAN"
              :name="$tc('modals.quantityField')"
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
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!valid"
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
import { getContractFeeData } from '~/utils/wallet';
import { WQLending } from '~/abi/index';

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
  },
  methods: {
    async openConfirmDetailsModal() {
      const amount = this.quantity;
      const { submit } = this.options;
      this.CloseModal();
      await submit(amount);
    },
    async maxBalance() {
      const balance = this.balance.fullBalance;
      const { result: { fee } } = await getContractFeeData('deposit', WQLending, this.ENV.WORKNET_LENDING, [], null, this.balance.fullBalance);
      this.quantity = new BigNumber(balance).minus(fee).toString();
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
  padding: 0 !important;

  &__content {
    padding: 25px 28px 30px 28px;
  }
}

.buttons {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 40px;
}

.content {
  &__field {
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
      margin-bottom: 10px;
    }
  }
}
</style>
