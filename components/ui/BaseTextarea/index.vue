<template>
  <ValidationProvider
    v-slot="{errors}"
    data-selector="COMPONENT-BASE-TEXTAREA"
    tag="div"
    class="ctm-field ctm-field_default"
    :rules="rules"
    :name="name"
    :vid="vid"
    mode="aggressive"
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
      <textarea
        id="textarea"
        data-selector="BASE-TEXTAREA-TEXTAREA"
        :value="mode === 'convertDate' ? convertDate(value) : value"
        class="ctm-field__textarea"
        :class="{'ctm-field__textarea_error' : (isHideError || errors[0])}"
        :placeholder="placeholder"
        @input="input"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
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
      v-if="!isHideError || errors[0]"
      class="ctm-field__err"
    >
      {{ errorText || errors[0] }}
    </div>
  </ValidationProvider>
</template>

<script>
import moment from 'moment';

export default {
  name: 'BaseTextarea',
  props: {
    value: {
      type: String,
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
    errorText: {
      type: String,
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
  },
  methods: {
    input($event) {
      this.$emit('input', $event.target.value);
      if (this.selector) {
        this.$emit('selector', $event.target.value);
      }
    },
    convertDate(date) {
      return moment(date).format('DD.MM.YYYY');
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
  &__textarea {
    padding: 10px 20px;
    border-radius: 6px;
    height: 214px;
    width: 100%;
    border: 0;
    color: $black700;
    background: $black0;
    resize: none;
    &_error {
      border: 1px solid $red;
    }
    &::placeholder {
      color: $black300;
    }
    &:focus {
      background: #FFFFFF;
      border: 1px solid #0083C7;
    }
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
  &__input {
    height: 46px;
    border-radius: 6px;
    border: 2px solid transparent;
    padding: 0 20px;
    transition: .3s;
    width: 100%;
  }
  &_disabled {
    .ctm-field__input {
      pointer-events: none;
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
  &_icon {
    .ctm-field {
      &__input {
        padding: 0 20px 0 50px;
      }
    }
  }
}
</style>
