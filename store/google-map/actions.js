export default {
  async setNewZoom({ commit }, payload) {
    commit('setZoom', payload);
  },
  async setNewBounds({ commit }, payload) {
    commit('setBounds', payload);
  },
  async setNewCenter({ commit }, payload) {
    commit('setCenter', payload);
  },
  async resetMap({ commit }) {
    commit('setZoom', 15);
    commit('setPoints', []);
    commit('setCenter', { lat: 0, lng: 0 });
    commit('setBounds', {
      northEast: { lat: 0, lng: 0 },
      southWest: { lat: 0, lng: 0 },
    });
  },
  async questsPoints({ commit, rootGetters }, { query, specFilter }) {
    try {
      delete query.q;
      delete query.limit;
      delete query.offset;
      delete query['sort[createdAt]'];
      const specializations = specFilter ? Object.values(specFilter) : [];
      const { ok, result } = await this.$axios.$post('/v1/quest/map/get-points', { specializations }, {
        params: { ...query },
      });
      console.log('QUESTS', result.quests);
      console.log('GETTERS', rootGetters['wallet/getBalanceData']);
      commit('setPoints', result.quests);
      return { ok };
    } catch (e) {
      console.error('map/questsPoints');
      return { ok: false };
    }
  },
  async employeesPoints({ commit }, { query, specFilter }) {
    try {
      delete query.q;
      delete query.limit;
      delete query.offset;
      delete query['sort[createdAt]'];
      const specializations = specFilter ? Object.values(specFilter) : [];
      const { ok, result } = await this.$axios.$post('/v1/profile/workers/map/get-points', { specializations }, {
        params: { ...query },
      });
      console.log('USERS', result.quests);
      commit('setPoints', result.users);
      return { ok };
    } catch (e) {
      console.error('map/employeesPoints', e);
      return { ok: false };
    }
  },
};
