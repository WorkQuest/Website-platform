<template>
  <div class="search">
    <div class="search__block">
      <base-checkbox
        v-model="isShowMap"
        class="search__block-item"
        data-selector="ACTION-IS-SHOW-MAP-USER"
        name="map"
        :label="$t('quests.ui.showMap')"
      />
      <div
        class="search__block-item"
        data-selector="ACTION-TOGGLE-SEARCH-DD-USER"
        @click="toggleSearchDD"
      >
        <base-field
          v-model="search"
          v-click-outside="hideSearchDD"
          mode="icon"
          class="search__field"
          is-search
          is-hide-error
          :placeholder="$t('quests.ui.search')"
          :selector="isSearchDDStatus"
          data-selector="INPUT-SEARCH-ADDRESS-USER"
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
      <base-dd
        v-model="distanceIndex"
        class="search__distances"
        :items="distanceItems"
      />
      <div class="search__block-item">
        <base-btn
          data-selector="ACTION-MAP-CENTER-CHANGE-USER"
          @click="centerChange"
        >
          {{ $t('workers.searchWorkers') }}
        </base-btn>
      </div>
    </div>
    <div class="search__filter filter">
      <base-dd
        v-model="distanceIndex"
        class="filter__dd"
        :items="distanceItems"
      />
      <base-checkbox
        v-model="isShowMap"
        class="filter__toggle"
        name="map"
        data-selector="ACTION-IS-SHOW-MAP-USER"
        :label="$t('quests.ui.showMap')"
      />
    </div>
  </div>
</template>

<script>
import { GeoCode } from 'geo-coder';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'SearchBlock',
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isShowMap: true,
      isSearchDDStatus: true,
      search: '',
      distanceIndex: 0,
      addresses: [],
      coordinates: null,
    };
  },
  computed: {
    distanceItems() {
      return [
        this.$t('quests.distance.100'),
        this.$t('quests.distance.500'),
        this.$t('quests.distance.1000'),
      ];
    },
  },
  watch: {
    isShowMap() { this.$emit('isShowMap', this.isShowMap); },
  },
  methods: {
    toggleSearchDD() {
      this.isSearchDDStatus = !this.isSearchDDStatus;
    },
    hideSearchDD() {
      this.isSearchDDStatus = false;
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

.search {
  @include box;

  &__block {
    display: grid;
    grid-template-columns: 154px 1fr 143px 260px;
  }

  &__distances {
    padding: 20px 0;
    border-right: 1px solid $black0;
  }

  &__block-item {
    padding: 20px;
    border-right: 1px solid $black0;

    &:last-child {
      border-right: none;
    }
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

@include _991 {
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

;
</style>
