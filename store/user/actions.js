import { error } from '~/utils/web3';
import { connectWithMnemonic } from '~/utils/wallet';

export default {
  async getStatistic({ commit }) {
    try {
      const { result } = await this.$axios.$get('/v1/profile/statistic/me');
      commit('setStatisticData', result);
    } catch (e) {
      console.log(e);
    }
  },
  async getUserPortfolios({ commit }, { userId, query }) {
    try {
      const response = await this.$axios.$get(`/v1/user/${userId}/portfolio/cases`, {
        params: { ...query },
      });
      commit('setUserPortfolioCases', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async setCaseImage({ commit }, { url, formData, type }) {
    const response = await this.$axios.$put(url, formData, {
      headers: {
        'Content-Type': type,
        'x-amz-acl': 'public-read',
      },
    });
    commit('setCaseImage', response.result);
    return response;
  },
  async setCaseData({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/portfolio/add-case', payload);
      commit('setCaseData', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async editCaseData({ commit }, { payload, id }) {
    try {
      const response = await this.$axios.$put(`/v1/portfolio/${id}`, payload);
      commit('setCaseData', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async deletePortfolio({ commit }, id) {
    try {
      return await this.$axios.$delete(`/v1/portfolio/${id}`);
    } catch (e) {
      return console.log(e);
    }
  },

  async getAllUserReviews({ commit }, { userId, query }) {
    try {
      const response = await this.$axios.$get(`/v1/user/${userId}/reviews?${query}`);
      commit('setUserReviews', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async sendReviewForUser({ commit }, { questId, message, mark }) {
    try {
      const { ok, result } = await this.$axios.$post('/v1/review/send', { questId, message, mark });
      return { ok };
    } catch (e) {
      console.log('user/sendReviewForUser');
      return false;
    }
  },
  async registerWallet({ commit }, payload) {
    try {
      return await this.$axios.$post('/v1/auth/register/wallet', payload);
    } catch (e) {
      return error(e.response.data.code, e.response.data.message);
    }
  },
  async signIn({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/login', payload);
      commit('setTokens', response.result);
      if (response.result.userStatus === 1) {
        await dispatch('getUserData');
        await dispatch('getStatistic');
      }
      return response;
    } catch (e) {
      return error();
    }
  },
  async signUp({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/register', payload);
      commit('setTokens', response.result);
      return response;
    } catch (e) {
      return error();
    }
  },
  async logout({ commit }) {
    commit('logOut');
  },
  async confirm({ commit }, payload) {
    commit('setTokens', { access: this.$cookies.get('access'), refresh: this.$cookies.get('refresh') });
    this.$cookies.set('role', payload.role);
    return await this.$axios.$post('/v1/auth/confirm-email', payload);
  },
  async getUserData({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/profile/me');
      const { result } = response;
      commit('setUserData', result);
      if (result.wallet?.address) connectWithMnemonic(result.wallet.address);
      return response;
    } catch (e) {
      return console.error(e);
    }
  },
  async getAnotherUserData({ commit }, payload) {
    const response = await this.$axios.$get(`/v1/profile/${payload}`);
    await commit('setAnotherUserData', response.result);
    return response.result;
  },
  clearAnotherUserData({ commit }) {
    commit('setAnotherUserData', {});
  },
  async setUserRole({ commit }, payload) {
    const response = await this.$axios.$post('/v1/profile/set-role', payload);
    commit('setUserRole', response.result);
    return response;
  },
  async editEmployerData({ commit }, payload) {
    try {
      const response = await this.$axios.$put('/v1/employer/profile/edit', payload);
      commit('setUserData', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async editWorkerData({ commit }, payload) {
    try {
      const response = await this.$axios.$put('/v1/worker/profile/edit', payload);
      commit('setUserData', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async refreshTokens({ commit }) {
    const response = await this.$axios.$post('/v1/auth/refresh-tokens');
    commit('setTokens', response.result);
    return response;
  },
  async setCurrentPosition({ commit }, payload) {
    commit('setCurrentUserPosition', payload);
  },
  async editUserPassword({ commit }, payload) {
    const response = await this.$axios.$put('/v1/profile/change-password', payload);
    commit('setUserPassword', response.result);
    return response;
  },
  async passwordSendCode({ commit }, payload) {
    const response = await this.$axios.$post('/v1/restore-password/send-code', payload);
    commit('setSendCode', response.result);
    return response;
  },
  async passwordChange({ commit }, payload) {
    const response = await this.$axios.$post('/v1/restore-password/set-password', payload);
    commit('setUserPassword', response.result);
    return response;
  },

  async imageType({ commit }, payload) {
    const response = await this.$axios.$post('/v1/storage/get-upload-link', payload);
    commit('setImageType', response.result);
    return response;
  },
  async setImage({ commit }, { url, formData, type }) {
    const response = await this.$axios.$put(url, formData, {
      headers: {
        'Content-Type': type,
        'x-amz-acl': 'public-read',
      },
    });
    commit('setImage', response.result);
    return response;
  },
  async getUploadFileLink({ commit }, config) {
    try {
      const { result } = await this.$axios.$post('/v1/storage/get-upload-link', config);
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async uploadFile({ commit }, payload) {
    try {
      await this.$axios.$put(payload.url, payload.data, {
        headers: {
          'Content-Type': payload.contentType,
          'x-amz-acl': 'public-read',
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  async disable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/disable', payload);
      commit('setDisable2FA', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async enable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/enable', payload);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async confirmEnable2FA({ commit }, payload) {
    const response = await this.$axios.$post('/v1/totp/confirm', payload);
    commit('setEnable2FA', response.result);
    return response;
  },

  async sendPhone({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/phone/send-code', payload);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async confirmPhone({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/phone/confirm', payload);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
};
