export default {
  getZoom: (state) => state.zoom,
  getCenter: (state) => ({ lat: state.center.lat, lng: state.center.lng }),
  getBounds: (state) => state.bounds,
  getPoints: (state) => state.points,
};
