/* eslint-disable no-param-reassign */

export default {
  updateConnectionsStatus(state, { name, value }) {
    state.connections[name] = value;
  },
};
