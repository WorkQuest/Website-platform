<template>
  <div class="content">
    <div class="content__qr">
      <qrcode
        v-if="userWalletAddress"
        :value="userWalletAddress"
        :options="{ width: 206 }"
      />
    </div>
    <p class="content__scanQrCode">
      {{ $t('modals.deposit.scanQrCodeWallet') }}
    </p>
    <div class="content__wallet">
      <div class="wallet">
        <span class="wallet__address">{{ CutTxn(userWalletAddress) }}</span>
        <button
          v-clipboard:copy="userWalletAddress"
          v-clipboard:success="showSuccessCopied"
          v-clipboard:error="clipboardErrorHandler"
          type="button"
        >
          <span class="icon-copy wallet__icon" />
        </button>
      </div>
      <base-btn
        class="wallet__share"
        mode="share"
        data-selector="SHOW-SHARE-MODAL"
        @click="showShareModal"
      >
        <span class="icon-share_outline wallet__chain" />
      </base-btn>
    </div>
    <base-btn
      data-selector="CONFIRM"
      @click="CloseModal"
    >
      {{ $t('meta.btns.close') }}
    </base-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'DepositWalletAddress',
  computed: {
    ...mapGetters({
      userWalletAddress: 'user/getUserWalletAddress',
    }),
  },
  methods: {
    clipboardErrorHandler(value) {
      this.$store.dispatch('main/showToast', {
        title: 'Copy error',
        text: value,
      });
    },
    showSuccessCopied() {
      this.ShowModal({
        key: modals.status,
        img: require('assets/img/ui/questAgreed.svg'),
        title: this.$t('wallet.walletCopied'),
      });
    },
    showShareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
        itemId: `${this.$t('modals.deposit.sharingText')} ${this.userWalletAddress}`,
        mode: 'wallet',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &__qr{
    margin: 20px 0;
     border: 1px solid $black0;
     border-radius: 6px;
   }
  &__scanQrCode{
    color: $black500;
    line-height: 130%;
    align-self: flex-start;
  }
  &__wallet{
    margin-top: 10px;
    margin-bottom: 25px;
    align-self: flex-start;
    display: grid;
    grid-template-columns: 82% 18%;
    width: 100%;
  }
}
.wallet{
  display: flex;
  padding: 13px;
  border: 1px solid $black0;
  border-radius: 6px;
  gap: 12px;
  justify-content: space-between;
  &__address{
    @include text-simple;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__share{
      width: 46px!important;
      height: 46px!important;
      border-radius: 6px;
      margin-left: 10px;
  }
  &__share:hover &__chain::before {
    color: $white!important;
  }
  &__chain:before{
    color: $blue;
    font-size: 25px!important;
  }

}
.icon {
  &-copy:before {
    content: "\e996";
    color: $blue;
    font-size: 20px;
  }
}
</style>
