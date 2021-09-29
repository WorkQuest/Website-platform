export default {
  getSumSubBackendToken: (state) => state.accessTokenBackend || '',
  getApplicantStatus: (state) => state.applicantStatus || '',
};
