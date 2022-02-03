<template>
  <div class="notifications-page">
    <div class="notifications-page__main-container">
      <div class="info-block info-block__container">
        <div class="info-block__title">
          {{ $t('ui.notifications.title') }}
        </div>
        <div class="info-block__list">
          <div
            v-for="(notification, i) in notifications"
            :key="i"
            :ref="`${notification.id}|${notification.seen}`"
            v-observe-visibility="(isVisible) => checkUnseenNotifs(isVisible, notification)"
            class="notification"
            :class="{'notification_gray' : !notification.seen}"
          >
            <template v-if="notification.sender">
              <div class="notification__avatar">
                <img
                  class="avatar"
                  :src="notification.sender.avatar && notification.sender.avatar.url ? notification.sender.avatar.url : EmptyAvatar"
                  alt=""
                >
              </div>
              <div class="notification__inviter inviter">
                <span class="inviter__name">
                  {{ UserName(notification.sender.firstName, notification.sender.lastName) }}
                </span>
                <!--                <span class="inviter__company">-->
                <!--                  {{ notification.company }}-->
                <!--                </span>-->
              </div>
            </template>

            <div class="notification__quest quest">
              <span class="quest__invitation">
                {{ $t(notification.actionNameKey) }}:
              </span>
              <span
                v-if="notification.params"
                class="quest__title"
              >
                {{ notification.params.title }}
              </span>
            </div>
            <div class="notification__date">
              {{ notification.creatingDate }}
            </div>

            <!--            <div-->
            <!--              v-if="!notification.seen"-->
            <!--              class="notification__unread-dot"-->
            <!--            />-->

            <!--            <img-->
            <!--              class="notification__remove"-->
            <!--              src="~assets/img/ui/close.svg"-->
            <!--              alt="x"-->
            <!--              @click="tryRemoveNotification(notification.id)"-->
            <!--            >-->

            <div class="notification__button">
              <base-btn
                mode="outline"
                class="button__view"
                @click="goToEvent(notification.params ? notification.params.link : '')"
              >
                {{ $t('btn.view') }}
              </base-btn>
            </div>
          </div>
        </div>
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
import modals from '~/store/modals/modals';

export default {
  name: 'Notifications',
  data() {
    return {
      filter: {
        limit: 10,
        offset: 0,
      },
      page: 1,
      notificationIdsForRead: [],
      delay: null,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      notifications: 'user/getNotificationsList',
      notifsCount: 'user/getNotificationsCount',
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
  destroyed() {
    this.$store.commit('user/setNotifications', { notifications: [], count: this.notifsCount });
  },
  methods: {
    tryRemoveNotification(notificationId) {
      // back-bug
      this.ShowModal({
        key: modals.areYouSure,
        title: this.$t('modals.sureDeleteNotification'),
        okBtnTitle: this.$t('meta.delete'),
        okBtnFunc: async () => await this.removeNotification(notificationId),
      });
    },
    async removeNotification(notificationId) {
      this.CloseModal();
      const payload = {
        config: {
          params: this.filter,
        },
        notificationId,
      };

      await this.$store.dispatch('user/removeNotification', payload);
    },
    checkUnseenNotifs(isVisible, { id, seen }) {
      if (!isVisible || seen || this.notificationIdsForRead.indexOf(id) >= 0) return;

      this.notificationIdsForRead.push(id);

      this.setDelay(async () => {
        const config = {
          notificationIds: this.notificationIdsForRead,
        };

        await this.$store.dispatch('user/readNotifications', config);

        this.notificationIdsForRead = [];
      }, 1000);
    },
    setDelay(f, t) {
      clearTimeout(this.delay);
      this.delay = setTimeout(f, t);
    },
    async setPage() {
      this.filter.offset = (this.page - 1) * this.filter.limit;
      this.SetLoader(true);
      await this.getNotifications();
      this.SetLoader(false);
    },
    async getNotifications() {
      const config = {
        params: this.filter,
      };

      await this.$store.dispatch('user/getNotifications', config);
    },
    goToEvent(path) {
      this.$router.push(path);
    },
    navigateBack() {
      if (this.userRole === 'employer') {
        this.$router.push('/workers');
      } else if (this.userRole === 'worker') {
        this.$router.push('/quests');
      } else {
        this.$router.push('/');
      }
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

.info-block {
  background: #fff;
  border-radius: 6px;

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

  &_gray {
    background: #f7f8fabd;
  }

  &__unread-dot {
    grid-column: 3;
    grid-row: 1;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: #0083C7;
    justify-self: flex-end;
    margin-right: 10px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $black100;
  }

  &__avatar {
    grid-area: avatar;
    align-self: flex-start;
  }
  &__inviter {
    grid-area: inviter;
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
}
.inviter {
  &__name {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    letter-spacing: 0.02em;
  }
  &__company {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    letter-spacing: 0.02em;
    margin-left: 5px;
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
    &__quest {
      margin-bottom: 20px;
    }
    &__button {
      display: none;
    }

    width: 350px;
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
      margin-bottom: 10px;
    }
    &__title {
      display: none;
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
@include _380 {
  .notification {
    width: auto;
  }
}

</style>
