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
      <g-map-info-block
        :items="[]"
        :window-position="clusterPosition"
        :is-opened="isOpenedClusterInfo"
        :is-cluster="true"
        @onCloseClick="onCloseClick"
      />
      <g-map-marker
        v-for="(item, key) in points"
        :key="key"
        :position="{lat: item.location.latitude, lng: item.location.longitude}"
        :options="getMarkerOptions(item)"
        :clickable="isDraggable"
        @click="onMarkerClick(item)"
      >
        <g-map-info-block
          :key="`info-window-${key}`"
          :item="item"
          :window-position="{lat: item.location.latitude, lng: item.location.longitude}"
          :is-opened="openedMarkerID === item.id"
          @onCloseClick="onCloseClick"
        />
      </g-map-marker>
    </g-map-cluster>
  </g-map>
</template>

<script>
import { mapGetters } from 'vuex';
import { UserRole, questPriority } from '~/utils/enums';

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
      isOpenedClusterInfo: false,
      clusterPosition: { lat: 0, lng: 0 },
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
      this.isOpenedClusterInfo = true;
      const newCenter = cluster.center_.toJSON();
      this.clusterPosition = { ...newCenter };
      this.map.$mapObject.setCenter({ ...newCenter });
    },
    async onMarkerClick(marker) {
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
    onCloseClick() {
      this.openedMarkerID = null;
      this.isOpenedClusterInfo = false;
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
