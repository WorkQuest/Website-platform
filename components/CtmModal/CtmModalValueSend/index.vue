<template>
  <ctm-modal-box
    class="claim"
    :title="modalName"
  >
    <div class="claim__content content">
      <validation-observer
        v-slot="{handleSubmit, valid}"
      >
        <base-field
          id="amount"
          v-model="amount"
          class="content__field"
          type="number"
          data-selector="INPUT_AMOUNT"
          placeholder="3500"
          :label="$t('modals.amount')"
          rules="required|decimal|decimalPlaces:18"
          :name="$t('modals.amount')"
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
              <span class="max__text">{{ $t('modals.maximum') }}</span>
            </base-btn>
          </template>
        </base-field>
        <div class="content__container">
          <base-btn
            mode="outline"
            data-selector="CANCEL"
            @click="hide()"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            data-selector="SUBMIT"
            :disabled="!valid"
            @click="send()"
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

export default {
  name: 'CtmModalValueSend',
  data() {
    return {
      amount: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    modalName() {
      switch (this.options.mode) {
        case 'refund':
          return this.$t('crediting.refund');
        case 'withdraw':
          return this.$t('meta.withdraw');
        case 'deposit':
          return this.$t('meta.deposit');
        case 'claim':
          return this.$t('modals.claim');
        default:
          return this.$t('modals.amount');
      }
    },
    maxValue() {
      return this.options.maxValue;
    },
  },
  methods: {
    hide() { this.CloseModal(); },
    async send() {
      const value = this.amount;
      const { callback, maxValue } = this.options;
      this.hide();
      await callback(value, maxValue);
    },
    maxBalance() {
      this.amount = this.maxValue;
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
.claim {
  max-width: 487px!important;
  &__content {
    padding: 22px 28px 30px 28px!important;
  }
}
.content {
  &__subtitle {
    @include text-simple;
    font-weight: 400;
    font-size: 14px;
    color: $black500;
    &_blue {
      @extend .content__subtitle;
      color: $blue;
    }
  }
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    margin-top: 25px;
  }
}
</style>
