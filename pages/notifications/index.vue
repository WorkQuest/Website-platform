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
            v-observe-visibility="(isVisible) => checkUnseenNotifs(isVisible, {id: notification ? notification.id : '', seen: notification.seen})"
            class="notification"
            :class="{'notification_gray' : !notification.seen}"
            @click="goToEvent(notification.params ? notification.params.path : '', true)"
          >
            <template v-if="notification.params.isLocal">
              <div class="notification__avatar">
                <img
                  class="avatar"
                  :src="notification.data.sender.avatar"
                  alt=""
                >
              </div>
              <div class="notification__inviter inviter">
                <span class="inviter__name">
                  {{ UserName(notification.data.sender.firstName, '') }}
                </span>
              </div>
            </template>
            <template v-if="!notification.params.isLocal && notification.sender">
              <div class="notification__avatar">
                <img
                  class="avatar"
                  :src="avatar(notification)"
                  alt=""
                  @click="toUserProfile(notification)"
                >
              </div>
              <div class="notification__inviter inviter">
                <span
                  class="inviter__name"
                  @click="toUserProfile(notification)"
                >
                  {{ UserName(notification.sender.firstName, notification.sender.lastName) }}
                </span>
                <span
                  v-if="notification.sender.additionalInfo"
                  class="inviter__company"
                >
                  {{ notification.sender.additionalInfo.company ?
                    `${$t('modals.fromAddress')} ${notification.sender.additionalInfo.company}` : '' }}
                </span>
              </div>
            </template>
            <div
              v-if="notification.params.isLocal"
              class="notification__quest quest"
            >
              <span class="quest__invitation">
                {{ notification.data.message }}
              </span>
            </div>
            <div
              v-if="!notification.params.isLocal"
              class="notification__quest quest"
            >
              <span class="quest__invitation">
                {{ notificationActionKey(notification) }}
              </span>
              <span
                v-if="notification.params"
                class="quest__title"
              >
                {{ notification.params.title }}
              </span>
            </div>
            <div class="notification__date">
              {{ $moment(notification.createdAt).format('MMMM Do YYYY, h:mm') }}
            </div>
            <img
              v-if="!notification.params.isLocal"
              class="notification__remove"
              src="~assets/img/ui/close.svg"
              alt="x"
              @click="tryRemoveNotification($event, notification.id, notification)"
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
                @click="notification.params.isExternalLink ? '' : goToEvent(notification.params.path)"
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
import {
  UserRole, Path, SumSubStatuses, TwoFAStatuses,
} from '~/utils/enums';
import modals from '~/store/modals/modals';
import { LocalNotificationAction } from '~/utils/notifications-enum';
import { images } from '~/utils/images';

