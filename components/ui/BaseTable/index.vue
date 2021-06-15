<template>
  <div class="table">
    <b-table
      :items="items"
      :fields="fields"
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
        <div class="row__container">
          <span class="table__grey">{{ el.item.block }}</span>
        </div>
      </template>
      <template #cell(timestamp)="el">
        <div class="row__container">
          <span class="table__grey">{{ el.item.timestamp }}</span>
        </div>
      </template>
      <template #cell(transaction_fee)="el">
        <div class="row__container">
          <span class="table__grey">{{ el.item.transaction_fee }}</span>
        </div>
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
.row {
  &__container {
    overflow-x: auto;
    max-width: 150px;
    max-height: 150px;
    display: flex;
    word-break: break-word;
  }
}
.table {
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
  }
}
</style>
