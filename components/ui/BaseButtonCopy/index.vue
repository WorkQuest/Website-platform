<template>
  <button
    v-clipboard:copy="copyValue"
    v-clipboard:success="isShowToastSuccess ? () => ShowToast($t('modals.textCopy'), $t('createWallet.secretPhrase')) : ClipboardSuccessHandler"
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
    isShowToastSuccess: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classByMode() {
      if (this.mode === 'twoFA') return 'two-auth';
      return this.mode || '';
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

.reward {
  & .icon-copy {
    font-size: 15px;
  }
}

.mnemonic {
  & .icon-copy:hover::before {
    color: $blue;
  }
}
</style>
