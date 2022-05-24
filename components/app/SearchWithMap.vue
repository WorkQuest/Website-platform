<template>
  <div class="search-with-map">
    <g-map-loader
      class="search-with-map__map-block"
      :class="{'search-with-map__map-block_hidden' : !isShowMap}"
    />
    <div
      class="search-with-map__search search"
      :class="{'search_on-map': isShowMap}"
    >
      <div
        class="search__block"
        :class="{'search__block_without-map': !isShowMap}"
      >
        <base-checkbox
          v-model="isShowMap"
          :label="$t('quests.ui.showMap')"
          class="search__block-item search__checkbox"
          :class="{'search__checkbox_without-map': !isShowMap}"
          name="map"
          data-selector="ACTION-SHOW-MAP"
        />
        <base-field
          v-model="search"
          v-click-outside="deFocus"
          class="search__block-item"
          is-search
          is-hide-error
          :selector="isSearchFocus"
          :placeholder="searchPlaceholder"
          data-selector="INPUT-SEARCH"
          @focus="isSearchFocus = true"
          @selector="getAddressInfo(search)"
          @input="$emit('search', search)"
          @enter="$emit('search', search)"
        >
          <template v-slot:selector>
            <div
              v-if="addresses.length"
              class="selector"
              :class="{'selector_hide': !isSearchFocus}"
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
          </template>
        </base-field>
        <base-dd
          v-if="isShowMap"
          v-model="distanceIndex"
          class="search__block-item search__distances"
          data-selector="ACTION-CHANGE-DISTANCE"
          :items="distanceItems"
        />
        <div
          v-if="isShowMap"
          class="search__block-item"
        >
          <base-btn
            data-selector="ACTION-CHANGE-MAP-CENTER"
            @click="searchHandler"
          >
            {{ isPageQuests ? $t('workers.searchQuests') : $t('workers.searchWorkers') }}
          </base-btn>
        </div>
      </div>
      <div
        v-if="isShowMap"
        class="search__filters filters"
      >
        <base-checkbox
          v-model="isShowMap"
          :label="$t('quests.ui.showMap')"
          class="filters__checkbox"
          name="map"
          data-selector="ACTION-SHOW-MAP"
        />
        <base-dd
          v-model="distanceIndex"
          class="filters__distances"
          data-selector="ACTION-CHANGE-DISTANCE"
          :items="distanceItems"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { GeoCode } from 'geo-coder';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'SearchWithMap',
  directives: { ClickOutside },
  data() {
    return {
      isShowMap: true,
      isSearchFocus: false,
      geoCode: null,
      coordinates: null,
      addresses: [],
      search: '',
      distanceIndex: 1,
    };
  },
  computed: {
    distanceItems() {
      const keys = Object.keys(this.$t('quests.distance'));
      return keys.map((d) => this.$t(`quests.distance.${d}`));
    },
    isPageQuests() {
      return this.$route.name === 'quests';
    },
    searchPlaceholder() {
      if (this.isShowMap) return this.$t('quests.ui.searchWithMap');
      return this.isPageQuests ? this.$t('quests.ui.searchOnQuestsPage') : this.$t('quests.ui.searchOnWorkersPage');
    },
  },
  watch: {
    isShowMap(newVal) {
      this.search = '';
      this.clearSearchResult();
      localStorage.setItem('isShowMap', newVal);
      this.$emit('isShowMap', this.isShowMap);
    },
    async distanceIndex() {
      const newZoom = { 0: 18, 1: 15, 2: 10 }[this.distanceIndex];
      await this.$store.dispatch('google-map/setNewZoom', newZoom);
    },
  },
  mounted() {
    const isShow = JSON.parse(localStorage.getItem('isShowMap'));
    if (typeof isShow === 'boolean') this.isShowMap = isShow;
    this.geoCode = new GeoCode('google', {
      key: process.env.GMAPKEY,
      lang: this.$i18n?.localeProperties?.code || 'en-US',
    });
  },
  beforeDestroy() {
    this.geoCode = null;
  },
  methods: {
    deFocus() {
      this.isSearchFocus = false;
    },
    searchHandler() {
      if (!this.search || !this.coordinates) return;
      this.$store.dispatch('google-map/setNewCenter', this.coordinates);
    },
    selectAddress(address) {
      this.search = address.formatted;
      this.addresses = [];
      this.coordinates = {
        lat: address.lat,
        lng: address.lng,
      };
    },
    async getAddressInfo(address) {
      if (!this.isShowMap) return;
      try {
        if (address.length) {
          this.addresses = await this.geoCode.geolookup(address);
          this.coordinates = { lat: this.addresses[0].lat, lng: this.addresses[0].lng };
          return;
        }
      } catch (e) {
        console.error('Geo look up is failed', e);
      }
      this.clearSearchResult();
    },
    clearSearchResult() {
      this.addresses = [];
      this.coordinates = null;
    },
  },
};
</script>

<style lang="scss" scoped>

.search-with-map__map-block {
  height: 435px;

  &_hidden {
    display: none;
  }
}

.search {
  max-width: 1180px;
  margin: 30px auto;

  &_on-map {
    position: relative;
    margin: 0 auto;
    height: 0;
    bottom: 113px;
  }

  &__block {
    display: grid;
    grid-template-columns: 160px 1fr 155px 260px;

    @include box;

    &_without-map {
      grid-template-columns: 160px 1fr;
    }
  }

  &__block-item {
    padding: 20px;
    border-right: 1px solid $black0;

    &:last-child {
      border-right: none;
    }
  }

  &__distances {
    padding: 20px 0;
  }

  &__filters {
    display: none;
  }
}

.selector {
  @include box;
  max-height: 300px;
  overflow: hidden auto;
  overscroll-behavior: contain;

  &_hide {
    display: none;
  }

  &__item {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    padding: 15px 20px;
    background: $white;
    cursor: pointer;
    transition: .3s;

    &:hover {
      background: $black0;
    }
  }
}

@include _1199 {
  .search {
    padding: 0 20px;

    &__block {
      grid-template-columns: 160px 1fr 155px 220px;

      &_without-map {
        grid-template-columns: 160px 1fr;
      }
    }
  }
}

@include _991 {
  .search {
    position: inherit;
    height: 100%;
    margin-top: 30px;

    &__block {
      grid-template-columns: 1fr 180px;

      &_without-map {
        grid-template-columns: 160px 1fr;
      }
    }

    &__checkbox {
      display: none !important;

      &_without-map {
        display: flex !important;
      }
    }

    &__distances {
      display: none;
    }

    &__filters {
      display: grid;
      grid-template-columns: 150px 150px;
      justify-content: space-between;

      margin-top: 20px;
    }
  }

  .filters__checkbox {
    padding: 10px;
    background: $white;
    border-radius: 6px;
    text-align: center;
  }
}

@include _575 {
  .search {
    padding: 0 10px;
    margin-top: 10px;

    &__block {
      grid-template-columns: 1fr 143px;

      &_without-map {
        grid-template-columns: 135px 1fr;
      }
    }

    &__block-item {
      padding: 10px;
    }

    &__filters {
      margin-top: 10px;
    }
  }
}

;
</style>
