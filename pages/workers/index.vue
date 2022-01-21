<template>
  <div class="employees">
    <map-block :is-show-map="isShowMap" />
    <div
      class="workers__search search"
      :class="{ 'search_map-hidden': !isShowMap }"
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
                      :data-selector="`ACTION-SELECT-ADDRESS-${item.key}`"
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
        <div class="filter__dd">
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
                mode="blackFont"
                :items="ratingItems"
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
                v-model="selectedWorkplace"
                class="panel__item"
                :items="workplaceItems"
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
                  <span class="icon-caret_down icon_blue" />
                </template>
              </base-btn>
            </div>
            <div class="panel__right">
              <base-btn
                class="tools__item"
                mode="light"
                :padding="true"
                data-selector="ACTION-TIME-SORT-USER"
                @click="sortByTime()"
              >
                <span class="tools__text">
                  {{ $t('quests.time') }}
                </span>
                <span :class="`icon-Sorting_${query['sort[createdAt]'] === 'desc' ? 'descending' : 'ascending'}`" />
              </base-btn>
            </div>
          </div>
        </div>
        <div
          v-if="workersList.count"
          class="employees__cards"
        >
          <employee-card
            v-for="(user,id) in workersList.users"
            :key="id"
            :user="user"
            @click="showDetails(user)"
          />
        </div>
        <empty-data
          v-else
          :description="$t('errors.emptyData.noEmployees')"
        />
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          class="employees__pager"
          :total-pages="totalPages"
          @input="setPage($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { GeoCode } from 'geo-coder';
import ClickOutside from 'vue-click-outside';
import modals from '~/store/modals/modals';
import { RatingFilter, PriorityFilter, WorkplaceFilter } from '~/utils/enums';

