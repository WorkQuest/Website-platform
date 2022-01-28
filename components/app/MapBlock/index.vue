<template>
  <GmapMap
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
      :options="item.type !== 'cluster' ? getPriorityMarker(item) : { icon: pins.quest.blue, show: item === currentLocation} "
      @click="coordinatesChange(item)"
    >
      <GMapInfoWindow
        v-if="hiddenWindowInfo"
        :options="{maxWidth: 280}"
      >
        <div class="info-window__content">
          <div class="info-window__block">
            <div class="info-window__user">
              <div
                class="info-window__avatar avatar"
              >
                <img
                  class="avatar__image"
                  :src="item.userAvatarUrl ? item.userAvatarUrl : '~/assets/img/app/avatar_empty.png'"
                  :alt="item.userFirstName"
                >
              </div>
              <div class="info-window__name">
                {{ `${item.userFirstName} ${item.userLastName}` }}
              </div>
            </div>
            <div
              class="info-window__status"
              :class="getPriorityClass(item.questPriority)"
            >
              {{ getPriority(item.questPriority) }}
            </div>
          </div>
          <div class="info-window__block">
            <div class="info-window__cost">
              <p class="info-window__text">
                Cost per hour
              </p>
              <p class="info-window__value">
                {{ `${item.questPrice} WUSD` }}
              </p>
            </div>
            <button
              class="info-window__switch"
              @click="showDetails(item.questId)"
            >
              <span class="icon-caret_right" />
            </button>
          </div>
        </div>
      </GMapInfoWindow>
    </GMapMarker>
  </GmapMap>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Map',
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
        quest: {
          red: '/img/app/marker_red.svg',
          green: '/img/app/marker_red.svg',
          yellow: '/img/app/marker_red.svg',
          blue: '/img/app/marker_blue.svg',
        },
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
      hiddenWindowInfo: false,
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
  mounted() {
    this.checkUserCoordinates();
  },
  methods: {
    checkUserCoordinates() {
      if (this.userData.location && this.userData.location.latitude && this.userData.location.longitude) {
        this.userLocation.lat = this.userData.location.latitude;
        this.userLocation.lng = this.userData.location.longitude;
      }
    },
    coordinatesChange(item) {
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
    getPriorityMarker(item) {
      const priority = {
        0: {
          icon: this.pins.quest.blue,
          show: item === this.currentLocation,
        },
        1: {
          icon: this.pins.quest.green,
          show: item === this.currentLocation,
        },
        2: {
          icon: this.pins.quest.yellow,
          show: item === this.currentLocation,
        },
        3: {
          icon: this.pins.quest.red,
          show: item === this.currentLocation,
        },
      };
      return priority[item.questPriority] || '';
    },
  },
};
</script>

<style lang="scss" scoped>

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
    align-items: center;
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
    display: block !important;
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

</style>
