<template>
  <!-- Quest page_User -->
  <div>
    <div class="main">
      <div class="main__body">
        <div class="user__top">
          <div class="user__container">
            <div class="user__head">
              <div class="user__left">
                <img
                  class="user__img"
                  src="~/assets/img/app/fake_profile.png"
                >
                <p class="user__username">
                  {{ user.username }}
                </p>
                <p class="user__company">
                  from {{ user.company }}
                </p>
              </div>
              <div class="user__right">
                <p class="user__date">
                  {{ user.date }}
                </p>
                <div class="icon__wrapper">
                  <span class="icon-share_outline" />
                </div>
              </div>
            </div>
            <div class="location__container">
              <div class="quest__location">
                <div class="icon__wrapper0">
                  <span
                    class="icon-location"
                  />
                </div>
                <p>{{ quest.location }}</p>
              </div>
              <nuxt-link
                :to="user.distanceLink"
                class="user__distance"
              >
                {{ user.distance }}
              </nuxt-link>
              <div class="performance__container">
                <div class="icon__wrapper0">
                  <span class="icon-clock" />
                </div>
                <p class="performance__title">
                  Performance timer
                </p>
                <nuxt-link
                  class="performance__link"
                  to="quest.runtimeLink"
                >
                  {{ quest.performanceTimer }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div class="badge__container">
          <ul class="badgeList">
            <li
              v-for="item in badgeList"
              :key="`item-${item.id}`"
              class="badge__blue"
            >
              {{ item.text }}
            </li>
          </ul>
        </div>
        <div class="quest__container">
          <h2 class="quest__title">
            {{ quest.title }}
          </h2>
          <p class="quest__body">
            {{ quest.body }}
          </p>
        </div>
        <hr class="hr__line">
        <div class="quest_materials__container">
          <h2 class="quest_materials__title">
            Quest materials
          </h2>
          <div class="img__container">
            <img
              class="img__item"
              src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
              alt=""
            >
            <img
              class="img__item"
              src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
              alt=""
            >
            <img
              class="img__item"
              src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
              alt=""
            >
            <img
              class="img__item"
              src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
              alt=""
            >
          </div>
          <hr>
          <div class="price__wrapper">
            <div class="btn__wrapper">
              <base-btn
                @click="showMessageModal()"
              >
                Send a request
              </base-btn>
            </div>
            <div class="price__wrapperValue">
              <p class="price__value">
                {{ quest.price }}
              </p>
              <div class="badge__wrapper">
                <span class="badge__green">{{ quest.badgeGreen }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map__container">
      <transition name="fade-fast">
        <GMap
          v-if="isShowMap"
          ref="gMap"
          class="quests__map"
          language="en"
          :center="{lat: locations[0].lat, lng: locations[0].lng}"
          :zoom="6"
        />
      </transition>
    </div>
    <div class="main">
      <div class="spec__container">
        <div class="quest__group">
          <h2 class="quest__spec">
            Other quests for the specialization
            <nuxt-link
              to="#"
              class="spec__link"
            >
              "{{ quest.spec }}"
            </nuxt-link>
          </h2>
        </div>
        <p class="quest__count">
          {{ quest.amount }}
        </p>
        <div class="quest__card">
          <!-- Cards -->
          <div class="quests__cards">
            <div
              v-for="(item, i) in cards"
              :key="i"
              class="quests__block block"
            >
              <div class="block__left">
                <div class="block__img">
                  <img
                    src="~assets/img/temp/fake-card.svg"
                    alt=""
                  >
                </div>
              </div>
              <div class="block__right">
                <div class="block__head">
                  <div class="block__title">
                    <div class="block__avatar">
                      <img
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
                    class="block__icon block__icon_fav star"
                    @click="item.favourite = !item.favourite"
                  >
                    <img
                      class="star__hover"
                      src="~assets/img/ui/star_hover.svg"
                      alt=""
                    >
                    <img
                      v-if="!item.favourite"
                      class="star__default"
                      src="~assets/img/ui/star_simple.svg"
                      alt=""
                    >
                    <img
                      v-if="item.favourite"
                      class="star__checked"
                      src="~assets/img/ui/star_checked.svg"
                      alt=""
                    >
                  </div>
                </div>
                <div class="block__locate">
                  <span class="icon-location" />
                  <span class="block__text block__text_locate">200m {{ $t('meta.fromYou') }}</span>
                </div>
                <div class="block__text block__text_blue">
                  {{ item.theme }}
                </div>
                <div class="block__text block__text_desc">
                  {{ item.desc }}
                </div>
                <div class="block__actions">
                  <div class="block__status">
                    <div
                      class="block__priority"
                      :class="getPriorityClass(item.priority)"
                    >
                      {{ getPriority(item.priority) }}
                    </div>
                    <div class="block__amount">
                      {{ item.amount }} {{ item.symbol }}
                    </div>
                  </div>
                  <div class="block__details">
                    <button class="block__btn">
                      <div class="block__text block__text_details">
                        {{ $t('meta.details') }}
                      </div>
                      <span class="icon-short_right" />
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
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Quests',
  data() {
    return {
      isShowMap: true,
      locations: [
        {
          lat: 56.475565,
          lng: 84.967270,
        },
      ],
      priority: [
        this.$t('quests.priority.all'),
        this.$t('quests.priority.low'),
        this.$t('quests.priority.normal'),
        this.$t('quests.priority.urgent'),
      ],
      priorityIndex: 0,
      distanceIndex: 0,
      priceSort: 'desc',
      timeSort: 'desc',
      cards: [
        {
          title: 'Samantha Sparks',
          favourite: true,
          sub: '',
          background: require('~/assets/img/temp/fake-card.svg'),
          theme: 'Paint the garage quickly',
          desc: 'Hi, i’m urgently looking for a skilled man that can paint my Garage doors and a couple of walls around the garage and by the way...',
          priority: 0,
          amount: 1500,
          symbol: 'wusd',
        },
      ],
      user: {
        avatar: require('~/assets/img/app/fake_profile.png'),
        username: 'Samantha Sparcs',
        company: 'Amazon',
        date: '12 January 2021,14:45',
        distance: '200m from you',
        distanceLink: '#',
      },
      quest: {
        location: 'Moscow, Lenina street, 3',
        runtime: '14:45:23',
        runtimeLink: '#',
        title: 'Paint the garage quickly',
        body: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, '
          + 'lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, '
          + 'vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum '
          + 'dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum '
          + 'lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac '
          + 'felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus Lorem ipsum dolor sit amet, '
          + 'consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus '
          + 'non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis '
          + 'scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor '
          + 'condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, '
          + 'consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus',
        price: '1500  WUSD',
        badgeGreen: 'Low priority',
        spec: 'Painting works',
        amount: '26 quests',
        performanceTimer: '14:45:23',
        questImgList: [
          {
            src: 'https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg',
          },
          {
            src: 'https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg',
          },
          {
            src: 'https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg',
          },
          {
            src: 'https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg',
          },
        ],
      },
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
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    toggleMap() {
      this.isShowMap = !this.isShowMap;
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
        0: 'block__priority_low',
        1: 'block__priority_normal',
        2: 'block__priority_urgent',
      };
      return priority[index] || '';
    },
    /*
    async sendRequest() {
      try {
        const payload = {
          // firstName: this.model.firstName,
        };
        const response = await this.$store.dispatch('user/quest', payload);
        if (response?.ok) {
          this.showMessageModal();
        }
      } catch (e) {
        console.log(e);
      }
    }, */
    showMessageModal() {
      this.ShowModal({
        key: modals.message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  @include main;
}
$color: black;
$bg-color: white;

.btn {
  &__wrapper {
    width: 220px;
  }
}

.icon{
  &__wrapper {
    margin: 0 0 0 25px;
  }
  &__wrapper0 {
    margin: 0 6px 0 0;
  }
}
.badgeList{
  display: flex;
  flex-direction: row;
}

.user {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__container {
    padding: 34.5px 0 25.5px 0;
  }
  &__company {
    @include text-simple;
    margin: 0 0 0 10px;
    font-size: 16px;
    color: #7C838D;
  }
  &__wrapper{
    display: flex;
    flex-direction: row;
  }
  &__date{
    @include text-simple;
    color:#7C838D;
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
    @include text-simple;
    color: #1D2127;
    font-weight: 500;
    font-size: 16px;
    margin: 0 0 0 10px;
  }
  &__distance{
    margin: 0 0.5%;
    @include text-simple;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #0083C7;
  }
  &__left {
    display: flex;
  }
  &__right {
    display: flex;
    flex-direction: row;
  }
}
.spec{
  &__link{
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    color: #0083C7;
  }
  &__container{
    margin: 20px 0;
  }
}

.quest{
  &__spec {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    color: #1D2127;
    margin: 0 0 0 0;
  }
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    color: #1D2127;
    margin: 0 0 10px 0;
  }
  &__body {
    @include text-simple;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color:rgba(53, 60, 71, 1);
  }
  &__location {
    color: #353C47;
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    display: flex;
    flex-direction: row;
  }
  &__count {
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: #8D96A2;
  }
  &__group {
    color:$color;
    display: flex;
    flex-direction: row;
  }
  &__card {
    color:$color;
  }
}

.quest_materials {
  &__title{
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    color: #1D2127;
    padding: 10px 0 20px 0;
  }
}
.performance {
  &__title {
    flex-shrink: 0;
  }
  &__container {
    display: flex;
    flex-direction: row;
    margin: 0 1%;
    @include text-simple;
    font-size: 14px;
    align-items: center;
    color: #353C47;
  }
  &__link {
    margin: 0 3%;
    @include text-simple;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #0083C7;
    flex-shrink: 0;
  }
}
.map {
  &__container {
    margin:30px 0 20px 0;
  }
}

.price{
  &__value {
    @include text-simple;
    color: #00AA5B;
    font-weight: bold;
    font-size: 25px;

  }
  &__wrapperValue {
    position: relative;
    display: flex;
    flex-direction: row;
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
    margin:0 0 30px 0;
    justify-content: space-between;
  }
}

.badge {
  &__container {
    padding: 0 0 20px 0;
  }
  &__green {
    background-color: rgba(34, 204, 20, 0.1);
    color:#22CC14;
    padding: 5px;
    margin: 0 0 0 15px;
    border-radius: 5px;
  }
  &__blue {
    background-color: rgba(0, 131, 199, 0.1);
    margin: 0 9px 0 0;
    padding: 5px;
    border-radius: 44px;
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    align-items: center;
    color: #0083C7;
  }
  &__wrapper{
    margin: auto;
  }
}

.location{
  &__container{
    display: flex;
    flex-direction: row;
    margin: 25.5px 0 0 0;
  }
}
.img{
  &__container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 0 20px 0;
  }
  &__item{
    border-radius: 6px;
    margin: 0 20px;
    width: 20%;
    height: 25%;
    transition: 0.5s;
  }
  &__item:hover{
    transform: scale(1.2);
    transition: 0.5s;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }
}
.hr{
  &__line{}
}

// Стили Ильи
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
.block {
  background: #FFFFFF;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 230px;
  &__img {
    max-width: 240px;
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
    color: #00AA5B;
    text-transform: uppercase;
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
    img {
      border-radius: 100%;
    }
  }
  &__title {
    display: grid;
    grid-template-columns: 30px 1fr;
    grid-gap: 10px;
    align-items: center;
  }
}
.quests {
  &__cards {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    padding-top: 20px;
  }
  &__top {
    position: relative;
    min-height: 160px;
  }
  &__search {
    position: absolute;
    max-width: 1180px;
    height: 83px;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1200;
    @include box;
  }
  &__content {
    display: flex;
    justify-content: center;
  }
  &__body {
    padding-top: 30px;
    max-width: 1180px;
    width: 100%;
    height: 100%;
    &_wrap {
      padding-top: 10px;
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    &_title  {
      font-weight: 500;
      font-size: 25px;
      line-height: 130%;
      color: $black800;
    }
  }
  &__tags {
    padding-top: 30px;
    max-width: 1180px;
  }
  &__tools {
    padding-top:  20px;
  }
}
.tags {
  display: flex;
  &__btn {
    span::before {
      color: $blue;
      font-size: 24px;
      padding-left: 3px;
    }
  }
  &__item {
    min-width: 135px;
    max-width: 150px;
    &:not(:first-child) {
      margin-left: 20px;
    }
  }
}
.tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__left {
    display: grid;
    grid-template-columns: 103px 152px minmax(141px, auto);
    grid-gap: 20px;
    span::before {
      padding-left: 10px;
      margin-right: -10px;
      color: $black400;
      font-size: 24px;
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
  }
  &__right {
    min-width: 149px;
    span::before {
      padding-left: 10px;
      margin-right: -10px;
      color: $black400;
      font-size: 24px;
    }
  }
}
.quests::v-deep {
  .GMap__Wrapper {
    height: 435px;
  }
  .ctm-field__left {
    padding-top: 6px;
  }
}
</style>