export default {
  name: 'Employees',
  directives: {
    ClickOutside,
  },
  data() {
    return {
      page: 1,
      query: {
        limit: 12,
        offset: 0,
        'sort[createdAt]': 'desc',
      },
      isFetching: false,
      selectedRating: null,
      selectedPriority: null,
      selectedWorkplace: null,

      additionalValue: '',
      isSearchDDStatus: true,
      isShowMap: true,
      rating: [],
      sortData: '',
      search: '',
      distanceIndex: 0,
      addresses: [],
      coordinates: null,
      boundsTimeout: null,
    };
  },
  computed: {
    ...mapGetters({
      userPosition: 'user/getUserCurrentPosition',
      userRole: 'user/getUserRole',
      mapBounds: 'quests/getMapBounds',
      workersList: 'quests/getWorkersList',
      selectedPriceFilter: 'quests/getSelectedPriceFilter',
      selectedSpecializationsFilters: 'quests/getSelectedSpecializationsFilters',
    }),
    totalPages() { return Math.ceil(this.workersList.count / this.query.limit); },
    specFiltersQuery() {
      const filtersData = this.selectedSpecializationsFilters?.query || [];
      const query = {};
      filtersData.forEach((item, i) => { query[`specialization[${i}]`] = item; });
      return query;
    },
    ratingItems() {
      const filters = [this.$t('quests.allVariants')];
      RatingFilter.forEach((item) => { if (item) filters.push(this.$t(`quests.rating.${item}`)); });
      return filters;
    },
    priorityItems() {
      const filters = [this.$t('quests.priority.all')];
      PriorityFilter.forEach((item) => { if (item.value) filters.push(this.$t(`quests.runtime.${item.key}`)); });
      return filters;
    },
    workplaceItems() { return WorkplaceFilter.map((item) => this.$t(`workPlaces.${item}`)); },

    distanceItems() {
      return [
        this.$t('quests.distance.100'),
        this.$t('quests.distance.500'),
        this.$t('quests.distance.1000'),
      ];
    },
  },
  watch: {
    async isShowMap(newVal) {
      this.SetLoader(true);
      this.additionalValue = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`;
      await this.fetchEmployeeList();
      this.SetLoader(false);
      localStorage.setItem('isShowMap', JSON.stringify(newVal));
    },
    async specFiltersQuery() {
      this.page = 1;
      await this.fetchEmployeeList();
    },
    async selectedRating() {
      this.page = 1;
      if (!this.selectedRating) delete this.query['ratingStatus[0]'];
      else this.query['ratingStatus[0]'] = RatingFilter[this.selectedRating];
      await this.fetchEmployeeList();
    },
    async selectedPriority() {
      this.page = 1;
      if (!this.selectedPriority) delete this.query['priority[0]'];
      else this.query['priority[0]'] = PriorityFilter[this.selectedPriority].value;
      await this.fetchEmployeeList();
    },
    async selectedWorkplace() {
      this.page = 1;
      if (!this.selectedWorkplace) delete this.query['workplace[0]'];
      else this.query['workplace[0]'] = WorkplaceFilter[this.selectedWorkplace];
      await this.fetchEmployeeList();
    },
    async selectedPriceFilter() {
      this.page = 1;
      const { selectedPriceFilter: { from, to } } = this;
      if (from || to) {
        this.query['betweenWagePerHour[from]'] = from || 0;
        this.query['betweenWagePerHour[to]'] = to || 99999999999999;
      } else {
        delete this.query['betweenWagePerHour[from]'];
        delete this.query['betweenWagePerHour[to]'];
      }
      await this.fetchEmployeeList();
    },

    async mapBounds(newVal, prevVal) {
      if (newVal?.center?.lng === prevVal?.center?.lng
        && newVal?.center?.lat === prevVal?.center?.lat
        && newVal?.northEast?.lng === prevVal?.northEast?.lng
        && newVal?.northEast?.lat === prevVal?.northEast?.lat
        && newVal?.southWest?.lng === prevVal?.southWest?.lng
        && newVal?.southWest?.lat === prevVal?.southWest?.lat) {
        return;
      }
      clearTimeout(this.boundsTimeout);
      this.boundsTimeout = setTimeout(async () => await this.fetchEmployeeList(), 1000);
    },
  },
  async mounted() {
    this.SetLoader(true);
    const isShow = JSON.parse(localStorage.getItem('isShowMap'));
    if (typeof isShow === 'boolean') this.isShowMap = isShow;
    await this.fetchEmployeeList();
    this.SetLoader(false);
  },
  beforeDestroy() {
    clearTimeout(this.boundsTimeout);
  },
  methods: {
    toggleSearchDD() {
      this.isSearchDDStatus = !this.isSearchDDStatus;
    },
    hideSearchDD() {
      this.isSearchDDStatus = false;
    },
    async setPage(newPage) {
      this.page = newPage;
      await this.fetchEmployeeList();
    },
    async sortByTime() {
      this.query['sort[createdAt]'] = this.query['sort[createdAt]'] === 'desc' ? 'asc' : 'desc';
      await this.fetchEmployeeList();
    },
    async fetchEmployeeList() {
      if (this.isFetching) return;
      this.SetLoader(true);
      this.isFetching = true;

      if (this.isShowMap && Object.keys(this.mapBounds).length) {
        this.query['north[longitude]'] = this.mapBounds.northEast.lng;
        this.query['north[latitude]'] = this.mapBounds.northEast.lat;
        this.query['south[longitude]'] = this.mapBounds.southWest.lng;
        this.query['south[latitude]'] = this.mapBounds.southWest.lat;
      } else {
        delete this.query['north[longitude]'];
        delete this.query['north[latitude]'];
        delete this.query['south[longitude]'];
        delete this.query['south[latitude]'];
      }

      const { query: { limit }, page } = this;
      this.query.offset = (page - 1) * limit;
      await this.$store.dispatch('quests/employeeList', {
        query: this.query,
        specFilter: this.specFiltersQuery,
      });

      this.isFetching = false;
      this.SetLoader(false);
    },
    showPriceSearch() {
      this.ShowModal({
        key: modals.priceSearch,
      });
    },
    showDetails(worker) {
      this.$store.dispatch('quests/setCurrentWorker', worker);
      this.$router.push(`/profile/${worker.id}`);
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

.employees {

  &__cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 360px;
    grid-gap: 20px;
    margin-top: 20px;
  }

  &__pager {
    margin-top: 20px;
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

.search {
  height: 0;
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
  &_map-hidden {
    padding: 20px 0;
    height: auto;
    .search__block {
      bottom: 0;
    }
  }
}

@include _1300 {
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
@include _1199 {
  .employees {

    &__cards {
      grid-template-columns: repeat(3, 1fr);
    }
  }

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
  .menu__right {
    grid-template-columns: repeat(2, 1fr);
  }
}
@include _991 {
  .employees {

    &__cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .panel {
    &__left {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .main {
    display: block;
  }
  .tools {
    &__panel {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .dd {
    grid-column: 1/3;
  }
  .search {
    width: 100%;
    position: initial;
    padding: 20px;
    height: auto;
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
  .employees {

    &__cards {
      grid-template-columns: 1fr;
    }
  }

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

    .menu__right {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
