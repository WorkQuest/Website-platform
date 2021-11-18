<template>
  <div>
    <GmapSearchBlock
      :is-show-map="isShowMap"
    />
    <div
      class="gmap-block search"
      :class="!isShowMap ? 'gmap-block_shift' : ''"
    >
      <div class="search__block">
        <div class="search__content">
          <div class="search__toggle">
            <base-checkbox
              v-model="isShowMap"
              name="map"
              :label="$t('quests.ui.showMap')"
            />
          </div>
          <div
            class="search__inputs"
            @click="toggleSearchDD"
          >
            <base-field
              v-model="search"
              v-click-outside="hideSearchDD"
              class="search__input"
              is-search
              :placeholder="$t('quests.ui.search')"
              mode="icon"
              :selector="searchDDStatus"
              @selector="getAddressInfo(search)"
            >
              <template v-slot:left />
              <template v-slot:selector>
                <div
                  v-if="addresses.length"
                  class="selector"
                  :class="{'hide': searchDDStatus === false}"
                >
                  <div class="selector__items">
                    <div
                      v-for="(item, i) in addresses"
                      :key="i"
                      class="selector__item"
                      @click="selectAddress(item)"
                    >
                      {{ item.formatted }}
                    </div>
                  </div>
                </div>
              </template>
            </base-field>
          </div>
          <div class="search__dd">
            <base-dd
              v-model="distanceIndex"
              :items="distance"
            />
          </div>
          <div class="search__actions">
            <base-btn
              class="search__btn"
              @click="centerChange"
            >
              {{ userRole === 'worker' ? $t('quests.searchResults') : $t('workers.searchWorkers') }}
            </base-btn>
          </div>
        </div>
      </div>
      <div class="search__filter filter">
        <div
          class="filter__dd"
        >
          <base-dd
            v-model="distanceIndex"
            :items="distance"
          />
        </div>
        <div class="filter__toggle">
          <base-checkbox
            v-model="isShowMap"
            name="map"
            :label="$t('quests.ui.showMap')"
          />
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main__body">
        <h2 class="main__title">
          {{ $t('workers.topWorkers') }}
        </h2>
        <div class="quests__tools panel">
          <div class="panel">
            <div class="panel__left">
              <base-filter-dd class="panel__item" />
              <base-dd
                v-for="(item, i) in panelDDLeft"
                :key="i"
                v-model="item.vmodel"
                :class="item.class"
                :items="item.items"
                :mode="item.mode"
                :placeholder="item.placeholder"
              />
              <base-btn
                class="panel__item"
                :mode="'light'"
                @click="showPriceSearch"
              >
                <span class="tools__text">
                  {{ $t('quests.price') }}
                </span>
                <template v-slot:right>
                  <span
                    class="icon-caret_down icon_blue"
                  />
                </template>
              </base-btn>
            </div>
            <div class="panel__right">
              <base-btn
                class="tools__item"
                :mode="'light'"
              >
                <span class="tools__text">
                  {{ $t('quests.time') }}
                </span>
                <span
                  v-if="timeSort === 'desc'"
                  class="icon-Sorting_descending"
                />
                <span
                  v-if="timeSort === 'asc'"
                  class="icon-Sorting_ascending"
                />
              </base-btn>
            </div>
          </div>
        </div>
        <div class="content">
          <div
            v-for="(user, i) in workersList.users"
            :key="i"
            class="card card_lower"
            @click="showDetails(user)"
          >
            <!-- :class="cardsLevelsBorder(i)" -->
            <div
              class="card__content"
            >
              <div class="card__header">
                <div class="card__header_top">
                  <div class="card__header_left">
                    <img
                      class="card__img"
                      :src="user.avatar !== null ? user.avatar.url: require('~/assets/img/app/avatar_empty.png')"
                      :alt="user.firstName"
                    >
                  </div>
                  <div class="card__header_right">
                    <span
                      class="card__name"
                    >
                      <!-- :class="{'card__name_center': card.level.code === '0'}" -->
                      {{ user.firstName ? user.firstName : $t('quests.namelessWorker') }} {{ user.lastName ? user.lastName : "" }}
                    </span>
                    <!-- <div
                      class="card__level"
                      :class="{'card__level_disabled': card.level.code === '0'}"
                    >
                      <span class="icon-circle_up icon_blue" />
                      <span
                        class="card__level_higher"
                        :class="cardsLevels(i)"
                      >{{ card.level.title }}</span>
                    </div> -->
                  </div>
                </div>
              </div>
              <div class="card__spec_title">
                {{ $t('workers.specializations') }}
              </div>
              <span
                v-if="user.userSpecializations.length === 0"
                class="card__spec"
              >
                {{ $t('quests.dontHaveSpec') }}
              </span>
              <span v-if="user.userSpecializations.length > 0">
                <span
                  v-for="(spec, j) in user.userSpecializations"
                  :key="j"
                  class="card__spec"
                >
                  {{ spec.title }}
                </span>
              </span>
              <div
                v-if="user.additionalInfo"
                class="card__title"
              >
                {{ $t('workers.aboutMe') }}
              </div>
              <div
                v-if="user.additionalInfo"
                class="card__about"
              >
                {{ user.additionalInfo.description ? user.additionalInfo.description: $t('quests.nothingAboutMe') }}
              </div>
              <div
                v-if="user.additionalInfo"
                class="card__address"
              >
                {{ user.additionalInfo.address ? user.additionalInfo.address : $t('quests.unknownAddress') }}
              </div>
              <!-- <div class="card__cost cost">
                <div class="cost__title">
                  {{ $t('workers.costTitle') }}
                </div>
                <div class="cost__value">
                  {{ user.cost }}
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { GeoCode } from 'geo-coder';
import ClickOutside from 'vue-click-outside';
import GmapSearchBlock from '~/components/app/GmapSearch';
import modals from '~/store/modals/modals';

