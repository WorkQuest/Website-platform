export default {
  isAuth: (state) => !!(state.tokens.access && state.tokens.refresh),
  accessToken: (state) => state.tokens.access,
  refreshToken: (state) => state.tokens.refresh,
  getUserData: (state) => state.userData,
  editUserData: (state) => state.userData,
  getUserRole: (state) => state.userData?.role,
  getUserCurrentPosition: (state) => state.currentUserPosition || null,
  getImageData: (state) => state.userData?.avatar?.url || null,
};
