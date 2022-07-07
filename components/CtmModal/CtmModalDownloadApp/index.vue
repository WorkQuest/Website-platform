<template>
  <ctm-modal-box
    class="ctm-modal-download"
    :class="checkIfMobile()? 'ctm-modal-download-mobile':'ctm-modal-download-desktop'"
    :title="options.title"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__desc">
        {{ checkIfMobile() ? options.subtitle: $t('modals.scanQrCode') }}
      </div>
      <div
        v-if="checkIfMobile()"
        class="links"
      >
        <div class="links__big">
          <a
            v-for="item in marketLinks"
            :key="item.key"
            :class="`links__store links__store_${item.key}`"
            :href="item.href"
          />
        </div>
      </div>
      <div
        v-else-if="options.title === this.$tc('modals.titles.downloadApp')"
        class="qrCode app"
      />
      <div
        v-else
        class="qrCode wallet"
      />
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { URLS } from '~/utils/сonstants/footer';

export default {
  name: 'CtmModalDownloadApp',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    marketLinks() {
      if (this.options.app === 'quests') return this.marketLinksQuest;
      return this.marketLinksWallet;
    },
    marketLinksWallet() {
      return [
        { key: 'app-store', href: URLS.STORES.APP_STORE },
        { key: 'play-market', href: URLS.STORES.PLAY_MARKET },
      ];
    },
    marketLinksQuest() {
      return [
        { key: 'app-store', href: URLS.STORES.APP_STORE },
        { key: 'play-market', href: URLS.STORES.PLAY_MARKET },
      ];
    },
  },
  mounted() {
    this.$cookies.set(this.options.app, true);
  },

};
</script>

<style lang="scss" scoped>
.ctm-modal-download {
  &-mobile {
    max-width: 343px !important;
  }
  &-desktop{
    max-width: 382px !important;
  }
  &::v-deep{
    .ctm-modal__content{
      padding-top: 10px;
    }
    .ctm-modal__title{
      margin: 0 auto;
    }
    .ctm-modal__desc{
      color: $black600;
      font-weight: 400;
    }
  }
}
.links{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  gap: 10px;
  &__big {
    display: flex;
    grid-gap: 10px;
  }
  &__store {
    width: 151px;
    height: 56px;
    &_app-store {
      background-size: 100% 100%;
      background-image: url('/img/app/app_store_button.svg');
    }
    &_play-market {
      background-size: 100% 100%;
      background-image: url('/img/app/play_market_button.svg');
    }
  }
}
.qrCode {
  width: 180px;
  height: 180px;
  margin: 25px auto 0;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid $black200;
  background-position: center;
  background-size: 150px 150px;
  background-repeat: no-repeat;
  z-index: 100;
  &.app {
    background-image: url('../../../assets/img/app/qrCodeApp.png');
  }
  &.wallet {
    background-image: url('../../../assets/img/app/qrCodeWallet.png');
  }
}
</style>
