<template>
  <div class="quests">
    <div class="quests__card card">
      <div
        v-for="item in object.quests"
        :key="item.id"
        class="card__content"
      >
        <div class="card__block block">
          <div
            class="block__left"
            :style="`background: url(${getQuestPreview(item).url}) no-repeat`"
          >
            <div
              class="block__state"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusCard(item.status) }}
            </div>
          </div>
          <div class="block__right">
            <div class="block__head">
              <div
                class="block__title"
                @click="showProfile(item.userId)"
              >
                <div class="block__avatar avatar">
                  <img
                    class="avatar__image"
                    :src=" item.user.avatar ? item.user.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                    :alt="item.user.firstName"
                    @click="goToProfile(item.user.id)"
                  >
                </div>
                <div
                  class="block__text block__text_title"
                  @click="goToProfile(item.user.id)"
                >
                  {{ `${item.user.firstName} ${item.user.lastName}` }}
                </div>
              </div>
              <div class="block__head-right">
                <div
                  class="block__icon block__icon_fav star"
                  @click="clickFavoriteStar(item)"
                >
                  <img
                    class="star__hover"
                    src="~assets/img/ui/star_hover.svg"
                    alt="favorite star"
                  >
                  <img
                    :class="[{'star__default': !item.star},{'star__checked': item.star}]"
                    :src="!item.star ? require('~/assets/img/ui/star_simple.svg') : require('~/assets/img/ui/star_checked.svg')"
                    alt=""
                  >
                </div>
                <div class="block__shared">
                  <quest-dd
                    v-if="item.status === questStatuses.Created"
                    class="block__icon block__icon_fav"
                    mode="vertical"
                    :item-id="item.id"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="item.assignedWorkerId"
              class="block__progress progress"
            >
              <div class="progress__title">
                {{ progressQuestText(item.status) }}
              </div>
              <div class="progress__container container">
                <div class="container__user user">
                  <img
                    class="user__avatar"
                    :src="item.assignedWorker.avatar ? item.assignedWorker.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                    :alt="`${item.assignedWorker.firstName} ${item.assignedWorker.lastName}`"
                    @click="goToProfile(item.assignedWorker.id)"
                  >
                  <div
                    class="user__name"
                    @click="goToProfile(item.assignedWorker.id)"
                  >
                    {{ item.assignedWorker.firstName }} {{ item.assignedWorker.lastName }}
                  </div>
                </div>
                <itemRating :rating="getRatingValue(item)" />
              </div>
            </div>
            <div class="block__locate">
              <span class="icon-location" />
              <span class="block__text block__text_locate">
                {{ showDistance(item.location.latitude, item.location.longitude) }}
                {{ `${$t('distance.m')} ${$t('meta.fromYou')}` }}
              </span>
            </div>
            <div class="block__text block__text_blue">
              {{ cropTxt(item.title) }}
            </div>
            <div class="block__text block__text_desc">
              {{ cropTxt(item.description) }}
            </div>
            <div class="block__text block__publication">
              <span class="block__publication_bold">{{ $t('quests.publicationDate') }}</span>
              <span class="block__publication_thin">{{ $moment(item.createdAt).format('Do MMMM YYYY, hh:mm a') }}</span>
            </div>
            <div class="block__actions">
              <div class="block__status">
                <div
                  v-if="item.priority !== 0 && item.status !== questStatuses.Done"
                  class="block__priority"
                  :class="getPriorityClass(item.priority)"
                >
                  {{ getPriority(item.priority) }}
                </div>
                <div
                  class="block__amount"
                  :class="getAmountStyles(item)"
                >
                  {{ `${item.price}  ${currency}` }}
                </div>
              </div>
              <div class="block__details">
                <base-btn
                  v-if="item.type !== 3"
                  mode="borderless-right"
                  @click="showDetails(item.id)"
                >
                  {{ $t('meta.details') }}
                  <template v-slot:right>
                    <span class="icon-short_right" />
                  </template>
                </base-btn>
                <div
                  v-if="item.status === questStatuses.Done && item.assignedWorkerId === userData.id"
                  class="block__rating"
                >
                  <div class="block__star">
                    <star-rating
                      :quest-index="i"
                      :rating-type="'questPage'"
                      :stars-number="5"
                      :rating="getRating(item)"
                      :is-disabled="item.yourReview !== null"
                      @input="showReviewModal($event, item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { QuestStatuses, questPriority } from '~/utils/enums';
import modals from '~/store/modals/modals';
import itemRating from '~/components/app/info/item-rating';

