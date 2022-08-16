<template>
  <div
    class="primary"
    :class="{'stop-scrolling':isShow}"
  >
    <div class="primary__template template">
      <div
        class="template__content"
        :class="{'template__content_rows' : isChatOpened}"
      >
        <Header class="template__header" />
        <div
          v-show="isShowBluePanel"
          class="blue-panel"
        />
        <div
          class="template__main"
          :class="{'template__main_padding' : isChatOpened, 'template__main_margin': isShowBluePanel, 'template__main_disabled-margin': isDisableMargin}"
        >
          <nuxt />
        </div>
        <Footer
          class="template__footer"
          :is-top-hidden="isChatOpened"
          @clickOnLogo="toMain"
        />
      </div>
    </div>
    <transition name="fade">
      <loader v-if="isLoading" />
    </transition>
    <ctm-modal />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import modals from '~/store/modals/modals';
import {
  DeFiBluePanelPathNames, Path, RouterNames, UserRole,
} from '~/utils/enums';
import localNotifications from '~/plugins/mixins/localNotifications';

export default {
  name: 'DefaultLayout',
  middleware: ['auth', 'locker'],
  directives: {
    ClickOutside,
  },
  mixins: [localNotifications],
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userData: 'user/getUserData',
      isChatOpened: 'chat/isChatOpened',
      isShow: 'modals/getIsShow',
      userWalletAddress: 'user/getUserWalletAddress',
    }),
    isShowBluePanel() { // for DeFi pages
      return DeFiBluePanelPathNames.includes(this.$route.name);
    },
    isDisableMargin() { // content full width
      return [
        RouterNames.QUESTS_ID,
        RouterNames.QUESTS,
        RouterNames.WORKERS,
        RouterNames.PROFILE_ID,
      ].includes(this.$route.name);
    },
  },
  created() {
    this.CheckMnemonic();
  },
  mounted() {
    if (!this.$cookies.get('isWorkQuestsAppShowed') && this.$route.path !== Path.WALLET) {
      this.ShowModal({
        key: modals.downloadApp,
        title: this.$tc('modals.titles.downloadApp'),
        subtitle: this.$t('modals.downOnSmartphone'),
        app: 'isWorkQuestsAppShowed',
      });
    }
    this.GetLocation();
    this.setLocalNotifications();
  },
  methods: {
    toMain() {
      if (this.userData.role === UserRole.WORKER) {
        this.$router.push(Path.QUESTS);
      }
      if (this.userData.role === UserRole.EMPLOYER) {
        this.$router.push(Path.WORKERS);
      }
    },
    CheckMnemonic() {
      const mnemonicInLocalStorage = JSON.parse(localStorage.getItem('wal'));
      const isWalletInMnemonicList = mnemonicInLocalStorage && mnemonicInLocalStorage[this.userWalletAddress];
      if (!this.$cookies.get('socialNetwork')
        && (!isWalletInMnemonicList || !localStorage.getItem('wal'))) {
        this.$cookies.remove('access');
        this.$cookies.remove('refresh');
        this.$cookies.remove('userLogin');
        this.$router.push(Path.SIGN_IN);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.primary {
  height: 100vh;
  background: $black0;
}

.blue-panel {
  @include blue-panel;
}

.template {
  min-height: 100vh;
  background: $black0;

  &__content {
    min-height: 100vh;
  }

  &__main {
    z-index: 1;
    position: relative;
    max-width: 1180px;
    margin: 0 auto 80px auto;
    width: 100%;

    &_padding {
      padding-bottom: 0;
    }

    &_disabled-margin {
      margin: 0 0 20px 0 !important;
      max-width: none;
    }

    &_margin {
      padding-top: 30px !important;
    }
  }
}
.stop-scrolling{
  overflow: hidden;
  height: 100vh;
}

@include _1199 {
  .template__main {
    padding: 0 10px;
    &_disabled-margin {
      padding: 0 !important;
    }
    &_margin {
      padding-top: 30px !important;
    }
  }
}

@include _991 {
  .template__main {
    margin: 0 auto 40px auto;
    &_disabled-margin {
      padding: 0 !important;
    }
    &_margin {
      padding-top: 30px !important;
    }
  }
}
</style>
