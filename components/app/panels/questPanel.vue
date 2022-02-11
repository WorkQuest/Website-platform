<template>
  <div class="user">
    <div class="user__top">
      <div class="user__container">
        <div class="user__head">
          <div
            class="user__left"
            @click="showProfile"
          >
            <img
              class="user__img"
              :src="userAvatar || require('~/assets/img/app/avatar_empty.png')"
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
              {{ convertDate }}
            </span>
            <quest-dd
              v-if="questData.status === questStatuses.Created"
              :item-id="questData.id"
            />
          </div>
        </div>
        <div
          v-if="questData"
          class="location__container"
        >
          <div class="quest__location">
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
    <skills
      v-if="questData.questSpecializations"
      :specializations="questData.questSpecializations"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { InfoModeEmployer, InfoModeWorker, QuestStatuses } from '~/utils/enums';
import skills from '~/components/app/pages/common/skills';

export default {
  name: 'QuestPanel',
  components: {
    skills,
  },
  props: {
    location: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      userInfo: 'quests/getQuestUser',
      userAvatar: 'quests/getQuestUserAvatar',
      userCompany: 'quests/getQuestUserCompany',
      questData: 'quests/getQuest',
    }),
    InfoModeEmployer() {
      return InfoModeEmployer;
    },
    InfoModeWorker() {
      return InfoModeWorker;
    },
    questStatuses() {
      return QuestStatuses;
    },
    convertDate() {
      const { createdAt } = this.questData;
      return createdAt ? moment(createdAt).format('MMMM Do YYYY, h:mm') : '';
    },
  },
  mounted() {
    this.SetLoader(false);
  },
  methods: {
    getSkillTitle(path) {
      const [spec, skill] = path.split('.');
      return this.$t(`filters.items.${spec}.sub.${skill}`);
    },
    showDistance() {
      const { location: { lat, lng }, userData: { location } } = this;
      return this.getDistanceFromLatLonInKm(
        lat,
        lng,
        location?.latitude || 0,
        location?.longitude || 0,
      );
    },
    showProfile() {
      this.$router.push(`/profile/${this.questData.userId}`);
    },
  },
};
</script>

<style lang="scss" scoped>

.profile {
  &__img {
    width: 30px;
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

@include _991 {
  .user {
    &__container {
      padding-top: 20px;
    }
  }
}

@include _767 {
  .user {
    &__container {
      padding-top: 5px;
    }
  }
}
</style>
