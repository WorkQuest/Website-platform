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
            <quest-dd />
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
            <span class="quest__address">{{ questData.locationPlaceName ? questData.locationPlaceName : '' }}</span>
            <span
              class="user__distance"
            >
              {{ showDistance() }} {{ $t('meta.fromYou') }}
            </span>
          </div>
          <div
            class="priority__container"
          >
            {{ `${$t('quests.priority.title')}: ` }}
            <div
              class="priority__title"
              :class="getPriorityClass(questData.priority)"
            >
              {{ getPriority(questData.priority) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="badge__container">
      <ul
        v-for="(skills, spec) in questData.skillFilters"
        :key="spec"
        class="badge-list"
      >
        <li
          v-for="(skill, key) in skills"
          :key="key"
          class="badge__item badge__item_blue"
        >
          {{ skill }}
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
  props: {
    avatarUrl: {
      type: String,
      default: '',
    },
    location: {
      type: Object,
      default: null,
    },
    questData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      localsTime: '',
      questLat: 0,
      questLng: 0,
      userLat: 0,
      userLng: 0,
      questSkills: [],
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      imageData: 'user/getImageData',
      badgeList: 'data/getBadgeList',
      userInfo: 'quests/getQuestUser',
      userAvatar: 'quests/getQuestUserAvatar',
      userCompany: 'quests/getQuestUserCompany',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    console.log(this.userData);
    // this.avatarUrl = this.userInfo.avatarId ? this.userInfo.avatar.url : '~/assets/img/app/avatar_empty.png';
    // this.questLat = this.questData?.location?.latitude;
    // this.questLng = this.questData?.location?.longitude;
    // this.userLat = this.userData?.location?.longitude;
    // this.userLng = this.userData?.location?.longitude;
    this.SetLoader(false);
  },
  methods: {
    showDistance() {
      return this.getDistanceFromLatLonInKm(
        this.location.lat,
        this.location.lng,
        this.userData.location ? this.userData.location.latitude : 0,
        this.userData.location ? this.userData.location.longitude : 0,
      );
    },
    shareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
      });
    },
    showProfile() {
      if (this.questData.user.id === this.userData.id) {
        this.$router.push(`/profile/${this.userData.id}`);
      } else {
        this.$router.push('/show-profile');
      }
    },
    convertDate() {
      if (this.questData.createdAt) {
        return moment(this.questData.createdAt).format('MMMM Do YYYY, h:mm');
      }
      return '';
    },
    getPriority(index) {
      const priority = {
        0: this.$t('priority.low'),
        1: this.$t('priority.normal'),
        2: this.$t('priority.urgent'),
      };
      return priority[index] || '';
    },
    getPriorityClass(index) {
      const priority = {
        0: 'priority__title_low',
        1: 'priority__title_normal',
        2: 'priority__title_urgent',
      };
      return priority[index] || '';
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
    flex-wrap: wrap;
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
  margin-bottom: 10px;
  flex-wrap: wrap;
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
      margin: 0 9px 5px 0;
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
    flex-wrap: wrap;
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
    object-fit: cover;
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
.priority {
  &__container {
    @include text-simple;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    display: flex;
    grid-gap: 10px;
  }
  &__title {
    @include text-simple;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    font-size: 12px;
    line-height: 130%;
    height: 24px;
    padding: 0 5px;
    &_low {
      background: rgba(34, 204, 20, 0.1);
      color: #22CC14;
    }
    &_urgent {
      background: rgba(223, 51, 51, 0.1);
      color: #DF3333;
    }
    &_normal {
      background: rgba(232, 210, 13, 0.1);
      color: #E8D20D;
    }
  }
}
</style>
