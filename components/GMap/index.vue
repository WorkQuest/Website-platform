<template>
  <div class="GMap">
    <div
      ref="map"
      class="GMap__Wrapper"
      :style="options.height ? `height:${options.height}` : null"
    />
    <slot />
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader';
import { mapGetters } from 'vuex';

const MarkerClusterer = require('node-js-marker-clusterer');

export default {
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    language: {
      type: String,
      default: 'en',
    },
    zoom: {
      type: Number,
      default: 8,
    },
    cluster: {
      type: Object,
      default: () => ({}),
    },
    center: {
      type: Object,
      default: () => ({
        lat: 45.8150,
        lng: 15.9819,
      }),
    },
  },

  data() {
    return {
      map: null,
      google: null,
      markerCluster: null,
      markers: [],
      bounds: null,
      timeoutIdRequest: null,
      events: [
        'bounds_changed',
        'center_changed',
        'click',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'heading_changed',
        'idle',
        'maptypeid_changed',
        'mousemove',
        'mouseout',
        'mouseover',
        'projection_changed',
        'resize',
        'rightclick',
        'tilesloaded',
        'tilt_changed',
        'zoom_changed',
      ],
      newCenter: null,
    };
  },
  computed: {
    ...mapGetters({
      mapCenter: 'quests/getMapCenter',
    }),
  },
  watch: {
    async zoom() {
      await this.mapLoaded();
    },
    async mapCenter() {
      this.newCenter = this.mapCenter;
      await this.mapLoaded();
    },
    async center() {
      this.newCenter = this.center;
      await this.mapLoaded();
    },
  },
  async mounted() {
    this.newCenter = this.center;
    await this.mapLoaded();
  },

  beforeDestroy() {
    this.$GMaps.loaded = false;
    clearTimeout(this.timeoutIdRequest);
  },

  methods: {
    async mapLoaded() {
      if (this.$GMaps.loaded === false) {
        this.$GMaps.loaded = true;
        try {
          const GMapSettings = {
            apiKey: this.$GMaps.apiKey,
            language: this.language,
          };

          if (this.$GMaps.libraries !== undefined) {
            GMapSettings.libraries = this.$GMaps.libraries;
          }

          const google = GoogleMapsApiLoader(GMapSettings);
          this.$GMaps.google = google;
        } catch (e) {
          console.log(e);
        }
      }

      this.google = await this.$GMaps.google;
      this.initMap();
      this.$emit('init', this.google);
      this.$emit('loaded', this.google);
    },
    initMap(listener) {
      this.map = new google.maps.Map(this.$refs.map, {
        center: this.newCenter,
        zoom: this.zoom,
        ...this.options,
      });
      setTimeout(this.getMapBounds, 100);
      this.events.forEach((event) => {
        this.map.addListener(event, (e) => {
          if (['dragend', 'tilesloaded', 'zoom_changed'].includes(event)) {
            this.getMapBounds();
          }
          this.$emit(event, {
            map: this.map,
            event: e,
          });
        });
      });
    },
    getMapBounds() {
      const bounds = this.map.getBounds();
      const mapCenterString = this.map.getCenter();
      const mapCenterArray = mapCenterString.toString().replace(/[()]/g, '').split(', ');
      this.newCenter = {
        lat: parseFloat(mapCenterArray[0]),
        lng: parseFloat(mapCenterArray[1]),
      };
      const coordinates = {
        center: {
          lat: parseFloat(mapCenterArray[0]),
          lng: parseFloat(mapCenterArray[1]),
        },
        southWest: {
          lat: bounds.getSouthWest().lat(),
          lng: bounds.getSouthWest().lng(),
        },
        northEast: {
          lat: bounds.getNorthEast().lat(),
          lng: bounds.getNorthEast().lng(),
        },
      };
      if (this.timeoutIdRequest !== null) {
        clearTimeout(this.timeoutIdRequest);
        this.timeoutIdRequest = null;
      }
      this.timeoutIdRequest = setTimeout(async () => {
        await this.initChildren();
        await this.$store.dispatch('quests/setMapBounds', coordinates);
      }, 300);
    },
    initChildren() {
      if (this.markerCluster !== null) this.markerCluster.clearMarkers();
      if (this.markers.length > 0) this.markers = [];

      this.$children.forEach((child) => {
        child.init();
      });

      this.map.markers = this.markers;
      if (Object.keys(this.cluster).length > 0) {
        this.markerCluster = new MarkerClusterer(this.map, this.markers, { ...this.cluster.options });
      }
    },
  },
};
</script>

<style>
</style>
