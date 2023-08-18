<template>
  <div
    class="dd-container"
    data-selector="COMPONENT-BASE-DD"
  >
    <div
      v-if="label !== ''"
      :class="[{'ctm-field__header' : !tip}, {'ctm-field__header ctm-field__header_mar5' : tip}]"
    >
      {{ label }}
    </div>
    <div
      v-click-outside="hideDd"
      class="dd"
      :class="[{'dd__top': mode === 'top' }, {'dd_small' : isDotsView}, { 'dd_min-width': type !== 'underline' }]"
    >
      <span
        v-if="tooltip"
        class="dd__tooltip"
      >
        {{ tooltip }}
      </span>
      <slot name="card" />
      <button
        class="dd__btn"
        :class="ddClass"
        :data-selector="`ACTION-BTN-${dataSelector.toUpperCase()}`"
        :disabled="disabled || elementsIsEmpty"
        @click="isShown = !isShown"
      >
        <span class="icon-more_horizontal" />

        <div
          v-if="isIcon"
          class="dd__icon"
        >
          <img
            v-if="items[value].icon"
            :src="items[value].icon"
            :alt="items[value].title"
          >
          <span
            class="dd__title"
            :class="[{'dd__title_white': type === 'blue' }, { 'dd__title_black': mode === 'blackFont' }]"
          >
            {{ dataType === 'array' ? items[value].title : items.title }}
          </span>
        </div>

        <span
          v-else-if="items[value]"
          class="dd__title"
          :data-selector="`BASE-DD-${dataSelector.toUpperCase()}-${items[value]}`"
          :class="[{'dd__title_white': type === 'blue' }, { 'dd__title_black': mode === 'blackFont' }, { 'dd__full-text': isShown }]"
        >
          {{ dataType === 'array' ? items[value] : items[value].title }}
        </span>
        <span
          v-else-if="!items[value] && placeholder"
          class="dd__title"
          :class="[{'dd__title_white': type === 'blue' }, { 'dd__title_black': mode === 'blackFont' }, { 'dd__full-text': isShown }]"
        >
          {{ placeholder }}
        </span>
        <span
          v-if="type === 'sort'"
          class="dd__caret dd__caret_dark icon-Sorting_descending"
          :class="[{'dd__caret_white': type === 'blue' }]"
        />
        <span
          v-else
          :class="[{'dd__caret_white': type === 'blue' }, isShown ? 'icon-caret_up' :'icon-caret_down', 'dd__caret' ]"
        />
      </button>
      <transition name="fade">
        <div
          v-if="isShown && isIcon"
          class="dd__items"
          :class="[{'dd__items_small' : mode === 'small'}, { 'dd__items_underline-type': type === 'underline' }]"
        >
          <button
            v-for="(item, i) in items"
            :key="`dd__item-${i}`"
            :data-selector="`ACTION-BTN-SELECT-ITEM-${dataSelector.toUpperCase()}-${i}`"
            :disabled="disabledIndexes.includes(i)"
            class="dd__item dd__item_icon"
            :class="{dd__item_disabled: disabledIndexes.includes(i)}"
            @click="selectItem(i)"
          >
            <img
              v-if="item.icon"
              :src="item.icon"
              :alt="item.title"
            >
            {{ item.title }}
            <slot name="picture" />
          </button>
        </div>
        <div
          v-if="isShown && !isIcon"
          class="dd__items"
          :class="[{'dd__items_small' : mode === 'small'}, {'dd__items_wide' : isDotsView}, { 'dd__items_underline-type': type === 'underline' } ]"
        >
          <base-field
            v-if="isSearch"
            v-model="searchLine"
            class="dd__search"
            data-selector="INPUT-SEARCH"
            :placeholder="searchPlaceholder"
            :is-search="true"
            :is-hide-error="true"
          />
          <button
            v-for="(item, i) in items"
            :key="`dd__item-${i}`"
            class="dd__item"
            :data-selector="`ACTION-BTN-SELECT-ITEM-${dataSelector.toUpperCase()}-${i}`"
            :class="{'dd__item_hide': isSelected(i) || (isSearch && !isSearchMatched(item))}"
            @click="selectItem(i)"
          >
            {{ dataType === 'array' ? item : item.title }}
          </button>
          <slot name="buttonCard" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  name: 'Dd',
  directives: {
    ClickOutside,
  },
  props: {
    dataType: {
      type: String,
      default: () => 'array',
    },
    disabledIndexes: {
      type: Array,
      default: () => [],
    },
    items: {
      type: [Array, Object],
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: [String, Number],
      default: '',
    },
    tip: {
      type: String,
      default: '',
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    type: {
      type: String,
      default: 'default',
    },
    isIcon: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hideSelected: {
      type: Array,
      default: () => [],
    },
    isDotsView: {
      type: Boolean,
      default: false,
    },
    dataSelector: {
      type: String,
      default: 'NON-SELECTOR',
      required: true,
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    isShown: false,
    searchLine: '',
  }),
  computed: {
    elementsIsEmpty() {
      return this.items.length - this.hideSelected.length <= 0;
    },
    ddClass() {
      const { type, isDotsView } = this;
      return [
        { dd__btn_dark: type === 'dark' },
        { dd__btn_disabled: type === 'disabled' || this.elementsIsEmpty },
        { dd__btn_gray: type === 'gray' },
        { dd__btn_blue: type === 'blue' },
        { dd__btn_border: type === 'border' },
        { dd__btn_underline: type === 'underline' },
        { 'dd__dots-btn': isDotsView },
      ];
    },
  },
  methods: {
    hideDd() {
      this.isShown = false;
    },
    selectItem(i) {
      if (this.hideSelected.includes(i) || this.disabledIndexes.includes(i)) return;
      this.isShown = false;
      this.$emit('input', i);
    },
    isSelected(i) {
      return this.hideSelected.includes(i);
    },
    isSearchMatched(item) {
      if (this.dataType === 'object') return item.title.toLowerCase().includes(this.searchLine.toLowerCase());
      return item.toLowerCase().includes(this.searchLine.toLowerCase());
    },
  },
};
</script>

