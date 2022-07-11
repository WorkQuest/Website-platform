<template>
  <button
    v-clipboard:copy="copyValue"
    v-clipboard:success="ClipboardSuccessHandler"
    v-clipboard:error="ClipboardErrorHandler"
    data-selector="COPY-BTN"
    type="button"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Copy',
  props: {
    copyValue: {
      type: String,
      default: '',
    },
  },
};
</script>
