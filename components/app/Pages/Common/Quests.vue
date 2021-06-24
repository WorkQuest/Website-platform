<template>
  <div class="main__body">
    <div class="quests">
      <div class="quests__container">
        <div class="quests__body">
          <div class="quests__title">
            {{ $t('quests.MyQuests') }}
          </div>
          <div class="quests__content">
            <base-btn
              v-for="item in tabs"
              :key="item.id"
              :mode="btnMode(item.id)"
              class="quests__btn"
              @click="filterCards(item.id)"
            >
              {{ item.title }}
            </base-btn>
          </div>
          <div class="quests__cards">
            <div
              v-for="(item, i) in filteredCards(selectedTab, isShowFavourite)"
              :key="item.id"
              class="quests__cards__all"
            >
              <div
                class="quests__block block"
              >
                <div class="block__left">
                  <div class="block__img">
                    <img
                      src="~/assets/img/temp/fake-card.svg"
                      class="quests__img image"
                      alt=""
                    >
                  </div>
                  <div
                    class="quests__cards__state"
                    :class="getStatusClass(item.type)"
                  >
                    {{ getStatusCard(item.type) }}
                  </div>
                </div>
                <div class="block__right">
                  <div class="block__head">
                    <div class="block__title">
                      <div
                        class="block__avatar"
                      >
                        <img
                          class="avatar"
                          :src="item.background"
                          alt=""
                        >
                      </div>
                      <div class="block__text block__text_title">
                        {{ item.title }}
                        <span
                          v-if="item.sub"
                          class="block__text block__text_grey"
                        >{{ item.sub }}</span>
                      </div>
                    </div>
                    <div
                      v-if="isHideStar(item.type)"
                      class="block__icon block__icon_fav star"
                      @click="item.isFavourite = !item.isFavourite"
                    >
                      <img
                        class="star__hover"
                        src="~assets/img/ui/star_hover.svg"
                        alt=""
                      >
                      <img
                        v-if="!item.isFavourite"
                        class="star__default"
                        src="~assets/img/ui/star_simple.svg"
                        alt=""
                      >
                      <img
                        v-if="item.isFavourite"
                        class="star__checked"
                        src="~assets/img/ui/star_checked.svg"
                        alt=""
                      >
                    </div>
                  </div>
                  <div
                    v-if="item.inProgress.work === true"
                    class="block__progress"
                  >
                    <div class="container__title">
                      In progress by:
                    </div>
                    <div class="limit__container">
                      <div class="avatar__container">
                        <div class="avatar">
                          <img
                            :src="User.avatar"
                            :alt="User.name"
                          >
                        </div>
                        <div>
                          {{ item.inProgress.name }}
                        </div>
                        <div class="">
                          <span
                            v-if="item.level.code !== 0"
                            class="card__level_higher"
                            :class="cardsLevels(i)"
                          >
                            <span v-if="item.level.code === 1">
                              HIGHER LEVEL
                            </span>
                            <span v-if="item.level.code === 2">
                              RELIABLE EMP.
                            </span>
                            <span v-if="item.level.code === 3">
                              CHECKED BY TIME
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="block__locate">
                    <span class="icon-location" />
                    <span class="block__text block__text_locate">{{ item.distance }}{{ $t('distance.m') }} {{ $t('meta.fromYou') }}</span>
                  </div>
                  <div class="block__text block__text_blue">
                    {{ item.theme }}
                  </div>
                  <div class="block__text block__text_desc">
                    {{ item.desc }}
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
                      <div class="block__amount_green">
                        {{ item.amount }} {{ item.symbol }}
                      </div>
                    </div>
                    <div
                      v-else
                      class="block__amount_gray"
                    >
                      {{ item.amount }} {{ item.symbol }}
                    </div>
                    <div class="block__details">
                      <base-btn
                        v-if="item.type !== 3"
                        mode="borderless-right"
                        @click="showDetails()"
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
                            @click="showReviewModal(item.rating)"
                          >
                            <b-form-rating
                              v-model="item.rating"
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
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import modals from '~/store/modals/modals';

const value = new Vue();

