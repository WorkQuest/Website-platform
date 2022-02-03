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
import moment from 'moment';
import Footer from '~/components/app/Footer';
import { MessageAction } from '~/utils/enums';

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
      localUserData: {},
      isInstrumentDropdownOpened: false,
      isUserDDOpened: false,
      isShowProfile: false,
      isShowNotify: false,
      isShowAdditionalMenu: false,
      isShowLocale: false,
      isMobileMenu: false,
      isNotFlexContainer: true,
      notification: 1,
      currentLocale: '',
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userData: 'user/getUserData',
      imageData: 'user/getImageData',
      userRole: 'user/getUserRole',
      token: 'user/accessToken',
      connections: 'data/notificationsConnectionStatus',
      chatId: 'chat/getCurrChatId',
      messagesFilter: 'chat/getMessagesFilter',
      isChatOpened: 'chat/isChatOpened',
      unreadMessagesCount: 'user/getUnreadChatsCount',
      chats: 'chat/getChats',
    }),
    headerLinksWorker() {
      return [
        {
          url: '/quests',
          title: this.$t('ui.quests'),
        },
        {
          url: '/my',
          title: this.$t('ui.myQuests'),
        },
        {
          url: '/wallet',
          title: this.$t('ui.wallet'),
        },
      ];
    },
    headerLinksEmployer() {
      return [
        {
          url: '/workers',
          title: this.$t('ui.jobQuestors'),
        },
        {
          url: '/my',
          title: this.$t('ui.myQuests'),
        },
        {
          url: '/wallet',
          title: this.$t('ui.wallet'),
        },
      ];
    },
    locales() {
      return this.$i18n.locales.map((item) => ({
        localeSrc: `${item}.svg`,
        localeText: this.$t(`ui.locals.${item}`),
      }));
    },
    instrumentDDLinks() {
      return [
        {
          link: '/pension',
          title: this.$t('ui.menu.pension.title'),
        },
        {
          link: '/referral',
          title: this.$t('ui.menu.referral.title'),
        },
        {
          link: '/insuring',
          title: this.$t('ui.menu.p2p.title'),
        },
        {
          link: '/savings',
          title: this.$t('ui.menu.savings.title'),
        },
        {
          link: '/crediting',
          title: this.$t('ui.menu.crediting.title'),
        },
        {
          link: '/mining',
          title: this.$t('ui.menu.mining.title'),
        },
        {
          link: '/crosschain',
          title: this.$t('ui.menu.crosschain.title'),
        },
        {
          link: '/staking',
          title: this.$t('ui.menu.staking.title'),
        },
      ];
    },
    mobileMenuLinks() {
      return [
        {
          path: '/quests',
          title: this.$t('ui.quests'),
        },
        {
          path: '/my',
          title: this.$t('ui.myQuests'),
        },
        {
          path: '/wallet',
          title: this.$t('ui.wallet'),
        },
      ];
    },
    userDDLinks() {
      return [
        {
          link: `/profile/${this.userData.id}`,
          title: this.$t('ui.profile.myProfile'),
        },
        {
          link: '/settings',
          title: this.$t('ui.profile.settings'),
        },
        {
          link: '/disputes',
          title: this.$t('ui.profile.disputes'),
        },
        {
          link: '/',
          title: this.$t('ui.profile.logout'),
        },
      ];
    },
  },
  watch: {
    $route() {
      this.$refs.templateScroll.scrollTop = 0;
      this.closeAll();
    },
  },
  async mounted() {
    await this.initWSListeners();
    this.GetLocation();
    this.localUserData = JSON.parse(JSON.stringify(this.userData));
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
    async initWSListeners() {
      const { chatConnection, notifsConnection } = this.connections;
      if (!chatConnection) {
        await this.$wsChat.connect(this.token);
        this.$wsChat.subscribe('/notifications/chat', async ({ data, action }) => {
          if (this.$route.name === 'messages') {
            if (action === MessageAction.GROUP_CHAT_CREATE) {
              data.isUnread = true;
              data.userMembers = data.userMembers.filter((member) => member.id !== this.userData.id);
              this.$store.commit('chat/addChatToList', data);
              this.$store.commit('user/changeUnreadChatsCount', { needAdd: true, count: 1 });
            } else if (action === MessageAction.NEW_MESSAGE) {
              await this.$store.dispatch('chat/getCurrChatData', data.chatId);
              await this.getStatistic();
            }
            return;
          }

          await this.getStatistic();

          if (data.chatId === this.chatId && !this.messagesFilter.canLoadToBottom) {
            if (action === MessageAction.MESSAGE_READ_BY_RECIPIENT) return;
            this.$store.commit('chat/addMessageToList', data);
            this.$store.commit('chat/setChatAsUnread');

            if (data.type === 'info') {
              const { user } = data.infoMessage;

              if (action === MessageAction.GROUP_CHAT_ADD_USERS) {
                this.$store.commit('chat/addUserToChat', user);
              } else if (action === MessageAction.GROUP_CHAT_DELETE_USER) {
                this.$store.commit('chat/removeUserFromChat', user.id);
              }
            }
          }
        });
      }
    },
    async getStatistic() {
      await this.$store.dispatch('user/getStatistic');
    },
    setLocale(item) {
      this.currentLocale = item.localeText;
      this.$i18n.setLocale(item.localeText);
      moment.locale(item.localeText);
    },
    kitcutDescription(text) {
      text = text.trim();
      if (text.length <= 120) return text;

      text = text.slice(0, 120);

      return `${text.trim()}...`;
    },
    userWindowChange() {
      this.isMobileMenu = false;
      this.isNotFlexContainer = false;
      this.closeAnother('mobile');
    },
    toRoute(path) {
      this.$router.push(path);
      this.toggleMobileMenu();
    },
    toggleUserDD() {
      this.isUserDDOpened = !this.isUserDDOpened;
    },
    toggleInstrumentDD() {
      this.isInstrumentDropdownOpened = !this.isInstrumentDropdownOpened;
    },
    closeMenu() {
      this.isMobileMenu = false;
      this.closeAnother('mobile');
    },
    toggleMobileMenu() {
      this.isMobileMenu = !this.isMobileMenu;
      this.isNotFlexContainer = !this.isNotFlexContainer;
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
    createNewQuest(platform) {
      this.$router.push('/create-quest');
      if (platform === 'mobile') {
        this.toggleMobileMenu();
      }
    },
    goToMessages() {
      this.$router.push('/messages');
      this.closeAll();
    },
    showProfile() {
      this.closeAnother('profile');
      this.isShowProfile = !this.isShowProfile;
    },
    showNotification() {
      this.closeAnother('notify');
      this.isShowNotify = !this.isShowNotify;
    },
    showNotifications() {
      this.$router.push('/notifications');
      this.isShowNotify = !this.isShowNotify;
    },
    showAdditionalMenu() {
      this.closeAnother('instruments');
      this.isShowAdditionalMenu = !this.isShowAdditionalMenu;
    },
    showLocale() {
      this.closeAnother('locale');
      this.isShowLocale = !this.isShowLocale;
    },
    closeAnother(value) {
      switch (value) {
        case 'mobile':
          this.isShowProfile = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          this.isShowAdditionalMenu = false;
          break;
        case 'instruments':
          this.isShowProfile = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          break;
        case 'profile':
          this.isShowAdditionalMenu = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          break;
        case 'locale':
          this.isShowAdditionalMenu = false;
          this.isShowNotify = false;
          this.isShowProfile = false;
          break;
        case 'notify':
          this.isShowAdditionalMenu = false;
          this.isShowProfile = false;
          this.isShowLocale = false;
          break;
        default:
          break;
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      await this.$router.push('/');
    },
    closeAll() {
      this.isShowProfile = false;
      this.isShowNotify = false;
      this.isShowAdditionalMenu = false;
      this.isShowLocale = false;
    },
  },
};
</script>
<style lang="scss" scoped>

.hidden {
  display: none;
}

.mobile {
  &-dropdown {
    border-bottom: 1px solid $black0;

    &__btn {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }

    &__title {
      padding: 16px 0 20px 20px;
    }

    &__arrow {
      justify-self: flex-end;
      padding: 16px 20px 0 0;
    }

    &__container {
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
  }

  &__link {
    padding: 16px 20px 16px 20px;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    border-bottom: 1px solid $black0;
    transition: 1s;
    text-decoration: none;

    &:hover {
      @extend .mobile__link;
      background: $blue;
      color: $white;
      font-weight: 600;
    }
  }
}

.instrument-dropdown {
  &__link {
    @extend .mobile__link;
    display: flex;
    flex-direction: column;
    color: $black600;
    padding: 16px 0 20px 35px;
  }
}

.user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &-dropdown {
    &__link {
      @extend .mobile__link;
      display: flex;
      flex-direction: column;
      background: $black0;
      padding: 16px 0 20px 20px;

      &_logout {
        color: $red;
      }
    }
  }

  &-container {
    &__avatar {
      padding: 15px;
    }

    &__user {
      padding: 15px 0 0 0;
      display: grid;
    }
  }

  &__dropdown {
    align-self: center;
  }

  &__container {
    display: flex;
    flex-direction: row;
    background: $black0;
    max-height: 70px;
    height: 100%;
    max-width: 100%;
    width: 100%;
    padding: 0 20px 0 0;
  }

  &__avatar {
    max-height: 40px;
    max-width: 40px;
    height: 100%;
    width: 100%;
    border-radius: 137px;
  }

  &__name {
    font-weight: 500;
    font-size: 16px;
    color: $black800;
  }

  &__role {
    font-weight: 400;
    font-size: 12px;
    color: $blue;
    padding: 0 0 11px 0;
  }
}

.icon {
  font-size: 20px;

  &-caret_down:before {
    @extend .icon;
    content: "\ea48";
    color: #2e3a59;
  }

  &-caret_up:before {
    @extend .icon;
    content: "\ea4b";
    color: #2e3a59;
  }

  &-close_big:before {
    @extend .icon;
    content: "\e948";
    color: #2e3a59;
  }
}

.ctm {
  &-open {
    display: flex;
    width: 100%;
  }

  &__actions {
    padding: 20px;
  }

  &-menu {
    display: none;
    transition: .2s;

    &_opened {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
      overflow-y: auto;
      background: $white;
      display: flex;
      width: 100%;
      position: fixed;
      top: 73px;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 9999;
    }

    &__content {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      background: $white;
      border-radius: 0 0 5px 5px;

      &_hide {
        width: 0;
      }
    }
  }
}

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

.notify {
  position: absolute;
  top: 57px;
  right: calc(100% - 43px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 441px;
  z-index: 10000000;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    border-bottom: 1px solid #F7F8FA;

    span:before {
      color: $shade700 !important;
      font-size: 24px;
    }
  }

  &__title {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 130%;
    color: $black800;
  }

  &__btn {
    background: #F7F8FA;
    border-radius: 3px;
    height: 44px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    transition: .5s;

    span:before {
      color: #0083C7;
      font-size: 24px;
    }

    &:hover {
      background: #dadade;
    }
  }

  &__action {
    padding-top: 12px;
  }

  &__content {
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  &__reason {
    padding-top: 12px;
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    line-height: 130%;

    &_date {
      font-size: 12px;
      text-align: right;
      color: $black300;
    }

    &_name {
      font-size: 16px;
      color: $black800;
    }

    &_grey {
      font-size: 12px;
      color: $black500;
    }

    &_blue {
      font-size: 16px;
      color: $blue;
      text-align: left;
    }

    &_btn {
      font-size: 16px;
      color: $black800;
    }
  }

  &__items {
    display: grid;
    grid-template-columns: 1fr;
  }

  &__user {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-gap: 10px;
  }

  &__info {
    grid-gap: 5px;
    display: grid;
    text-align: left;
    align-items: center;
  }

  &__avatar {
    max-height: 40px;
    max-width: 40px;
    border-radius: 100%;
  }

  &__top {
    display: flex;
    justify-content: space-between;
  }

  &__item {
    min-height: 167px;
    border-bottom: 1px solid #F7F8FA;
    width: 100%;
    display: flex;
    justify-items: flex-start;
    align-items: center;
  }
}

.profile {
  position: absolute;
  top: 57px;
  right: calc(100% - 43px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 223px;
  width: 100%;
  min-height: 235px;
  z-index: 10000000;

  &__img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__header {
    border-bottom: 1px solid #F7F8FA;
    display: grid;
    grid-template-columns: 40px 1fr;
    padding: 15px;
    grid-gap: 10px;
  }

  &__avatar {
    max-width: 40px;
    max-height: 40px;
    border-radius: 100%;
  }

  &__items {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: flex-start;
  }

  &__item {
    height: 41px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    width: 100%;
    transition: .3s;
    border-radius: 6px;

    &_red {
      color: $red;
    }

    &:hover {
      background: #F7F8FA;
    }
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black800;

    &_blue {
      font-weight: normal;
      font-size: 12px;
      color: $blue;
    }

    &_green {
      font-weight: normal;
      font-size: 12px;
      color: $green;
    }
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px;
    text-align: left;
  }
}

.header {
  position: sticky;
  top: 0;
  z-index: 99999;
  min-height: 72px;
  background: #FFFFFF;
  box-shadow: 0 1px 0 #E6E9EC;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__body {
    max-width: 1180px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__left {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-gap: 35px;
  }

  &__link {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black400;
    text-decoration: none;

    &_active {
      color: $black800;
    }

    &_menu {
      display: flex;
      align-items: center;
      position: relative;

      span::before {
        color: $black400;
        font-size: 24px;
        padding-left: 5px;
      }
    }
  }

  &__button {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    width: 43px;
    height: 43px;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid $black100;
    }

    span:before {
      color: $black400;
      font-size: 24px;
    }

    &_profile {
      position: relative;
    }

    &_menu {
      position: relative;
      display: none;
    }

    &_notify {
      position: relative;
    }

    &_locale {
      width: 86px;
      height: 46px;
    }

    &_locale-name {
      padding-left: 10px;
    }
  }

  &__links {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(4, auto);
    grid-gap: 25px;
  }

  &__right {
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-gap: 10px;
    align-items: center;
  }

  &__btn {
    min-width: 163px;
  }

  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    cursor: pointer;

    span {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: $black700;
    }
  }
}

.menu {
  position: absolute;
  top: 50px;
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 790px;
  width: 100%;
  left: -100%;
  min-height: 230px;
  z-index: 10000000;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    span::before {
      transition: .1s;
      visibility: hidden;
      font-size: 24px;
      color: #2E3A59;
    }
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;

    &_header {
      font-size: 16px;
      line-height: 130%;
      color: $black800;
    }

    &_grey {
      font-size: 14px;
      line-height: 130%;
      color: $black500;
    }
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 20px;
    grid-gap: 10px;
  }

  &__item {
    transition: .3s;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid transparent;
    min-height: 90px;
    display: flex;
    align-items: flex-start;
    text-align: left;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px;

    &:hover {
      border: 1px solid $black100;

      .menu {
        &__top {
          span::before {
            visibility: initial;
          }
        }
      }
    }
  }
}

.locale {
  position: absolute;
  top: 73px;
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  z-index: 10000000;
  padding: 15px 20px;

  &__item {
    width: 46px;
    display: flex;
    align-items: center;
    opacity: 0.7;

    &_active {
      opacity: 1;
    }

    &:hover {
      opacity: 1;
    }
  }

  &__item:not(:last-child) {
    margin-bottom: 15px;
  }

  &__icon {
    display: block;
    margin-right: 10px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
  }
}

.ctm-menu {
  &__toggle {
    display: none;
  }
}

@include _1199 {
  .ctm-menu {
    &__toggle {
      display: flex;
    }
  }
  .header {
    &__button_menu {
      display: flex;
    }

    &__body {
      margin: 0 20px 0 20px;
    }

    &__links {
      display: none;
    }

    &__button {
      &_profile {
        display: none;
      }
    }

    &__btn {
      display: none !important;
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

@include _575 {
  .header {
    &__logo {
      span {
        display: none;
      }
    }

    &__btn {
      display: none !important;
    }

    &__left {
      grid-gap: 15px;
    }

    &__right {
      grid-gap: 2px;
    }
  }
  .notify {
    min-width: 350px;
  }
}

@include _380 {
  .notify {
    min-width: 250px;
  }
}
</style>
