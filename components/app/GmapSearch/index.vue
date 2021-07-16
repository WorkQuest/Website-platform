<template>
  <div
    class="map__container gmap"
    :class="!isShowMap ? 'map__container_small' : ''"
  >
    <div class="gmap__block">
      <div class="gmap__top">
        <transition name="fade-fast">
          <!--          in GMAP-->
          <!--          v-if="isShowMap && userPosition"-->
          <!--          :cluster="{options: {styles: clusterStyle}}"-->
          <!--          :center="{lat: userPosition.latitude, lng: userPosition.longitude}"-->
          <GMap
            ref="gMap"
            language="en"
            :options="{fullscreenControl: false}"
            :zoom="10"
          >
            <GMapMarker
              v-for="location in locations"
              :key="location.id"
              :position="{lat: location.lat, lng: location.lng}"
              :options="{icon: location === currentLocation ? pins.selected : pins.notSelected}"
              @click="currentLocation = location"
            >
              <GMapInfoWindow :options="{maxWidth: 200}">
                lat: {{ location.lat }},
                lng: {{ location.lng }}
              </GMapInfoWindow>
            </GMapMarker>
          </GMap>
        </transition>
        <div class="gmap__search">
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
                is-search
                class="search__input"
                :placeholder="$t('quests.ui.search')"
                :mode="'icon'"
              />
            </div>
            <div class="search__dd">
              <base-dd
                v-model="distanceIndex"
                :items="distance"
              />
            </div>
            <div class="search__actions">
              <base-btn class="search__btn">
                {{ userRole === 'worker' ? $t('quests.searchResults') : $t('workers.searchWorkers') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div class="gmap__filter">
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Index',
  data() {
    return {
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
      isShowMap: true,
      distance: [
        '+ 100 m',
        '+ 500 m',
        '+ 1000 m',
      ],
      priorityIndex: 0,
      distanceIndex: 0,
      priceSort: 'desc',
      timeSort: 'desc',
    };
  },
  computed: {
    ...mapGetters({
      userPosition: 'user/getUserCurrentPosition',
      userRole: 'user/getUserRole',
    }),
  },
};
</script>

<style lang="scss" scoped>
.map__container::v-deep {
  .GMap__Wrapper {
    height: 435px;
    display: block;
  }
  .ctm-field__left {
    padding-top: 6px;
  }
}
.map__container_small::v-deep {
  .GMap__Wrapper {
    display: none;
  }
}
.gmap{
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
    height: 100%;
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
.map__container {
  &_small {
    padding-top: 20px;
    height: 90px;
    .gmap {
      &__top {
        height: 100%;
      }
      &__search {
        top: 1px;
        max-width: 1180px;
      }
    }
  }
}
@include _1199 {
  .search {
    grid-template-columns: repeat(4, auto);
    &__actions, &__toggle {
      padding: 10px;
    }
  }
  .map__container {
    padding-left: 20px;
    padding-right: 20px;
  }
  .gmap {
    &__search {
      width: 90%;
    }
  }
}
@include _767 {
  .map__container {
    height: 580px;
    padding-top: 10px;
    &_small {
      height: 150px;
    }
    .gmap__search {
      position: relative;
      bottom: 0;
      top: 10px;
    }
  }
  .gmap {
    &__search {
      width: 100%;
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
  .gmap {
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
