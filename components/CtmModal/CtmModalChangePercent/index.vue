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
          @keydown.delete="ChangeCaretPosition($refs.percentInput)"
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
            @click="handleSubmit(send())"
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
      amount: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async send() {
      const { amount, options: { submit } } = this;
      await submit(amount);
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
