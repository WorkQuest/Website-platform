<template>
  <div>
    <info />
    <div
      class="main-white"
    >
      <div class="main__body">
        <questPanel
          :avatar-url="userAvatar"
          :location="questLocation"
          :quest-data="questData"
        />

        <div class="quest__container">
          <h2 class="quest__title">
            {{ questData.title }}
          </h2>
          <span class="quest__description">
            {{ questData.description }}
          </span>
        </div>
        <div class="divider" />
        <div class="quest_materials__container">
          <h2 class="quest_materials__title">
            {{ $t('quests.questMaterials') }}
          </h2>
          <div class="img__container">
            <img
              v-for="n in 4"
              :key="n"
              class="img__item"
              src="https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg"
              alt=""
              @click="openImage('https://3dnews.ru/assets/external/illustrations/2020/09/14/1020548/03.jpg')"
            >
          </div>
          <div class="divider" />

          <questIdEmployer
            :user-avatar="userAvatar"
            :assign-worker="quest.assignedWorker"
          />

          <questIdWorker />
        </div>
      </div>
    </div>
    <div
      class="map__container gmap"
    >
      <div class="gmap__block">
        <transition name="fade-fast">
          <GmapMap
            ref="gMap"
            class="quests__map"
            language="en"
            :center="questLocation"
            :zoom="zoom"
            :options="{scrollWheel: false, navigationControl: false, mapTypeControl: false, scaleControl: false,}"
          >
            <GMapMarker
              v-for="(item, key) in locations"
              :key="key"
              :position="questLocation"
              :options="{ icon: pins.quest.blue, show: true}"
              @click="coordinatesChange(item)"
            >
              <GMapInfoWindow
                :options="{maxWidth: 280}"
              >
                <div>
                  <h3>{{ questData.title }}</h3>
                  <span>{{ questData.description }}</span>
                </div>
              </GMapInfoWindow>
            </GMapMarker>
          </GmapMap>
        </transition>
      </div>
    </div>
    <div class="main">
      <div class="spec__container">
        <div class="quest__group">
          <h2 class="quest__spec">
            {{ $t('quests.otherQuestsSpec') }}
            <nuxt-link
              to="#"
              class="spec__link"
            >
              "{{ payload.spec }}"
            </nuxt-link>
          </h2>
        </div>
        {{ responsesToQuest.responses }}
        <div class="quest__card">
          <quests
            v-if="questsObjects.count !== 0"
            :limit="questLimits"
            :object="questsObjects"
            :page="'quests'"
          />
          <emptyData
            v-else
            :description="$t(`errors.emptyData.${userRole}.allQuests.desc`)"
            :btn-text="$t(`errors.emptyData.${userRole}.allQuests.btnText`)"
            :link="userRole === 'employer' ? '/create-quest' : '/quests'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import info from '~/components/app/info/index.vue';
import questPanel from '~/components/app/panels/questPanel';
import quests from '~/components/app/pages/common/quests';
import emptyData from '~/components/app/info/emptyData';
import questIdEmployer from '~/components/app/pages/quests_id/employer';
import questIdWorker from '~/components/app/pages/quests_id/worker';

