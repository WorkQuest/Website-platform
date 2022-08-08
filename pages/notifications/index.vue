<template>
  <div class="notifications-page">
    <div class="notifications-page__main-container">
      <div class="info-block info-block__container">
        <div class="info-block__title">
          {{ $t('ui.notifications.title') }}
        </div>

        <div
          v-if="notifsCount && notifications"
          class="info-block__list"
        >
          <div
            v-for="(notification, i) in notifications"
            :key="i"
            :ref="`${notification.id}|${notification.seen}`"
            class="notification"
            :class="{'notification_gray' : !notification.seen}"
            @click="goToEvent(notification)"
          >
            <div class="notification__left">
              <div class="notification__avatar">
                <img
                  class="avatar"
                  :class="{'avatar_hov': !checkLocalOrSystemNotif(notification)}"
                  :src="avatar(notification)"
                  alt=""
                  @click="toUserProfile(notification)"
                >
              </div>
              <div class="notification__info info">
                <template v-if="notification.sender">
                  <div class="notification__inviter inviter">
                    <span
                      class="inviter__name"
                      :class="{'inviter__name_hov': !checkLocalOrSystemNotif(notification) }"
                      @click="notification.params.isLocal ? '' : toUserProfile(notification)"
                    >
                      {{ UserName(notification.sender.firstName, notification.sender.lastName) }}
                    </span>
                    <span
                      v-if="notification.sender.additionalInfo"
                      class="inviter__company"
                    >
                      {{
                        notification.sender.additionalInfo.company
                          ? `${$t('modals.fromAddress')} ${notification.sender.additionalInfo.company}`
                          : ''
                      }}
                    </span>
                  </div>
                </template>
                <div class="info__text">
                  {{
                    notification.params.isLocal || (notification.data && notification.data.message)
                      ? notification.data.message
                      : notificationActionKey(notification)
                  }}
                </div>
                <div
                  v-if="notification.params"
                  class="info__title"
                  :class="{'info__title_hov': !notification.params.isLocal}"
                  @click="notification.params.isLocal ? '' : goToEvent(notification, true)"
                >
                  {{ notification.params.title }}
                </div>
                <div class="info__date">
                  {{ $moment(notification.createdAt).format('MMMM Do YYYY, h:mm') }}
                </div>
              </div>
            </div>
            <div class="notification__right">
              <img
                v-if="!notification.params.isLocal"
                class="notification__remove"
                :src="$options.images.CLOSE"
                alt="x"
                @click="tryRemoveNotification($event, notification)"
              >
              <base-btn
                v-if="notification.params"
                mode="outline"
                :link="notification.params.isExternalLink ? `${notification.params.externalBase}${notification.params.path}` : ''"
                class="button__view"
                data-selector="NOTIFICATION-VIEW"
                @click="notification.params.isExternalLink ? '' : goToEvent(notification, true)"
              >
                {{ actionBtnText(notification) }}
              </base-btn>
            </div>
          </div>
        </div>
        <empty-data
          v-else
          class="info-block__no-content"
          :description="$tc('ui.notifications.noNotifications')"
        />
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          class="info-block__pager"
          :total-pages="totalPages"
          @input="setPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { UserRole, Path } from '~/utils/enums';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';
import localNotifications from '~/plugins/mixins/localNotifications';

