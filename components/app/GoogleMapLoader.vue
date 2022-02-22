<template>
  <g-map
    ref="gMap"
    :options="{
      disableDefaultUI: true,
      minZoom: 1,
      maxZoom: 18,
      gestureHandling: isDraggable ? 'auto' : 'none',
      clickableIcons: isDraggable,
    }"
    :center="center"
    :zoom="zoom"
    @click="onCloseClick"
  >
    <g-map-cluster
      :styles="clusterStyle"
      @click="onClusterClick"
    >
      <g-map-marker
        v-for="(item, key) in points"
        :key="key"
        :position="{lat: item.location.latitude, lng: item.location.longitude}"
        :options="getMarkerOptions(item)"
        :clickable="isDraggable"
        @click="onMarkerClick(item)"
      >
        <g-map-info-window
          :options="{maxWidth: 280}"
          :opened="openedMarkerID === item.id"
          :closeclick="true"
          @closeclick="onCloseClick"
        >
          <div class="info-window__content">
            <div class="info-window__block">
              <div class="info-window__user">
                <div class="info-window__avatar avatar">
                  <img
                    class="avatar__image"
                    :src="infoContent.avatar"
                    :alt="infoContent.alt"
                  >
                </div>
                <div class="info-window__name">
                  {{ infoContent.userName }}
                </div>
              </div>
              <item-rating
                v-if="infoContent.status"
                :rating="infoContent.status"
              />
              <div
                v-else
                class="info-window__status"
                :class="infoContent.labelClass"
              >
                {{ infoContent.label }}
              </div>
            </div>
            <div class="info-window__block">
              {{ infoContent.title }}
            </div>
            <div class="info-window__block">
              <div class="info-window__cost">
                <p
                  v-if="item.wagePerHour || item.price"
                  class="info-window__text"
                >
                  {{ infoContent.priceTitle }}
                </p>
                <p
                  v-if="item.wagePerHour || item.price"
                  class="info-window__value"
                >
                  {{ infoContent.price }}
                </p>
              </div>
              <base-btn
                class="info-window__switch"
                mode="grey"
                @click="showDetails(item.id)"
              >
                <template>
                  <span class="info-window__icon icon-caret_right" />
                </template>
              </base-btn>
            </div>
          </div>
        </g-map-info-window>
      </g-map-marker>
    </g-map-cluster>
  </g-map>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  UserRole, TokenSymbols, Path, questPriority, RatingFilter,
} from '~/utils/enums';

export default {
  name: 'GoogleMapLoader',
  props: {
    isDraggable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      map: null,
      pins: {
        employee: {
          red: '/img/app/employee_marker_red.svg',
          green: '/img/app/employee_marker_green.svg',
          yellow: '/img/app/employee_marker_yellow.svg',
          blue: '/img/app/employee_marker_blue.svg',
        },
        quest: {
          red: '/img/app/quest_marker_red.svg',
          green: '/img/app/quest_marker_green.svg',
          yellow: '/img/app/quest_marker_yellow.svg',
          blue: '/img/app/quest_marker_blue.svg',
        },
      },
      clusterStyle: [
        {
          url: '/img/app/cluster_marker.svg',
          width: 50,
          height: 50,
          textSize: 15,
          textColor: '#fff',
        },
      ],
      timeoutIdBoundsChange: null,
      openedMarkerID: null,
      infoContent: {},
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
  },
  destroyed() {
    this.map.$off('bounds_changed', this.onBoundsChanged);
    this.map.$off('zoom_changed', this.onBoundsChanged);
    clearTimeout(this.timeoutIdBoundsChange);
    this.infoContent = {};
    this.timeoutIdBoundsChange = null;
    this.map = null;
  },
  methods: {
    async initMapListeners() {
      try {
        this.map = this.$refs.gMap;
        this.map.$on('bounds_changed', this.onBoundsChanged);
        this.map.$on('zoom_changed', this.onZoomChanged);
      } catch (e) {
        console.log(this.$t('messages.mapNotLoaded'));
        await this.initMapListeners();
      }
    },
    async onBoundsChanged(event) {
      clearTimeout(this.timeoutIdBoundsChange);
      this.timeoutIdBoundsChange = setTimeout(async () => {
        const parsedData = event.toJSON();
        await this.$store.dispatch('google-map/setNewBounds', {
          northEast: { lat: parsedData.north, lng: parsedData.east },
          southWest: { lat: parsedData.south, lng: parsedData.west },
        });
      }, 500);
    },
    async onZoomChanged(event) { await this.$store.dispatch('google-map/setNewZoom', event); },
    async onClusterClick(cluster) {
      const newCenter = cluster.center_.toJSON();
      this.map.$mapObject.setCenter({ lat: newCenter.lat, lng: newCenter.lng });
      await this.$store.dispatch('google-map/setNewZoom', this.zoom + 3 <= 18 ? this.zoom + 3 : 18);
    },
    async onMarkerClick(marker) {
      this.setContent(marker);
      this.openedMarkerID = marker.id;
      this.map.$mapObject.setCenter({ lat: marker.location.latitude, lng: marker.location.longitude });
    },
    getMarkerOptions(item) {
      if (item.role === UserRole.WORKER) return { icon: this.pins.employee.blue };
      switch (item.priority) {
        case (questPriority.Low):
          return { icon: this.pins.quest.green };
        case (questPriority.Normal):
          return { icon: this.pins.quest.yellow };
        case (questPriority.Urgent):
          return { icon: this.pins.quest.red };
        default:
          return { icon: this.pins.quest.blue };
      }
    },
    setContent(item) {
      if (this.userRole === UserRole.WORKER) {
        this.infoContent = {
          avatar: item.user.avatar ? item.user.avatar.url : this.EmptyAvatar(),
          alt: this.UserName(item.user.firstName, item.user.lastName),
          userName: this.UserName(item.user.firstName, item.user.lastName),
          label: this.getPriority(item.priority),
          labelClass: this.getPriorityClass(item.priority),
          title: item.title,
          priceTitle: this.$t('meta.price'),
          price: `${item.price} ${TokenSymbols.WUSD}`,
        };
        return;
      }
      this.infoContent = {
        avatar: item.avatar ? item.avatar.url : this.EmptyAvatar(),
        alt: this.UserName(item.firstName, item.lastName),
        userName: this.UserName(item.firstName, item.lastName),
        status: item.ratingStatistic.status || 'noStatus',
        title: item.email,
        priceTitle: this.$t('meta.costPerHour'),
        price: `${item.wagePerHour} ${TokenSymbols.WUSD}`,
      };
    },
    onCloseClick() {
      this.openedMarkerID = null;
      this.infoContent = {};
    },
    showDetails(id) {
      const path = this.userRole === UserRole.WORKER ? Path.QUESTS : Path.PROFILE;
      this.$router.push(`${path}/${id}`);
    },
    getPriority(index) {
      const priority = {
        0: '',
        1: this.$t('meta.priority.low'),
        2: this.$t('meta.priority.normal'),
        3: this.$t('meta.priority.urgent'),
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

    checkUserCoordinates() {
      if (this.userData.location && this.userData.location.latitude && this.userData.location.longitude) {
        this.userLocation.lat = this.userData.location.latitude;
        this.userLocation.lng = this.userData.location.longitude;
      }
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
  &__block {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__content {
    max-width: 280px;
    min-width: 200px;
    display: flex;
    grid-gap: 10px;
    flex-direction: column;
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
    width: 30px !important;
    height: 30px !important;
  }
  &__icon {
    color: $black400;
  }
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  overflow: hidden;
  &__image {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
  }
}

</style>
