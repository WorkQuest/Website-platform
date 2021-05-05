<template>
  <div class="table">
    <b-table
      :items="testItems"
      borderless
      caption-top
      thead-class="table__header"
      tbody-tr-class="table__row"
    >
      <template
        #table-caption
      >
        <span class="table__title">{{ $props.title }}</span>
      </template>
      <template #cell(status)="el">
        <span
          v-if="el.item.status === 'Success'"
          class="table__success"
        >{{ el.item.status }}</span>
        <span
          v-else
          class="table__failed"
        >{{ el.item.status }}</span>
      </template>
      <template #cell(block)="el">
        <span class="table__grey">{{ el.item.block }}</span>
      </template>
      <template #cell(timestamp)="el">
        <span class="table__grey">{{ el.item.timestamp }}</span>
      </template>
      <template #cell(transaction_fee)="el">
        <span class="table__grey">{{ el.item.transaction_fee }}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      testItems: [
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
      ],
    };
  },
  computed: {
    testFields() {
      return [
        this.$t('wallet.table.txHash'),
        this.$t('wallet.table.status'),
        this.$t('wallet.table.block'),
        this.$t('wallet.table.timestamp'),
        this.$t('wallet.table.transferred'),
        this.$t('wallet.table.value'),
        this.$t('wallet.table.trxFee'),
      ];
    },
  },
};
</script>

<style lang="scss">
.table {
  font-size: 16px;
  line-height: 130%;
  background: $white;
  border-radius: 6px;

  &__title {
    margin: 10px;
    color: $black800;
  }

  &__success {
    color: $green;
  }

  &__failed {
    color: $red;
  }

  &__grey {
    color: $black500;
  }

  &__header {
    background: rgba(0, 131, 199, 0.1);
    height: 27px;
    line-height: 27px;
    color: $blue;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 130%;
    font-weight: 100;
  }

  &__row {
    line-height: 40px;
  }
}
</style>
