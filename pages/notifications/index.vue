<template>
  <div class="main">
    <div class="main-white">
      <div class="main__body">
        <div class="page__container">
          <div class="page__title">
            <span
              class="icon-chevron_left back"
              @click="navigateBack"
            />
            {{ $t('ui.notifications.title') }}
          </div>
          <span
            v-for="(notification, i) in notifications"
            :key="i"
            class="notifications"
          >
            <div class="notification">
              <template v-if="notification.sender">
                <div class="notification__avatar">
                  <img
                    class="avatar"
                    :src="notification.sender.avatar && notification.sender.avatar.url ? notification.sender.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                    alt=""
                  >
                </div>
                <div class="notification__inviter inviter">
                  <span class="inviter__name">
                    {{ notification.sender.firstName }} {{ notification.sender.lastName }}
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
                <span class="quest__title">
                  {{ notification.params.title }}
                </span>
              </div>
              <div class="notification__date">{{ notification.creatingDate }}</div>

              <div class="notification__button button">
                <base-btn
                  mode="outline"
                  class="button__view"
                  @click="goToEvent(notification.params.link)"
                >
                  {{ $t('btn.view') }}
                </base-btn>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Notifications',
  data() {
    return {
      notifications: [
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
        {
          firstName: 'Edward',
          lastName: 'Cooper',
          company: 'from Amazon',
          questTitle: 'Paint the garage quickly',
          date: '14 January 2021, 14:54',
        },
      ],
      filter: {
        limit: 10,
        offset: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      notifications: 'user/getNotificationsList',
      notifsCount: 'user/getNotificationsCount',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    await this.getNotifications();
    this.SetLoader(false);
  },
  methods: {
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

.main {
  @include main;
  &-white {
    @include main;
    background: $white;
    background: #FFFFFF;
    margin: 30px 0 20px 0;
    border-radius: 6px;
    justify-content: center;
  }
  &__body {
    max-width: 1180px;
    height: 100%;
  }
}
.icon {
  &-caret_left:before {
    content: "\ea49";
    color: $black400;
    font-size: 25px;
  }
  &-caret_right:before {
    font-size: 25px;
    color: $black600;
    content: "\ea4a";
  }
}
.pagination {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 20px 0 0;
  &__btn {
    width: 43px;
    height: 43px;
    border-right: 1px solid $black0;
    color: $black600;
    font-size: 16px;
    transition: .5s;
    &:first-child {
      color: $black400;
    }
    &:last-child {
      border: none;
    }
    &:hover {
      background-color: rgb(123, 201, 246);
      color: $blue;
    }
    &_active {
      background-color: #E6F3F9;
      color: #0083c7;
    }
  }
  &__arrow {
    @extend .pagination__btn;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.img {
  &__container {
    display: flex;
    margin: 15px 0 10px 0;
  }
}

.btn {
  &__container {
    display: flex;
    align-items: center;
  }
}
.notifications {
  margin: 20px 20px 0 20px;
  border-bottom: 1px solid $black100;
  &:last-of-type {
    border-bottom: 1px solid white;
  }
}
.page {
  &__container {
    margin: 20px 0 20px 0;
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    max-width: 780px;
    width: 780px;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
    margin: 0 0 0 20px;
    letter-spacing: 0.05em;
  }
}
.back {
  display: none;
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
  padding-bottom: 5px;

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
    align-self: center;
  }
  &__date {
    grid-area: date;
    @include text-simple;
    font-weight: 400;
    font-size: 12px;
    color: $black500;
    margin-bottom: 10px;
  }
}
.icon-chevron_right {
  display: none;
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
.button {
  &__view {
    margin-top: -16px;
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
  .icon-chevron_right {
    display: inline-block;

    &:before {
      color: $blue;
      font-size: 24px;
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
  .back {
    display: block;
    margin-bottom: 10px;
    margin-left: -8px;
    cursor: pointer;
    &:before {
      color: $blue;
      font-size: 40px;
    }
  }
}
@include _380 {
  .notification {
    width: auto;
  }
}

</style>