export default {
  name: 'Notifications',
  UserRole,
  data() {
    return {
      filter: {
        limit: 10,
        offset: 0,
      },
      page: 1,
      notificationIdsForRead: [],
      delayId: null,
      profileFilled: false,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      statusKYC: 'user/getStatusKYC',
      status2FA: 'user/getStatus2FA',
      notifications: 'notifications/getNotificationsList',
      notifsCount: 'notifications/getNotificationsCount',
    }),
    totalPages() {
      return Math.ceil(this.notifsCount / this.filter.limit);
    },
  },
  async mounted() {
    this.SetLoader(true);
    const { userData, $cookies } = this;
    const {
      avatar, firstName, lastName, locationPlaceName, additionalInfo: { description },
    } = userData;
    const KYC = $cookies.get(LocalNotificationAction.TWOFA);
    const TWOFA = $cookies.get(LocalNotificationAction.KYC);
    this.page = $cookies.get('notificationPage');
    this.profileFilled = !!avatar && !!firstName && !!lastName && !!locationPlaceName
      && !!description;
    await this.getNotifications();
    await this.$store.dispatch('notifications/createLocalNotification', {
      action: LocalNotificationAction.GET_REWARD,
      message: this.$t('localNotifications.messages.inviteFriends'),
      actionBtn: this.$t('localNotifications.btns.inviteFriends'),
    });
    await this.$store.dispatch('notifications/createLocalNotification', {
      action: LocalNotificationAction.WIKI,
      message: this.$t('localNotifications.messages.wiki'),
      actionBtn: this.$t('localNotifications.btns.wiki'),
    });
    if (this.statusKYC === SumSubStatuses.NOT_VERIFIED) {
      if (!KYC) this.$cookies.set(LocalNotificationAction.KYC, this.statusKYC !== 0, { maxAge: 60 * 60 * 24 * 7, enabled: true });
      await this.$store.dispatch('notifications/createLocalNotification', {
        action: LocalNotificationAction.KYC,
        message: this.$t('localNotifications.messages.kyc'),
        actionBtn: this.$t('localNotifications.btns.kyc'),
      });
    }
    if (this.status2FA === TwoFAStatuses.DISABLED) {
      if (!TWOFA) this.$cookies.set(LocalNotificationAction.TWOFA, this.status2FA !== 0, { maxAge: 60 * 60 * 24 * 7, enabled: true });
      await this.$store.dispatch('notifications/createLocalNotification', {
        action: LocalNotificationAction.TWOFA,
        message: this.$t('localNotifications.messages.twoFA'),
        actionBtn: this.$t('localNotifications.btns.toSettings'),
      });
    }
    if (!this.profileFilled) {
      await this.$store.dispatch('notifications/createLocalNotification', {
        action: LocalNotificationAction.PROFILE_FILLED,
        message: this.$t('localNotifications.messages.fillSettingsData'),
        actionBtn: this.$t('localNotifications.btns.toSettings'),
      });
    }
    this.SetLoader(false);
  },
  async beforeDestroy() {
    await this.saveNotificationCurrentPage();
  },
  destroyed() {
    this.$store.commit('notifications/setNotifications', { result: { notifications: [], count: this.notifsCount } });
  },
  methods: {
    async saveNotificationCurrentPage() {
      this.$cookies.set('notificationPage', this.page);
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
      this.$router.push(`${Path.PROFILE}/${notification.sender.id}`);
    },
    tryRemoveNotification(ev, notificationId, notification) {
      ev.stopPropagation();
      this.ShowModal({
        key: modals.areYouSure,
        text: this.$t('modals.sureDeleteNotification'),
        okBtnTitle: this.$t('meta.btns.delete'),
        okBtnFunc: async () => await this.removeNotification(notificationId, notification),
      });
    },
    async removeNotification(notificationId, notification) {
      const { limit, offset } = this.filter;
      this.CloseModal();
      this.SetLoader(true);
      await this.$store.dispatch('notifications/removeNotification', {
        config: {
          params: {
            limit: 1,
            offset: limit + offset - 1,
          },
        },
        notificationId,
        notification,
      });
      this.SetLoader(false);
    },
    async checkUnseenNotifs(isVisible, { id, seen }) {
      if (!isVisible || !id || seen || this.notificationIdsForRead.indexOf(id) >= 0) return;
      this.notificationIdsForRead.push(id);
      this.delayId = this.SetDelay(async () => {
        await this.$store.dispatch('notifications/readNotifications', {
          notificationIds: this.notificationIdsForRead,
        });
        this.notificationIdsForRead = [];
      }, 1000, this.delayId);
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
    },
    goToEvent(path, isNotifCont) {
      if (isNotifCont && document.body.offsetWidth > 767) return;
      this.$router.push(path);
    },
    navigateBack() {
      if (this.userRole === UserRole.EMPLOYER) this.$router.push(Path.WORKERS);
      else if (this.userRole === UserRole.WORKER) this.$router.push(Path.QUESTS);
      else this.$router.push(Path.ROOT);
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
  background: #fff;
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
    background: #f7f8fabd;
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
  cursor: pointer;
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
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &:hover {
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

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;

    line-clamp: 3;
    -webkit-line-clamp: 3;
    box-orient: vertical;
    -webkit-box-orient: vertical;
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
  .notification {
    grid-template-columns: 52px auto 100px;
    &__quest {
      min-width: auto;
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
}
@include _380 {
  .notification {
    width: auto;
  }
}

</style>
