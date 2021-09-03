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
          <div class="search__inputs">
            <base-field
              v-model="search"
              class="search__input"
              is-search
              :placeholder="$t('quests.ui.search')"
              mode="icon"
              :selector="true"
              @selector="getAddressInfo(search)"
            >
              <template v-slot:left />
              <template v-slot:selector>
                <div
                  v-if="addresses.length"
                  class="selector"
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
      <div class="search-gmap__filter">
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
              v-model="selectedQuest"
              class="tools__item"
              :items="quests"
              mode="blackFont"
              :placeholder="$t('quests.quests')"
            />
            <base-dd
              v-model="selectedUrgent"
              class="tools__item"
              :items="urgent"
              mode="blackFont"
              :placeholder="$t('quests.urgent')"
            />
            <base-dd
              v-model="selectedTypeOfJob"
              class="tools__item"
              :items="typeOfJob"
              mode="blackFont"
              :placeholder="$t('quests.typeOfJob')"
            />
            <base-dd
              v-model="selectedDistantWork"
              class="tools__item"
              :items="distantWork"
              mode="blackFont"
              :placeholder="$t('quests.distantWork.title')"
            />
            <base-btn
              class="tools__item"
              :mode="'light'"
              @click="showPriceSearch"
            >
              <span class="tools__text">
                {{ $t('quests.price') }}
              </span>
              <template v-slot:right>
                <span
                  class="icon-caret_down"
                />
              </template>
            </base-btn>
            <base-btn
              class="tools__item"
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
          v-if="questsArray.length > 0"
          :object="questsObjects"
          :page="'quests'"
        />
        <base-pager
          v-if="totalPagesValue !== 1"
          v-model="page"
          :total-pages="totalPagesValue"
        />
        <emptyData
          v-else-if="questsArray.length === 0"
          :description="$t(`errors.emptyData.${userRole}.allQuests.desc`)"
          :btn-text="$t(`errors.emptyData.${userRole}.allQuests.btnText`)"
          :link="userRole === 'employer' ? '/create-quest' : ''"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { GeoCode } from 'geo-coder';
import modals from '~/store/modals/modals';
import GmapSearchBlock from '~/components/app/GmapSearch';
import quests from '~/components/app/pages/common/quests';
import emptyData from '~/components/app/info/emptyData';

