<template>
  <div
    class="ctm-field ctm-field_default"
    :class="[
      {'ctm-field_big': big},
      {'ctm-field_disabled': disabled},
      {'ctm-field_search': isSearch},
    ]"
  >
    <div
      v-if="label !== ''"
      class="ctm-field__header"
    >
      {{ label }}
    </div>
    <div class="ctm-field__body">
      <span
        v-if="isSearch"
        class="icon-Search ctm-field__search"
      />
      <input
        class="ctm-field__input"
        :placeholder="placeholder"
        :value="value"
        :type="type"
        :autocomplete="autocomplete"
        @input="input"
      >
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
      {{ errorText }}
    </div>
  </div>
</template>
<script>
export default {
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
      type: String,
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
  },
  methods: {
    input($event) {
      this.$emit('input', $event.target.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.ctm-field {
  &__right {
    min-height: 100%;
    display: flex;
  }
  &__right-absolute {
    position: absolute;
    right: 12px;
  }
  &__body {
    display: flex;
    align-items: center;
    position: relative;
  }
  &__header {
    letter-spacing: -0.025em;
    margin-bottom: 13px;
    height: 24px;
    color: #fff;
  }
  &__err {
    color: #F82727;
    font-size: 12px;
    min-height: 23px;
  }
  &__search {
    position: absolute;
    left: 13px;
    &:before {
      font-size: 30px;
      background: #F3F7FA;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  &__input {
    height: 60px;
    border-radius: 13px;
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
  &_search {
    .ctm-field__input {
      padding: 0 20px 0 50px;
    }
  }
  &_default {
    .ctm-field__input {
      color: #FFFFFF;
      background: #F3F7FA;
      border-radius: 6px;
      border: 1px solid transparent;
      &::placeholder {
        color: rgba(#FFFFFF, .3);
      }
      &:focus {
        border: 1px solid #0083C7;
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
</style>
