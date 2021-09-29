<template>
  <div class="GMap__InfoWindow info-window">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      infoWindow: null,
    };
  },

  methods: {
    initInfoWindow() {
      this.infoWindow = new google.maps.InfoWindow({
        content: this.$el,
        ...this.options,
      });
      this.$parent.marker.infoWindow = this.infoWindow;
    },
  },
};
</script>
