export default {
  async createAccessTokenBackend({ commit }) {
    const response = await this.$axios.$get('/v1/sumsub/create-access-token');
    commit('setAccessTokenBackend', response.result);
    return response.result;
  }, // work

  async getAccessToken({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/accessTokens?userId=${payload.userId}&levelName=${payload.levelName}`);
    commit('setAccessToken', response.result);
    return response.result;
  },
  async createApplicant({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/applicants?levelName=${payload.levelName}`);
    commit('setApplicant', response.result);
    return response.result;
  },
  async changingRequiredDocumentSetLevel({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/applicants/${payload.applicantId}/moveToLevel?name=${payload.levelName}`);
    commit('setLevel', response.result);
    return response.result;
  },
  async getRequiredIdDocs({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/applicants/${payload.applicantId}/requiredIdDocs`);
    commit('setRequiredIdDocs', response.result);
    return response.result;
  },
  async addingIDDocument({ commit }, payload) {
    // eslint-disable-next-line no-tabs
    const response = await this.$axios.$post(`/resources/applicants/${payload.applicantId}/info/idDoc`); // REQUEST HEADERS Content-Type	String	multipart/form-data X-Return-Doc-Warnings	Boolean	true/false {metadata idDocType	String	Yes, country	String	Yes}
    commit('setIDDocument', response.result);
    return response.result;
  },
  async getApplicantData({ commit }, payload) {
    const response = await this.$axios.$get(`/resources/applicants/${payload.applicantId}/one`);
    commit('setApplicantData', response.result);
    return response.result;
  },
  async changingProvidedInfo({ commit }, payload) {
    const response = await this.$axios.$patch(`/resources/applicants/${payload.applicantId}/fixedInfo`);
    commit('setProvidedInfo', response.result);
    return response.result;
  },
  async getApplicantStatus({ commit }, payload) {
    const response = await this.$axios.$get(`/resources/applicants/${payload.applicantId}/status`);
    commit('setApplicantStatus', response.result);
    return response.result;
  },
  async requestApplicantCheck({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/applicants/${payload.applicantId}/status/pending?reason=${payload.reason}`);
    commit('setApplicantCheck', response.result);
    return response.result;
  },
  async getDocumentImages({ commit }, payload) {
    const response = await this.$axios.$get(`/resources/inspections/${payload.inspectionId}/resources/${payload.imageId}`);
    commit('setDocumentImages', response.result);
    return response.result;
  },
  async addApplicantToBlacklist({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/applicants/${payload.applicantId}/blacklist`);
    commit('setApplicantToBlacklist', response.result);
    return response.result;
  },
  async generatingAShareToken({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/accessTokens/-/shareToken?applicantId=${payload.applicantId}&forClientId=${payload.clientId}`);
    commit('setShareToken', response.result);
    return response.result;
  },
  async importingAnApplicant({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/applicants/-/import?shareToken=${payload.shareToken}`);
    commit('setAnApplicant', response.result);
    return response.result;
  },
  async resettingAnApplicant(payload) {
    const response = await this.$axios.$post(`/resources/applicants/${payload.applicantId}/reset`);
    return response.result;
  },
  async importApplicants(payload) {
    const response = await this.$axios.$post('/resources/applicants/-/ingestCompleted'); // #{body}
    return response.result;
  },
  async setRiskLevelForTheApplicant({ commit }, payload) {
    const response = await this.$axios.$post(`/resources/applicants/${payload.applicantId}/riskLevel/entries`);
    commit('setRiskForTheApplicant', response.result);
    return response.result;
  },
  async apiHealth({ commit }) {
    const response = await this.$axios.$get('/resources/status/api');
    commit('setApiHealth', response.result);
    return response.result;
  },
};
