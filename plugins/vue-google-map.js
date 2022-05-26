import Vue from 'vue';
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps';
import ENV from '~/utils/adresses/index';

Vue.use(VueGoogleMaps, {
  load: {
    key: ENV.GMAPKEY,
    libraries: 'places',
  },
  // // If you intend to programmatically custom event listener code
  // // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  // // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  // // you might need to turn this on.
  autobindAllEvents: false,

  // // If you want to manually install components, e.g.
  // // import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  // // Vue.component('GmapMarker', GmapMarker)
  // // then set installComponents to 'false'.
  // // If you want to automatically install all the components this property must be set to 'true':
  installComponents: false,
});