export default {
  name: 'QuestsTab',
  data() {
    return {
      selectedTab: 0,
      isShowFavourite: false,
    };
  },
  computed: {
    cardLevelClass(idx) {
      const { Cards } = this;
      return [
        { card__level_reliable: Cards[idx].level.code === 2 },
        { card__level_checked: Cards[idx].level.code === 3 },
      ];
    },
    Tabs() {
      return this.$store.getters['data/getTabs'];
    },
    Cards() {
      return this.$store.getters['data/getCards'];
    },
    User() {
      return this.$store.getters['data/getUserInfo'];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    cardsLevels(idx) {
      const { Cards } = this;
      return [
        { card__level_checked: Cards[idx].level.code === 3 },
        { card__level_reliable: Cards[idx].level.code === 2 },
        { card__level_higher: Cards[idx].level.code === 1 },
      ];
    },
    showDetails() {
      this.$router.push('/quests/1');
    },
    showReviewModal(rating) {
      this.ShowModal({
        key: modals.review,
        rating,
      });
    },
    isHideStar(type) {
      return !(type === 4 || type === 3);
    },
    isRating(type) {
      return (type === 3);
    },
    isHideStatus(type) {
      return !(type === 3);
    },
    filterCards(id) {
      this.selectedTab = id;
      this.isShowFavourite = id === 1;
    },
    filteredCards(type, isFavorite) {
      if (type === 0) {
        return this.Cards;
      }
      if (isFavorite) {
        return this.Cards.filter((x) => x.isFavourite);
      }
      return this.Cards.filter((x) => x.type === type);
    },
    btnMode(id) {
      if (this.selectedTab === id) {
        return ' ';
      }
      return 'light';
    },
    getStatusCard(index) {
      const status = {
        0: '',
        1: '',
        2: this.$t('Requested'),
        3: this.$t('Performed'),
        4: this.$t('Active'),
        5: this.$t('Invited'),
      };
      return status[index] || '';
    },
    getStatusClass(index) {
      const status = {
        0: '',
        1: '',
        2: this.$t('quests__cards__state_req'),
        3: this.$t('quests__cards__state_per'),
        4: this.$t('quests__cards__state_act'),
        5: this.$t('quests__cards__state_inv'),
      };
      return status[index] || '';
    },
    getPriority(index) {
      const priority = {
        0: this.$t('priority.low'),
        1: this.$t('priority.normal'),
        2: this.$t('priority.urgent'),
      };
      return priority[index] || 'None';
    },
    getPriorityClass(index) {
      const priority = {
        0: this.$t('block__priority_low'),
        1: this.$t('block__priority_normal'),
        2: this.$t('block__priority_urgent'),
      };
      return priority[index] || '';
    },
  },
};
</script>

<style lang="scss" scoped>

.icon {
  font-size: 20px;
  cursor: pointer;
  &-short_right:before {
    @extend .icon;
    content: "\ea6e";
    color: #0083C7;
  }
}
.container {
  &__title {
    font-weight: 400;
    font-size: 12px;
    color: $black500;
  }
}
.limit__container {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
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
  &__container {
    @extend .styles__full;
    display: grid;
    grid-template-columns: 0.2fr 0.6fr 1fr;
    margin: 10px 0 4px 0;
  }
}
.card {
  &__levels {
    padding: 2px 8px;
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
      @extend .card__levels;
      background-color: #F6CF00;
    }
    &_reliable {
      @extend .card__levels;
      background-color: #BBC0C7;
    }
    &_checked {
      @extend .card__levels;
      background-color: #B79768;
    }
    &_disabled {
      display: none;
    }
  }
}
.quests {
  width: 100%;
  background-color: #f6f8fa;
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
    padding: 20px 0;
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
  }
  &__cards {
    border-radius: 6px;
    width: 100%;
    display: grid;
    justify-content: center;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    &__all {
      box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
      &_per {
        height: 244px;
      }
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

    .image {
      border-radius: 6px 0 0 6px;
      object-fit: cover;
      max-height: 500px;
      height: 100%;
    }
  }

  .block {
    background: #FFFFFF;
    border-radius: 6px;
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100%;
    &__left {
      position: relative;
    }
    &__progress {
      background-color: $black0;
      border-radius: 6px;
      width: 100%;
      padding:10px;
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
    &__img {
      @extend .styles__full;
    }
    &__title {
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
      &__img {
        height: 100%;
        width: 100%;
        img {
          border-radius: 6px;
        }
      }
    }
  }
}
@include _767 {
  .quests {
    .limit__container {
      display: grid;
      grid-template-columns: auto;
    }
    .block {
      grid-template-columns: auto;
      &__img {
        height: 200px;
        img {
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
