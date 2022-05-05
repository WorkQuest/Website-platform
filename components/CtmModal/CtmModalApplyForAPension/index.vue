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
            :rules="`decimal:18|notMoreDecimalPlaces|greaterThanZero|zeroFail|notMoreDecimalPlaces|${maxValue ? `max_value:${maxValue}` : ''}`"
          >
            <template
              v-if="maxValue"
              v-slot:right-absolute
              class="content__max max"
            >
              <base-btn
                mode="max"
                data-selector="MAX-BALANCE"
                class="max__button"
                @click="maxBalance()"
              >
                <span class="max__text">
                  {{ $t('modals.maximum') }}
                </span>
              </base-btn>
            </template>
          </base-field>
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
    }),
    maxValue() {
      return this.options.maxValue;
    },
  },
  mounted() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
    this.depositPercentFromAQuest = `${this.options.defaultFee}%`;
  },
  methods: {
    async submitPensionRegistration() {
      const { depositPercentFromAQuest, firstDepositAmount, options: { submitMethod } } = this;
      await submitMethod(firstDepositAmount, depositPercentFromAQuest);
    },
    calcPensionPercent() {
      this.depositPercentFromAQuest = this.CalcPercent(this.depositPercentFromAQuest);
      this.ChangeCaretPosition(this.$refs.percentInput);
    },
    maxBalance() {
      this.firstDepositAmount = this.maxValue;
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
