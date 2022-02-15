<template>
  <div
    class="table"
    data-selector="COMPONENT-BASE-TABLE"
  >
    <b-table
      :items="items"
      :fields="fields"
      borderless
      thead-class="table__header"
      caption-top
      :responsive="true"
      tbody-tr-class="table__row"
    >
      <template
        #table-caption
      >
        <span class="table__title">{{ $props.title }}</span>
      </template>
      <template #cell(tx_hash)="el">
        <a
          :href="getTransactionUrl(el.item.tx_hash)"
          target="_blank"
          class="table__url"
        >
          {{ CutTxn(el.item.tx_hash, 8, 4) }}
        </a>
      </template>
      <template #cell(status)="el">
        <span
          :class="{table__success: el.item.status, table__failed: !el.item.status}"
        >
          {{ el.item.status ? $t('modals.success') : $t('modals.failed') }}
        </span>
      </template>
      <template #cell(block)="el">
        <span class="table__grey">{{ el.item.block }}</span>
      </template>
      <template #cell(timestamp)="el">
        <span class="table__grey">{{ el.item.timestamp }}</span>
      </template>
      <template #cell(from_address)="el">
        <a
          :href="getAddressUrl(el.item.from_address)"
          target="_blank"
          class="table__url"
        >
          {{ CutTxn(el.item.from_address, 4, 4) }}
        </a>
      </template>
      <template #cell(to_address)="el">
        <a
          :href="getAddressUrl(el.item.to_address)"
          target="_blank"
          class="table__url"
        >
          {{ CutTxn(el.item.to_address, 4, 4) }}
        </a>
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
    fields: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getTransactionUrl(hash) {
      if (process.env.PROD === 'true') {
        return `https://dev-explorer.workquest.co/transactions/${hash}`;
      }
      return `https://dev-explorer.workquest.co/transactions/${hash}`;
    },
    getAddressUrl(address) {
      if (process.env.PROD === 'true') {
        return `https://dev-explorer.workquest.co/address/${address}`;
      }
      return `https://dev-explorer.workquest.co/address/${address}`;
    },
  },
};
</script>

<style lang="scss">
.table {
  overflow-x: hidden;
  font-size: 16px;
  line-height: 130%;
  background: #FFFFFF;
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
  &__url:hover {
    text-decoration: none;
  }
  &__header {
    @include text-simple;
    background: rgba(0, 131, 199, 0.1);
    height: 27px;
    line-height: 17px;
    color: $blue;
    font-style: normal;
    font-size: 12px;
    word-break: break-word;
  }
  &__row {
    line-height: 40px;
  }
  @include _991 {
    .table {
      &__row {
        font-size: 12px;
      }
      &__header {
        font-size: 10px;
      }
    }
    //thead, tbody tr {
    //  display:table;
    //  width: 920px;
    //  min-width: 710px;
    //  table-layout:fixed;
    //}
    //thead {
    //  width: calc( 940px - 1em );
    //  min-width: calc( 710px - 1em );
    //}
  }
  @include _767 {
    //thead, tbody tr {
    //  display:table;
    //  width: 700px;
    //  min-width: 540px;
    //  table-layout:fixed;
    //}
    //thead {
    //  width: calc( 700px - 1em );
    //  min-width: calc( 540px - 1em );
    //}
  }
}
</style>
