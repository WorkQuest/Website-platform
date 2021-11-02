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
            :assign-worker="questData.assignedWorker ? questData.assignedWorker : questData.assignedWorker = null"
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
        spec: 'Painting works',
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
      questData: 'quests/getQuest',
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
  async created() {
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
      await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    async initUserAvatar() {
      this.userAvatar = this.questData?.user?.avatar?.url || require('~/assets/img/app/avatar_empty.png');
    },
    // getPageModeEmp(status) {
    //   const mode = {
    //     1: 2,
    //     2: 8,
    //     3: 7,
    //     5: 6,
    //     6: 9,
    //   };
    //   return mode[status] || '';
    // },
    // getPageModeWor(status) {
    //   const mode = {
    //     1: 2,
    //     2: 8,
    //     3: 7,
    //     5: 4,
    //     6: 9,
    //   };
    //   return mode[status] || '';
    // },
    async checkPageMode() {
      // questStatus
      // Created = 0,
      // Active = 1
      // Closed = 2
      // Dispute = 3
      // WaitWorker = 4
      // WaitConfirm = 5
      // Done = 6

      if (this.userRole === 'employer') {
        if (this.responsesData.count === 0) {
          await this.$store.dispatch('quests/setInfoDataMode', 1);
        } if (this.responsesData.count > 0) {
          await this.$store.dispatch('quests/setInfoDataMode', 3);
        } if (this.questData.assignedWorker !== null) {
          if (this.questData.status !== 2) {
            await this.$store.dispatch('quests/setInfoDataMode', 4);
          }
        }
        // else {
        //   await this.$store.dispatch('quests/setInfoDataMode', this.getPageModeEmp(this.questData.status));
        // }
        if (this.questData.status === 1) {
          await this.$store.dispatch('quests/setInfoDataMode', 2);
        } if (this.questData.status === 2) {
          await this.$store.dispatch('quests/setInfoDataMode', 8);
        } if (this.questData.status === 3) {
          await this.$store.dispatch('quests/setInfoDataMode', 7);
        } if (this.questData.status === 5) {
          await this.$store.dispatch('quests/setInfoDataMode', 6);
        } if (this.questData.status === 6) {
          await this.$store.dispatch('quests/setInfoDataMode', 9);
        }
      }
      if (this.userRole === 'worker') {
        if (this.questData.assignedWorker === null && ![1].includes(this.questData.status)) {
          await this.$store.dispatch('quests/setInfoDataMode', 5);
        } if (this.questData.assignedWorkerId === this.userData.id
          && ![1, 3].includes(this.questData.status)) {
          await this.$store.dispatch('quests/setInfoDataMode', 1);
        }
        // else {
        //   await this.$store.dispatch('quests/setInfoDataMode', this.getPageModeWor(this.questData.status));
        // }
        if (this.questData.status === 1) {
          await this.$store.dispatch('quests/setInfoDataMode', 2);
        } if (this.questData.status === 2) {
          await this.$store.dispatch('quests/setInfoDataMode', 8);
        } if (this.questData.status === 3) {
          await this.$store.dispatch('quests/setInfoDataMode', 7);
        } if (this.questData.status === 5) {
          await this.$store.dispatch('quests/setInfoDataMode', 4);
        } if (this.questData.status === 6) {
          await this.$store.dispatch('quests/setInfoDataMode', 9);
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
.quest {
  &__map {
    height: 205px;
  }
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 30px;
    color: $black800;
    line-height: 39px;
    word-wrap: break-word;
  }
  &__description {
    @include text-simple;
    margin-top: 10px;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $black700;
    word-wrap: break-word
  }
}
.hide {
  display: none;
}
.gallery {
  &__image {
    border-radius: 6px;
    margin: 0 0 10px 0;
    &_big {
      width: 100%;
      height: 280px;
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
.divider {
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
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
    padding: 20px 0 20px 0;
  }
}

.map {
  &__container {
    padding: 0;
    display: flex;
    justify-content: center;
    height: 205px;
    .gmap__block {
      height: 205px;
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

.quests::v-deep {
  .GMap__Wrapper {
    height: 205px;
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
  color: $black500;
  font-size: 20px;
  &-chat::before {
    @extend .icon;
    color: $green !important;
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
