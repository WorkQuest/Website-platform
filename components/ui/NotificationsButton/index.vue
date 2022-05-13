<template>
  <div
    v-click-outside="closePopUp"
    data-selector="COMPONENT-NOTIFICATION-BUTTONS"
    class="reduced-notifications"
  >
    <button
      class="reduced-notifications__button"
      data-selector="ACTION-BTN-TOGGLE-POP-UP"
      @click="togglePopUp"
    >
      {{ unreadNotifsCount }}
      {{ notificationsCount }}
      <template v-if="notificationsCount">
        <img
          v-if="unreadNotifsCount"
          src="~assets/img/ui/notification_outline_red_dot.svg"
          alt=""
        >
        <span
          v-else
          class="icon-notification_outline_dot"
        />
      </template>
      <span
        v-else
        class="icon-notification_outline"
      />
    </button>
    <transition name="fade">
      <div
        v-if="isShowNotify"
        class="reduced-notifications__pop-up"
      >
        <div class="reduced-notifications__header">
          <div class="reduced-notifications__title">
            {{ $t('ui.notifications.title') }}
          </div>
          <span
            class="icon icon-close_small"
            data-selector="ACTION-BTN-CLOSE-POP-UP"
            @click="closePopUp"
          />
        </div>
        <template v-if="notificationsCount">
          <div class="reduced-notifications__list">
            <div
              v-for="(notification) in notifications"
              :key="notification.id"
              :data-selector="`NOTIFICATION-BUTTONS-NOTIFICATION-${notification.id}`"
              class="notify notify__content"
            >
              <div class="notify__top">
                <div
                  v-if="notification.params"
                  class="notify__user"
                >
                  <img
                    class="notify__avatar"
                    :src="avatar(notification)"
                    alt="avatar"
                  >
                  <div
                    v-if="notification.sender"
                    class="notify__info"
                  >
                    <a
                      :href="`/profile/${senderId(notification)}`"
                      class="notify__text notify__text_name"
                    >
                      {{ UserName(notification.sender.firstName, notification.sender.lastName) }}
                    </a>
                  </div>
                </div>
                <div class="notify__text notify__text_date">
                  {{ $moment(notification.createdAt).format('Do MMMM YYYY, hh:mm a') }}
                </div>
              </div>
              <div class="notify__reason">
                <div class="notify__text notify__text_blue">
                  {{ notification.params && notification.params.isLocal
                    ? notification.data.message : $t(notification.actionNameKey) }}
                </div>
              </div>
              <div class="notify__action">
                <base-btn
                  class="notify__btn"
                  @click="goToEvent(notification.params ? notification.params.path : '')"
                >
                  <div class="notify__text notify__text_btn">
                    {{
                      notification.params && notification.params.isLocal
                        ? notification.data.message
                        : $t(notification.actionNameKey)
                    }}
                  </div>
                  <span class="icon icon-chevron_right" />
                </base-btn>
              </div>
            </div>
          </div>
          <base-btn
            class="reduced-notifications__more-btn"
            mode="outline"
            data-selector="ACTION-BTN-GO-TO-NOTIFICATION-PAGE"
            @click="goToNotifsPage"
          >
            {{ $t('meta.btns.showAll') }}
          </base-btn>
        </template>
        <empty-data
          v-else
          class="reduced-notifications__no-content"
          :description="$tc('ui.notifications.noNotifications')"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { images } from '~/utils/images';

export default {
  name: 'NotificationsButtonContainer',
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isShowNotify: false,
    };
  },
  computed: {
    ...mapGetters({
      unreadNotifsCount: 'notifications/getUnreadNotifsCount',
      notifications: 'notifications/getReducedNotifications',
      notificationsCount: 'notifications/getNotificationsCount',
    }),
  },
  async beforeMount() {
    await this.$store.dispatch('notifications/getNotifications');
  },
  methods: {
    senderId(notification) {
      return notification.sender?.id || '';
    },
    avatar(notification) {
      return notification.sender?.avatar?.url || images.EMPTY_AVATAR;
    },
    goToNotifsPage() {
      this.closePopUp();
      this.$router.push('/notifications');
    },
    togglePopUp() {
      if (document.body.offsetWidth <= 575) {
        this.goToNotifsPage();
        return;
      }
      this.isShowNotify = !this.isShowNotify;
      this.$emit('closeAnotherPopUp');
    },
    closePopUp() {
      this.isShowNotify = false;
    },
    goToEvent(path) {
      this.closePopUp();
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>

.icon-chevron_right {
  color: #0083C7;
}

.icon-close_small {
  color: $shade700;
}

.reduced-notifications {
  position: relative;

  &__button {
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    width: 43px;
    height: 43px;
    border: 1px solid transparent;
    position: relative;
    &:hover {
      border: 1px solid $black100;
    }
    span {
      color: $black400;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
  }

  &__title {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 130%;
    color: $black800;
  }

  &__pop-up {
    position: absolute;
    top: 58px;
    right: calc(100% - 43px);
    background: #FFFFFF;
    box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
    border-radius: 6px;
    min-width: 441px;
    z-index: 10000000;
  }

  &__list {
    display: grid;
    gap: 20px;
    padding-bottom: 20px;
  }

  &__more-btn {
    width: 33%;
    margin: 0 auto 20px;
  }

  &__no-content {
    margin: 0 0 20px;
    background: transparent;
  }
}

.icon {
  cursor: pointer;
  font-size: 24px;
}

.notify {
  min-height: 167px;
  width: 100%;

  &__content {
    padding: 20px 20px 0;
    border-top: 1px solid $black0;
    display: grid;
    gap: 12px;
  }

  &__btn {
    display: grid;
    grid-template-columns: 1fr max-content;
    background: $black0;
    border-radius: 3px;
    height: 44px;
    align-items: center;
    padding: 0 10px;
    transition: .5s;
    &:hover {
      background: #dadade;
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    line-height: 130%;
    &_date {
      font-size: 12px;
      color: $black300;
      flex-shrink: 0;
    }
    &_name {
      font-size: 16px;
      color: $black800;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 5px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
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
    height: 40px;
    width: 40px;
    border-radius: 50%;
    -o-object-fit: cover;
    object-fit: cover;
  }
  &__top {
    display: flex;
    justify-content: space-between;
  }
}
</style>
