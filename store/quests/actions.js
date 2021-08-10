export default {

  /*  Quest  */

  // Replaced
  async questCreate({ commit }, payload) {
    return await this.$axios.$post('/v1/quest/create', payload);
  },
  async getAllQuests({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/quests${payload}`);
    commit('setAllQuests', response.result);
    return response.result;
  },
  async getQuest({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/quest/${payload}`);
    commit('setQuest', response.result);
    return response.result;
  },
  async getUserQuests({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/employer/${payload}/quests`);
    commit('setUserQuests', response.result);
    return response.result;
  },

  async getQuestsLocation({ commit }) {
    const response = await this.$axios.$get('/v1/quests/map/list-points');
    commit('setAllQuests', response.result);
    return response.result;
  },

  // Experimental
  async editQuest({ commit }, payload, id) {
    // Needed to add quest id;

    // const payload = {
    //   category: 'Retail',
    //   priority: 0,
    //   location: {
    //     longitude: 84.948846,
    //     latitude: 56.48122,
    //   },
    //   title: 'Title...',
    //   description: 'Description quest...',
    //   price: '500',
    //   adType: 0,
    //   medias: [
    //     'fa0e2e4e-c53f-4af7-8906-1649daa0cce3',
    //   ],
    // };
    const response = await this.$axios.$put(`/v1/quest/${id}`, payload);
    commit('setQuestData', response.result);
    return response;
  },

  // Experimental
  async deleteQuest(id) {
    // Needed to add quest id;
    await this.$axios.$delete(`/v1/quest/${id}`);
  },

  // Experimental
  async acceptCompletedWorkOnQuest(id) {
    // Needed to add quest id;
    return await this.$axios.$post(`/v1/quest/${id}/accept-completed-work`, id);
  },

  // Experimental
  async acceptWorkOnQuest(id) {
    // Needed to add quest id;
    return await this.$axios.$post(`/v1/quest/${id}/accept-work`, id);
  },

  // Experimental
  async closeQuest(id) {
    // Needed to add quest id;
    return await this.$axios.$post(`/v1/quest/${id}/close`, id);
  },

  // Experimental
  async completeWorkOnQuest(id) {
    // Needed to add quest id;
    return await this.$axios.$post(`/v1/quest/${id}/complete-work`, id);
  },

  // Experimental
  async rejectCompletedWorkOnQuest(id) {
    // Needed to add quest id;
    return await this.$axios.$post(`/v1/quest/${id}/reject-completed-work`, id);
  },

  // Experimental
  async rejectWorkOnQuest(id) {
    // Needed to add quest id;
    return await this.$axios.$post(`/v1/quest/${id}/reject-work`, id);
  },

  // Experimental
  async setStarOnQuest(id) {
    // Needed to add quest id;
    return await this.$axios.$post(`/v1/quest/${id}/star`, id);
  },

  // Experimental
  async takeAwayStarOnQuest(id) {
    // Needed to add quest id;
    return await this.$axios.$delete(`/v1/quest/${id}/star`, id);
  },

  // Experimental
  async startQuest(id) {
    // Needed to add quest id;

    // const payload = {
    //   "assignedWorkerId": "fa0e2e4e-c53f-4af7-8906-1649daa0cce3"
    // },
    return await this.$axios.$post(`/v1/quest/${id}/start`, id);
  },

  // Experimental
  async getStarredQuests({ commit }) {
    const { data } = await this.$axios.$get('/v1/quests/starred');
    commit('setStarredQuests', data.result);
    return data.result;
  },

  /*  Quest response  */

  // Experimental
  async inviteOnQuest({ commit }, payload, id) {
    // Needed to add quest id;

    // const payload = {
    //   "invitedUserId": "fa0e2e4e-c53f-4af7-8906-1649daa0cce3",
    //   "message": "Hello, I need this job"
    // }
    return await this.$axios.$post(`/v1/quest/${id}/invite`, payload);
  },

  // Experimental
  async respondOnQuest({ commit }, payload, id) {
    // Needed to add quest id;

    // const payload = {
    //   "message": "Hello, I need this job"
    // }
    return await this.$axios.$post(`/v1/quest/${id}/response`, payload);
  },

  // Experimental
  async getResponsesToQuest({ commit }, id) {
    // Needed to add quest id;
    const { data } = await this.$axios.$get(`/v1/quest/${id}/responses`);
    commit('setResponses', data.result);
    return data.result;
  },

  // Experimental
  async acceptQuestInvitation(id) {
    // Needed to add response id;
    return await this.$axios.$post(`/v1/quest/response/${id}/accept`, id);
  },

  // Experimental
  async rejectQuestInvitation(id) {
    // Needed to add response id;
    return await this.$axios.$post(`/v1/quest/response/${id}/reject`, id);
  },

  // Experimental
  async getResponsesToQuestForAuthorizedUser({ commit }) {
    const { data } = await this.$axios.$get('/v1/quest/responses/my');
    commit('setResponsesMy', data.result);
    return data.result;
  },

};
