<template>
  <div
    class="quests"
  >
    <div
      v-if="[1].includes(pageMode)"
      class="quests__card card"
    >
      <div
        v-for="(item, i) in object"
        :key="i"
        class="card__content"
      >
        <div
          class="card__block block"
        >
          <div
            class="block__left"
          >
            <img
              src="~/assets/img/temp/fake-card.svg"
              class="block__image"
              alt=""
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
              <div class="block__title">
                <div
                  class="block__avatar avatar"
                >
                  <img
                    class="avatar__image"
                    :src="item.quest.user.avatar ? item.quest.user.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                    :alt="item.quest.user.firstName"
                  >
                </div>
                <div class="block__text block__text_title">
                  {{ `${item.quest.user.firstName} ${item.quest.user.lastName}` }}
                  <span
                    v-if="userCompany"
                    class="block__text block__text_grey"
                  >{{ `${$t('quests.fromSmall')} ${item.quest.user.additionalInfo.company}` }}</span>
                </div>
              </div>
              <div
                class="block__icon block__icon_fav star"
                @click="setStar(item.quest.id)"
              >
                <img
                  class="star__hover"
                  src="~assets/img/ui/star_hover.svg"
                  alt=""
                >
                <img
                  :class="[
                    {'star__default': !item.star},
                    {'star__checked': item.star}
                  ]"
                  :src="!item.star ? require('~/assets/img/ui/star_simple.svg') : require('~/assets/img/ui/star_checked.svg')"
                  alt=""
                >
              </div>
            </div>
            <div
              v-if="item.quest.assignedWorkerId"
              class="block__progress progress"
            >
              <div
                class="progress__title"
              >
                {{ progressQuestText(item.quest.status) }}
              </div>
              <div class="progress__container container">
                <div class="container__user user">
                  <img
                    class="user__avatar"
                    :src="item.quest.assignedWorker.avatar ? item.quest.assignedWorker.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                    :alt="`${item.quest.assignedWorker.firstName} ${item.quest.assignedWorker.lastName}`"
                  >
                  <div class="user__name">
                    {{ item.quest.assignedWorker.firstName }} {{ item.quest.assignedWorker.lastName }}
                  </div>
                </div>
                <div class="container__status status">
                  <!--                  <span-->
                  <!--                    class="status__level"-->
                  <!--                    :class="getStatusCard(item.level)"-->
                  <!--                  >-->
                  <!--                    {{ $t(`levels.${item.level}`) }}-->
                  <!--                  </span>-->
                </div>
              </div>
            </div>
            <div class="block__locate">
              <span
                class="icon-location"
              />
              <span class="block__text block__text_locate">
                {{ showDistance(item.quest.location.latitude, item.quest.location.longitude) }}
                {{ `${$t('distance.m')} ${$t('meta.fromYou')}` }}
              </span>
            </div>
            <div class="block__text block__text_blue">
              {{ cropTxt(item.quest.title) }}
            </div>
            <div class="block__text block__text_desc">
              {{ cropTxt(item.quest.description) }}
            </div>
            <div class="block__actions">
              <div
                v-if="isHideStatus(item.quest.type)"
                class="block__status"
              >
                <div
                  class="block__priority"
                  :class="getPriorityClass(item.quest.priority)"
                >
                  {{ getPriority(item.quest.priority) }}
                </div>
                <div class="block__amount block__amount_green">
                  {{ `${item.quest.price}  ${currency}` }}
                </div>
              </div>
              <div
                v-else
                class="block__amount block__amount_gray"
              >
                {{ `${item.quest.price}  ${currency}` }}
              </div>
              <div class="block__details">
                <base-btn
                  v-if="item.quest.type !== 3"
                  mode="borderless-right"
                  @click="showDetails(item.quest.id)"
                >
                  {{ $t('meta.details') }}
                  <template v-slot:right>
                    <span class="icon-short_right" />
                  </template>
                </base-btn>
                <div
                  v-else
                  class="block__rating"
                >
                  <div class="block__rating block__rating_star">
                    <button
                      @click="showReviewModal(item.quest.user.ratingStatistic)"
                    >
                      <b-form-rating
                        v-model="item.quest.user.ratingStatistic"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="[2,3,4].includes(pageMode)"
      class="quests__card card"
    >
      <div
        v-for="(item, i) in object.quests"
        :key="i"
        class="card__content"
      >
        <div
          class="card__block block"
        >
          <div
            class="block__left"
          >
            <img
              src="~/assets/img/temp/fake-card.svg"
              class="block__image"
              alt=""
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
              <div class="block__title">
                <div
                  class="block__avatar avatar"
                >
                  <img
                    class="avatar__image"
                    :src="item.user.avatar ? item.user.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                    :alt="item.user.firstName"
                  >
                </div>
                <div class="block__text block__text_title">
                  {{ `${item.user.firstName} ${item.user.lastName}` }}
                  <span
                    v-if="userCompany"
                    class="block__text block__text_grey"
                  >{{ `${$t('quests.fromSmall')} ${item.user.additionalInfo.company ? item.user.additionalInfo.company : 'Without company'}` }}</span>
                </div>
              </div>
              <quest-dd
                v-if="[0,4].includes(item.status)"
                class="block__icon block__icon_fav"
                mode="vertical"
              />
              <div
                v-if="[2,3,6].includes(item.status)"
                class="block__icon block__icon_fav star"
                @click="setStar(item)"
              >
                <img
                  class="star__hover"
                  src="~assets/img/ui/star_hover.svg"
                  alt=""
                >
                <img
                  :class="[
                    {'star__default': !item.star},
                    {'star__checked': item.star}
                  ]"
                  :src="!item.star ? require('~/assets/img/ui/star_simple.svg') : require('~/assets/img/ui/star_checked.svg')"
                  alt=""
                >
              </div>
            </div>
            <div
              v-if="item.assignedWorkerId"
              class="block__progress progress"
            >
              <div
                class="progress__title"
              >
                {{ progressQuestText(item.status) }}
              </div>
              <div class="progress__container container">
                <div class="container__user user">
                  <img
                    class="user__avatar"
                    :src="item.assignedWorker.avatar ? item.assignedWorker.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                    :alt="`${item.assignedWorker.firstName} ${item.assignedWorker.lastName}`"
                  >
                  <div class="user__name">
                    {{ item.assignedWorker.firstName }} {{ item.assignedWorker.lastName }}
                  </div>
                </div>
                <!--                <div class="container__status status">-->
                <!--                  <span-->
                <!--                    class="status__level"-->
                <!--                    :class="getStatusCard(item.level.code)"-->
                <!--                  >-->
                <!--                    {{ $t(`levels.${item.level.code}`) }}-->
                <!--                  </span>-->
                <!--                </div>-->
              </div>
            </div>
            <div class="block__locate">
              <span
                class="icon-location"
              />
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
              <div
                v-if="isHideStatus(item.type)"
                class="block__status"
              >
                <div
                  class="block__priority"
                  :class="getPriorityClass(item.priority)"
                >
                  {{ getPriority(item.priority) }}
                </div>
                <div class="block__amount block__amount_green">
                  {{ `${item.price}  ${currency}` }}
                </div>
              </div>
              <div
                v-else
                class="block__amount block__amount_gray"
              >
                {{ `${item.price}  ${currency}` }}
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
                  v-else
                  class="block__rating"
                >
                  <div class="block__rating block__rating_star">
                    <button
                      @click="showReviewModal(item.user.ratingStatistic)"
                    >
                      <b-form-rating
                        v-model="item.user.ratingStatistic"
                      />
                    </button>
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
import modals from '~/store/modals/modals';

