<template>
  <ValidationProvider
    v-slot="{errors}"
    data-selector="COMPONENT-BASE-INPUT"
    tag="div"
    class="ctm-field ctm-field_default"
    :class="[
      {'ctm-field_big': big},
      {'ctm-field_disabled': disabled},
      {'ctm-field_search': isSearch},
      {'ctm-field_icon': mode === 'icon'},
      {'ctm-field_smallError': mode === 'smallError'},
      {'ctm-field_white': mode === 'white'},
      {'ctm-field_chat': mode === 'chat'},
    ]"
    :rules="rules"
    :name="name"
    :vid="vid"
    :mode="validationMode"
    slim
  >
    <div
      v-if="label !== ''"
      :class="[{'ctm-field__header' : !tip}, {'ctm-field__header ctm-field__header_mar5' : tip}]"
    >
      {{ label }}
    </div>
    <div
      v-if="tip"
      class="ctm-field__header ctm-field__header_sub"
    >
      {{ tip }}
    </div>
    <div class="ctm-field__body">
      <span
        v-if="isSearch"
        class="icon-search ctm-field__search"
      />
      <div class="ctm-field__left">
        <slot name="left" />
      </div>
      <input
        ref="input"
        :step="step"
        class="ctm-field__input"
        :class="[{'ctm-field__input_error': errors[0]},
                 {'ctm-field__input_padding-r' : $slots['right-absolute'] || (value && isSearch && !isBusySearch)}]"
        :placeholder="placeholder"
        :data-selector="`BASE-INPUT-FIELD-${dataSelector.toUpperCase()}`"
        :value="mode === 'convertDate' ? convertDate(value) : value"
        :type="customType"
        :autocomplete="autocomplete"
        :disabled="disabled"
        @input="input"
        @keyup.enter="enter"
        @keypress.enter="onEnterPress"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      >
      <div
        v-if="value && isSearch && !isBusySearch"
        class="ctm-field__clear"
        :data-selector="`ACTION-BTN-CLEAR-${dataSelector.toUpperCase()}`"
        @click="clear()"
      >
        <span class="icon-close_small" />
      </div>
      <div class="ctm-field__selector">
        <slot name="selector" />
      </div>
      <div class="ctm-field__right">
        <slot name="right" />
      </div>
      <div class="ctm-field__right-absolute">
        <slot name="right-absolute" />
      </div>
    </div>
    <div
      v-if="!isHideError"
      class="ctm-field__err"
    >
      {{ errors[0] }}
    </div>
  </ValidationProvider>
</template>
<script>

