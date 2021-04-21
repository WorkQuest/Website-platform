<template>
  <!-- Quest page_User -->
  <div>
    <div class="container">
      <div class="user__top">
        <div class="user__container">
          <div class="user__wrapper">
            <img
              class="user__img"
              src="https://media.pn.am/media/issue/197/297/photo/197297.jpg"
              alt=""
            >
            <p class="user__username">
              Samantha Sparcs
            </p>
            <div class="date__wrapper">
              <p class="user__date">
                12 January 2021,14:45
              </p>
              <div class="icon__wrapper">
                <span class="icon-share" />
              </div>
            </div>
          </div>
          <div class="location__container">
            <div class="quest__location">
              <span
                class="icon-location"
              />
              <p>Moscow, Lenina street, 3</p>
            </div>
            <a
              class="user__distance"
              href="#"
            >
              200m from you
            </a>
            <div class="runtime__container">
              <span class="icon-clock" />
              <p>Runtime</p>
              <a
                class="runtime__link"
                href="#"
              >
                14:45:23
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="badge__container">
        <span class="badge__blue">Painting Works</span>
        <span class="badge__blue">Art</span>
      </div>
      <div class="quest__container">
        <h2 class="quest__title">
          Paint the garage quickly
        </h2>
        <p class="quest__body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus
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
          <b-btn class="btn__request">
            Send a request
          </b-btn>
          <div class="price__wrapperValue">
            <p class="price__value">
              1500  WUSD
            </p>
            <div>
              <div class="badge__wrapper">
                <span class="badge__green">Low priority</span>
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
    <div class="container">
      <div class="specialisation__container">
        <div class="quest__group">
          <h2 class="quest__spec">
            Other quests for the specialization
            <a
              class="spec__link"
              href="#"
            >"Painting Works"</a>
          </h2>
        </div>
        <p class="quest__count">
          26 quests
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
      search: '',
      locations: [
        {
          lat: 56.475565,
          lng: 84.967270,
        },
      ],
      distance: [
        '+ 100 m',
        '+ 500 m',
        '+ 1000 m',
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
    changeSorting(type) {
      if (type === 'price') {
        // eslint-disable-next-line no-unused-expressions
        this.priceSort === 'desc' ? this.priceSort = 'asc' : this.priceSort = 'desc';
      }
      if (type === 'time') {
        // eslint-disable-next-line no-unused-expressions
        this.timeSort === 'desc' ? this.timeSort = 'asc' : this.timeSort = 'desc';
      }
    },
    deleteTag(tag) {
      this.$store.dispatch('ui/deleteTags', tag);
    },
    showSkillsModal() {
      this.ShowModal({
        key: modals.skills,
      });
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
  },
};
</script>

<style lang="scss" scoped>

$color: black;
$bg-color: white;

.container{}
.icon{
  &__wrapper{
    margin: 0 0 0 25px;
  }
}
.user{
  &__top{}
  &__container{
    padding: 34.5px 0 25.5px 0;
  }
  &__wrapper{
    display: flex;
    flex-direction: row;
  }
  &__date{
    color:rgba(124, 131, 141, 1);
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
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
}
.spec{
  &__link{
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    color: #0083C7;
  }
}
.date{
  &__wrapper{
    margin-left: 60%;
    display: flex;
    flex-direction: row;
  }
}

.quest{
  &__container{}
  &__spec{
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    color: #1D2127;
    margin: 0 0 0 15px;
  }
  &__title{
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    color: #1D2127;
  }
  &__body{
    @include text-simple;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color:rgba(53, 60, 71, 1);
  }
  &__location{
    color: #353C47;
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    display: flex;
    flex-direction: row;
  }
  &__count{
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: #8D96A2;
  }
  &__group{
    color:$color;
    display: flex;
    flex-direction: row;
  }
  &__card{
    color:$color;
  }
}

.quest_materials{
  &__container{}
  &__title{
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    color: #1D2127;
    padding: 20px 0 20px 0;
  }
}
.runtime{
  &__container{
    display: flex;
    flex-direction: row;
    margin: 0 1%;
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    align-items: center;
    color: #353C47;
  }
  &__link{
    margin: 0 3%;
    @include text-simple;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #0083C7;
  }
}
.map{
  &__container{
    margin:30px 0 20px 0;
  }
}

.price{
  &__value{
    color: #00AA5B;
  }
  &__wrapperValue{
    position: relative;
    display: flex;
    flex-direction: row;
    margin-left: 70%;
  }
  &__wrapper{
    display: flex;
    flex-direction: row;
    margin:0 0 30px 0;
  }
}

.badge{
  &__container{
    padding: 0 0 20px 0;
  }
  &__green{
    background-color: rgba(34, 204, 20, 0.1);
    color:#22CC14;
    padding: 5px;
    margin: 0 0 0 15px;
    border-radius: 5px;
  }
  &__blue{
    background-color: rgba(0, 131, 199, 0.1);
    padding: 5px;
    border-radius: 10px;
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    align-items: center;
    color: #0083C7;
  }
  &__wrapper{}
}

.specialisation{
  &__container{}
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
    margin: 1% 1%;
  }
  &__item{
    border-radius: 6px;
    margin: 0 20px;
    width: 20%;
    height: 25%;
  }
}
.hr{
  &__line{}
}
.btn{
  &__request{
    background: #0083C7;
    border-radius: 6px;
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    text-align: center;
    color: #FFFFFF;
  }
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
