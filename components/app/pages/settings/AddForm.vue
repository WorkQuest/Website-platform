<template>
  <validation-observer
    v-slot="{handleSubmit, invalid}"
    tag="div"
    data-selector="COMPONENT-ADD-FORM"
    class="knowledge"
  >
    <base-field
      v-model="item.from"
      :name="$t('meta.fromBig')"
      :type="isAdding ? 'date' : 'gray'"
      :mode="isAdding ? '': 'convertDate'"
      data-selector="ADD-FORM-FROM-FIELD"
      :disabled="!isAdding"
      class="knowledge__data"
      :placeholder="$t('meta.fromBig')"
      :rules="`between-date:[${$moment().format('1900/01/01')},${$moment().format('yyyy/MM/DD')}]`"
      :validation-mode="validationMode"
      @blur="$emit('blur')"
    />
    <span class="knowledge__dash">
      -
    </span>
    <base-field
      v-model="item.to"
      :name="$t('meta.toBig')"
      :type="isAdding ? 'date' : 'gray'"
      :mode="isAdding ? '': 'convertDate'"
      data-selector="ADD-FORM-TO-FIELD"
      :disabled="!isAdding"
      class="knowledge__data"
      :placeholder="$t('meta.toBig')"
      :rules="`between-date:[${$moment().format('yyyy/MM/DD')},${$moment().add(10, 'y').format('yyyy/MM/DD')}]`"
      :validation-mode="validationMode"
      @blur="$emit('blur')"
    />
    <base-field
      v-model="item.place"
      :name="$t('settings.education.educationalInstitution')"
      type="grey"
      :disabled="!isAdding"
      data-selector="ADD-FORM-PLACE-FIELD"
      class="knowledge__data knowledge__data_big"
      :placeholder="placeholder"
      :validation-mode="validationMode"
      rules="max:100|min:2"
      @blur="$emit('blur')"
    />
    <base-btn
      class="knowledge__btn"
      :data-selector="`${isAdding} ? ${$t('meta.btns.add')} : ${$t('meta.btns.delete')}`"
      :disabled="!item.from || !item.to || !item.place || invalid"
      @click="$emit('click')"
    >
      {{ isAdding ? $t('meta.btns.add') : $t('meta.btns.delete') }}
    </base-btn>
  </validation-observer>
</template>

<script>
export default {
  name: 'AddForm',
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    validationMode: {
      type: String,
      default: 'aggressive',
    },
    isAdding: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledge {
    display: grid;
    grid-template-columns: 1fr 0fr 1fr 1fr 1fr;
    gap: 20px;
    span {
      margin-top: 10px;
    }
}
@include _991 {
  .knowledge {
    grid-template-columns: 1fr 1fr;
    gap: 0;
    column-gap: 20px;
    margin-bottom: 20px;
    span {
      display: none;
    }
  }
}
@include _575 {
  .knowledge {
    grid-template-columns: 1fr;
    gap: 0;
    margin-bottom: 20px;
  }
}

</style>
