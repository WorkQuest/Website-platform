export default {
  async createAccessTokenBackend({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/sumsub/create-access-token');
      commit('setAccessTokenBackend', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async verifySumsubSender() {
    try {
      const response = await this.$axios.$post(`/resources/inspectionCallbacks/testDigest?secretKey=${process.env.SECRET_SUMSUB}`);
      console.log(response);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async applicantStatus({ commit }, id) {
    try {
      const response = await this.$axios.$post('/v1/sumsub/applicant-reviewed', id);
      commit('setApplicantStatus', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async getAccessToken({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/accessTokens?userId=${payload.userId}&levelName=${payload.levelName}`);
      commit('setAccessToken', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async createApplicant({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants?levelName=${payload.levelName}`);
      commit('setApplicant', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async changingRequiredDocumentSetLevel({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/moveToLevel?name=${payload.levelName}`);
      commit('setLevel', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async getRequiredIdDocs({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/requiredIdDocs`);
      commit('setRequiredIdDocs', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async addingIDDocument({ commit }, payload) {
    try {
      // eslint-disable-next-line no-tabs
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/info/idDoc`); // REQUEST HEADERS Content-Type	String	multipart/form-data X-Return-Doc-Warnings	Boolean	true/false {metadata idDocType	String	Yes, country	String	Yes}
      commit('setIDDocument', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async getApplicantData({ commit }, payload) {
    try {
      const response = await this.$axios.$get(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/one`);
      commit('setApplicantData', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async changingProvidedInfo({ commit }, payload) {
    try {
      const response = await this.$axios.$patch(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/fixedInfo`);
      commit('setProvidedInfo', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async requestApplicantCheck({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/status/pending?reason=${payload.reason}`);
      commit('setApplicantCheck', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async getDocumentImages({ commit }, payload) {
    try {
      const response = await this.$axios.$get(`https://test-api.sumsub.com/resources/inspections/${payload.inspectionId}/resources/${payload.imageId}`);
      commit('setDocumentImages', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async addApplicantToBlacklist({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/blacklist`);
      commit('setApplicantToBlacklist', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async generatingAShareToken({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/accessTokens/-/shareToken?applicantId=${payload.applicantId}&forClientId=${payload.clientId}`);
      commit('setShareToken', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async importingAnApplicant({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants/-/import?shareToken=${payload.shareToken}`);
      commit('setAnApplicant', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async resettingAnApplicant(payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/reset`);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async importApplicants(payload) {
    try {
      const response = await this.$axios.$post('https://test-api.sumsub.com/resources/applicants/-/ingestCompleted'); // #{body}
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async setRiskLevelForTheApplicant({ commit }, payload) {
    try {
      const response = await this.$axios.$post(`https://test-api.sumsub.com/resources/applicants/${payload.applicantId}/riskLevel/entries`);
      commit('setRiskForTheApplicant', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
  async apiHealth({ commit }) {
    try {
      const response = await this.$axios.$get('https://test-api.sumsub.com/resources/status/api');
      commit('setApiHealth', response.result);
      return response.result;
    } catch (e) {
      return null;
    }
  },
};
