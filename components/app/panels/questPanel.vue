<template>
  <div class="user">
    <div class="user__top">
      <div class="user__container">
        <div class="user__head">
          <div
            class="user__left"
            @click="showProfile()"
          >
            <img
              class="user__img"
              :src="avatarUrl"
              alt=""
              loading="lazy"
            >
            <span class="user__username">
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
            <quest-dd
              v-if="userRole === 'employer'
                ? ![InfoModeEmployer.Closed, InfoModeEmployer.Done].includes(infoDataMode)
                : ![InfoModeWorker.WaitConfirm, InfoModeWorker.Done].includes(infoDataMode)"
            />
          </div>
        </div>
        <div class="location__container">
          <div
            v-if="questData"
            class="quest__location"
          >
            <span class="icon icon-location icon_fs-20" />
            <span
              v-if="questData.locationPlaceName"
              class="quest__address"
            >{{ questData.locationPlaceName }}</span>
            <span class="user__distance">
              {{ showDistance() }} {{ $t('distance.m') }} {{ $t('meta.fromYou') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="questData.questSpecializations"
      class="badge__container"
    >
      <ul class="badge-list">
        <li
          v-for="(skill, spec) in questData.questSpecializations"
          :key="spec"
          class="badge__item badge__item_blue"
        >
          {{ getSkillTitle(skill.path) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { InfoModeEmployer, InfoModeWorker } from '~/utils/enums';
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
      infoDataMode: 'quests/getInfoDataMode',
    }),
    InfoModeEmployer() {
      return InfoModeEmployer;
    },
    InfoModeWorker() {
      return InfoModeWorker;
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    getSkillTitle(path) {
      const [spec, skill] = path.split('.');
      return this.$t(`filters.items.${spec}.sub.${skill}`);
    },
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
      this.$router.push(`/profile/${this.questData.userId}`);
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

.badge {
  &-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  &__container {
    padding: 20px 0 20px 0;
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
    padding: 34px 0 25px 0;
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
  &__username {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
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
