<template>
  <ctm-modal-box
    class="buy-wqt"
    title="Buy WQT"
  >
    <validation-observer
      v-slot="{handleSubmit, invalid}"
      class="buy-wqt__content content"
      tag="div"
    >
      <div class="content__field">
        <div class="content__field_label">
          {{ $t('modals.network') }}
        </div>
        <base-dd
          v-model="selectedNetwork"
          type="border"
          data-selector="NETWORK"
          :items="networkList"
          is-icon
        />
      </div>
      <div class="content__field">
        <div class="content__field_label">
          {{ $t('modals.token') }}
        </div>
        <base-dd
          v-model="selectedToken"
          type="border"
          data-selector="TOKEN"
          :items="tokenList"
        />
      </div>
      <base-field
        v-model="amount"
        :placeholder="$t('modals.amount')"
        :name="$t('modals.amount')"
        rules="required|decimal"
        data-selector="AMOUNT"
      />
      <base-btn
        :disabled="invalid"
        @click="handleSubmit(submit)"
      >
        {{ $t('meta.btns.confirm') }}
      </base-btn>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { SwapAddresses } from '~/utils/сonstants/bridge';
import { Chains } from '~/utils/enums';

export default {
  name: 'ModalBuyWQT',
  data() {
    return {
      selectedToken: 0,
      selectedNetwork: 0,
      amount: null,
    };
  },
  computed: {
    networkList() {
      return [
        SwapAddresses.get(Chains.ETHEREUM),
        SwapAddresses.get(Chains.BINANCE),
      ];
    },
    tokenList() {
      return ['USDT'];
    },
  },
  methods: {
    submit() {

    },
  },
};
</script>

<style lang="scss" scoped>
.buy-wqt {
  &__content {
    padding: 20px 28px 30px 28px !important;
  }
}
.content {
  display: grid;
  grid-gap: 20px;
  &__field {
    display: grid;
    grid-gap: 10px;
  }
}
</style>
