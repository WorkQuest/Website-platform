<template>
  <div
    ref="templateScroll"
    class="primary"
  >
    <div class="primary__template template">
      <div
        class="template__content"
        :class="{'template__content_rows' : isChatOpened}"
      >
        <Header />
        <div
          class="template__main"
          :class="{'template__main_padding' : isChatOpened}"
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
import Footer from '~/components/app/Footer';

export default {
  scrollToTop: true,
  name: 'DefaultLayout',
  middleware: 'auth',
  components: { Footer },
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isShowProfile: false,

      isShowAdditionalMenu: false,
      isShowLocale: false,
      isMobileMenu: false,
      isNotFlexContainer: true,
      currentLocale: '',
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userData: 'user/getUserData',
      token: 'user/accessToken',
      connections: 'data/notificationsConnectionStatus',
      chatId: 'chat/getCurrChatId',
      messagesFilter: 'chat/getMessagesFilter',
      isChatOpened: 'chat/isChatOpened',
    }),
  },
  watch: {
    $route() {
      this.$refs.templateScroll.scrollTop = 0;
      this.closeAll();
    },
  },
  async mounted() {
    this.currentLocale = this.$i18n.localeProperties.code;
  },
  created() {
    window.addEventListener('resize', this.userWindowChange);
  },
  destroyed() {
    window.removeEventListener('resize', this.userWindowChange);
    this.$wsChat.disconnect();
  },
  methods: {
    async getStatistic() {
      await this.$store.dispatch('user/getStatistic');
    },
    userWindowChange() {
      this.isMobileMenu = false;
      this.isNotFlexContainer = false;
      this.closeAnother('mobile');
    },
    toMain() {
      if (this.userData.role === 'worker') {
        this.$router.push('/quests');
      }
      if (this.userData.role === 'employer') {
        this.$router.push('/workers');
      }
    },
    closeAnother(value) {
      switch (value) {
        case 'mobile':
          this.isShowProfile = false;
          this.isShowLocale = false;
          this.isShowAdditionalMenu = false;
          break;
        case 'instruments':
          this.isShowProfile = false;
          this.isShowLocale = false;
          break;
        case 'profile':
          this.isShowAdditionalMenu = false;
          this.isShowLocale = false;
          break;
        case 'locale':
          this.isShowAdditionalMenu = false;
          this.isShowProfile = false;
          break;
        default:
          break;
      }
    },
    closeAll() {
      this.isShowProfile = false;
      this.isShowAdditionalMenu = false;
      this.isShowLocale = false;
    },
  },
};
</script>
<style lang="scss" scoped>

.primary {
  height: 100vh;
  overflow-y: auto;
  background: #F7F8FA;
}

.template {
  min-height: 100vh;
  background: #F7F8FA;

  &__content {
    display: grid;
    grid-template-rows: 72px 1fr auto;
    min-height: 100vh;

    &_rows {
      grid-template-rows: 72px 1fr 72px;
    }
  }

  &__main {
    display: grid;
    padding-bottom: 80px;
    transition: 1s;
    width: 100%;

    &_padding {
      padding-bottom: 0;
    }
  }
}

@include _991 {
  .template {
    &__content {
      grid-template-rows: 72px 1fr auto;
    }
  }
}
</style>
