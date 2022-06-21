<template>
  <div
    class="card-quest"
    :class="raiseCardStyle()"
    :data-selector="`COMPONENT-CARD-QUEST-${questIndex}`"
  >
    <div
      class="card-quest__left"
      :style="`background: url(${getQuestPreview(quest).url}) no-repeat`"
    >
      <div
        class="card-quest__state"
        :class="questState.class"
      >
        {{ questState.title }}
      </div>
    </div>
    <div class="card-quest__right">
      <div class="card-quest__head">
        <div>
          <item-rating
            v-if="quest.raiseView && $options.RaiseViewStatus[quest.raiseView.status]"
            :is-quest-rating="true"
            :rating="quest.raiseView.type"
          />
          <div
            class="card-quest__title"
            :data-selector="`ACTION-BTN-TO-CREATOR-QUEST-PROFILE-${questIndex}`"
            @click="showProfile(quest.userId)"
          >
            <div class="card-quest__avatar avatar">
              <img
                class="avatar__image"
                :alt="`${quest.user ? UserName(quest.user.firstName, quest.user.lastName) : ''}`"
                :src="quest.user && quest.user.avatar ? quest.user.avatar.url : $options.images.EMPTY_AVATAR"
              >
            </div>
            <div class="card-quest__text card-quest__text_title">
              {{ `${quest.user ? UserName(quest.user.firstName, quest.user.lastName) : ''}` }}
            </div>
          </div>
        </div>
        <div class="card-quest__head-right">
          <span
            v-if="quest.adType > 0"
            class="icon-circle_up"
          />
          <div
            v-if="quest.userId === userData.id || quest.assignedWorkerId === userData.id"
            class="card-quest__icon card-quest__icon_fav star"
            :class="[{'star__hide': disputeId.length !== 0}]"
            :data-selector="`ACTION-BTN-TOGGLE-FAVORITE-QUEST-${questIndex}`"
            @click="clickFavoriteStar(quest)"
          >
            <img
              class="star__hover"
              src="~assets/img/ui/star_hover.svg"
              alt="favorite star"
            >
            <img
              :class="[{'star__default': !quest.star},{'star__checked': quest.star}]"
              :src="!quest.star ? require( '~/assets/img/ui/star_simple.svg') : require('~/assets/img/ui/star_checked.svg')"
              alt=""
            >
          </div>
          <quest-dd
            v-if="quest && quest.status === $options.QuestStatuses.Created && userRole === $options.UserRole.EMPLOYER && quest.userId === userData.id"
            class="card-quest__icon card-quest__icon_fav"
            :quest-index="questIndex"
            :item="quest"
          />
          <button
            v-if="userRole === $options.UserRole.WORKER || quest.status !== $options.QuestStatuses.Created"
            :data-selector="`ACTION-BTN-TO-SHARE-QUEST-${questIndex}`"
            class="card-quest__shared"
            @click="shareModal(quest)"
          >
            <span class="card-quest__icon card-quest__icon_fav icon-share_outline" />
          </button>
        </div>
      </div>
      <div
        v-if="quest.assignedWorkerId"
        class="card-quest__progress progress"
      >
        <div class="progress__title">
          {{ questState.progressText }}
        </div>
        <div class="progress__container container">
          <div
            class="container__user user"
            :data-selector="`ACTION-BTN-TO-ASSIGNED-WORKER-PROFILE-${questIndex}`"
            @click="showProfile(quest.assignedWorker.id)"
          >
            <img
              class="user__avatar"
              :src="quest.assignedWorker.avatar ? quest.assignedWorker.avatar.url : $options.images.EMPTY_AVATAR"
              :alt="`${ quest.assignedWorker ? UserName(quest.assignedWorker.firstName, quest.assignedWorker.lastName) : '' }`"
            >
            <div class="user__name">
              {{ quest.assignedWorker ? UserName(quest.assignedWorker.firstName, quest.assignedWorker.lastName) : '' }}
            </div>
          </div>
          <item-rating :rating="quest.assignedWorker.ratingStatistic.status" />
        </div>
      </div>
      <div class="card-quest__locate">
        <span class="icon-location" />
        <span class="card-quest__text card-quest__text_locate">
          {{ showDistance(quest.location) }}
          {{ `${$t('meta.units.distance.m')} ${$t('meta.fromYou')}` }}
        </span>
      </div>
      <div
        v-if="quest.title"
        class="card-quest__text card-quest__text_blue"
      >
        {{ CropTxt(quest.title, 68) }}
      </div>
      <div
        v-if="quest.description"
        class="card-quest__text card-quest__text-description"
      >
        {{ CropTxt(quest.description, 98) }}
      </div>
      <div class="card-quest__text card-quest__publication">
        <span class="card-quest__publication_bold">{{ $t('quests.publicationDate') }}</span>
        <span class="card-quest__publication_thin">{{ $moment(quest.createdAt).format('Do MMMM YYYY, hh:mm a') }}</span>
      </div>
      <div class="card-quest__actions">
        <div class="card-quest__status">
          <div
            v-if="quest.priority !== 0 && quest.status !== $options.QuestStatuses.Done"
            class="card-quest__priority"
            :class="getPriorityClass(quest.priority)"
          >
            {{ getPriority(quest.priority) }}
          </div>
          <div
            v-if="quest.payPeriod"
            class="card-quest__payPeriod"
          >
            {{ $tc(`quests.payPeriods.${quest.payPeriod}`) }}
          </div>
          <div
            class="card-quest__amount"
            :class="getAmountStyles(quest)"
          >
            {{ `${questReward}  ${$options.TokenSymbols.WUSD}` }}
          </div>
        </div>
        <div class="card-quest__details">
          <base-btn
            v-if="quest.type !== 3"
            class="card-quest__btn-details"
            mode="borderless-right"
            :data-selector="`TO-QUEST-DETAILS-${questIndex}`"
            @click="showDetails(quest.id)"
          >
            {{ $t('meta.details') }}
            <template v-slot:right>
              <span class="icon-short_right" />
            </template>
          </base-btn>
          <div
            v-if="quest.status === $options.QuestStatuses.Done"
            class="card-quest__rating"
          >
            <star-rating
              v-if="userRole === $options.UserRole.WORKER ? quest.assignedWorkerId === userData.id : quest.userId === userData.id"
              class="card-quest__star"
              :stars-number="5"
              :data-selector="`ACTION-BTN-SHOW-REVIEW-MODAL-${quest.id}`"
              :rating="rating"
              :is-disabled="!!rating"
              @input="showReviewModal($event, quest.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  questPriority, UserRole, Path, TokenSymbols, QuestModeReview, RaiseViewStatus,
} from '~/utils/enums';
import { QuestsResponseStatus, QuestStatuses } from '~/utils/сonstants/quests';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'CardQuest',
  images,
  UserRole,
  TokenSymbols,
  QuestStatuses,
  RaiseViewStatus,
  props: {
    disputeId: {
      type: String,
      default: '',
    },
    questIndex: {
      type: Number,
      default: 0,
    },
    quest: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ratingStatistic: '',
      questResponses: [],
      isFavorite: false,
      localUserData: {},
      userLat: 0,
      userLng: 0,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
    }),
    rating() {
      return this.quest.yourReview?.mark || 0;
    },
    questReward() {
      return new BigNumber(this.quest.price).shiftedBy(-18).toString();
    },
    isWorker() {
      return this.userRole === UserRole.WORKER;
    },
    questStatusesData() {
      const statuses = {
        [QuestStatuses.Pending]: {
          title: '',
          progressText: '',
          class: 'info_hide',
        },
        [QuestStatuses.Created]: {
          title: this.quest?.responded?.workerId === this.userData.id ? this.$t('meta.responded') : '',
          progressText: this.$t('quests.questActive'),
          class: 'info_hide',
        },
        [QuestStatuses.WaitWorker]: {
          title: this.$t('quests.active'),
          progressText: this.$t('quests.inProgressBy'),
          class: 'card-quest__state_green',
        },
        [QuestStatuses.WaitWorkerOnAssign]: {
          title: this.isWorker ? this.$t('meta.invited') : '',
          progressText: this.$t('quests.questWaitConfirm'),
          class: this.isWorker ? 'card-quest__state_yellow' : '',
        },
        [QuestStatuses.WaitEmployerConfirm]: {
          title: this.$t('quests.pendingConsideration'),
          progressText: this.$t('quests.waitWorkerOnAssign'),
          class: 'card-quest__state_green',
        },
        [QuestStatuses.Dispute]: {
          title: this.$t('meta.disputeReview'),
          progressText: this.$t('quests.questDispute'),
          class: 'card-quest__state_red',
        },
        [QuestStatuses.Closed]: {
          title: this.$t('quests.closed'),
          progressText: this.$t('quests.questClosed'),
          class: 'card-quest__state_red',
        },
        [QuestStatuses.Done]: {
          title: this.isWorker ? this.$t('meta.performed') : this.$t('meta.completed'),
          progressText: this.$t('quests.finishedBy'),
          class: 'card-quest__state_blue',
        },
        [QuestStatuses.Responded]: {
          title: this.$t('meta.responded'),
          progressText: '',
          class: 'card-quest__state_gray',
        },
        [QuestStatuses.Invited]: {
          title: this.$t('quests.pending'),
          progressText: this.$t('quests.waitWorkerOnAssign'),
          class: 'card-quest__state_yellow',
        },
      };
      if (this.isWorker) {
        statuses[QuestStatuses.Rejected] = {
          title: this.$t('quests.rejected'),
          progressText: '',
          class: 'card-quest__state_red',
        };
      } else {
        statuses[QuestStatuses.Blocked] = {
          title: this.$t('quests.blocked'),
          progressText: '',
          class: 'card-quest__state_red',
        };
      }
      return statuses;
    },
    questState() {
      const {
        quest: {
          questChat, status: questStatus, invited, responded,
        },
        userData: { id: myId },
      } = this;

      if (questChat && questStatus === QuestStatuses.Created && myId === questChat.workerId && questChat.status === QuestsResponseStatus.Rejected) {
        // Case when user requested to the quest but employer was rejected you
        return this.questStatusesData[QuestStatuses.Rejected];
      }

      if (questStatus === QuestStatuses.Blocked) return this.questStatusesData[QuestStatuses.Blocked];

      if (this.isWorker) {
        if (responded) {
          if (questStatus === QuestStatuses.WaitWorkerOnAssign) return this.questStatusesData[QuestStatuses.WaitWorkerOnAssign];
          return this.questStatusesData[QuestStatuses.Responded];
        }
        if (invited) {
          return this.questStatusesData[QuestStatuses.Invited];
        }
      }
      return this.questStatusesData[questStatus || 0];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.localUserData = this.userData;
    this.userLat = this.localUserData?.location?.latitude;
    this.userLng = this.localUserData?.location?.longitude;
    this.SetLoader(false);
  },
  methods: {
    raiseCardStyle() {
      if (!RaiseViewStatus[this.quest.raiseView?.status]) return '';
      const res = ['card-quest__raise'];
      res.push({
        0: 'card-quest__raise_gold',
        1: 'card-quest__raise_gold',
        2: 'card-quest__raise_silver',
        3: 'card-quest__raise_bronze',
      }[this.quest.raiseView.type]);
      return res;
    },
    showDistance(location) {
      if (!location?.latitude && !location?.longitude) return 0;
      return this.getDistanceFromLatLonInKm(location.latitude, location.longitude, this.userLat, this.userLng);
    },
    shareModal(item) {
      this.ShowModal({
        key: modals.sharingQuest,
        itemId: item.id,
        mode: 'quest',
      });
    },
    getAmountStyles(item) {
      return [
        { 'card-quest__amount_green': item.status !== QuestStatuses.Done },
        { 'card-quest__amount_gray': item.status === QuestStatuses.Done },
      ];
    },
    getQuestPreview(quest) {
      if (quest?.medias?.length) {
        for (let i = 0; i < quest.medias.length; i += 1) {
          const media = quest.medias[i];
          if (media.contentType.split('/')[0] === 'image') return { url: media.url, alt: 'Quest preview' };
        }
      }
      return { url: require('~/assets/img/temp/fake-card.svg'), alt: 'Fake quest preview' };
    },
    clickFavoriteStar(item) {
      this.$emit('clickFavoriteStar', item);
    },
    showProfile(profileId) {
      this.$router.push(`${Path.PROFILE}/${profileId}`);
    },
    showDetails(questId) {
      this.$router.push(`${Path.QUESTS}/${questId}`);
    },
    showReviewModal(rating, id) {
      this.ShowModal({
        key: modals.review,
        title: this.$tc('modals.titles.reviewOnEmployer'),
        rating,
        callback: async (message, mark) => {
          const ok = await this.$store.dispatch('user/sendReviewForUser', {
            message,
            mark,
            questId: id,
            questMode: QuestModeReview.QUEST_LIST,
          });
          if (ok) {
            this.ShowModal({ key: modals.thanks });
          } else this.CloseModal();
        },
      });
    },
    getPriority(index) {
      const priority = {
        [questPriority.Low]: this.$t('meta.priority.fixedDelivery'),
        [questPriority.Normal]: this.$t('meta.priority.shortTerm'),
        [questPriority.Urgent]: this.$t('meta.priority.urgent'),
      };
      return priority[index] || '';
    },
    getPriorityClass(index) {
      const priority = {
        [questPriority.Low]: 'card-quest__priority_low',
        [questPriority.Normal]: 'card-quest__priority_normal',
        [questPriority.Urgent]: 'card-quest__priority_urgent',
      };
      return priority[index] || '';
    },
    getRating(item) {
      return item?.yourReview?.mark || 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.user {
  min-width: 0;

  &__name {
    @include text-simple;
    width: 100%;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      color: $blue;
    }
  }
}

.right {
  justify-self: flex-end;
}

.icon-circle_up {
  color: $black100;
  font-size: 24px;
}

.icon-share_outline {
  color: $black100;
  font-size: 24px;
}

.icon-short_right {
  font-size: 20px;
  cursor: pointer;
  color: $blue;
}

.progress {
  &__title {
    @include text-simple;
    margin: 10px 0 7px 10px;
    font-weight: 400;
    font-size: 12px;
    color: $black500;
  }

  &__container {
    @extend .styles__full;
    min-width: 0;
    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    grid-gap: 10px;
    padding-left: 0;
    margin: 7px 0 0 6px;
    justify-content: start;

    .container {
      &__user {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .user {
          &__avatar {
            border-radius: 50%;
            height: 30px;
            width: 30px;
            object-fit: cover;
            cursor: pointer;
            flex-shrink: 0;
            margin-right: 10px;
          }
        }
      }
    }
  }
}

.styles {
  &__full {
    width: 100%;
    height: 100%;
  }
}

.avatar {
  @extend .styles__full;
  max-height: 30px;
  max-width: 30px;
  border-radius: 50%;

  &__image {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    object-fit: cover;
    cursor: pointer;
  }

  &__col {
    &_left {
      max-width: 142px;
      padding: 0 15px 0 0;
    }
  }
}

.status {
  &__levels {
    padding: 2px 5px;
    margin: 0 5px 0 0;
    align-items: center;
    border-radius: 3px;
    color: $white;
  }

  &__level {
    display: grid;
    grid-template-columns: 20px auto;
    grid-gap: 7px;
    font-size: 12px;
    justify-content: flex-start;
    align-items: center;
    height: 20px;

    &_higher {
      @extend .status__levels;
      background-color: $yellow100;
    }

    &_reliable {
      @extend .status__levels;
      background-color: $grey200;
    }

    &_checked {
      @extend .status__levels;
      background-color: $brown;
    }

    &_disabled {
      display: none;
    }
  }
}

.card-quest {
  transition: .5s;
  border: 1px solid $white;
  background: $white;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 210px 1fr;

  &__raise {
    border: 1px solid !important;
    &_gold {
      border-color: $yellow100 !important;
    }
    &_silver {
      border-color: $grey200 !important;
    }
    &_bronze {
      border-color: $brown !important;
    }
  }

  &:hover {
    border: 1px solid $black100;
  }

  &__btn-details {
    height: 24px !important;
    width: 100%;
    min-width: 100px;
  }

  &__rating {
    height: 19px;
    align-self: center;
  }

  &__container {
    display: flex;
    justify-content: center;
  }

  &__details {
    display: flex;
    flex-direction: row-reverse;
    gap: 10px;
    height: 24px;
  }

  &__publication {
    &_bold {
      @include text-simple;
      font-size: 12px;
      font-weight: 500;
      color: $black600;
    }

    &_thin {
      @include text-simple;
      font-size: 12px;
      font-weight: 400;
      color: $black500;
    }
  }

  &__left {
    @extend .styles__full;
    position: relative;
    display: flex;
    background-size: cover !important;
    background-position: center !important;
    border-radius: 6px 0 0 6px;
  }

  &__state {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    padding: 0 20px;
    height: 41px;
    border-radius: 5px 0;
    color: #FFFFFF;
    top: 0;
    left: 0;

    &_gray {
      color: $black600;
      background-color: $black200;
    }

    &_blue {
      background-color: $blue;
    }

    &_green {
      background-color: $green;
    }

    &_yellow {
      background-color: $yellow100;
    }

    &_red {
      background-color: $red;
    }
  }

  &__progress {
    background-color: $black0;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    height: 73px;
    width: 100%;
    padding: 10px;
  }

  &__locate {
    display: grid;
    grid-template-columns: 20px 1fr;
    grid-gap: 5px;
    align-items: center;

    span::before {
      font-size: 20px;
      color: $black500;
    }
  }

  &__status {
    display: flex;
    align-self: flex-start;
    align-items: center;
    gap: 10px;
  }

  &__amount {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    height: 24px;
    text-transform: uppercase;

    &_green {
      color: $green;
    }

    &_gray {
      color: $black200;
    }

    &__performed {
      color: $black400;
    }
  }

  &__priority {
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
      color: $green;
    }

    &_urgent {
      background: rgba(223, 51, 51, 0.1);
      color: $red;
    }

    &_normal {
      background: rgba(232, 210, 13, 0.1);
      color: $yellow;
    }
  }
  &__payPeriod {
    @include text-simple;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    font-size: 12px;
    line-height: 130%;
    height: 24px;
    padding: 0 5px;
    background: $grey100;
    color: $black800;

  }

  &__actions {
    grid-template-columns: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__right {
    min-width: 0;
    padding: 20px 20px 20px 30px;
    display: grid;
    grid-template-columns: auto;
    grid-gap: 10px;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-right {
      display: flex;
      width: auto;
      align-items: flex-start;
      justify-content: flex-end;
      gap: 5px;
      margin-bottom: auto;
    }
  }

  &__shared {
    height: 24px;
    width: 24px;
  }

  &__icon {
    &_fav {
      cursor: pointer;
      transition: .5s;

      &:hover {
        color: $black200;
      }
    }

    &_perf {
      display: grid;
      grid-template-columns: repeat(5, 25px);
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    min-width: 146px;
    height: 34px;
    background: transparent;

    span::before {
      font-size: 24px;
      color: $blue;
    }
  }

  &__text {
    @include text-simple;

    &_details {
      font-size: 16px;
      line-height: 130%;
      color: $blue;
    }

    &-description {
      font-size: 16px;
      line-height: 130%;
      color: $black700;
      word-wrap: break-word;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &_blue {
      font-weight: 500;
      font-size: 18px;
      line-height: 130%;
      color: $blue;
    }

    &_title {
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
      color: $black800;
      cursor: pointer;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      &:hover {
        color: $blue;
      }
    }

    &_locate {
      font-size: 14px;
      line-height: 130%;
      color: #7C838D;
    }

    &_grey {
      font-size: 16px;
      line-height: 130%;
      color: #7C838D;
    }
  }

  &__avatar {
    max-width: 30px;
    max-height: 30px;
    border-radius: 50%;

    &__img {
      border-radius: 100%;
      height: 100%;
    }
  }

  &__title {
    @include text-simple;
    cursor: pointer;
    display: grid;
    grid-template-columns: 30px 1fr;
    grid-gap: 10px;
    align-items: center;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
    color: $black800;
    margin-top: 5px;
  }

  &__cards {
    &_red {
      background: $red;
    }

    &_gray {
      background: $grey;
      color: $black600 !important;
    }

    &_blue {
      background: $blue;
    }

    &_green{
      background: $green;
    }

    &_yellow {
      background: $yellow;
    }
  }

  &__card {
    margin: 20px 0 0 0;
    border: 0 solid;
    border-radius: 6px;
    background-color: $black200;
    width: 100%;
    display: grid;
    justify-content: center;
    grid-template-columns: 1fr;
    grid-gap: 20px;

    &__content {
      border-radius: 6px 0 0 6px;
      box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);

      &_per {
        height: 244px;
      }
    }
  }
}

.star {
  height: 30px;
  width: 30px;
  align-self: center;
  justify-self: center;

  &__hide {
    display: none;
  }

  &__default {
    display: flex;
  }

  &__hover {
    display: none;
  }

  &:hover {
    .star {
      &__hover {
        display: flex;
      }

      &__default {
        display: none;
      }

      &__checked {
        display: none;
      }
    }
  }
}

@include _991 {
  .card-quest {
    grid-template-columns: auto;

    &__right {
      padding-left: 20px;
    }

    &__left {
      height: 200px;
      border-radius: 6px 6px 0 0;

      img {
        border-radius: 6px;
        height: 100%;
        width: 100%;
      }
    }

    .avatar {
      &__container {
        grid-template-columns: auto repeat(2, 3fr);
      }
    }
  }
}

@include _767 {
  .card-quest {
    &__left {
      height: 200px;
      border-radius: 6px 6px 0 0;

      img {
        border-radius: 6px;
        height: 100%;
        width: 100%;
      }
    }
  }
}

@include _575 {
  .card-quest {
    &__amount {
      font-size: 16px;
    }

    &__btn-details {
      height: 24px !important;
      font-size: 13px !important;
    }

    &__actions {
      display: grid;
      grid-template-columns: 1fr;
    }

    &__btn {
      margin-top: 10px;
      padding: 0;
    }
  }
}

@include _480 {
  .card-quest {
    &__actions {
      grid-template-columns: 1fr;
    }

    &__right {
      padding: 10px;
    }
  }
  .status {
    &__level {
      font-size: 12px;
    }
  }
  .avatar {
    &__container {
      grid-template-columns: repeat(3, auto);
    }
  }
}

@include _380 {
  .card-quest__progress {
    height: 100%;
  }
  .progress__container {
    grid-template-columns: auto;
  }
}
</style>