export default {
  name: 'Notifications',
  UserRole,
  images,
  mixins: [localNotifications],
  data() {
    return {
      notifications: [],
      filter: {
        limit: 10,
        offset: 0,
      },
      page: 5, // TODO 1;
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      statusKYC: 'user/getStatusKYC',
      status2FA: 'user/getStatus2FA',
      notificationsList: 'notifications/getNotificationsList',
      notifsCount: 'notifications/getNotificationsCount',
      unreadNotifsCount: 'notifications/getUnreadNotifsCount',
    }),
    totalPages() {
      return Math.ceil(this.notifsCount / this.filter.limit);
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.getNotifications();
    this.SetLoader(false);
  },
  methods: {
    checkLocalOrSystemNotif(notification) {
      return notification?.params?.isLocal || !notification?.sender?.id;
    },
    actionBtnText(notification) {
      return notification.actionBtn ?? this.$t('meta.btns.view');
    },
    avatar(notification) {
      return notification.sender?.avatar?.url || images.EMPTY_AVATAR;
    },
    notificationActionKey(notification) {
      const symbol = ['notifications.newDiscussionLike'].includes(notification.actionNameKey) ? '.' : ':';
      return `${this.$t(notification.actionNameKey)}${symbol}`;
    },
    toUserProfile(notification) {
      if (notification?.params?.isLocal) return;
      if (notification?.sender?.id) this.$router.push(`${Path.PROFILE}/${notification.sender.id}`);
    },
    tryRemoveNotification(ev, notification) {
      ev.stopPropagation();
      this.ShowModal({
        key: modals.areYouSure,
        text: this.$t('modals.sureDeleteNotification'),
        okBtnTitle: this.$t('meta.btns.delete'),
        okBtnFunc: async () => await this.removeNotification(notification),
      });
    },
    async removeNotification(notification) {
      const { limit, offset } = this.filter;
      this.CloseModal();
      this.SetLoader(true);
      const { ok } = await this.$store.dispatch('notifications/removeNotification', {
        config: {
          params: {
            limit: 1,
            offset: limit + offset - 1,
          },
        },
        notification,
      });
      if (ok) {
        await this.getNotifications();
      } else {
        await this.$store.dispatch('main/showToast', {
          title: this.$t('toasts.error'),
          variant: 'warning',
          text: '',
        });
      }
      this.SetLoader(false);
    },
    checkUnseenNotifs() {
      const toRead = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of this.notifications) {
        if (!item.seen && !item.params?.isLocal) toRead.push(item.id);
      }
      if (!toRead.length) return;
      setTimeout(async () => {
        await this.$store.dispatch('notifications/readNotifications', {
          notificationIds: toRead,
        });
      }, 3000);
    },
    async setPage() {
      this.filter.offset = (this.page - 1) * this.filter.limit;
      this.SetLoader(true);
      this.ScrollToTop();
      await this.getNotifications();
      this.SetLoader(false);
    },
    async getNotifications() {
      await this.$store.dispatch('notifications/getNotifications', { params: this.filter });
      const numberOfNotifAdded = await this.getCountLocalNotifications();
      const notifAddedBeforeNewPage = numberOfNotifAdded - (this.filter.limit - (this.notifsCount % this.filter.limit));
      await this.setLocalNotifications(this.notifsCount);
      this.notifications = this.notificationsList;
      if (notifAddedBeforeNewPage > 0 && this.page === this.totalPages && this.totalPages > 1) {
        this.notifications = [...this.notifications].splice(1, notifAddedBeforeNewPage);
      }
      this.checkUnseenNotifs();
    },
    goToEvent(notification, isRefBtn) {
      if (!notification.params || (document.body.offsetWidth > 767 && !isRefBtn)) return;
      const { path } = notification.params;
      if (notification.params.isExternalLink) {
        window.open(notification.params.externalBase + path, '_blank');
        return;
      }
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
.notifications-page {
  margin-top: 20px;
  &__main-container {
    border-radius: 6px;
    background: $white;
    padding: 10px;
  }
}
.info-block {
  padding: 10px;
  &__title {
    font-weight: 500;
    font-size: 18px;
  }
  &__pager {
    margin-top: 20px;
  }
}

.button__view {
  text-decoration: none;
  text-outline: none;
  width: 150px;
}

.notification {
  display: flex;
  padding: 20px 0;
  &:not(:last-of-type) {
    border-bottom: 1px solid $black100;
  }

  &__avatar {
    flex-shrink: 0;
  }

  &__left {
    display: flex;
    flex-grow: 1;
  }
  &__right {
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__sender {
    display: flex;
  }

  &__remove {
    margin-left: auto;
    height: 15px;
    margin-bottom: 10px;
    cursor: pointer;
    visibility: hidden;
  }

  &:hover {
    .notification__remove {
      visibility: visible;
    }
  }
}

@mixin hov {
  &:hover {
    cursor: pointer;
    color: $blue;
  }
};

.inviter {
  font-size: 16px;
  &__name {
    font-weight: 500;

    &_hov {
      @include hov;
    }
  }
  &__company {
    color: $black500;
  }
}

.info {
  &__date {
    margin-top: 10px;
    font-weight: 400;
    font-size: 12px;
    color: $black500;
  }

  &__text {
    margin-top: 10px;
  }

  &__title {
    white-space: nowrap;
    max-width: 60vw;
    text-overflow: ellipsis;
    overflow: hidden;
    &_hov {
      @include hov;
    }
  }
}

.avatar {
  margin-right: 15px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid $black0;
  object-fit: cover;
  &_hov:hover {
    cursor: pointer;
  }
}

@include _1199 {
  .notifications-page {
    padding: 10px;
    &__main-container {
      padding: 5px;
    }
  }
  .notification {
    padding: 10px 0;
  }
  .info-block {
    padding: 0;
    font-size: 14px;
  }
}

@include _767 {
  .notification-page {
    padding: 5px;
  }
  .notification {
     &__remove {
       visibility: visible;
     }
  }
  .button__view {
    display: none;
  }
}

</style>
