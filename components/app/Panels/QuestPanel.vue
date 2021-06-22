<template>
  <div>
    <div class="user__top">
      <div class="user__container">
        <div class="user__head">
          <div
            class="user__left"
            @click="showProfile()"
          >
            <img
              class="user__img"
              src="~/assets/img/app/fake_profile.png"
              alt=""
            >
            <span class="user__username">
              {{ payload.username }}
            </span>
            <span
              v-if="userRole === 'employer'"
              class="user__company"
            >
              {{ $t('company.from') }} {{ payload.company }}
            </span>
          </div>
          <div class="user__right">
            <span class="user__date">
              {{ payload.date }}
            </span>
            <span class="icon-share_outline icon_fs-20" />
          </div>
        </div>
        <div class="location__container">
          <div class="quest__location">
            <span
              class="icon-location icon_fs-20"
            />
            <span>{{ payload.location }}</span>
            <span
              class="user__distance"
            >
              {{ payload.distance }} {{ $t('meta.fromYou') }}
            </span>
          </div>
          <div
            v-if="userRole === 'worker'"
            class="runtime__container"
          >
            <span class="icon-clock" />
            <span class="runtime__title">{{ $t('quests.runtime') }}</span>
            <span
              class="runtime__link"
            >
              {{ payload.runtime }}
            </span>
          </div>
          <div
            v-if="userRole === 'employer'"
            class="runtime__container"
          >
            <span class="icon-clock" />
            <span class="runtime__title">
              {{ $t('quests.performanceTimer') }}
            </span>
            <span
              class="runtime__link"
            >
              {{ payload.performanceTimer }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="badge__container">
      <ul class="badge-list">
        <li
          v-for="item in badgeList"
          :key="`item-${item.id}`"
          class="badge__item badge__item_blue"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'QuestPanel',
  data() {
    return {
      badgeList: [
        {
          id: 1,
          text: 'Painting Works',
        },
        {
          id: 2,
          text: 'Art',
        },
      ],
      payload: {
        company: 'Amazon',
        avatar: require('~/assets/img/app/fake_profile.png'),
        username: 'Samantha Sparcs',
        date: '12 January 2021,14:45',
        distance: '200',
        distanceLink: '/',
        performanceTimer: '14:45:23',
        runtime: '14:45:23',
        runtimeLink: '#',
      },
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
    }),
  },
  methods: {
    showProfile() {
      this.$router.push('/profile');
    },
  },
};
</script>

<style lang="scss" scoped>

.quest {
  &__location {
    display: flex;
  }
}

.runtime {
  @include text-simple;
  display: flex;
  font-style: normal;
  font-weight: normal;
  align-items: center;
  font-size: 14px;
  &__container {
    @extend .runtime;
    justify-items: center;
    color: $black700;
  }
  &__link {
    @extend .runtime;
    margin: 0 5px;
    font-weight: 500;
    color: $blue;
  }
}

.user {
  @include text-simple;
  color: $black800;
  font-weight: 500;
  font-size: 16px;
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__container {
    padding: 35px 0 25px 0;
  }
  &__wrapper{
    display: flex;
    flex-direction: row;
  }
  &__date{
    @include text-simple;
    color: $black500;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    margin: auto;
  }
  &__img{
    width:30px;
    height: 30px;
    border-radius: 50%;
  }
  &__username{
    @extend .user;
    padding-left: 10px;
  }
  &__distance{
    @extend .user;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: $blue;
  }
  &__left {
    @extend .user;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  &__right {
    display: flex;
    flex-direction: row;
  }
  &__company {
    @extend .user;
    margin: 0 0 0 10px;
    color: $black500;
  }
}

</style>
