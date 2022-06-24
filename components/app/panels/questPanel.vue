<template>
  <div
    class="user"
    data-selector="COMPONENT-QUEST-PANEL"
  >
    <div class="user__top">
      <div class="user__container">
        <div class="user__head">
          <div
            class="user__left"
            data-selector="ACTION-BTN-SHOW-PROFILE"
            @click="showProfile"
          >
            <img
              class="user__img"
              :src="userAvatar"
              alt=""
              loading="lazy"
            >
            <span class="user__username">
              {{ userName }}
            </span>
            <span
              v-if="userRole === $options.UserRole.EMPLOYER && userCompany"
              class="user__company"
            >
              {{ $t('meta.fromSmall') }} {{ userCompany }}
            </span>
          </div>
          <div class="user__right">
            <span class="user__date">
              {{ convertDate }}
            </span>
            <div class="user__btn">
              <quest-dd
                v-if="userData.id === questData.user.id && questDDMode"
                :data-selector="`QUEST-DD-${questData.id}`"
                :item="questData"
              />
              <base-btn
                v-else
                mode="share-btn"
                data-selector="SHARE-USER-PROFILE"
                @click="shareModal()"
              />
              <base-btn
                v-if="isShowReportBtn"
                mode="report"
                data-selector="OPEN-MODAL-REPORT"
                @click="showReportModal"
              >
                <span class="icon-warning_outline" />
              </base-btn>
            </div>
          </div>
        </div>
        <div
          v-if="questData"
          class="location__container"
        >
          <div class="quest__location">
            <span class="icon icon-location icon_fs-20" />
            <div
              v-if="questData.locationPlaceName"
              class="quest__address"
            >
              {{ questData.locationPlaceName }}
            </div>
            <div class="user__distance">
              {{ showDistance() }} {{ $t('meta.units.distance.m') }} {{ $t('meta.fromYou') }}
            </div>
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
import { EntityType, Path, UserRole } from '~/utils/enums';
import { QuestStatuses } from '~/utils/сonstants/quests';
import skills from '~/components/app/pages/common/skills';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'QuestPanel',
  UserRole,
  QuestStatuses,
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
      questData: 'quests/getQuest',
    }),
    userName() {
      return this.UserName(this.questData?.user?.firstName, this.questData?.user?.lastName);
    },
    userAvatar() {
      return this.questData?.user?.avatar?.url || images.EMPTY_AVATAR;
    },
    userCompany() {
      return this.questData?.user?.additionalInfo?.company;
    },
    questDDMode() {
      return [
        QuestStatuses.Created,
        QuestStatuses.Blocked,
      ].includes(this.questData.status);
    },
    convertDate() {
      const { createdAt } = this.questData;
      this.$moment.locale(this.$i18n.locale);
      return createdAt ? this.$moment(createdAt).format('MMMM Do YYYY, h:mm') : '';
    },
    isShowReportBtn() {
      return this.questData.userId !== this.userData.id;
    },
  },
  methods: {
    shareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
        itemId: this.questData.id,
        mode: 'quest',
      });
    },
    getSkillTitle(path) {
      const [spec, skill] = path.split('.');
      return this.$t(`filters.skills.${spec}.sub.${skill}`);
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
      this.$router.push(`${Path.PROFILE}/${this.questData.userId}`);
    },
    showReportModal() {
      const { title, id } = this.questData;
      this.ShowModal({
        key: modals.report,
        title,
        entityId: id,
        entityType: EntityType.QUEST,
      });
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
  color: $black700;
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
    padding: 25px 0 25px 0;
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
  }
  &__date {
    @include text-simple;
    color: $black500;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
  }
  &__img {
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      color: $black600;
    }
  }
  &__distance {
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
    align-items: center;
    gap: 10px;
  }
  &__company {
    @extend .user;
    margin: 0 0 0 10px;
    color: $black500;
  }
  &__btn{
    display: flex;
    gap: 2px;
  }
}

@include _1199 {
  .user {
    &__container {
      padding-top: 15px;
    }
  }
}

@include _767 {
  .user {
    &__left{
      width: 80%;
    }
    &__head{
      position: relative;
      gap: 10px;
    }
    &__date {
      display: inline-block;
      padding-right: 40px;
    }
    &__btn{
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .quest {
    &__location {
      margin-right: 0;
    }
  }

}
</style>
