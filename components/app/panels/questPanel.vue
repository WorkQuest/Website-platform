<template>
  <div class="user">
    <div class="user__top">
      <div class="user__container">
        <div class="user__head">
          <div
            class="user__left"
            @click="showProfile()"
          >
            <span>
              <img
                class="user__img"
                :src="avatarUrl"
                alt=""
              >
            </span>
            <span
              class="user__username"
            >
              {{ `${userInfo.firstName} ${userInfo.lastName}` }}
            </span>
            <span
              v-if="userRole === 'employer' && userCompany"
              class="user__company"
            >
              {{ $t('company.from') }} {{ userCompany }}
            </span>
          </div>
          <div class="user__right">
            <span class="user__date">
              {{ convertDate() }}
            </span>
            <button
              class="icon-share_outline icon_fs-20"
              @click="shareModal()"
            />
          </div>
        </div>
        <div class="location__container">
          <div
            v-if="questData"
            class="quest__location"
          >
            <span
              class="icon icon-location icon_fs-20"
            />
            <span class="quest__address">Хардкод</span>
            <span
              class="user__distance"
            >
              {{ getDistanceFromLatLonInKm() }} {{ $t('meta.fromYou') }}
            </span>
          </div>
          <div
            v-if="userRole === 'worker'"
            class="runtime__container"
          >
            <span class="icon icon-clock" />
            <span class="runtime__title">{{ $t('quests.runtime') }}</span>
            <span
              class="runtime__link"
            >
              Хардко
            </span>
          </div>
          <div
            v-if="userRole === 'employer'"
            class="runtime__container"
          >
            <span class="icon icon-clock" />
            <span class="runtime__title">
              {{ $t('quests.performanceTimer') }}
            </span>
            <span
              class="runtime__link"
            >
              Хардкод
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
import moment from 'moment';
import modals from '~/store/modals/modals';

export default {
  name: 'QuestPanel',
  data() {
    return {
      localsTime: '',
      avatarUrl: '',
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      imageData: 'user/getImageData',
      badgeList: 'data/getBadgeList',
      questData: 'quests/getQuest',
      userInfo: 'quests/getQuestUser',
      userAvatar: 'quests/getQuestUserAvatar',
      userCompany: 'quests/getQuestUserCompany',
    }),
  },
  mounted() {
    this.avatarUrl = this.userInfo.avatarId ? this.userInfo.avatar.url : '~/assets/img/app/avatar_empty.png';
  },
  methods: {
    getDistanceFromLatLonInKm() {
      const lat1 = this.questData?.location?.latitude || 0;
      const lon1 = this.questData?.location?.longitude || 0;
      const lat2 = this.userData?.location?.longitude || 0;
      const lon2 = this.userData?.location?.longitude || 0;
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
      const dLon = this.deg2rad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2))
        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = (R * c) * 1000; // Distance in km
      if (d >= 1000) {
        d = '+1000';
      } else if (d >= 500) {
        d = '+500';
      } else {
        d = '-500';
      }
      return d;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    showProfile() {
      this.$router.push('/show-profile');
    },
    shareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
      });
    },
    convertDate() {
      if (this.questData.createdAt) {
        return moment(this.questData.createdAt).format('MMMM Do YYYY, h:mm');
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>

.profile {
  &__img {
    width:30px;
    height: 30px;
    border-radius: 50%;
  }
}
.location {
  &__container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
.icon {
  align-self: center;
  &-share_outline {
    margin-left: 15px;
  }
}
.quest {
  &__location {
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
  &__address {
    margin: 0 5px;
    font-size: 14px;
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
    font-weight: 500;
    color: $blue;
  }
  &__title {
    margin: 0 5px;
  }
}

.badge-list{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.badge {
  &__container {
    padding-top: 20px;
  }
}
.badge {
  &__container {
    padding: 0 0 20px 0;
  }
  &__item {
    @include text-simple;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-weight: normal;
    padding: 0 5px;
    &_green {
      @extend .badge__item;
      background-color: rgba(34, 204, 20, 0.1);
      color:$green;
      margin: 0 0 0 15px;
      border-radius: 5px;
    }
    &_blue {
      @extend .badge__item;
      background-color: rgba(0, 131, 199, 0.1);
      margin: 0 9px 0 0;
      border-radius: 44px;
      font-size: 16px;
      color: $blue;
      height: 31px;
    }
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
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
    &:hover {
      color: $black600;
    }
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
