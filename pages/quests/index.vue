<template>
  <div class="quests">
    <GmapSearchBlock
      :is-show-map="isShowMap"
      :zoom="zoomNumber"
    />
    <div
      class="quests__search-gmap search-gmap"
      :class="!isShowMap ? 'quests__search-gmap_shift' : ''"
    >
      <div class="search-gmap__search">
        <div class="search">
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
                  <div
                    class="selector__items"
                  >
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
              :items="distanceItems"
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
      <div class="search-gmap__filter">
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
            :label="$t('quests.ui.showMap')"
          />
        </div>
      </div>
    </div>
    <div class="quests__content">
      <div
        class="quests__body"
        :class="{'quests__body_wrap': !isShowMap}"
      >
        <div class="quests__title">
          <div class="quests__text quests__text_title">
            {{ $t('quests.searchResults') }}
          </div>
        </div>
        <div class="quests__tools tools">
          <div class="tools__panel">
            <base-filter-dd class="tools__item" />
            <base-dd
              v-model="selectedPriority"
              class="tools__item"
              mode="blackFont"
              :placeholder="$t('quests.priority.title')"
              :items="priorityItems"
            />
            <base-dd
              v-model="selectedTypeOfJob"
              class="tools__item"
              mode="blackFont"
              :placeholder="$t('quests.typeOfJob')"
              :items="typeOfJobItems"
            />
            <base-dd
              v-model="selectedDistantWork"
              class="tools__item"
              mode="blackFont"
              :placeholder="$t('quests.distantWork.title')"
              :items="distantWorkItems"
            />
            <base-btn
              class="tools__item"
              :mode="'light'"
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
                  class="icon-caret_down"
                />
              </template>
            </base-btn>
            <base-btn
              class="tools__item tools__item_time"
              :mode="'light'"
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
        <div
          v-if="tags.length"
          class="quests__tags tags"
        >
          <div
            v-for="(item, i) in tags"
            :key="i"
            class="tags__item"
          >
            <base-btn
              class="tags__btn"
              mode="tag"
            >
              {{ item }}
              <span
                class="icon-close_small"
                @click="deleteTag(item)"
              />
            </base-btn>
          </div>
        </div>
        <quests
          v-if="questsData.length > 0"
          :quests="questsData"
          @clickFavoriteStar="clickFavoriteStarHandler"
        />
        <div
          v-if="totalPages > 1"
          class="quests__pager"
        >
          <base-pager
            v-model="page"
            :total-pages="totalPages"
          />
        </div>
        <emptyData
          v-else-if="questsData.length === 0"
          :description="$t(`errors.emptyData.${userRole}.allQuests.desc`)"
          :btn-text="$t(`errors.emptyData.${userRole}.allQuests.btnText`)"
          :link="getEmptyLink"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { GeoCode } from 'geo-coder';
import modals from '~/store/modals/modals';
import GmapSearchBlock from '~/components/app/GmapSearch';
import quests from '~/components/app/pages/common/quests';
import emptyData from '~/components/app/info/emptyData';
import {
  priorityFilter, typeOfJobFilter, workplaceFilter, Path, UserRole,
} from '~/utils/enums';