export default {
  props: {
    autoFocus: {
      type: Boolean,
      default: () => false,
    },
    step: {
      type: String,
      default: 'any',
    },
    onEnterPress: {
      type: Function,
      default: () => {},
    },
    value: {
      type: [String, Number],
      default: '',
    },
    mode: {
      type: String,
      default: '',
    },
    big: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isHideError: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
    isBusySearch: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'on',
    },
    rules: {
      type: [String, Array, Object],
      description: 'Vee validate validation rules',
      default: '',
    },
    name: {
      type: String,
      description: 'Input name (used for validation)',
      default: '',
    },
    vid: {
      type: String,
      default: '',
    },
    selector: {
      type: Boolean,
      default: false,
    },
    validationMode: {
      type: String,
      default: 'aggressive',
    },
    dataSelector: {
      type: String,
      default: 'NON_SELECTOR',
      required: true,
    },
  },
  computed: {
    customType() {
      return this.type === 'number' ? 'customNumber' : this.type;
    },
  },
  methods: {
    focus() {
      if (this.autoFocus) this.$refs.input.focus();
    },
    enter(e) {
      this.$emit('enter', e.target.value);
    },
    input(e) {
      const selStart = this.$refs.input.selectionStart;
      if (this.customType === 'customNumber') {
        let val = e.target.value.toString().replace(/,/g, '.').replace(/[^0-9.]/g, '');

        const dotIndex = val.indexOf('.');
        const dotIndexLast = val.lastIndexOf('.');
        if (dotIndex !== dotIndexLast) {
          const len = val.length;
          val = val.substr(0, dotIndex + 1) + val.substr(dotIndex + 1, len).replace(/[.]/g, '');
        }

        if (val[0] === '.') val = `${0}${val}`;
        while (val.startsWith('0') && val.length > 1 && !(val.startsWith('0,') || val.startsWith('0.'))) {
          val = val.substr(1, val.length);
        }
        e.target.value = val;
      }
      this.$emit('input', e.target.value);
      this.$refs.input.selectionStart = selStart;
      this.$refs.input.selectionEnd = selStart;

      if (this.selector) {
        this.$emit('selector', e.target.value);
      }
    },
    clear() {
      this.$emit('input', '');
      this.$emit('clear', event);
    },
    convertDate(date) {
      return this.$moment(date).format('DD.MM.YYYY');
    },
  },
};
</script>
<style lang="scss" scoped>
.ctm-field {
  &__selector {
    position: absolute;
    width: 100%;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    z-index: 120;
  }
  &__right {
    min-height: 100%;
    display: flex;
  }
  &__clear {
    position: absolute;
    right: 20px;
    padding-top: 6px;
    cursor: pointer;
    span::before {
      color: $blue;
      font-size: 24px;
    }
  }
  &__right-absolute {
    position: absolute;
    right: 12px;
  }
  &__left {
    position: absolute;
    left: 12px;
    padding-left: 5px;
  }
  &__body {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
  }
  &__header {
    letter-spacing: -0.025em;
    margin-bottom: 13px;
    height: 24px;
    color: #212529;

    &_mar5 {
      margin-bottom: 5px;
      height: unset;
    }

    &_sub {
      margin-bottom: 5px;
      color: #7C838D !important;
      font-weight: 400;
      font-size: 16px;
      height: unset;
    }
  }
  &__err {
    color: $errorText;
    font-size: 12px;
    min-height: 23px;
  }
  &__search {
    position: absolute;
    left: 13px;
    &:before {
      font-size: 24px;
      background: #0083C7;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  &__input {
    height: 46px;
    border-radius: 6px;
    border: 2px solid transparent;
    padding: 0 10px 0 10px;
    transition: width .3s;
    width: 100%;
    &_error {
      border: 1px solid red !important
    }
    &_padding-r {
      padding-right: 50px !important;
    }
  }
  &_disabled {
    .ctm-field__input {
      pointer-events: none;
    }
  }
  &_search {
    .ctm-field__input {
      padding: 0 20px 0 50px;
      background: transparent !important;
      &:hover {
        border: 1px solid #E6EAEE !important;
      }
      &:focus {
        border: 1px solid #E6EAEE !important;
      }
    }
  }
  &_default {
    .ctm-field__input {
      color: $black700;
      background: $black0;
      border-radius: 6px;
      border: 1px solid transparent;
      &::placeholder {
        color: $black300;
      }
      &:focus {
        background: #FFFFFF;
        border: 1px solid #0083C7;
      }
    }
  }
  &_white {
    .ctm-field__input {
      color: $black700;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px solid $black0;
      &::placeholder {
        color: $black300;
      }
      &:focus {
        background: #FFFFFF;
        border: 1px solid #0083C7;
      }
    }
  }
  &_chat {
    .ctm-field__input {
      height: 40px;
      background: $black0;
    }
  }
  &_icon {
    .ctm-field {
      &__input {
        padding: 0 20px 0 50px;
      }
    }
  }
  &_big {
    .ctm-field {
      &__input {
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 25px;
        height: 84px;
      }
    }
  }
}
@include _480 {
  .ctm-field {
    &__input {
      padding: 0 40px 0 10px;
      &::placeholder {
        font-size: 14px;
      }
    }
  }
}
@include _350 {
  .ctm-field {
    &__input {
      &::placeholder {
        font-size: 12px;
      }
    }
  }
}
</style>
