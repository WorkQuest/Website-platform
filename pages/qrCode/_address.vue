<template>
  <div class="container">
    <div class="header">
      <div
        class="header__logo"
        @click="toMain()"
      >
        <img
          src="~assets/img/app/logo.svg"
          alt="WorkQuest"
        >
        <span class="header__text">WorkQuest</span>
      </div>
    </div>
    <div class="qrCodeCard">
      <h1>{{ $t('qrCodePage.pageTitle') }}</h1>
      <p>{{ $t('qrCodePage.subText') }}</p>
      <qrcode
        v-if="$route.query.address"
        :value="$route.query.address"
        :options="{ width: 300 }"
      />
      <div class="wallet">
        <span class="wallet__address">{{ CutTxn($route.query.address) }}</span>
        <button
          v-clipboard:copy="$route.query.address"
          v-clipboard:success="showSuccessCopied"
          v-clipboard:error="clipboardErrorHandler"
          type="button"
        >
          <span class="icon-copy" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Path } from '~/utils/enums';

export default {
  layout: 'empty',
  methods: {
    toMain() {
      this.$router.push(Path.SIGN_IN);
    },
    clipboardErrorHandler(value) {
      this.$store.dispatch('main/showToast', {
        title: 'Copy error',
        text: value,
      });
    },
    showSuccessCopied() {
      this.$bvToast.toast(String(this.$t('modals.deposit.walletCopied')), {
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-right',
        appendToast: true,
        toastClass: 'custom-toast-width',
        bodyClass: 'custom-toast-width',
      });
    },
  },
  head() {
    return {
      title: this.$t('qrCodePage.pageTitle'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('qrCodePage.subText'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin-top: 25px;
  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    cursor: pointer;
    span {
      @include text-simple;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: $black700;
    }
  }
}
.qrCodeCard {
  height: 100%;
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px 10px;
}
.wallet{
  max-width: 350px;
  display: flex;
  padding: 13px;
  background: $black0;
  border: 1px solid $black100;
  border-radius: 6px;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  &__address{
   @include text-simple;
 }
}
.icon-copy {
  color: $blue;
}
</style>