const value = new Vue();
export default {
  name: 'QuestsTab',
  props: {
    limit: {
      type: Number,
      default: 10,
    },
    page: {
      type: [String, null],
      default: '',
    },
    selectedTab: {
      type: Number,
      default: 0,
    },
    object: {
      type: [Object, Array],
      default: null,
    },
  },
  data() {
    return {
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
    pageMode() {
      if (this.userRole === 'worker') {
        if (this.$route.path === '/my') {
          return 1;
        }
        if (this.$route.path !== '/my') {
          return 2;
        }
      }
      if (this.userRole === 'employer') {
        if (this.$route.path === '/my') {
          return 3;
        }
        if (this.$route.path !== '/my') {
          return 4;
        }
      }
      return 0;
    },
    userCompany() {
      return this.userData.additionalInfo?.company || null;
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
    async setStar(item) {
      if (!item.star) {
        await this.$store.dispatch('quests/setStarOnQuest', item.id);
      } if (item.star) {
        await this.$store.dispatch('quests/takeAwayStarOnQuest', item.id);
      }
    },
    cropTxt(str) {
      const maxLength = 120;
      if (str.length > maxLength) str = `${str.slice(0, maxLength)}...`;
      return str;
    },
    progressQuestText(status) {
      if (this.userRole) {
        if ([1].includes(status)) {
          return this.$t('quests.questActive:');
        } if ([2].includes(status)) {
          return this.$t('quests.questClosed:');
        } if ([3].includes(status)) {
          return this.$t('questDispute:');
        } if ([4].includes(status)) {
          return this.$t('quests.inProgressBy');
        } if ([5].includes(status)) {
          return this.$t('questWaitConfirm:');
        } if ([6].includes(status)) {
          return this.$t('quests.finishedBy');
        }
      }
      return '';
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
    showDetails(questId) {
      this.$router.push(`/quests/${questId}`);
    },
    showReviewModal(rating) {
      this.ShowModal({
        key: modals.review,
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
      const status = {
        '-1': 'Rejected',
        1: this.$t('quests.active'),
        6: this.$t('quests.performed'),
        5: this.$t('quests.requested'),
        4: this.$t('quests.invited'),
        2: this.$t('quests.closed'),
      };
      return status[index] || '';
    },
    getStatusClass(index) {
      const status = {
        '-1': 'quests__cards__state_clo',
        1: 'quests__cards__state_act',
        6: 'quests__cards__state_per',
        5: 'quests__cards__state_req',
        4: 'quests__cards__state_inv',
        2: 'quests__cards__state_clo',
      };
      return status[index] || '';
    },
    getPriority(index) {
      const priority = {
        0: '',
        1: this.$t('priority.low'),
        2: this.$t('priority.normal'),
        3: this.$t('priority.urgent'),
      };
      return priority[index] || '';
    },
    getPriorityClass(index) {
      const priority = {
        0: '',
        1: 'block__priority_low',
        2: 'block__priority_normal',
        3: 'block__priority_urgent',
      };
      return priority[index] || '';
    },
  },
};
</script>
<style lang="scss" scoped>
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
    margin: 10px 0 0 0;
    .container {
      &__user {
        display: flex;
        grid-gap: 20px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .user {
          &__avatar {
            border-radius: 50%;
            height: 30px;
            width: 30px;
            object-fit: cover;
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
      &_req {}
      &_per {
        background: $blue;
      }
      &_act {
        background: $green;
      }
      &_inv {}
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
  grid-template-columns: 240px 1fr;
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
    height: auto;
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
      @extend .block__amount;
      color: #00AA5B;
    }
    &_gray {
      @extend .block__amount;
      color: #B0B3B9;
    }
    &__performed {
      @extend .block__amount;
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
    display: grid;
    grid-template-columns: 30px 1fr;
    grid-gap: 10px;
    align-items: center;
  }
  &__image {
    border-radius: 6px 0 0 6px;
    object-fit: cover;
    max-height: 500px;
    height: 100%;
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
@include _1199 {
  .quests {
    padding: 10px;
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
        grid-template-columns: 1fr;
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