export default {
  name: 'QuestsList',
  directives: {
    ClickOutside,
  },
  components: {
    GmapSearchBlock,
    quests,
    emptyData,
  },
  data() {
    return {
      isShowMap: localStorage.getItem('isShowMap') ? JSON.parse(localStorage.getItem('isShowMap')) : true,
      search: '',
      isSearchDDStatus: true,
      searchDDStatus: true,
      selectedDistantWork: null,
      selectedPriority: null,
      selectedTypeOfJob: null,
      distanceIndex: 0,
      timeSort: 'desc',
      page: 1,
      perPager: 10,
      zoomNumber: 15,
      addresses: [],
      coordinates: null,
      boundsTimeout: null,
      skillsArray: [],
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      mapBounds: 'quests/getMapBounds',
      questsData: 'quests/getAllQuests',
      questsCount: 'quests/getAllQuestsCount',
      selectedSpecializationsFilters: 'quests/getSelectedSpecializationsFilters',
      selectedPriceFilter: 'quests/getSelectedPriceFilter',
    }),
    distanceItems() {
      return [
        this.$t('quests.distance.100'),
        this.$t('quests.distance.500'),
        this.$t('quests.distance.1000'),
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
    typeOfJobItems() {
      return [
        this.$t('quests.allVariants'),
        this.$t('quests.fullTime'),
        this.$t('quests.partTime'),
        this.$t('quests.fixedTerm'),
      ];
    },
    distantWorkItems() {
      return [
        this.$t('quests.distantWork.allWorkplaces'),
        this.$t('quests.distantWork.distantWork'),
        this.$t('quests.distantWork.workInOffice'),
        this.$t('quests.distantWork.bothVariant'),
      ];
    },
    totalPages() {
      return Math.ceil(this.questsCount / this.perPager);
    },
    getEmptyLink() {
      return this.userRole === UserRole.WORKER
        ? ''
        : Path.CREATE_QUEST;
    },
  },
  watch: {
    async isShowMap(newVal) {
      this.page = 1;
      await this.updateQuests();
      localStorage.setItem('isShowMap', JSON.stringify(newVal));
    },
    async page() {
      await this.updateQuests();
    },
    async selectedPriceFilter() {
      this.page = 1;
      await this.updateQuests();
    },
    async selectedSpecializationsFilters() {
      this.page = 1;
      await this.updateQuests();
    },
    async selectedDistantWork() {
      this.page = 1;
      await this.updateQuests();
    },
    async selectedPriority() {
      await this.updateQuests();
    },
    async selectedTypeOfJob() {
      await this.updateQuests();
    },
    async mapBounds(newVal, prevVal) {
      if (this.isShowMap) {
        if (newVal?.center?.lng === prevVal?.center?.lng
          && newVal?.center?.lat === prevVal?.center?.lat
          && newVal?.northEast?.lng === prevVal?.northEast?.lng
          && newVal?.northEast?.lat === prevVal?.northEast?.lat
          && newVal?.southWest?.lng === prevVal?.southWest?.lng
          && newVal?.southWest?.lat === prevVal?.southWest?.lat) {
          return;
        }
        this.page = 1;
        clearTimeout(this.boundsTimeout);
        this.boundsTimeout = setTimeout(async () => await this.updateQuests(), 100);
      }
    },
    distanceIndex() {
      const zoom = {
        0: 15,
        1: 10,
        2: 8,
      };
      this.zoomNumber = zoom[this.distanceIndex];
    },
    async $route() {
      await this.$store.dispatch('quests/setSelectedSpecializationsFilters', {
        query: '', selected: {}, visible: {}, selectedAll: {},
      });
    },
  },
  async mounted() {
    const { query } = this.$route;
    if (Object.keys(query).length) {
      this.isShowMap = false;
      const skills = Object.keys(this.$t(`filters.items.${query.specialization}.sub`));
      const selected = {};
      for (let i = 0; i < skills.length; i += 1) {
        this.skillsArray.push(`${query.specialization}.${skills[i]}`);
        selected[`${query.specialization}.${skills[i]}`] = true;
      }
      this.formattedSpecFilters();
      const data = {
        query: this.skillsArray,
        selected,
        selectedAll: {},
        visible: { [query.specialization - 1]: true },
      };
      await this.$store.dispatch('quests/setSelectedSpecializationsFilters', data);
    }
    await this.updateQuests();
  },
  beforeDestroy() {
    clearTimeout(this.boundsTimeout);
  },
  methods: {
    formattedSpecFilters() {
      let filtersData = [];
      if (this.$route.query.specialization) {
        filtersData = this.skillsArray;
      } else {
        filtersData = this.selectedSpecializationsFilters.query || [];
      }
      const filters = {};
      for (let i = 0; i < filtersData.length; i += 1) { filters[`specializations[${i}]`] = filtersData[i]; }
      return filters;
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
    async updateQuests() {
      if (!this.isShowMap) this.SetLoader(true);
      await this.fetchQuests({
        limit: this.perPager,
        offset: (this.page - 1) * this.perPager,
        'sort[createdAt]': this.timeSort,
      });
      this.SetLoader(false);
    },
    async clickFavoriteStarHandler(item) {
      this.SetLoader(true);
      if (!item.star) {
        await this.$store.dispatch('quests/setStarOnQuest', item.id);
      } else {
        await this.$store.dispatch('quests/takeAwayStarOnQuest', item.id);
      }
      await this.updateQuests();
      this.SetLoader(false);
    },
    async fetchQuests(payload = {}) {
      payload = Object.assign(payload, this.formattedSpecFilters());
      if (this.selectedDistantWork > 0) payload['workplaces[]'] = workplaceFilter[this.selectedDistantWork];
      if (this.selectedTypeOfJob > 0) payload['employments[]'] = typeOfJobFilter[this.selectedTypeOfJob];
      if (this.selectedPriority) payload['priorities[]'] = priorityFilter[this.selectedPriority];
      if (this.selectedPriceFilter.from || this.selectedPriceFilter.to) {
        payload['priceBetween[from]'] = this.selectedPriceFilter.from || 0;
        payload['priceBetween[to]'] = this.selectedPriceFilter.to || 99999999999999;
      }
      if (this.$route.query.statuses) payload['statuses[]'] = 0;
      if (!this.isShowMap || !this.mapBounds.center) {
        await this.$store.dispatch('quests/getAllQuests', payload);
      } else {
        const bounds = {
          'north[longitude]': await this.mapBounds?.northEast?.lng,
          'north[latitude]': await this.mapBounds?.northEast?.lat,
          'south[longitude]': await this.mapBounds?.southWest?.lng,
          'south[latitude]': await this.mapBounds?.southWest?.lat,
        };
        await this.$store.dispatch('quests/getAllQuests', Object.assign(payload, bounds));
        await this.$store.dispatch('quests/getQuestsLocation', bounds);
      }
    },
    toggleMap() {
      this.isShowMap = !this.isShowMap;
    },
    async changeSorting(type) {
      if (type === 'time') {
        this.timeSort = this.timeSort === 'desc' ? 'asc' : 'desc';
      }
      await this.updateQuests({
        limit: this.perPager,
        offset: (this.page - 1) * this.perPager,
        'sort[createdAt]': this.timeSort,
      });
    },
    deleteTag(tag) {
      this.$store.dispatch('ui/deleteTags', tag);
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

.icon {
  cursor: pointer;
  font-size: 25px;
  &-caret_down::before {
    @extend .icon;
    content: "\ea48";
    color: $blue !important;
  }
  &-notification_outline:before {
    @extend .icon;
    content: "\e93a";
    color: $blue;
  }
  &-location:before {
    font-size: 20px;
    content: "\ea23";
    color: $black500;
  }
  &-short_right:before {
    @extend .icon;
    content: "\ea6e";
    color: $blue;
    font-size: 20px;
  }
}

.quests {
  &__pager {
    margin-top: 25px;
  }
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
  &__search-gmap {
    height: 0;
    &_shift {
      padding: 20px 0;
      height: auto;
      .search-gmap__search {
        bottom: 0;
      }
    }
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
  &__item {
    justify-content: space-around;
  }
  &__panel {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 10px;
    width: 100%;
    span::before {
      padding-left: 10px;
      margin-right: 10px;
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
    display: block;
    &_price {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }
  }
  &__right {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
    span::before {
      padding-left: 10px;
      margin-right: 10px;
      color: $black400;
      font-size: 24px;
    }
  }
}
.search-gmap {
  &__top {
    height:435px;
  }
  &__search {
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
  &__filter {
    display: none;
  }
  &__search, &__filter {
    transition: all 0.5s ease;
  }
}
.search {
  display: grid;
  grid-template-columns: 154px 1fr 143px 260px;
  align-items: center;
  height: 100%;
  justify-items: center;
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

@include _1300 {
  .search {
    grid-template-columns: repeat(4, auto);
    &__actions, &__toggle {
      padding: 10px;
    }
  }
  .search-gmap {
    &__search {
      width: 80%;
    }
  }
}
@include _1199 {
  .quests {
    &__content {
      padding: 20px;
    }
  }
}
@include _991 {
  .tools {
    justify-content: center;
    &__panel {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .quests {
    .limit__container {
      display: grid;
      grid-template-columns: auto;
    }
    &__content {
      grid-template-columns: 1fr;
    }
  }
}
@include _767 {
  .quests {
    .limit__container {
      display: grid;
      grid-template-columns: auto;
    }
    &__search-gmap {
      padding: 20px;
      height: auto;
    }
    &__body {
      display: flex;
      grid-gap: 15px;
      flex-direction: column;
    }
    &__tools {
      padding: 0;
    }
  }
  .tools {
    &__panel {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .search-gmap {
    &__search {
      width: 100%;
      position: initial;
    }
  }
  .search {
    grid-template-columns: 1fr 0.5fr;
    padding: 0 10px;
    grid-gap: 10px;
    &__toggle, &__dd {
      display: none;
    }
    &__actions {
      border: none;
    }
    &__inputs {
      padding: 0 10px;
    }
  }
  .search-gmap {
    &__filter {
      display: flex;
      flex-direction: row;
      position: relative;
      justify-content: space-between;
      top: 20px;
      align-content: center;
    }
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

@include _480 {
  .tools {
    &__panel {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .quests {
    &__top {
      min-height: 125px;
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
  .dd__btn {
    justify-content: space-around;
  }
  .base-btn {
    justify-content: space-between;
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
  .search {
    &__actions {
      width: 100%;
      padding: 10px;
    }
  }
}
</style>
