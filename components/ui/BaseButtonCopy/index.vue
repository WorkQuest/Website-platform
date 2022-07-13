<template>
  <button
    v-clipboard:copy="copyValue"
    v-clipboard:success="ClipboardSuccessHandler"
    v-clipboard:error="ClipboardErrorHandler"
    data-selector="COPY-BTN"
    type="button"
    :class="classByMode"
  >
    <span
      class="icon-copy"
    />
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
    mode: {
      type: String,
      default: '',
    },
  },
  computed: {
    classByMode() {
      switch (this.mode) {
        case 'twoFA':
          return 'two-auth';
        case 'wallet':
          return 'wallet';
        default: {
          return '';
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-copy {
  font-size: 24px;
  color: $blue;
}

.two-auth {
  background: $white;
  border: 1px solid $black0;
  padding: 11px;
  border-radius: 6px;
}

.wallet {
  margin-left: 22px;
}
</style>
