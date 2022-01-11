<template>
  <div
    ref="templateScroll"
    class="primary"
  >
    <div
      class="primary__template template"
    >
      <div
        class="template__content"
        :class="{'template__content_rows' : isChatOpened}"
      >
        <div
          v-click-outside="closeAll"
          class="template__header header"
        >
          <div class="header__body">
            <div class="header__left">
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
              <div
                v-if="userRole === 'employer'"
                class="header__links"
              >
                <nuxt-link
                  v-for="(item, i) in headerLinksEmployer"
                  :key="i"
                  :to="item.url"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  {{ item.title }}
                </nuxt-link>
                <button
                  class="header__link header__link_menu"
                  :class="{'header__link_active': isShowAdditionalMenu}"
                  @click="showAdditionalMenu()"
                >
                  {{ $t('ui.profile.DeFi') }}
                  <span class="icon-caret_down" />
                  <transition name="fade">
                    <div
                      v-if="isShowAdditionalMenu"
                      class="menu"
                    >
                      <div class="menu__items">
                        <n-link
                          v-for="(item,i) in additionalMenuLinks"
                          :key="`item-${i}`"
                          :to="item.path"
                          tag="div"
                          class="menu__item"
                        >
                          <div class="menu__top">
                            <div class="menu__text menu__text_header">
                              {{ item.title }}
                            </div>
                            <span class="icon-chevron_right" />
                          </div>
                          <div class="menu__bottom">
                            <div class="menu__text menu__text_grey">
                              <span>
                                {{ kitcutDescription(item.desc) }}
                              </span>
                            </div>
                          </div>
                        </n-link>
                      </div>
                    </div>
                  </transition>
                </button>
              </div>
              <div
                v-if="userRole === 'worker'"
                class="header__links"
              >
                <nuxt-link
                  v-for="(item, i) in headerLinksWorker"
                  :key="i"
                  :to="item.url"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  {{ item.title }}
                </nuxt-link>
                <button
                  class="header__link header__link_menu"
                  :class="{'header__link_active': isShowAdditionalMenu}"
                  @click="showAdditionalMenu()"
                >
                  {{ $t('ui.profile.DeFi') }}
                  <span class="icon-caret_down" />
                  <transition name="fade">
                    <div
                      v-if="isShowAdditionalMenu"
                      class="menu"
                    >
                      <div class="menu__items">
                        <n-link
                          v-for="item in additionalMenuLinks"
                          :key="`item-${item.title}`"
                          :to="item.path"
                          tag="div"
                          class="menu__item"
                        >
                          <div class="menu__top">
                            <div class="menu__text menu__text_header">
                              {{ item.title }}
                            </div>
                            <span class="icon-chevron_right" />
                          </div>
                          <div class="menu__bottom">
                            <div class="menu__text menu__text_grey">
                              <span>
                                {{ kitcutDescription(item.desc) }}
                              </span>
                            </div>
                          </div>
                        </n-link>
                      </div>
                    </div>
                  </transition>
                </button>
              </div>
            </div>
            <div class="header__right">
              <button
                class="header__button header__button_locale"
                @click="showLocale()"
              >
                <span
                  v-if="currentLocale"
                  class="header__button_locale-name"
                >
                  {{ currentLocale.toUpperCase() }}
                </span>
                <span v-else>
                  {{ $t('ui.locals.en').toUpperCase() }}
                </span>
                <span class="icon-caret_down" />
                <transition name="fade">
                  <ul
                    v-if="isShowLocale"
                    class="locale"
                  >
                    <li
                      v-for="item in locales"
                      :key="item.localeText"
                      class="locale__item"
                      :class="[{'locale__item_active' : currentLocale === item.localeText}]"
                      @click="setLocale(item)"
                    >
                      <img
                        :src="require(`assets/img/lang/${item.localeSrc}`)"
                        :alt="item.localeText"
                        class="locale__icon"
                      >
                      <span class="locale__text">
                        {{ item.localeText.toUpperCase() }}
                      </span>
                    </li>
                  </ul>
                </transition>
              </button>
              <button
                class="header__button"
                @click="goToMessages()"
              >
                <img
                  v-if="hasUnreadMessage"
                  src="~assets/img/ui/message_unread.svg"
                >
                <span
                  v-else
                  class="icon-message"
                />
              </button>
              <button class="header__button header__button_notify">
                <span
                  v-if="notification"
                  class="icon-notification_outline_dot"
                  @click="showNotification()"
                />
                <span
                  v-else
                  class="icon-notification_outline"
                />
                <transition name="fade">
                  <div
                    v-if="isShowNotify"
                    class="notify"
                  >
                    <div class="notify__header">
                      <div class="notify__title">
                        {{ $t('ui.notifications.title') }}
                      </div>
                      <span
                        class="icon-close_small"
                        @click="showNotification()"
                      />
                    </div>
                    <div class="notify__body">
                      <div class="notify__items">
                        <div class="notify__item">
                          <div class="notify__content">
                            <div class="notify__top">
                              <div class="notify__user">
                                <div class="notify__avatar">
                                  <img
                                    src="~assets/img/app/fakeavatar.svg"
                                    alt=""
                                  >
                                </div>
                                <div class="notify__info">
                                  <div class="notify__text notify__text_name">
                                    Edward Cooper
                                  </div>
                                  <div class="notify__text notify__text_grey">
                                    CEO from Amazon
                                  </div>
                                </div>
                              </div>
                              <div class="notify__text notify__text_date">
                                14 January 2021, 14:54
                              </div>
                            </div>
                            <div class="notify__reason">
                              <div class="notify__text notify__text_blue">
                                {{ $t('ui.notifications.invite') }}:
                              </div>
                            </div>
                            <div class="notify__action">
                              <button
                                class="notify__btn"
                                @click="showNotifications"
                              >
                                <span class="notify__text notify__text_btn">
                                  Paint the garage quickly
                                </span>
                                <span class="icon-chevron_right" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class="notify__item">
                          <div class="notify__content">
                            <div class="notify__top">
                              <div class="notify__user">
                                <div class="notify__avatar">
                                  <img
                                    src="~assets/img/app/fakeavatar.svg"
                                    alt=""
                                  >
                                </div>
                                <div class="notify__info">
                                  <div class="notify__text notify__text_name">
                                    Samantha Sparks
                                  </div>
                                </div>
                              </div>
                              <div class="notify__text notify__text_date">
                                14 January 2021, 14:54
                              </div>
                            </div>
                            <div class="notify__reason">
                              <div class="notify__text notify__text_blue">
                                {{ $t('ui.notifications.invite') }}:
                              </div>
                            </div>
                            <div class="notify__action">
                              <button
                                class="notify__btn"
                                @click="showNotifications"
                              >
                                <span class="notify__text notify__text_btn">
                                  Paint the garage quickly
                                </span>
                                <span class="icon-chevron_right" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </button>
              <div
                class="ctm-menu__toggle"
                @click="toggleMobileMenu()"
              >
                <button
                  class="header__button header__button_menu"
                >
                  <span
                    v-if="!isMobileMenu"
                    class="icon-hamburger"
                  />
                  <span
                    v-if="isMobileMenu"
                    class="icon-close_big"
                  />
                </button>
              </div>
              <button
                class="header__button header__button_profile"
                @click="showProfile()"
              >
                <span class="icon-hamburger" />
                <transition name="fade">
                  <div
                    v-if="isShowProfile"
                    class="profile"
                  >
                    <div class="profile__header">
                      <div class="profile__avatar">
                        <img
                          v-if="imageData"
                          id="userAvatarThree"
                          class="profile__img"
                          :src="imageData"
                          alt=""
                        >
                        <img
                          v-if="!imageData"
                          id="userAvatarTwo"
                          class="profile__img"
                          src="~/assets/img/app/avatar_empty.png"
                          alt=""
                        >
                      </div>
                      <div class="profile__info">
                        <div class="profile__text">
                          {{ userData.firstName }} {{ userData.lastName }}
                        </div>
                        <div
                          v-if="userRole === 'employer'"
                          class="profile__text profile__text_blue"
                        >
                          {{ $t('role.employer') }}
                        </div>
                        <div
                          v-if="userRole === 'worker'"
                          class="profile__text profile__text_green"
                        >
                          {{ $t('role.worker') }}
                        </div>
                      </div>
                    </div>
                    <div class="profile__items">
                      <nuxt-link
                        v-for="item in profileLinks"
                        :key="`item-${item.title}`"
                        tag="button"
                        class="profile__item"
                        :to="item.path"
                      >
                        {{ item.title }}
                      </nuxt-link>
                      <button
                        class="profile__item profile__item_red"
                        @click="logout()"
                      >
                        {{ $t('ui.profile.logout') }}
                      </button>
                    </div>
                  </div>
                </transition>
              </button>
              <base-btn
                v-if="userRole === 'employer'"
                class="header__btn"
                @click="createNewQuest('pc')"
              >
                {{ $t('layout.create') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div
          :class="[{'ctm-open': isMobileMenu},
                   {'ctm-open': isNotFlexContainer}]"
        >
          <transition name="fade-fast">
            <div
              class="ctm-menu"
              :class="{'ctm-menu_opened': isMobileMenu}"
            >
              <div class="ctm-menu__content">
                <div
                  v-if="isMobileMenu"
                  class="user"
                  @click="toggleUserDD()"
                >
                  <div class="user__container">
                    <div class="user-container__avatar">
                      <img
                        v-if="imageData"
                        id="userAvatarOne"
                        class="profile__img"
                        :src="imageData"
                        alt=""
                      >
                      <img
                        v-if="!imageData"
                        id="userAvatar"
                        class="profile__img"
                        src="~/assets/img/app/avatar_empty.png"
                        alt=""
                      >
                    </div>
                    <div class="user-container__user">
                      <div class="user__name">
                        {{ userData.firstName }} {{ userData.lastName }}
                      </div>
                      <div
                        v-if="userRole === 'employer'"
                        class="user__role"
                      >
                        {{ $t('role.employer') }}
                      </div>
                      <div
                        v-if="userRole === 'worker'"
                        class="user__role"
                      >
                        {{ $t('role.worker') }}
                      </div>
                    </div>
                  </div>
                  <div class="user-container__dropdown">
                    <div class="user__container">
                      <div
                        class="user__dropdown"
                      >
                        <span
                          v-if="!isUserDDOpened"
                          class="icon-caret_down"
                        />
                        <span
                          v-if="isUserDDOpened"
                          class="icon-caret_up"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="isUserDDOpened === true"
                  class="user-dropdown__container"
                >
                  <div
                    v-for="(item, i) in userDDLinks"
                    :key="i"
                  >
                    <div
                      class="user-dropdown__link"
                      :class="item.title === 'Logout' ? 'user-dropdown__link_logout' : ''"
                      @click="toRoute(item.link)"
                    >
                      {{ item.title }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="isMobileMenu"
                  class="mobile__links"
                >
                  <div
                    v-for="(item, i) in mobileMenuLinks"
                    :key="i"
                  >
                    <div
                      class="mobile__link"
                      @click="toRoute(item.path)"
                    >
                      {{ item.title }}
                    </div>
                  </div>
                </div>
                <div
                  class="mobile-dropdown"
                  @click="toggleInstrumentDD()"
                >
                  <div
                    v-if="isMobileMenu"
                    class="mobile-dropdown__btn"
                  >
                    <div class="mobile-dropdown__title">
                      {{ $t('ui.profile.DeFi') }}
                    </div>
                    <div class="mobile-dropdown__arrow">
                      <span
                        v-if="!isInstrumentDropdownOpened"
                        class="icon-caret_down"
                      />
                      <span
                        v-if="isInstrumentDropdownOpened"
                        class="icon-caret_up"
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-if="isInstrumentDropdownOpened"
                  class="mobile-dropdown__container"
                >
                  <div
                    v-for="(item, i) in instrumentDDLinks"
                    :key="i"
                  >
                    <div
                      v-if="isMobileMenu"
                      class="instrument-dropdown__link"
                      @click="toRoute(item.link)"
                    >
                      {{ item.title }}
                    </div>
                  </div>
                </div>
                <div class="ctm__actions">
                  <base-btn
                    v-if="userRole === 'employer'"
                    class="ctm__btn"
                    @click="createNewQuest('mobile')"
                  >
                    {{ $t('layout.create') }}
                  </base-btn>
                </div>
              </div>
            </div>
          </transition>
          <div
            class="template__main"
            :class="{'template__main_padding' : isChatOpened}"
          >
            <nuxt />
          </div>
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
      chatFilter: {
        limit: 15,
        offset: 0,
        starred: false,
      },
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
      hasUnreadMessage: 'chat/hasUnreadMessage',
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
    profileLinks() {
      return [
        {
          title: this.$t('ui.profile.myProfile'),
          path: `/profile/${this.userData.id}`,
        },
        {
          title: this.$t('ui.profile.settings'),
          path: '/settings',
        },
        {
          title: this.$t('ui.profile.disputes'),
          path: '/disputes',
        },
      ];
    },
    additionalMenuLinks() {
      return [
        {
          title: this.$t('ui.menu.pension.title'),
          desc: this.$t('ui.menu.pension.desc'),
          path: '/pension',
        },
        {
          title: this.$t('ui.menu.referral.title'),
          desc: this.$t('ui.menu.referral.desc'),
          path: '/referral',
        },
        {
          title: this.$t('ui.menu.p2p.title'),
          desc: this.$t('ui.menu.p2p.desc'),
          path: '/insuring',
        },
        {
          title: this.$t('ui.menu.savings.title'),
          desc: this.$t('ui.menu.savings.desc'),
          path: '/savings',
        },
        {
          title: this.$t('ui.menu.crediting.title'),
          desc: this.$t('ui.menu.crediting.desc'),
          path: '/crediting',
        },
        {
          title: this.$t('ui.menu.mining.title'),
          desc: this.$t('ui.menu.mining.desc'),
          path: '/mining',
        },
        {
          title: this.$t('ui.menu.crosschain.title'),
          desc: this.$t('ui.menu.crosschain.desc'),
          path: '/crosschain',
        },
        {
          title: this.$t('ui.menu.staking.title'),
          desc: this.$t('ui.menu.staking.desc'),
          path: '/staking',
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
  beforeCreate() {
    if (!this.$cookies.get('userLogin')) {
      this.$store.dispatch('user/logout');
      this.$router.push('/sign-in');
    }
  },
  async mounted() {
    await this.initWSListeners();
    await this.getChats();
    this.GetLocation();
    this.localUserData = JSON.parse(JSON.stringify(this.userData));
    this.currentLocale = this.$i18n.localeProperties.code;
  },
  created() {
    window.addEventListener('resize', this.userWindowChange);
  },
  destroyed() {
    window.removeEventListener('resize', this.userWindowChange);
  },
  methods: {
    async getChats() {
      await this.$store.dispatch('chat/getChatsList', this.chatFilter);
    },
    async initWSListeners() {
      const { chatConnection, notifsConnection } = this.connections;
      if (!chatConnection) {
        await this.$wsChat.connect(this.token);
        this.$wsChat.subscribe('/notifications/chat', async ({ data, action }) => {
          await this.getChats();

          if (data.chatId === this.chatId && !this.messagesFilter.canLoadToBottom) {
            if (action !== 'messageReadByRecipient') this.$store.commit('chat/addMessageToList', data);

            if (data.type === 'info') {
              const { user } = data.infoMessage;

              if (action === 'groupChatAddUsers') {
                this.$store.commit('chat/addUserToChat', user);
              } else if (action === 'groupChatDeleteUser') {
                this.$store.commit('chat/removeUserFromChat', user.id);
              }
            }
          }
        });
      }
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
    &__container {}
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
