<template>
  <g-map
    ref="gMap"
    :options="{
      styles: clusterStyle,
      disableDefaultUI: true,
      minZoom: 1,
      maxZoom: 18,
      gestureHandling: isDraggable ? 'auto' : 'none'
    }"
    :center="center"
    :zoom="zoom"
  >
    <g-map-cluster
      :styles="clusterStyle"
      @click="onClusterClick"
    >
      <g-map-marker
        v-for="(item, key) in points"
        :key="key"
        :position="{lat: item.location.latitude, lng: item.location.longitude}"
        :options="{ icon: pins.quest.blue, show: item === currentLocation} "
        @click="coordinatesChange(item)"
      >
        <g-map-info-window
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
        </g-map-info-window>
      </g-map-marker>
    </g-map-cluster>
  </g-map>
</template>

<script>
import { mapGetters } from 'vuex';
import { UserRole } from '~/utils/enums';

export default {
  name: 'MapBlock',
  props: {
    isDraggable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentZoom: null,
      userLocation: { lat: 54.9833, lng: 82.8964 },
      currentLocation: {},
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
          url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
          width: 75,
          height: 75,
          textSize: 15,
          textColor: '#fff',
        },
      ],
      coordinates: null,
      hiddenWindowInfo: false,
      timeoutIdBoundsChange: null,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      userPosition: 'user/getUserCurrentPosition',
      userRole: 'user/getUserRole',

      zoom: 'google-map/getZoom',
      center: 'google-map/getCenter',
      bounds: 'google-map/getBounds',
      points: 'google-map/getPoints',
    }),
  },
  async mounted() {
    await this.initMapListeners();
    this.checkUserCoordinates();
  },
  methods: {
    async initMapListeners() {
      try {
        this.$refs.gMap.$on('bounds_changed', this.onBoundsChanged);
        this.$refs.gMap.$on('zoom_changed', this.onZoomChanged);
      } catch (e) {
        console.log(this.$t('messages.mapNotLoaded'));
        await this.initMapListeners();
      }
    },
    onBoundsChanged(event) {
      if (this.timeoutIdBoundsChange) {
        clearTimeout(this.timeoutIdBoundsChange);
        this.timeoutIdBoundsChange = null;
      }
      this.timeoutIdBoundsChange = setTimeout(async () => {
        console.log('onBoundsChanged');
        const parsedData = event.toJSON();
        const coordinates = {
          northEast: { lat: parsedData.north, lng: parsedData.east },
          southWest: { lat: parsedData.south, lng: parsedData.west },
        };
        await this.$store.dispatch('google-map/setNewBounds', coordinates);

        const params = {
          'northAndSouthCoordinates[north][longitude]': coordinates.northEast.lng,
          'northAndSouthCoordinates[north][latitude]': coordinates.northEast.lat,
          'northAndSouthCoordinates[south][longitude]': coordinates.southWest.lng,
          'northAndSouthCoordinates[south][latitude]': coordinates.southWest.lat,
        };
        if (this.userRole === UserRole.WORKER) await this.$store.dispatch('google-map/getQuestsPoints', params);
        else await this.$store.dispatch('google-map/getEmployeesPoints', params);
      }, 500);
    },
    async onZoomChanged(event) { await this.$store.dispatch('google-map/setNewZoom', event); },
    async onClusterClick(cluster) {
      await this.$store.dispatch('google-map/setNewCenter', cluster.center_.toJSON());

      const newZoom = this.zoom + 3 <= 18 ? this.zoom + 3 : 18;
      await this.$store.dispatch('google-map/setNewZoom', newZoom);
      if (newZoom !== 18) return;

      this.ShowMessage(
        'Warning',
        'Its maximum of zoom, look of result',
      );
    },

    checkUserCoordinates() {
      if (this.userData.location && this.userData.location.latitude && this.userData.location.longitude) {
        this.userLocation.lat = this.userData.location.latitude;
        this.userLocation.lng = this.userData.location.longitude;
      }
    },
    coordinatesChange(item) {
      console.log(item);
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
      return priority[MapBlock] || '';
    },
    getPriorityClass(index) {
      const priority = {
        0: 'info-window__status_all',
        1: 'info-window__status_low',
        2: 'info-window__status_normal',
        3: 'info-window__status_urgent',
      };
      return priority[MapBlock] || '';
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

<style lang="scss">
.cluster {
  & img {
    width: 100%;
    height: 100%;
  }
}
</style>

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
