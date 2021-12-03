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
              data-selector="ACTION-IS-SHOW-MAP-USER"
              name="map"
              :label="$t('quests.ui.showMap')"
            />
          </div>
          <div
            class="search__inputs"
            data-selector="ACTION-TOGGLE-SEARCH-DD-USER"
            @click="toggleSearchDD"
          >
            <base-field
              v-model="search"
              v-click-outside="hideSearchDD"
              data-selector="INPUT-SEARCH-ADDRESS-USER"
              class="search__input"
              is-search
              :placeholder="$t('quests.ui.search')"
              mode="icon"
              :selector="isSearchDDStatus"
              @selector="getAddressInfo(search)"
            >
              <template v-slot:left />
              <template v-slot:selector>
                <div
                  v-if="addresses.length"
                  class="selector"
                  :class="{'selector_hide': isSearchDDStatus === false}"
                >
                  <div class="selector__items">
                    <div
                      v-for="(item, i) in addresses"
                      :key="i"
                      :data-selector="`ACTION-SELECT-ADDRESS-${item.key.toUpperCase()}`"
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
              :items="distanceItems"
            />
          </div>
          <div class="search__actions">
            <base-btn
              class="search__btn"
              data-selector="ACTION-MAP-CENTER-CHANGE-USER"
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
            :items="distanceItems"
          />
        </div>
        <div class="filter__toggle">
          <base-checkbox
            v-model="isShowMap"
            name="map"
            data-selector="ACTION-IS-SHOW-MAP-USER"
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
                v-model="selectedRating"
                class="panel__item"
                :items="ratingItems"
                mode="blackFont"
                :placeholder="$t('quests.rating.title')"
              />
              <base-dd
                v-model="selectedPriority"
                class="panel__item"
                :items="priorityItems"
                mode="blackFont"
                :placeholder="$t('quests.priority.title')"
              />
              <base-dd
                v-model="selectedDistantWork"
                class="panel__item"
                :items="distantWorkItem"
                mode="blackFont"
                :placeholder="$t('quests.distantWork.title')"
              />
              <base-btn
                class="panel__item"
                :mode="'light'"
                data-selector="ACTION-SHOW-PRICE-SEARCH-USER"
                @click="showPriceSearch"
              >
                <span
                  v-if="selectedPriceFilter.from && selectedPriceFilter.to"
                  class="tools__text tools__text_price"
                >
                  {{ selectedPriceFilter.from }} - {{ selectedPriceFilter.to }}
                </span>
                <span
                  v-else-if="!selectedPriceFilter.from && selectedPriceFilter.to"
                  class="tools__text tools__text_price"
                >
                  0 - {{ selectedPriceFilter.to }}
                </span>
                <span
                  v-else-if="selectedPriceFilter.from && !selectedPriceFilter.to"
                  class="tools__text tools__text_price"
                >
                  > {{ selectedPriceFilter.from }}
                </span>
                <span
                  v-else
                  class="tools__text"
                >
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
                data-selector="ACTION-TIME-SORT-USER"
                @click="changeSorting('time')"
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
          <div v-if="workersList.count === 0">
            {{ $t('workers.noWorkers') }}
          </div>
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
              <div
                v-if="user.userSpecializations.length !== 0"
                class="badge__container"
              >
                <ul class="badge-list">
                  <li
                    v-for="(skill, spec) in user.userSpecializations"
                    :key="spec"
                    class="badge__item"
                  >
                    {{ getSkillTitle(skill.path) }}
                  </li>
                </ul>
              </div>
              <span
                v-if="user.userSpecializations.length === 0"
                class="card__spec"
              >
                {{ $t('quests.dontHaveSpec') }}
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
              <div class="card__cost cost">
                <div class="cost__title">
                  {{ $t('workers.costTitle') }}
                </div>
                <div class="cost__value">
                  {{ user.wagePerHour !== null ? user.wagePerHour : $t('worker.cost.notIndicated') }} {{ user.wagePerHour !== null ? $t('quests.wusd') : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="page"
          :total-pages="totalPagesValue"
        />
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
import { priorityFilter, ratingFilter, workplaceFilter } from '~/utils/enums';

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
      workerObjects: {},
      page: 1,
      perPager: 12,
      additionalValue: '',
      totalPagesValue: 1,
      isSearchDDStatus: true,
      isShowMap: true,
      rating: [],
      sortData: '',
      selectedPriority: null,
      selectedDistantWork: null,
      selectedRating: null,
      selectedTypeOfJob: '',
      search: '',
      distanceIndex: 0,
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
      selectedSpecializationsFilters: 'quests/getSelectedSpecializationsFilters',
      selectedPriceFilter: 'quests/getSelectedPriceFilter',
    }),
    totalPages() {
      if (this.workersList.count > 0) {
        return Math.ceil(this.workersList.count / this.perPager);
      }
      return 0;
    },
    distantWorkItem() {
      return [
        this.$t('quests.distantWork.allWorkplaces'),
        this.$t('quests.distantWork.distantWork'),
        this.$t('quests.distantWork.workInOffice'),
        this.$t('quests.distantWork.bothVariant'),
      ];
    },
    priorityItems() {
      return [
        this.$t('quests.priority.all'),
        this.$t('quests.runtime.urgent'),
        this.$t('quests.runtime.shortTerm'),
        this.$t('quests.runtime.fixedDelivery'),
      ];
    },
    ratingItems() {
      return [
        this.$t('quests.allVariants'),
        this.$t('quests.rating.verified'),
        this.$t('quests.rating.reliable'),
        this.$t('quests.rating.topRanked'),
      ];
    },
    distanceItems() {
      return [
        this.$t('quests.distance.100'),
        this.$t('quests.distance.500'),
        this.$t('quests.distance.1000'),
      ];
    },
    cardLevelClass(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
      ];
    },
    formattedSpecFilters() {
      const filtersData = this.selectedSpecializationsFilters?.query || [];
      if (!filtersData.length) return '';
      let filters = `specialization[]=${filtersData[0]}`;
      for (let i = 1; i < filtersData.length; i += 1) { filters += `&specialization[]=${filtersData[i]}`; }
      return filters;
    },
  },
  watch: {
    async isShowMap() {
      this.SetLoader(true);
      this.additionalValue = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`;
      await this.fetchWorkersList();
      this.SetLoader(false);
    },
    async page() {
      this.SetLoader(true);
      this.additionalValue = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`;
      await this.fetchWorkersList();
      this.SetLoader(false);
    },
    async mapBounds() {
      await this.fetchWorkersList();
    },
    async formattedSpecFilters() {
      await this.fetchWorkersList();
    },
    async selectedPriceFilter() {
      await this.fetchWorkersList();
    },
    async selectedPriority() {
      await this.fetchWorkersList();
    },
    async selectedDistantWork() {
      await this.fetchWorkersList();
    },
    async selectedTypeOfJob() {
      await this.fetchWorkersList();
    },
    async selectedRating() {
      await this.fetchWorkersList();
    },
  },
  async mounted() {
    this.SetLoader(true);
    if (this.userRole === 'employer') {
      await this.fetchWorkersList();
      this.showWelcomeModal();
    }
    this.SetLoader(false);
  },
  methods: {
    toggleSearchDD() {
      this.isSearchDDStatus = !this.isSearchDDStatus;
    },
    hideSearchDD() {
      this.isSearchDDStatus = false;
    },
    getSkillTitle(path) {
      const [spec, skill] = path.split('.');
      return this.$t(`filters.items.${spec}.sub.${skill}`);
    },
    async changeSorting(type) {
      let sortValue = '';
      if (type === 'time') {
        this.timeSort = this.timeSort === 'desc' ? 'asc' : 'desc';
        sortValue = `&sort[createdAt]=${this.timeSort}`;
      }
      this.sortData = sortValue;
      await this.fetchWorkersList();
    },
    async fetchWorkersList() {
      let payload = this.formattedSpecFilters;
      payload += this.sortData;
      if (!this.isShowMap || !Object.keys(this.mapBounds).length) {
        this.workerObjects = await this.$store.dispatch('quests/workersList', `${this.additionalValue}&${payload}`);
      } else if (Object.keys(this.mapBounds).length > 0) {
        const bounds = `north[longitude]=${this.mapBounds.northEast.lng}&north[latitude]=${this.mapBounds.northEast.lat}&south[longitude]=${this.mapBounds.southWest.lng}&south[latitude]=${this.mapBounds.southWest.lat}`;
        if (this.selectedPriority) payload += `&priority=${priorityFilter[this.selectedPriority]}`;
        else if (this.selectedDistantWork > 0) payload += `&workplace[]=${workplaceFilter[this.selectedDistantWork]}`;
        else if (this.selectedRating > 0) payload += `&ratingStatus=${ratingFilter[this.selectedRating]}`;
        else if (this.selectedPriceFilter.from || this.selectedPriceFilter.to) {
          payload += `&betweenWagePerHour[from]=${this.selectedPriceFilter.from || 0}&betweenWagePerHour[to]=${this.selectedPriceFilter.to || 99999999999999}`;
        }
        await this.$store.dispatch('quests/workersList', `${this.additionalValue}&${bounds}&${payload}`);
      }
      this.totalPagesValue = this.totalPages;
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

.badge {
  &-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  &__container {
    padding: 0;
    height: 21px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  &__item {
    @include text-simple;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: $blue;
  }
}
.selector {
  @include box;
  width: 100%;
  z-index: 140;
  &_hide {
    display: none;
  }
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
  &__item {
    min-width: 180px !important;
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
    &_price {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
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
.tools {
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    display: block;
    &_price {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }
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
      width: 146px;
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