<style scoped lang="scss">
.dd-container {
  position: relative;
}
.ctm-field__header {
  letter-spacing: -0.025em;
  margin-bottom: 13px;
  height: 24px;
  color: #212529;
}
.dd {
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 130%;
  color: $black500;
  text-align: left;

  &__tooltip {
    visibility: hidden;
    width: 100%;
    background-color: rgba(124, 131, 141, 1);
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    position: absolute;
    top: 0;
    z-index: 1;
    font-size: 14px;

    &::after {
      content: " ";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: rgba(124, 131, 141, 1) transparent transparent transparent;
    }
  }

  &:hover .dd__tooltip {
    visibility: visible;
  }

  &_min-width {
    min-width: 131px;
  }

  &_small {
  min-width: unset;
  }

  &__title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: $black500;
    &_white {
      color: $white;
    }
    &_black {
      color: $black800 !important;
    }
  }
  &__full-text {
    padding: 13px 0;
    overflow: visible;
    white-space: normal;
  }
  &__top {
    align-items: flex-start;
  }
  &__items {
    @include box;
    width: 100%;
    flex-basis: 100%;
    position: absolute;
    background: #FFFFFF;
    top: calc(100% + 4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 15px;
    padding: 15px 20px;
    z-index: 4;

    &_underline-type {
      width: fit-content;
      min-width: fit-content;
      right: 0;
    }

    &_small {
      max-height: 200px;
      grid-gap: 10px;
      overflow-y: auto;
      overscroll-behavior-y: contain;
    }

    &_wide {
      min-width: 131px;
      right: 30px;
      top: 15px;
    }
  }
  &__item {
    text-align: left;
    flex-basis: 100%;
    width: 100%;
    height: 100%;
    color: $black500;
    &:hover {
      color: $black800;
    }
    &_disabled {
      cursor: default;
      color: $black300;
      &:hover {
        color: $black300;
      }
    }
    &_icon {
      display: flex;
      align-items: center;
      img {
        margin-right: 5px;
        height: 24px;
        width: 24px;
      }
    }
    &_hide {
      display: none;
    }
  }
  &__icon {
    display: flex;
    align-items: center;
    img {
      height: 24px;
      width: 24px;
      margin-right: 5px;
    }
    span {
      margin-right: 5px;
    }
  }
  &__caret {
    &::before {
      padding-left: 10px;
      color: $blue;
      font-size: 24px;
    }
    &_dark::before {
      color: $black700;
    }
    &_white::before {
      color: $white;
    }
  }
  &__btn {
    height: auto;
    min-height: 46px;
    display: grid;
    grid-template-columns: 1fr 34px;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid $black100;
    }
    &_blue {
      background-color: $blue;
    }
    &_dark {
      background: #151552;
    }
    &_gray {
      background-color: $black0;
    }
    &_disabled {
      background-color: #E6E6E7;
    }
    &_border {
      border: 1px solid $black0;
    }
    &_underline {
      border: none;
      background: none;
      min-height: 26px;
      padding-right: 0;
      padding-left: 0;
      margin-top: 5px;

      .dd__title {
        border-bottom: 1px solid $blue !important;
        color: $blue !important;
      }

      &:hover {
        border: none;
      }
    }
  }

  .icon-more_horizontal {
    display: none;
  }

  &__dots-btn {
    display: flex;
    justify-self: flex-end;
    justify-content: center;
    padding: 0;
    width: 30px;
    height: 30px;

    .dd__title,
    .dd__caret {
      display: none;
    }

    .icon-more_horizontal {
      display: block;
      color: #7c838d;
      font-size: 19px;
    }
  }
  &__search {
    width: 100%;
  }
}
</style>
