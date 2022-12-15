<template>
  <div
    class="profile-date-form"
    data-selector="COMPONENT-PROFILE-DATE-FORM"
  >
    <ValidationProvider
      ref="education"
      tag="div"
      class="profile-date-form__validation"
    >
      <date-picker
        v-model="item.from"
        valueType="date"
        class="profile-date-form__date-picker"
        input-class="data-picker-field"
        format="DD.MM.YYYY"
        :placeholder="getPlaceholder(item.from)"
        :disabled-date="disabledAfterToday"
        :disabled="action === 'Delete'"
        @select="onSelectStartDate"
      />
      <span class="knowledge__dash">
        -
      </span>
      <date-picker
        v-model="item.to"
        :placeholder="getPlaceholder(item.to)"
        class="profile-date-form__date-picker"
        input-class="data-picker-field"
        format="DD.MM.YYYY"
        valueType="date"
        :disabled-date="disabledBeforeSelectedDateAndAfterToday"
        :disabled="action === 'Delete' || !item.from"
        @select="onSelectEndDate"
      />
      <base-field
        v-model="item.place"
        type="grey"
        rules="max:100|min:2"
        data-selector="ADD-FORM-PLACE-FIELD"
        class="knowledge__data knowledge__data_big"
        :name="name"
        :placeholder="placeholder"
        :disabled="action === 'Delete'"
        @blur="$emit('blur')"
      />
      <base-btn
        class="knowledge__btn"
        :data-selector="`${action === 'Add'} ? ${$t('meta.btns.add')} : ${$t('meta.btns.delete')}`"
        :disabled="!item.from || !item.to || item.place.length <= 1"
        @click="$emit('click', $event)"
        @blur="$emit('blur')"
      >
        {{ action === 'Add' ? $t('meta.btns.add') : $t('meta.btns.delete') }}
      </base-btn>
    </ValidationProvider>
  </div>
</template>

<script>
import 'vue2-datepicker/index.css';
import DatePicker from 'vue2-datepicker';
import { images } from '~/utils/images';
import { getToday, getFormattedDate } from './utils';

export default {
  name: 'ProfileDateForm',
  images,
  components: {
    DatePicker,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },
  methods: {
    getPlaceholder(date) {
      return date ? getFormattedDate(date) : 'dd.mm.yyy';
    },
    onSelectStartDate(date) {
      this.item.from = getFormattedDate(date);
      this.item.to = null;
    },
    onSelectEndDate(date) {
      this.item.to = getFormattedDate(date);
    },
    disabledAfterToday(date) {
      const today = getToday();
      return date > new Date(today);
    },
    disabledBeforeSelectedDateAndAfterToday(date) {
      const selectedDate = new Date(this.item.from);
      selectedDate.setHours(0, 0, 0, 0);
      const today = getToday();
      if (this.type === 'Education') {
        return date < selectedDate;
      }
      return date < selectedDate || date > new Date(today);
    },
  },
};
</script>

<style lang="scss" scoped>
  .profile-date-form {
    width: 100%;
    &__validation {
      display: grid;
      grid-template-columns: 1fr 0fr 1fr 1fr 1fr;
      gap: 20px;
      align-items: baseline;
    }
    &__date-picker {
      width: 100%;
    }
  }
</style>