const value = new Vue();
export default {
  name: 'QuestsTab',
  components: {
    itemRating,
  },
  props: {
    object: {
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
      currency: 'WUSD',
      userLat: 0,
      userLng: 0,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
    }),
    questStatuses() {
      return QuestStatuses;
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
    getRatingValue(item) {
      return item.assignedWorker?.ratingStatistic?.status || 'noStatus';
    },
    getAmountStyles(item) {
      return [
        { block__amount_green: item.status !== this.questStatuses.Done },
        { block__amount_gray: item.status === this.questStatuses.Done },
      ];
    },
    goToProfile(id) {
      this.$router.push(`/profile/${id}`);
    },
    getQuestPreview(quest) {
      if (quest.medias.length) {
        for (let i = 0; i < quest.medias.length; i += 1) {
          const media = quest.medias[i];
          if (media.contentType.split('/')[0] === 'image') {
            return {
              url: media.url,
              alt: 'Quest preview',
            };
          }
        }
      }
      return {
        url: require('~/assets/img/temp/fake-card.svg'),
        alt: 'Fake quest preview',
      };
    },
    clickFavoriteStar(item) {
      this.$emit('clickFavoriteStar', item);
    },
    cropTxt(str) {
      const maxLength = 120;
      if (str.length > maxLength) str = `${str.slice(0, maxLength)}...`;
      return str;
    },
    progressQuestText(status) {
      if (!this.userRole) return '';
      switch (status) {
        case QuestStatuses.Active: return this.$t('quests.questActive:');
        case QuestStatuses.Closed: return this.$t('quests.questClosed:');
        case QuestStatuses.Dispute: return this.$t('quests.questDispute:');
        case QuestStatuses.WaitWorker: return this.$t('quests.inProgressBy');
        case QuestStatuses.WaitConfirm: return this.$t('quests.questWaitConfirm:');
        case QuestStatuses.Done: return this.$t('quests.finishedBy');
        default: return '';
      }
    },
    async getResponsesToQuestForAuthUser() {
      if (this.userRole === 'worker') {
        this.questResponses = await this.$store.dispatch('quests/getResponsesToQuestForAuthUser');
      }
    },
    showDistance(questLat, questLng) {
      return this.getDistanceFromLatLonInKm(
        questLat,
        questLng,
        this.userLat,
        this.userLng,
      );
    },
    cardsLevels(idx) {
      const { cards } = this;
      return [
        { card__level_checked: cards[idx].level.code === 3 },
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_higher: cards[idx].level.code === 1 },
      ];
    },
    showProfile(profileId) {
      this.$router.push(`/profile/${profileId}`);
    },
    showDetails(questId) {
      this.$router.push(`/quests/${questId}`);
    },
    showReviewModal(rating, item) {
      this.ShowModal({
        key: modals.review,
        item,
        rating,
      });
    },
    isHideStar(type) {
      return type !== 4 || type !== 3;
    },
    isRating(type) {
      return type === 3;
    },
    isHideStatus(type) {
      return type !== 4;
    },
    showMessageModal() {
      this.ShowModal({
        key: modals.sendARequest,
      });
    },
    getStatusCard(index) {
      const questStatus = {
        [QuestStatuses.Rejected]: this.$t('quests.rejected'),
        [QuestStatuses.Active]: this.$t('quests.active'),
        [QuestStatuses.Done]: this.$t('quests.performed'),
        [QuestStatuses.WaitConfirm]: this.$t('quests.requested'),
        [QuestStatuses.WaitWorker]: this.$t('quests.invited'),
        [QuestStatuses.Closed]: this.$t('quests.closed'),
      };
      return questStatus[index] || '';
    },
    getStatusClass(index) {
      const questStatus = {
        [QuestStatuses.Rejected]: 'quests__cards__state_clo',
        [QuestStatuses.Active]: 'quests__cards__state_act',
        [QuestStatuses.Done]: 'quests__cards__state_per',
        [QuestStatuses.WaitConfirm]: 'quests__cards__state_req',
        [QuestStatuses.WaitWorker]: 'quests__cards__state_inv',
        [QuestStatuses.Closed]: 'quests__cards__state_clo',
      };
      return questStatus[index] || '';
    },
    getPriority(index) {
      const priority = {
        [questPriority.Low]: this.$t('priority.low'),
        [questPriority.Normal]: this.$t('priority.normal'),
        [questPriority.Urgent]: this.$t('priority.urgent'),
      };
      return priority[index] || '';
    },
    getPriorityClass(index) {
      const priority = {
        [questPriority.Low]: 'block__priority_low',
        [questPriority.Normal]: 'block__priority_normal',
        [questPriority.Urgent]: 'block__priority_urgent',
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
  &__name {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    cursor: pointer;
  }
}
.right {
  justify-self: flex-end;
}
.icon {
  font-size: 20px;
  cursor: pointer;
  &-short_right:before {
    @extend .icon;
    content: "\ea6e";
    color: #0083C7;
  }
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
    display: grid;
    align-items: center;
    grid-template-columns: auto 3fr;
    grid-gap: 10px;
    padding-left: 0;
    margin: 7px 0 0 6px;
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
      background-color: #F6CF00;
    }
    &_reliable {
      @extend .status__levels;
      background-color: #BBC0C7;
    }
    &_checked {
      @extend .status__levels;
      background-color: #B79768;
    }
    &_disabled {
      display: none;
    }
  }
}
.quests {
  &__container {
    display: flex;
    justify-content: center;
  }
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
    color: $black800;
    margin: 20px 0 20px 0;
  }
  &__body {
    @extend .styles__full;
    max-width: 1180px;
  }
  &__content {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(6, auto);
    grid-gap: 10px;
    margin-bottom: 20px;
    &_employer {
      margin-bottom: 0;
    }
  }
  &__cards {
    &__state {
      &_clo {
        background: $red;
      }
      &_req {
        background: $grey;
        color: $black600 !important;
      }
      &_per {
        background: $blue;
      }
      &_act {
        background: $green;
      }
      &_inv {
        background: $yellow;
      }
    }
  }
  &__card {
    margin: 20px 0 0 0;
    border: 0 solid;
    border-radius: 6px;
    background-color: #f6f8fa;
    width: 100%;
    display: grid;
    justify-content: center;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    .card {
      &__content {
        border-radius: 6px 0 0 6px;
        box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
        &_per {
          height: 244px;
        }
      }
    }
  }
}
.block {
  background: #FFFFFF;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 210px 1fr;
  min-height: 100%;
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
    &_req {
      color: $black600;
      background-color: #E9EFF5;
    }
    &_per {
      background-color: #0083C7;
    }
    &_act {
      background-color: #00AA5B;
    }
    &_inv {
      background-color: #E8D20D;
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
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 15px;
  }
  &__amount {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 130%;
    text-transform: uppercase;
    &_green {
      color: #00AA5B;
    }
    &_gray {
      color: #B0B3B9;
    }
    &__performed {
      color: #B0B3B9;
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
  &__actions {
    grid-template-columns: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__right {
    padding: 20px 20px 20px 30px;
    display: grid;
    grid-template-columns: auto;
    grid-gap: 10px;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__head-right {
    display: flex;
    width: 70px;
    align-items: center;
    justify-content: flex-end;
  }
  &__shared {
    margin-left: 10px;
  }
  &__icon {
    &_fav {
      cursor: pointer;
    }
    &_perf {
      display: grid;
      grid-template-columns: repeat(5, 25px);
    }
  }
  &__btn {
    @extend .block__head;
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
    &_desc {
      font-size: 16px;
      line-height: 130%;
      color: $black700;
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
    cursor: pointer;
    display: grid;
    grid-template-columns: 30px 1fr;
    grid-gap: 10px;
    align-items: center;
  }
}
.star {
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
  .quests {
    .limit__container {
      display: grid;
      grid-template-columns: auto;
    }
    &__content {
      grid-template-columns: repeat(3, auto);
    }
    .block {
      &__left {
        height: 100%;
        width: 100%;
      }
    }
    .avatar {
      &__container {
        grid-template-columns: auto 3fr 3fr;
      }
    }
  }
}
@include _767 {
  .quests {
    .block {
      grid-template-columns: auto;
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
}
@include _575 {
  .quests {
    .block {
      &__actions{
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      &__btn {
        margin-top: 10px;
        padding: 0;
      }
    }
  }
}
@include _480 {
  .quests {
    &__content {
      grid-template-columns: repeat(2, auto);
    }
    .avatar {
      &__container {
        grid-template-columns: repeat(3, auto);
      }
    }
    .status {
      &__level {
        font-size: 12px;
      }
    }
    .block {
      &__right {
        padding: 10px;
      }
      &__amount_green {
        font-size: 18px;
      }
    }
  }
}
@include _380 {
  .quests {
    .block {
      &__amount_green {
        font-size: 16px;
      }
    }
  }
}
</style>
