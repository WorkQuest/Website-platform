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
        <span class="wallet__address">{{ CutTxn(convertedAddress) }}</span>
        <button
          v-clipboard:copy="convertedAddress"
          v-clipboard:success="showSuccessCopied"
          v-clipboard:error="clipboardErrorHandler"
          type="button"
        >
          <span class="icon-copy wallet__icon" />
        </button>
      </div>
      <sharing-btn
        class="wallet__sharing"
        :url="urlToShare"
      />
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
import { Chains, Path } from '~/utils/enums';
import SharingBtn from '~/components/ui/SharingBtn';

export default {
  name: 'DepositWalletAddress',
  components: { SharingBtn },
  computed: {
    ...mapGetters({
      userWalletAddress: 'user/getUserWalletAddress',
      selectedNetwork: 'wallet/getSelectedNetwork',
    }),
    convertedAddress() {
      if (this.selectedNetwork === Chains.WORKNET) return this.convertToBech32('wq', this.userWalletAddress);
      return this.userWalletAddress;
    },
    urlToShare() {
      return `${window.location.origin}${Path.QRCODE}?address=${this.convertedAddress}`;
    },

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
        title: this.$t('modals.deposit.walletCopied'),
      });
    },
    showShareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
        itemId: `${this.$t('modals.deposit.sharingText')} ${this.convertedAddress}`,
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
    grid-template-columns: auto 46px;
    gap: 10px;
    width: 100%;
  }
}
.wallet{
  display: flex;
  height: 46px;
  padding: 13px;
  border: 1px solid $black0;
  border-radius: 6px;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
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
}
.icon {
  &-copy:before {
    color: $blue;
    font-size: 20px;
  }
}
</style>
