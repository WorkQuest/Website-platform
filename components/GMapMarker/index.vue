<template>
  <div
    v-if="!markerLoaded"
    class="GMap__Marker"
  >
    <slot />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    position: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      marker: null,
      markerLoaded: false,
      events: ['click', 'mouseover', 'mouseout'],
      newChild: null,
    };
  },
  computed: {
    ...mapGetters({
      mapCenter: 'quests/getMapCenter',
    }),
  },
  watch: {
    options() {
      if (this.options) {
        this.marker.setIcon = this.options.icon;
        this.markerLoaded = this.options.show;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let child;
      this.markerLoaded = false;
      this.position.lat = parseFloat(this.position.lat);
      this.position.lng = parseFloat(this.position.lng);
      this.marker = new this.$parent.google.maps.Marker({
        position: this.position,
        map: this.$parent.map,
        ...this.options,
      });
      this.$parent.markers.push(this.marker);
      if (this.$children.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        child = this.$children[0];
        child.initInfoWindow();
      }
      this.events.forEach((event) => {
        this.$parent.google.maps.event.addListener(this.marker, event, (e) => {
          if (event === 'click') {
            console.log(child);
          }
          if (child !== undefined && event === 'click') {
            if (!this.options.show) {
              child.infoWindow.open(this.$parent.map, this.marker);
              this.markerLoaded = true;
            } else {
              child.infoWindow.close(this.$parent.map, this.marker);
              this.markerLoaded = false;
            }
          }
          this.$emit(event, {
            position: this.position, event: e, map: this.$parent.map, marker: this.marker,
          });
        });
      });
    },
  },
};
</script>
<style>
.GMap__Marker{
  display: none;
}
</style>
