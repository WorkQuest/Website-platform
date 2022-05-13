<template>
  <g-map
    ref="gMap"
    :options="{
      disableDefaultUI: true,
      minZoom: 4,
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
        :items="itemsForInfoBlock"
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
      counter: 1,
      timeoutIdBoundsChange: null,
      openedMarkerID: null,
      isOpenedClusterInfo: false,
      itemsForInfoBlock: [],
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
    await this.checkUserCoordinates();
  },
  destroyed() {
    this.map.$off('bounds_changed', this.onBoundsChanged);
    this.map.$off('zoom_changed', this.onBoundsChanged);
    clearTimeout(this.timeoutIdBoundsChange);
    this.timeoutIdBoundsChange = null;
    this.isOpenedClusterInfo = false;
    this.itemsForInfoBlock = [];
    this.openedMarkerID = null;
    this.counter = null;
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
        if (this.counter < 3) {
          this.counter += 1;
          await this.initMapListeners();
        }
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
    async onZoomChanged(event) {
      await this.$store.dispatch('google-map/setNewZoom', event);
    },
    async onClusterClick(cluster) {
      const newCenter = cluster.center_.toJSON();
      this.clusterPosition = { ...newCenter };
      this.map.$mapObject.setCenter({ ...newCenter });

      await this.$store.dispatch('google-map/setNewZoom', this.zoom + 3 <= 18 ? this.zoom + 3 : 18);
      if (this.zoom !== 18) return;

      this.isOpenedClusterInfo = true;
      this.itemsForInfoBlock = [];
      this.points.forEach((point) => {
        const isMatchLat = point.location.latitude === this.clusterPosition.lat;
        const isMatchLng = point.location.latitude === this.clusterPosition.lat;
        if (isMatchLng && isMatchLat) this.itemsForInfoBlock.push(point);
      });
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

    async checkUserCoordinates() {
      const center = {
        lat: this.userPosition?.latitude || this.userData.location?.latitude || 0,
        lng: this.userPosition?.longitude || this.userData.location?.longitude || 0,
      };
      if (center.lat && center.lng) await this.$store.dispatch('google-map/setNewCenter', center);
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
