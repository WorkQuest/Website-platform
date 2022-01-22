<template>
  <div class="employees">
    <map-block
      class="employees__map-block"
      :is-show-map="isShowMap"
    />
    <div
      class="employees__search search"
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
              {{ $t('workers.searchWorkers') }}
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
    <div class="employees__content">
      <h2 class="employees__title">
        {{ $t('workers.topWorkers') }}
      </h2>
      <filters-panel
        class="employees__filters"
        @sortSpec="sortBySpec"
        @sortTime="sortByTime"
        @sortPrice="sortByPrice"
        @sortRating="sortByRating"
        @sortPriority="sortByPriority"
        @sortWorkplace="sortByWorkplace"
      />
      <div
        v-if="employeeCount"
        class="employees__cards"
      >
        <employee-card
          v-for="(user,id) in employeeList"
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
        @input="setPage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { GeoCode } from 'geo-coder';
import ClickOutside from 'vue-click-outside';
import modals from '~/store/modals/modals';

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
      specFilter: {},
      isShowMap: true,
      isFetching: false,
      boundsTimeout: null,

      isSearchDDStatus: true,
      search: '',
      distanceIndex: 0,
      addresses: [],
      coordinates: null,
    };
  },
  computed: {
    ...mapGetters({
      mapBounds: 'quests/getMapBounds',
      employeeList: 'quests/getEmployeeList',
      employeeCount: 'quests/getEmployeeCount',
    }),
    totalPages() { return Math.ceil(this.employeeCount / this.query.limit); },

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
      localStorage.setItem('isShowMap', newVal);
      await this.fetchEmployeeList();
    },
    async mapBounds(newV, oldV) {
      if (!this.isShowMap || !Object.keys(oldV).length) return;
      if (
        newV?.center?.lng === oldV?.center?.lng
        && newV?.center?.lat === oldV?.center?.lat
        && newV?.northEast?.lng === oldV?.northEast?.lng
        && newV?.northEast?.lat === oldV?.northEast?.lat
        && newV?.southWest?.lng === oldV?.southWest?.lng
        && newV?.southWest?.lat === oldV?.southWest?.lat
      ) return;
      clearTimeout(this.boundsTimeout);
      this.boundsTimeout = setTimeout(async () => await this.fetchEmployeeList(true), 500);
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
    this.$store.commit('quests/setEmployeeList', { count: null, users: [] });
  },
  methods: {
    async setPage(newPage) {
      this.page = newPage;
      await this.fetchEmployeeList();
    },
    async fetchEmployeeList(isResetPage = false) {
      if (this.isFetching) return;
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

      if (isResetPage) this.page = 1;
      const { query: { limit }, page } = this;
      this.query.offset = (page - 1) * limit;

      await this.$store.dispatch('quests/employeeList', {
        query: this.query,
        specFilter: this.specFilter,
      });

      this.isFetching = false;
    },

    async sortBySpec(value) {
      this.specFilter = value;
      await this.fetchEmployeeList(true);
    },
    async sortByTime(value) {
      this.query['sort[createdAt]'] = value;
      await this.fetchEmployeeList();
    },
    async sortByPrice(value) {
      if (!Object.keys(value).length) {
        delete this.query['betweenWagePerHour[from]'];
        delete this.query['betweenWagePerHour[to]'];
      } else this.query = { ...this.query, ...value };
      await this.fetchEmployeeList(true);
    },
    async sortByRating(value) {
      if (!Object.keys(value).length) delete this.query['ratingStatus[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchEmployeeList(true);
    },
    async sortByPriority(value) {
      if (!Object.keys(value).length) delete this.query['priority[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchEmployeeList(true);
    },
    async sortByWorkplace(value) {
      if (!Object.keys(value).length) delete this.query['workplace[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchEmployeeList(true);
    },

    toggleSearchDD() {
      this.isSearchDDStatus = !this.isSearchDDStatus;
    },
    hideSearchDD() {
      this.isSearchDDStatus = false;
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
  @include text-simple;

  &__content {
    max-width: 1180px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  &__title {
    margin-top: 30px;
    font-size: 25px;
    font-weight: 500;
    line-height: 32px;
  }

  &__filters {
    margin-top: 25px;
  }

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

.map {
  &__container {
    position: relative;
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

    &__content {
      padding: 0 20px;
    }

    &__cards {
      grid-template-columns: repeat(3, 1fr);
    }
  }

}
@include _991 {
  .employees {

    &__cards {
      grid-template-columns: repeat(2, 1fr);
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

}
</style>
