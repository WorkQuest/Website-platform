<template>
  <div
    class="map__container gmap"
    :class="!isShowMap ? 'map__container_small' : ''"
  >
    <div class="gmap__top">
      <transition name="fade-fast">
        <!--          in GMAP-->
        <!--          v-if="isShowMap && userPosition"-->
        <!--          :cluster="{options: {styles: clusterStyle}}"-->
        <!--          :center="{lat: userPosition.latitude, lng: userPosition.longitude}"-->
        <GMap
          ref="gMap"
          language="en"
          :cluster="{options: {styles: clusterStyle}}"
          :options="{fullscreenControl: false, styles: clusterStyle}"
          :center="userLocation"
          :zoom="zoom"
        >
          <GMapMarker
            v-for="(item, key) in locations"
            :key="key"
            :position="{lat: item.coordinates[1], lng: item.coordinates[0]}"
            :options="{
              icon: item === currentLocation ? pins.selected : pins.notSelected,
              show: item === currentLocation
            }"
            @click="testFunction(item)"
          >
            <GMapInfoWindow :options="{maxWidth: 280}">
              <div class="info-window__content">
                <div class="info-window__block">
                  <div class="info-window__user">
                    <div
                      class="info-window__avatar avatar"
                    >
                      <img
                        class="avatar__image"
                        :src="item.useravatarurl ? item.useravatarurl : '~/assets/img/app/avatar_empty.png'"
                        :alt="item.userfirstName"
                      >
                    </div>
                    <div class="info-window__name">
                      {{ `${item.userfirstname} ${item.userlastname}` }}
                    </div>
                  </div>
                  <div
                    class="info-window__status"
                    :class="getPriorityClass(item.questpriority)"
                  >
                    {{ getPriority(item.questpriority) }}
                  </div>
                </div>
                <div class="info-window__block">
                  <div class="info-window__cost">
                    <p class="info-window__text">
                      Cost per hour
                    </p>
                    <p class="info-window__value">
                      {{ `${item.questprice} WUSD` }}
                    </p>
                  </div>
                  <button
                    class="info-window__switch"
                    @click="showDetails(item.questid)"
                  >
                    <span class="icon-caret_right" />
                  </button>
                </div>
              </div>
            </GMapInfoWindow>
          </GMapMarker>
        </GMap>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Index',
  props: {
    isShowMap: {
      type: Boolean,
      default: true,
    },
    zoom: {
      type: Number,
      default: 15,
    },
  },
  data() {
    return {
      userLocation: { lat: 54.9833, lng: 82.8964 },
      currentLocation: {},
      circleOptions: {},
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
      addresses: [],
      coordinates: null,
      locations: {},
      questData: [],
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      userPosition: 'user/getUserCurrentPosition',
      userRole: 'user/getUserRole',
      questsLocations: 'quests/getQuestsLocation',
      mapBounds: 'quests/getMapBounds',
    }),
  },
  watch: {
    async questsLocations() {
      this.locations = Object.keys(this.questsLocations).length > 0 ? this.questsLocations : {};
    },
  },
  methods: {
    testFunction(item) {
      if (Object.keys(this.currentLocation).length > 0) {
        this.currentLocation = {};
      } else {
        this.currentLocation = item;
      }
    },
    showDetails(id) {
      this.$router.push(`/quests/${id}`);
    },
    getPriority(index) {
      const priority = {
        0: this.$t('priority.all'),
        1: this.$t('priority.low'),
        2: this.$t('priority.normal'),
        3: this.$t('priority.urgent'),
      };
      return priority[index] || '';
    },
    getPriorityClass(index) {
      const priority = {
        0: 'info-window__status_all',
        1: 'info-window__status_low',
        2: 'info-window__status_normal',
        3: 'info-window__status_urgent',
      };
      return priority[index] || '';
    },
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
.map__container {
  &_small {
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
.info-window {
  &__content {
    max-width: 280px;
    display: flex;
    grid-gap: 10px;
    flex-direction: column;
  }
  &__block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    grid-gap: 20px;
  }
  &__name {
    max-width: 115px;
    font-weight: 600;
    font-size: 14px;
    line-height: 130%;
    color: #1D2127;
  }
  &__status {
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
  &__user {
    display: flex;
    grid-gap: 5px;
  }
  &__avatar {
    max-width: 30px;
    max-height: 30px;
    border-radius: 100%;
  }
  &__text {
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    color: #353C47;
  }
  &__cost {
    display: flex;
    grid-gap: 5px;
    flex-direction: column;
  }
  &__value {
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    color: #00AA5B;
  }
  &__switch {
    background: #F7F8FA;
    border-radius: 6px;
    width: 30px;
    height: 30px;
  }
}
.avatar {
  &__image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -o-object-fit: cover;
    object-fit: cover;
  }
}
@include _1199 {
  .map__container {
    padding-left: 20px;
    padding-right: 20px;
  }
}
@include _767 {
  .map__container {
    height: auto;
    padding-top: 10px;
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
