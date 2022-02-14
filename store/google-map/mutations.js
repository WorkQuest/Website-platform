export default {
  setZoom(state, data) { state.zoom = data; },
  setCenter(state, data) {
    state.center.lat = data.lat;
    state.center.lng = data.lng;
  },
  setBounds(state, data) { state.bounds = data; },
  setPoints(state, data) { state.points = data; },
};