export default {
  name: 'Quests',
  components: {
    GmapSearchBlock,
    quests,
    emptyData,
  },
  data() {
    return {
      isShowMap: true,
      search: '',
      quests: [
        this.$t('quests.quests'),
        this.$t('quests.specQuests'),
        this.$t('quests.permanentJob'),
      ],
      selectedQuest: '',
      urgent: [
        this.$t('priority.urgent'),
        this.$t('priority.normal'),
        this.$t('priority.low'),
      ],
      typeOfJob: [
        this.$t('quests.fullTime'),
        this.$t('quests.partTime'),
        this.$t('quests.fixedTerm'),
        this.$t('quests.contract'),
        this.$t('quests.remoteWork'),
      ],
      selectedTypeOfJob: '',
      distantWork: [
        this.$t('quests.distantWork.distantWork'),
        this.$t('quests.distantWork.workInOffice'),
        this.$t('quests.distantWork.bothVariant'),
      ],
      selectedDistantWork: '',
      priority: [
        this.$t('quests.priority.all'),
        this.$t('quests.priority.low'),
        this.$t('quests.priority.normal'),
        this.$t('quests.priority.urgent'),
      ],
      distanceIndex: 0,
      priceSort: 'desc',
      timeSort: 'desc',
      questsObjects: {},
      questsArray: [],
      sortData: '',
      page: 1,
      perPager: 10,
      totalPagesValue: 1,
      additionalValue: '',
      zoomNumber: 15,
      distance: [
        '+ 100 m',
        '+ 500 m',
        '+ 1000 m',
      ],
      addresses: [],
      coordinates: null,
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      checkWelcomeModal: 'modals/getIsShowWelcome',
      userRole: 'user/getUserRole',
      mapBounds: 'quests/getMapBounds',
    }),
    totalPages() {
      if (this.questsObjects) {
        return Math.ceil(this.questsObjects.count / this.perPager);
      }
      return 0;
    },
  },
  watch: {
    async isShowMap() {
      this.SetLoader(true);
      const additionalValue = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`;
      await this.getQuests(additionalValue);
      this.totalPagesValue = this.totalPages;
      this.SetLoader(false);
    },
    async page() {
      this.SetLoader(true);
      const additionalValue = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`;
      await this.getQuests(additionalValue);
      this.SetLoader(false);
    },
    async mapBounds() {
      this.SetLoader(true);
      const additionalValue = `${this.sortData}`;
      await this.getQuests(additionalValue);
      this.totalPagesValue = this.totalPages;
      this.SetLoader(false);
    },
    distanceIndex() {
      const zoom = {
        0: 15,
        1: 10,
        2: 8,
      };
      this.zoomNumber = zoom[this.distanceIndex];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    showPriceSearch() {
      this.ShowModal({
        key: modals.priceSearch,
      });
    },
    showFilter() {
      this.ShowModal({
        key: modals.questFilter,
      });
    },
    async getQuests(payload = '') {
      if (!this.isShowMap) {
        this.questsObjects = await this.$store.dispatch('quests/getAllQuests', payload);
        this.questsArray = this.questsObjects.quests;
      } else {
        this.additionalValue = payload;
        if (!Object.keys(this.mapBounds).length) {
          this.questsObjects = await this.$store.dispatch('quests/getAllQuests', payload);
        } else {
          const bounds = `north[longitude]=${this.mapBounds.northEast.lng}&north[latitude]=${this.mapBounds.northEast.lat}&south[longitude]=${this.mapBounds.southWest.lng}&south[latitude]=${this.mapBounds.southWest.lat}`;
          this.questsObjects = await this.$store.dispatch('quests/getAllQuests', `${bounds}&${payload}`);
          await this.$store.dispatch('quests/getQuestsLocation', `${bounds}`);
          this.questsArray = this.questsObjects.quests;
        }
        // const bounds = `north[longitude]=${this.mapBounds.northEast.lng}&north[latitude]=${this.mapBounds.northEast.lat}&south[longitude]=${this.mapBounds.southWest.lng}&south[latitude]=${this.mapBounds.southWest.lat}`;
      }
    },
    toNotifications() {
      this.$router.push('/notification');
    },
    toggleMap() {
      this.isShowMap = !this.isShowMap;
    },
    showDetails() {
      this.$router.push('/quests/1');
    },
    async changeSorting(type) {
      let sortValue = '';
      if (type === 'price') {
        if (this.priceSort === 'desc') {
          this.priceSort = 'asc';
          this.timeSort = 'desc';
        } else {
          this.priceSort = 'desc';
          this.timeSort = 'asc';
        }
        sortValue = `&sort[price]=${this.priceSort}`;
      }
      if (type === 'time') {
        if (this.timeSort === 'desc') {
          this.timeSort = 'asc';
          this.priceSort = 'desc';
        } else {
          this.timeSort = 'desc';
          this.priceSort = 'asc';
        }
        sortValue = `&sort[createdAt]=${this.timeSort}`;
      }
      this.sortData = sortValue;
      const additionalValue = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`;
      await this.getQuests(additionalValue);
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
        0: '',
        1: this.$t('priority.low'),
        2: this.$t('priority.normal'),
        3: this.$t('priority.urgent'),
      };
      return priority[index] || '';
    },
    getPriorityClass(index) {
      const priority = {
        0: '',
        1: 'block__priority_low',
        2: 'block__priority_normal',
        3: 'block__priority_urgent',
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

.block {
  &__container {
    display: flex;
    align-self: center;
    justify-content: flex-end;
  }
}

.bg {
  &_white {
    background-color: $white;
  }
}

.distance {
  &__container {
    display: flex;
    flex-direction: row;
    justify-items: flex-start;
    align-items: center;
    margin: 20px 20px 0 20px;
  }
  &__distance {
    justify-self: flex-start;
    align-self: center;
    font-weight: 400;
    font-size: 14px;
    color: $black500;
  }
}
.user {
  &__avatar {
    border-radius: 37px;
    max-width: 30px;
    max-height: 30px;
    width: 100%;
    height: 100%;
  }

  &__name {
    justify-self: flex-start;
  }
}

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
    margin-bottom: 20px;
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
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px;
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
.search-gmap{
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
.checkbox {
  &__isShowMap {
    margin: 30px 50px 0 10px;
    display: flex;
    flex-direction: row;
    height: 25px;
    align-items: center;
  }
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
.search-bar {
  left: 18%;
  bottom: 30px;
  margin: 10px 0 0 0;
  position: absolute;
  max-width: 1180px;
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  background-color: $white;
  z-index: 10;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  &__body {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 40px;
  }
  &__input {
    margin: 30px 10px 0 0;
    height: 25px;
    width: 510px;
  }
  &__btn {
    margin: 30px 10px 0 0;
    flex-shrink: 0;
  }
  &__btn-search {
    margin: 30px 10px 0 0;
    width: 220px;
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
    .block {
      &__img {
        height: 100%;
        width: 100%;
        img {
          border-radius: 6px;
        }
      }
    }
  }
}
@include _767 {
  .quests {
    .limit__container {
      display: grid;
      grid-template-columns: auto;
    }
    .block {
      grid-template-columns: auto;
      &__img {
        max-width: 100%;
        img {
          height: 200px;
          object-fit: cover;
          width: 100%;
        }
      }
    }
    &__search-gmap {
      padding: 20px;
      height: auto;
    }
  }
  .quests {
    &__tools {
      padding: 0;
      margin-bottom: 20px;
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
  .dd__btn {
    justify-content: center;
    padding: 0 0;
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
@include _575 {
  .block {
    &__actions {
      display: grid;
      grid-template-columns: 2fr 1fr;
    }
    &__btn {
      margin-top: 10px;
      display: flex;
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
      width: 60%;
      padding: 10px;
    }
  }
}
</style>
