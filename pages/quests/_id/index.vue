<template>
  <div
    v-if="questData"
    class="quest-page"
  >
    <info />
    <div class="main main-white">
      <div class="main__body main__body_20gap">
        <questPanel :location="questLocation" />

        <div class="quest__container">
          <h2 class="quest__title">
            {{ questData.title }}
          </h2>
          <span class="quest__description">
            {{ questData.description }}
          </span>
        </div>
        <template v-if="questData.medias && questData.medias.length">
          <div class="divider" />
          <div class="quest_materials__title">
            {{ $t('quests.questMaterials') }}
          </div>
          <files-preview :medias="questData.medias" />
        </template>
        <questIdEmployer v-if="userRole === 'employer'" />
        <questIdWorker v-if="userRole === 'worker'" />
      </div>
    </div>
    <div class="main">
      <div class="main__body main__body_30gap">
        <div class="main__map">
          <transition name="fade-fast">
            <GmapMap
              ref="gMap"
              class="quests__map"
              language="en"
              :center="questLocation"
              :zoom="15"
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
        <template v-if="userRole === 'employer' && infoDataMode === InfoModeEmployer.Created">
          <workers-list is-invited />
          <workers-list />
        </template>
        <div
          v-if="userRole === 'worker'"
          class="spec__container"
        >
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
              v-if="questsObjects.count"
              :limit="1"
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { InfoModeEmployer } from '~/utils/enums';
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
      payload: { // ???
        spec: 'Painting works',
      },
      questsObjects: { // ???
        count: 0,
      },
      questLocation: { lat: 0, lng: 0 },
      locations: {},
      currentLocation: {},
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
      responsesToQuest: 'quests/getResponsesToQuest',
      infoDataMode: 'quests/getInfoDataMode',
    }),
    InfoModeEmployer() {
      return InfoModeEmployer;
    },
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
  async beforeMount() {
    this.SetLoader(true);
    await this.initData();
    await this.getResponsesToQuest();
    this.SetLoader(false);
  },
  methods: {
    async initData() {
      await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    async getResponsesToQuest() {
      if (this.userRole === 'employer') await this.$store.dispatch('quests/responsesToQuest', this.questData.id);
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
  },
};
</script>

<style lang="scss">
.GMap__Wrapper {
  height: 205px;
}
.gm-svpc {
  top: 27px !important;
}
</style>

<style lang="scss" scoped>
.divider {
  margin: 20px 0 20px 0;
  background-color: $black0;
  width:100%;
  height: 1px;
}
.quest {
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
.main {
  @include main;
  &-white {
    @include main-white;
  }

  &__body {
    display: grid;

    &_30gap {
      gap: 30px;
    }

    &_20gap {
      gap: 20px;
    }
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
}

.quest_materials {
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    color: $black800;
    padding: 0 0 20px 0;
  }
}

.map {
  &__container {
    padding: 0;
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
    text-align: center;
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
