<template>
  <div class="table">
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
    fields: {
      type: Array,
      default: () => [],
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
