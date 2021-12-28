<template>
  <div class="knowledge">
    <base-field
      v-model="item.from"
      :name="$t('settings.workExps.from')"
      :type="isAdding ? 'date' : 'gray'"
      :mode="isAdding ? '': 'convertDate'"
      :disabled="isAdding ? false : true"
      class="knowledge__data"
      :placeholder="$t('settings.workExps.from')"
      :rules="`required||between-date:${item.from},${item.to}`"
      :validation-mode="validationMode"
      @blur="$emit('blur')"
    />
    <span class="knowledge__dash">
      -
    </span>
    <base-field
      v-model="item.to"
      :name="$t('settings.workExps.to')"
      :type="isAdding ? 'date' : 'gray'"
      :mode="isAdding ? '': 'convertDate'"
      :disabled="isAdding ? false : true"
      class="knowledge__data"
      :placeholder="$t('settings.workExps.to')"
      :rules="`required||between-date:${item.from},${item.to}`"
      :validation-mode="validationMode"
      @blur="$emit('blur')"
    />
    <base-field
      v-model="item.place"
      :name="$t('settings.education.educationalInstitution')"
      type="grey"
      :disabled="isAdding ? false : true"
      class="knowledge__data knowledge__data_big"
      :placeholder="$t('settings.education.educationalInstitution')"
      :validation-mode="validationMode"
      rules="required||max:100"
      @blur="$emit('blur')"
    />
    <base-btn
      class="knowledge__btn"
      @click="$emit('click')"
    >
      {{ isAdding ? $t('settings.add') : $t('settings.delete') }}
    </base-btn>
  </div>
</template>

<script>
export default {
  name: 'AddForm',
  props: {
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
      default: 'passive',
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
