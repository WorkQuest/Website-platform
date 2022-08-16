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
            <template v-if="notification.sender">
              <div class="notification__avatar">
                <img
                  class="avatar"
                  :class="{'avatar_hov': !checkLocalOrSystemNotif(notification)}"
                  :src="avatar(notification)"
                  alt=""
                  @click="toUserProfile(notification)"
                >
              </div>
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
            <div class="notification__quest quest">
              <div class="quest__invitation">
                {{
                  notification.params.isLocal || (notification.data && notification.data.message)
                    ? notification.data.message
                    : notificationActionKey(notification)
                }}
              </div>
              <div
                v-if="notification.params"
                class="quest__title"
                :class="{'quest__title_hov': !notification.params.isLocal}"
                @click="notification.params.isLocal ? '' : goToEvent(notification, true)"
              >
                {{ notification.params.title }}
              </div>
            </div>
            <div class="notification__date">
              {{ $moment(notification.createdAt).format('MMMM Do YYYY, h:mm') }}
            </div>
            <img
              v-if="!notification.params.isLocal"
              class="notification__remove"
              :src="$options.images.CLOSE"
              alt="x"
              @click="tryRemoveNotification($event, notification)"
            >
            <div
              v-if="notification.params"
              class="notification__button"
            >
              <base-btn
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

export default {
  name: 'Notifications',
  UserRole,
  images,
  data() {
    return {
      notifications: [],
      filter: {
        limit: 10,
        offset: 0,
      },
      page: 1,
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
      return `${this.$t(notification.actionNameKey)}`;
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
      const notifAddedBeforeNewPage = this.filter.limit - (this.notifsCount % this.filter.limit);
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
  display: flex;
  flex-direction: column;
  align-items: center;

  &__main-container {
    max-width: 1180px;
    width: 100%;
    padding-top: 30px;
  }
}

.button__view {
  text-decoration: none;
  text-outline: none;
}

.info-block {
  background: $white;
  border-radius: 6px;

  &__no-content {
    margin: 0 0 20px;
    background: transparent;
  }

  &__container {
    display: grid;
  }

  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
    letter-spacing: 0.05em;
    padding: 20px 20px 0;
  }

  &__pager {
    float: unset;
    justify-self: flex-end;
    margin: 20px;
    border: 1px solid $black0
  }
}

.icon-chevron_left {
  display: block;
  margin-bottom: 10px;
  margin-left: -8px;
  cursor: pointer;
  &:before {
    color: $blue;
    font-size: 40px;
  }
}

.notification {
  display: grid;
  grid-template-columns: 52px auto 150px;
  grid-template-rows: 19px auto 1fr;
  gap: 10px 15px;
  grid-template-areas:
    "avatar inviter button"
    "avatar quest button"
    "avatar date button";
  width: 100%;
  padding: 20px;
  min-width: 0;

  &_gray {
    background: $wheat;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $black100;
  }

  &__avatar {
    grid-area: avatar;
    align-self: flex-start;
  }
  &__inviter {
    display: flex;
    gap: 5px;
    grid-area: inviter;
    overflow: hidden;
  }
  &__quest {
    grid-area: quest;
    min-width: 400px;
    width: 100%;
  }
  &__button {
    grid-area: button;
    grid-row: 2/4;
  }
  &__date {
    grid-area: date;
    @include text-simple;
    font-weight: 400;
    font-size: 12px;
    color: $black500;
  }
  &__remove {
    display: none;
    grid-column: 3;
    grid-row: 1;
    cursor: pointer;
    align-self: center;
    justify-self: flex-end;
    margin-right: 4px;
  }

  &:hover {
    .notification__remove {
      display: block;
    }
  }
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid $black0;
  &_hov:hover {
      cursor: pointer;
    }
}
.inviter {
  &__name {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    line-height: normal;
    color: $black800;
    letter-spacing: 0.02em;
    transition: .5s;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &_hov:hover {
        cursor: pointer;
        color: $blue;
      }
  }
  &__company {
    flex: 0 0 15%;
    @include text-simple;
    line-height: normal;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    letter-spacing: 0.02em;
    margin-left: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.quest {
  &__invitation {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    letter-spacing: 0.03em;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $blue;
    letter-spacing: 0.03em;

    width: fit-content;
    max-width: 100%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: .2s color ease-in-out;
    &_hov:hover {
        cursor: pointer;
        color: $black500;
      }
  }
}

@include _1199 {
  .notifications-page {

    &__main-container {
      padding: 20px;
    }
  }
}

@include _991 {
  .page {
    &__container {
      max-width: 100%;
      width: auto;
    }
  }
}
@include _767 {
  .notification {
    grid-template-columns: 40px 1fr 1fr;
    grid-template-rows: 40px 1fr;
    grid-template-areas:
      "avatar inviter date"
      "quest quest quest";
    &__date {
      align-self: flex-start;
    }
    &__button {
      display: none;
    }

    &__date {
      justify-self: flex-end;
    }

    &__remove {
      display: block;
      grid-row: 2;
      align-self: unset;
    }
  }
  .inviter {
    align-self: center;
    &__name {
      align-self: center;
    }
    &__company {
      display: none;
    }
  }
  .avatar {
    width: 40px;
    height: 40px;
  }
  .quest {
    &__invitation {
      display: block;
      font-size: 16px;
      line-height: 21px;
      color: $black500;
    }
  }

  .page {
    &__title {
      font-weight: bold;
      font-size: 30px;
      line-height: 39px;
      letter-spacing: 0.03em;
      margin-bottom: 5px;
    }
  }
}

@include _575 {
  .notifications-page {

    &__main-container {
      padding: 10px;
    }
  }

  .notification {
    grid-template-columns: 40px 1fr;
    grid-template-rows: 40px max-content max-content;
    grid-template-areas:
      "avatar inviter"
      "date date"
      "quest quest";

    &__date {
      justify-self: flex-start;
    }

    &__remove {
      display: block;
      grid-row: 1;
      align-self: center;
    }
  }
  .info-block{
    &__pager {
      margin: 20px 0;
      justify-self: center;
    }
  }
}
@include _380 {
  .notification {
    width: auto;
  }
}

</style>
