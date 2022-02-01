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
  async getQuestsPoints({ commit }, params) {
    try {
      const { ok, result } = await this.$axios.$get('/v1/quests/map/list-points', { params });
      commit('setPoints', result.quests);
      return { ok };
    } catch (e) {
      console.error('map/getQuestsPoints');
      return { ok: false };
    }
  },
  async getEmployeesPoints({ commit }, params) {
    try {
      console.log('need add route for employees points on our back');
      const { ok, result } = await this.$axios.$get('/v1/quests/map/list-points', { params });
      commit('setPoints', result.quests);
      return { ok };
    } catch (e) {
      console.error('map/getQuestsPoints');
      return { ok: false };
    }
  },
};
