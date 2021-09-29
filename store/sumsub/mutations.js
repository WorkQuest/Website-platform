export default {
  setAccessTokenBackend(state, data) {
    state.accessTokenBackend = data;
  },
  setAccessToken(state, data) {
    state.token = data;
  },
  setApplicant(state, data) {
    state.applicant = data;
  },
  setLevel(state, data) {
    state.level = data;
  },
  setRequiredIdDocs(state, data) {
    state.requiredIdDocs = data;
  },
  setIDDocument(state, data) {
    state.IDDocument = data;
  },
  setApplicantData(state, data) {
    state.applicantData = data;
  },
  setProvidedInfo(state, data) {
    state.providedInfo = data;
  },
  setApplicantStatus(state, data) {
    state.applicantStatus = data;
  },
  setApplicantCheck(state, data) {
    state.applicantCheck = data;
  },
  setDocumentImages(state, data) {
    state.documentImages = data;
  },
  setApplicantToBlacklist(state, data) {
    state.applicantInBlackList = data;
  },
  setShareToken(state, data) {
    state.shareToken = data;
  },
  setAnApplicant(state, data) {
    state.anApplicant = data;
  },
  setRiskForTheApplicant(state, data) {
    state.RiskForTheApplicant = data;
  },
  setApiHealth(state, data) {
    state.apiHealth = data;
  },
};