export default {
  name: 'Workers',
  directives: {
    ClickOutside,
  },
  components: {
    GmapSearchBlock,
  },
  data() {
    return {
      searchDDStatus: true,
      isShowMap: true,
      currentLocation: {},
      circleOptions: {},
      locations: [
        {
          lat: 44.933076,
          lng: 15.629058,
        },
        {
          lat: 45.815,
          lng: '15.9819',
        },
        {
          lat: '45.12',
          lng: '16.21',
        },
      ],
      rating: [],
      selectedUrgent: '',
      selectedDistantWork: '',
      selectedTypeOfJob: '',
      pins: {
        selected: '/img/app/marker_blue.svg',
        notSelected: '/img/app/marker_red.svg',
      },
      clusterStyle: [
        {
          url:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
          width: 56,
          height: 56,
          textColor: '#fff',
        },
      ],
      search: '',
      priorityIndex: 0,
      distanceIndex: 0,
      priceSort: 'desc',
      timeSort: 'desc',
      addresses: [],
      coordinates: null,
    };
  },
  computed: {
    ...mapGetters({
      userPosition: 'user/getUserCurrentPosition',
      userRole: 'user/getUserRole',
      mapBounds: 'quests/getMapBounds',
      workersList: 'quests/getWorkersList',
    }),
    distantWork() {
      return [
        this.$t('quests.distantWork.distantWork'),
        this.$t('quests.distantWork.workInOffice'),
        this.$t('quests.distantWork.bothVariant'),
      ];
    },
    typeOfJob() {
      return [
        this.$t('quests.fullTime'),
        this.$t('quests.partTime'),
        this.$t('quests.fixedTerm'),
        this.$t('quests.contract'),
        this.$t('quests.remoteWork'),
      ];
    },
    urgent() {
      return [
        this.$t('priority.urgent'),
        this.$t('priority.normal'),
        this.$t('priority.low'),
      ];
    },
    distance() {
      return [
        '+ 100 m',
        '+ 500 m',
        '+ 1000 m',
      ];
    },
    priority() {
      return [
        this.$t('quests.priority.all'),
        this.$t('quests.priority.low'),
        this.$t('quests.priority.normal'),
        this.$t('quests.priority.urgent'),
      ];
    },
    panelDDLeft() {
      return [
        {
          vmodel: this.selectedTypeOfJob,
          class: 'panel__item',
          items: this.typeOfJob,
          mode: 'blackFont',
          placeholder: this.$t('quests.typeOfJob'),
        },
        {
          vmodel: this.selectedUrgent,
          class: 'panel__item',
          items: this.urgent,
          mode: 'blackFont',
          placeholder: this.$t('quests.urgent'),
        },
        {
          vmodel: this.selectedDistantWork,
          class: 'panel__item',
          items: this.distantWork,
          mode: 'blackFont',
          placeholder: this.$t('quests.distantWork.title'),
        },
      ];
    },
    cardLevelClass(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    if (this.userRole === 'employer') {
      await this.$store.dispatch('quests/workersList');
      this.showWelcomeModal();
    }
    this.SetLoader(false);
  },
  methods: {
    toggleSearchDD() {
      this.searchDDStatus = !this.searchDDStatus;
      return this.searchDDStatus;
    },
    hideSearchDD() {
      this.searchDDStatus = false;
      return this.searchDDStatus;
    },
    showPriceSearch() {
      this.ShowModal({
        key: modals.priceSearch,
      });
    },
    showWelcomeModal() {
      if (this.checkWelcomeModal === true) {
        this.ShowModal({
          key: modals.welcome,
        });
      }
      this.$store.dispatch('modals/checkWelcomeModal', false);
    },
    showDetails(worker) {
      this.$store.dispatch('quests/setCurrentWorker', worker);
      this.$router.push(`/workers/${worker.id}`);
    },
    cardsLevels(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
        { card__level_disabled: cards[idx].level.code === 0 },
      ];
    },
    cardsLevelsBorder(idx) {
      const { cards } = this;
      return [
        { card_lower: cards[idx].level.code === 2 },
        { card_lower: cards[idx].level.code === 3 },
        { card_lower: cards[idx].level.code === 0 },
      ];
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
    centerChange() {
      this.$store.dispatch('quests/setMapCenter', this.coordinates);
    },
    selectAddress(address) {
      this.search = address.formatted;
      this.addresses = [];
    },
    async getAddressInfo(address) {
      let response = [];
      const geoCode = new GeoCode('google', { key: process.env.GMAPKEY });
      try {
        if (address.length) {
          response = await geoCode.geolookup(address);
          this.addresses = JSON.parse(JSON.stringify(response));
          this.coordinates = JSON.parse(JSON.stringify({ lng: response[0].lng, lat: response[0].lat }));
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
.selector {
  @include box;
  width: 100%;
  z-index: 140;
  &__items {
    background: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
  &__item {
    @include text-simple;
    padding: 15px 20px;
    background: #FFFFFF;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    cursor: pointer;
    transition: .3s;
    &:hover {
      background: #F3F7FA;
    }
  }
}
.panel {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  &__left {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px;
  }
  &__right {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr;
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
    margin-bottom: 20px;
  }
}
.main {
  @include main;
  &-white {
    @include main-white;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
    color: $black800;
    margin: 30px 0 25px 0;
  }
}
.menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  justify-content: space-between;
  max-width: 1180px;
  width: 100%;
  &__left {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;
    justify-content: flex-start;
  }
  &__right {
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-gap: 20px;
    justify-content: flex-end;
  }
}
.map {
  &__container {
    position: relative;
  }
}
.content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 360px;
  grid-gap: 20px;
  margin-top: 20px;
}
.btn_white {
  font-size: 14px;
  background-color: $white;
  color: $black800;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 6px;
  flex-shrink: 0;
  width: 100%;
  transition: .2s;
  &:hover {
    background-color: $white;
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }
}
.icon {
  &_blue::before {
    color: $blue;
    font-size: 24px;
    display: block;
  }
}

.card {
  width: 100%;
  max-height: 360px;
  height: 360px;
  box-sizing: border-box;
  border-radius: 6px;
  align-items: center;
  cursor: pointer;
  box-shadow: none;
  transition: .5s;
  &:hover {
    cursor: pointer;
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }
  &_higher {
    border: 1px solid #F6CF00;
  }
  &_lower {
    border: none;
  }
  &__content {
    width: 100%;
    max-width: 240px;
  }
  &__spec {
    font-weight: 400;
    font-size: 14px;
    color: $blue;
    &_title {
      margin: 15px 0 0 0;
      font-size: 14px;
      font-weight: 400;
    }
  }
  &__header {
    display: flex;
    flex-direction: column;
    margin: 20px 0 0 0;
    &_top {
      display: grid;
      grid-template-columns: 61px 1fr;
      grid-gap: 15px;
      align-items: center;
    }
    &_right {
      display: grid;
      grid-template-rows: 20px 1fr;
      grid-gap: 7px;
    }
  }
  &__img {
    width: 61px;
    height: 61px;
    border-radius: 100%;
    object-fit: cover;
  }
  &__name {
    @include text-simple;
    font-size: 18px;
    font-weight: 500;
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
      display: flex;
      padding: 0 4px;
      align-items: center;
      background-color: #F6CF00;
      border-radius: 3px;
      color: $white;
    }
    &_reliable {
      display: flex;
      padding: 0 4px;
      align-items: center;
      background-color: #BBC0C7;
      border-radius: 3px;
      color: $white;
    }
    &_checked {
      display: flex;
      padding: 0 4px;
      align-items: center;
      background-color: #B79768;
      border-radius: 3px;
      color: $white;
    }
    &_disabled {
      display: none;
    }
  }
  &__title {
    margin: 15px 0 0 0;
    font-weight: 400;
    font-size: 14px;
  }
  &__about {
    margin: 0 0 15px 0;
    font-weight: 400;
    font-size: 14px;
    color: $black300;
    white-space: normal;
    overflow: hidden;
    max-height: 65px;
    text-overflow: ellipsis;
  }
  &__address {
    margin: 0 0 15px 0;
    font-weight: 500;
    font-size: 12px;
    color: $black500;
  }
}

.cost {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;

  &__title {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 5px;
  }
  &__value {
    font-size: 18px;
    line-height: 23px;
    color: $green;
  }
}

.checkbox {
  &-input {
    width: 24px;
    height: 24px;
  }
  &__label {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    margin: 0 0 0 5px;
    font-size: 16px;
  }
}
.gmap-block {
  height: 0;
  .search {
    &__block {
      position: relative;
      max-width: 1180px;
      height: 83px;
      bottom: 100px;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 1200;
      @include box;
    }
    &__content {
      display: grid;
      grid-template-columns: 154px 1fr 143px 260px;
      align-items: center;
      height: 100%;
      justify-items: center;
    }
    &__dd {
      display: flex;
      border-left: 1px solid #F7F8FA;
      justify-items: center;
      align-items: center;
      height: 100%;
      width: 144px;
    }
    &__icon {
      margin-bottom: -10px;
      &::before {
        font-size: 24px;
        color: $blue;
      }
    }
    &__inputs {
      padding: 0 20px;
      width: 100%;
      display: grid;
      align-items: center;
    }
    &__input {
      display: flex;
      align-items: center;
    }
    &__btn {
      max-width: 220px;
    }
    &__toggle {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #F7F8FA;
    }
    &__actions {
      height: 100%;
      border-left: 1px solid #F7F8FA;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    &__filter {
      display: none;
    }
  }
  &_shift {
    padding: 20px 0;
    height: auto;
    .search__block {
      bottom: 0;
    }
  }
}
@include _1300 {
  .gmap-block {
    .search {
      &__content {
        grid-template-columns: repeat(4, auto);
      }

      &__actions, &__toggle {
        padding: 10px;
      }

      &__block {
        width: 80%;
      }
    }
  }
}
@include _1199 {
  .panel {
    display: flex;
    flex-direction: column;
    &__right {
      margin-top: 10px;
    }
  }
  .main {
    padding-left: 20px;
    padding-right: 20px;
  }
  .menu {
    grid-template-columns: auto auto;
  }
  .card {
    padding: 10px;
  }
}
@include _991 {
  .content {
    grid-template-columns: repeat(3, 1fr);
  }
  .menu__right {
    grid-template-columns: repeat(2, 1fr);
  }
}
@include _767 {
  .panel {
    &__left {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .main {
    display: block;
    .content {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .tools {
    &__panel {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .dd {
    grid-column: 1/3;
  }
  .gmap-block {
    width: 100%;
    position: initial;
    padding: 20px;
    height: auto;
    .search {
      &__block {
        width: 100%;
        position: initial;
      }
      &__content {
        grid-template-columns: 1fr 0.5fr;
        padding: 0 10px;
        grid-gap: 10px;
      }
      &__toggle, &__dd {
        display: none;
      }
      &__actions {
        border: none;
      }
      &__inputs {
        padding: 0 10px;
      }
      &__filter {
        display: flex;
        flex-direction: row;
        position: relative;
        justify-content: space-between;
        top: 20px;
        align-content: center;
      }
    }
  }
  .dd__btn {
    justify-content: center;
    padding: 0 0;
  }
  .filter {
    &__toggle {
      text-align: center;
      display: flex;
      padding: 10px;
      border-radius: 6px;
      background: #FFFFFF;
    }
  }
}

@include _575 {
  .main {
    .menu {
      display: flex;
      flex-direction: column;
      grid-template-columns: auto;
    }
    .menu__left {
      display: flex;
      flex-direction: column;
    }
    .content {
      grid-template-columns: 1fr;
    }
    .menu__right {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