export default {
  name: 'Quests',
  components: {
    info,
    questPanel,
    quests,
    emptyData,
    questIdEmployer,
    questIdWorker,
  },
  data() {
    return {
      badge: {
        code: 1,
      },
      selectedWorker: [],
      payload: {
        type: 'active',
        favourite: true,
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
        amount: '26',
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
      isShowMap: true,
      priority: [
        this.$t('quests.priority.low'),
        this.$t('quests.priority.normal'),
        this.$t('quests.priority.urgent'),
      ],
      priorityIndex: 0,
      distanceIndex: 0,
      priceSort: 'desc',
      timeSort: 'desc',
      questLimits: 1,
      questsObjects: {
        count: 0,
      },
      questData: {},
      userAvatar: '',
      questLocation: { lat: 0, lng: 0 },
      locations: {},
      currentLocation: {},
      zoom: 15,
      pins: {
        quest: {
          red: '/img/app/marker_red.svg',
          green: '/img/app/marker_red.svg',
          yellow: '/img/app/marker_red.svg',
          blue: '/img/app/marker_blue.svg',
        },
        selected: '/img/app/marker_blue.svg',
        notSelected: '/img/app/marker_red.svg',
      },
    };
  },
  computed: {
    ...mapGetters({
      quest: 'quests/getQuest',
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      respondedList: 'data/getRespondedList',
      distance: 'data/getDistance',
      responsesToQuest: 'quests/getResponsesToQuest',
      responsesData: 'quests/getResponsesData',
      infoDataMode: 'quests/getInfoDataMode',
    }),
  },
  watch: {
    questData: {
      deep: true,
      handler() {
        this.questLocation = {
          lat: this.questData.location.latitude,
          lng: this.questData.location.longitude,
        };
        this.locations = this.questLocation;
      },
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.initData();
    await this.initUserAvatar();
    await this.getResponsesToQuest();
    await this.checkPageMode();
    this.SetLoader(false);
  },
  methods: {
    async getResponsesToQuest() {
      if (this.userRole === 'employer') {
        await this.$store.dispatch('quests/responsesToQuest', this.questData.id);
      }
    },
    async initData() {
      this.questData = await this.$store.dispatch('quests/getQuest', this.$route.params.id);
      console.log(this.questData);
    },
    async initUserAvatar() {
      this.userAvatar = this.questData?.user?.avatar?.url || require('~/assets/img/app/avatar_empty.png');
    },
    async checkPageMode() {
      if (this.userRole === 'employer') {
        if (this.responsesData.count === 0) {
          await this.$store.dispatch('quests/setInfoDataMode', 1);
        } if (this.responsesData.count > 0) {
          await this.$store.dispatch('quests/setInfoDataMode', 3);
        } if (this.questData.assignedWorker !== null) {
          await this.$store.dispatch('quests/setInfoDataMode', 4);
        } if (this.questData.status === 5) {
          await this.$store.dispatch('quests/setInfoDataMode', 6);
        }
      }
      if (this.userRole === 'worker') {
        if (this.questData.assignedWorker === null && this.questData.status !== 1) {
          await this.$store.dispatch('quests/setInfoDataMode', 5);
        } if (this.questData.status === 1) {
          await this.$store.dispatch('quests/setInfoDataMode', 2);
        } if (this.questData.assignedWorkerId === this.userData.id && this.questData.status !== 1) {
          await this.$store.dispatch('quests/setInfoDataMode', 1);
        } if (this.questData.status === 5) {
          await this.$store.dispatch('quests/setInfoDataMode', 4);
        } if (this.questData.status === 6) {
          await this.$store.dispatch('quests/setInfoDataMode', 4);
        }
      }
    },
    coordinatesChange(item) {
      if (Object.keys(this.currentLocation).length > 0) {
        this.currentLocation = {};
      } else {
        this.currentLocation = item;
      }
    },
    back() {
      this.$router.go(-1);
    },
    toggleMap() {
      this.isInvite = !this.isShowMap;
    },
    showRaiseViewsModal() {
      this.ShowModal({
        key: modals.raiseViews,
      });
    },
    openImage(src) {
      if (window.innerWidth >= 761) {
        this.ShowModal({
          key: modals.showImage,
          imageSrc: src,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
.gallery {
  &__image {
    border-radius: 6px;
    margin: 0 0 10px 0;
    &_big {
      width: 100%;
      height: 440px;
    }
  }
  &__small {
    width: 147px;
    height: 61px;
  }
}
.btn {
  &__container {
    margin: 0 16px 0 16px;
  }
}
.quest-materials {
  margin: 10px 0 0 10px;
  &__title {
    @extend .quest-materials;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
  }
  &__gallery {
    @extend .quest-materials;
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-gap: 13px;
  }
}
.user-skills {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 20px 20px 0 20px;
  &__skill {
    font-weight: 400;
    font-size: 16px;
    color: rgba(0, 131, 199, 1);
    background-color: rgba(0, 131, 199, 0.1);
    padding: 5px 7px;
    border-radius: 44px;
    margin: 0 10px 0 0;
  }
}
.user-location {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 20px 20px 0 20px;
  &__distance {
    font-weight: 400;
    font-size: 14px;
    color: $black500;
  }
}
.user-name {
  &__container {
    display: flex;
    flex-direction: row;
  }
}
.user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px 0 20px;
  &__avatar {
    width: 100%;
    height: 100%;
    max-width: 30px;
    max-height: 30px;
    border-radius: 137px;
  }
  &__name {
    margin: 0 0 0 10px;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
  }
  &__level {
    font-weight: 400;
    font-size: 12px;
    padding: 4px 5px;
    border-radius: 3px;
    &_green {
      @extend .user-info__level;
      color: #22CC14;
      background-color: rgba(34, 204, 20, 0.1);
    }
  }
}
.runtime {
  &__container {
    margin: 0 0 0 30px;
  }
  &__title {
    margin: 0 5px 0 5px;
  }
}

.btns {
  &__container {
    display: grid;
    grid-template-columns: 8fr 4fr;
    margin-bottom: 20px;
  }
}
.divider{
  margin: 20px 0 20px 0;
  background-color: $black0;
  width:100%;
  height: 1px;
}
.main {
  @include main;
  &-white {
    @include main-white;
  }
}

.spec {
  @include text-simple;
  font-weight: 500;
  font-size: 25px;
  &__link{
    @extend .spec;
    color: $blue;
  }
  &__container{
    margin: 40px 0;
  }
}

.quest_materials {
  &__title{
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
    padding: 10px 0 20px 0;
  }
}

.map {
  &__container {
    padding:30px 0 0 0;
    display: flex;
    justify-content: center;
    .gmap__block {
      max-width: 1180px;
      width: 100%;
    }
  }
}
.price {
  display: flex;
  flex-direction: row;
  align-items: center;
  &__value {
    @include text-simple;
    color: $green;
    font-weight: bold;
    font-size: 25px;
  }
  &__container {
    @extend .price;
    justify-content: flex-end;
  }
  &__wrapper {
    @extend .price;
    margin:0 0 30px 0;
    justify-content: space-between;
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
      margin: 0 9px 0 0;
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
.location {
  &__container{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 25.5px 0 0 0;
  }
}
.img {
  transition: 0.5s;
  &__container{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    margin: 0 0 20px 0;
  }
  &__item{
    @extend .img;
    border-radius: 6px;
    max-width: 280px;
    max-height: 210px;
    &:hover {
      @extend .img;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    }
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
.block {
  background: $white;
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
    @extend .block__actions;
  }
  &__icon {
    &_fav {
      cursor: pointer;
    }
  }
  &__btn {
    @extend .block__actions;
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
    font-size: 16px;
    line-height: 130%;
    &_details {
      @extend .block__text;
      color: $blue;
    }
    &_desc {
      @extend .block__text;
      color: $black700;
    }
    &_blue {
      @extend .block__text;
      font-weight: 500;
      font-size: 18px;
      color: $blue;
    }
    &_title {
      @extend .block__text;
      font-weight: 500;
      color: $black800;
    }
    &_locate {
      @extend .block__text;
      font-size: 14px;
      color: #7C838D;
    }
    &_grey {
      @extend .block__text;
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
    justify-content: unset;
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
    @include text-simple;
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
    @include text-simple;
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
.uploader {
  &__message {
    @include text-simple;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    color: $black800;
  }
}
.icon {
  color:$black500;
  font-size: 20px;
  &-chat::before {
    @extend .icon;
    color:$green;
  }
  &-location::before {
    @extend .icon;
  }
  &-clock::before {
    @extend .icon;
  }
  &-share_outline {
    @extend .icon;
    margin-left: 5px;
  }
  &-chat_green:before {
    @extend .icon;
    content: "\e9ba";
    color: #00AA5B;
  }
  &-caret_down_blue:before {
    @extend .icon;
    content: "\ea48";
    color: #0083C7;
  }
  &-chevron_big_left:before {
    @extend .icon;
    content: "\ea4d";
    color: #0083C7;
  }
  &-location:before {
    @extend .icon;
    content: "\ea23";
  }
}

@include _1199 {
  .main__body, .main {
    padding: 10px;
  }
  .user__distance {
    margin: 0 20px;
  }
  .img {
    &__container {
      grid-template-columns: repeat(3, auto);
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
@include _991 {
  .main-white {
    display: block;
  }
  .img {
    &__container {
      grid-template-columns: repeat(2, auto);
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
@include _767 {
  .user {
    &__container {
      padding: 0;
    }
  }
  .main {
    display: block;
    .block {
      grid-template-columns: auto;
      &__img {
        height: 200px;
        max-width: 100%;
        .image {
          width: 100%;
          border-radius: 6px;
          object-fit: cover;
          max-height: 500px;
          height: 100%;
        }
      }
    }
  }
  .price {
    &__container {
      flex-direction: column;
    }
    &__value {
      font-size: 19px;
    }
  }
}
@include _575 {
  .user {
    &__head {
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 5px;
    }
    &__right {
      align-items: center;
      .icon-share_outline {
        margin-left: 25px;
      }
    }
  }
  .location {
    &__container {
      display: grid;
      grid-template-columns: auto;
      grid-gap: 5px;
    }
  }
  .icon {
    &-clock, &-location {
      width: 30px;
    }
  }
  .runtime {
    &__container, &__title {
      margin: 0;
    }
  }
  .badge {
    &__container {
      padding-top: 20px;
    }
  }
  .img {
    &__container {
      grid-template-columns: 1fr;
    }
  }
  .quest {
    &__spec {
      font-size: 16px;
    }
  }
  .spec {
    &__link {
      font-size: 16px;
    }
  }
  .block {
    &__right {
      padding: 10px;
    }
    &__head {
      display: flex !important;
    }
    &__btn {
      padding: 0;
      margin-top: 10px;
    }
    &__actions {
      display: grid;
      grid-template-columns: 1fr;
      .block__btn {
        display: flex !important;
      }
    }
  }
}
</style>
