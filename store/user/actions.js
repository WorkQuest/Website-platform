import BigNumber from 'bignumber.js';
import {
  error,
  success,
  showToast,
  fetchContractData,
} from '~/utils/web3';

import {
  getGasPrice,
  createInstance,
  getWalletAddress,
  GetWalletProvider,
  connectWithMnemonic,
} from '~/utils/wallet';

import {
  UserStatuses,
  QuestModeReview,
  RaiseViewTariffPeriods,
} from '~/utils/enums';

import { WQPromotion } from '~/abi/index';
import { PaidTariff } from '~/utils/сonstants/quests';

const { WORKNET_PROMOTION } = process.env;

export default {
  async changeRole({ commit }, { totp }) {
    try {
      return await this.$axios.$put('/v1/profile/change-role', { totp });
    } catch (e) {
      return e;
    }
  },
  async getStatistic({ commit }) {
    try {
      const { result } = await this.$axios.$get('/v1/profile/statistic/me');
      commit('setStatisticData', result);
      return success(result);
    } catch (e) {
      return error();
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

  async getAllUserReviews({ commit }, { userId, params }) {
    try {
      const { result } = await this.$axios.$get(`/v1/user/${userId}/reviews`, { params });
      commit('setUserReviews', result);
      return success(result);
    } catch (e) {
      console.error('Error in user/getAllUserReviews: ', e);
      return error();
    }
  },
  async sendReviewForUser({ commit }, {
    questId, message, mark, questMode,
  }) {
    try {
      const { ok, result } = await this.$axios.$post('/v1/review/send', { questId, message, mark });
      if (questMode === QuestModeReview.QUEST_LIST) commit('quests/setMarkOnQuestInList', result, { root: true });
      if (questMode === QuestModeReview.QUEST_SINGLE) commit('quests/setMarkOnQuestSingle', result, { root: true });
      return ok;
    } catch (e) {
      console.log('user/sendReviewForUser');
      return false;
    }
  },
  async registerWallet({ commit }, payload) {
    try {
      return await this.$axios.$post('/v1/auth/register/wallet', payload);
    } catch (e) {
      return error(e.response.data.code, e.response.data.msg);
    }
  },
  async signIn({ commit, dispatch, state }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/login', payload);
      commit('setTokens', {
        access: response.result.access,
        refresh: state.isRememberMeChecked ? response.result.refresh : '',
      });
      if (response.result.userStatus === 1 && !response.result.totpIsActive) {
        await dispatch('getMainData');
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
  async getMainData({ dispatch }) {
    await Promise.all([
      dispatch('getUserData'),
      dispatch('getStatistic'),
      dispatch('notifications/getNotifications', '', { root: true }),
    ]);
  },
  async logout({ commit }, isValidToken = true) {
    try {
      if (isValidToken) await this.$axios.$post('v1/auth/logout');
      await this.$wsChatActions.disconnect();
      await this.$wsNotifs.disconnect();
      commit('logOut');
    } catch (e) {
      console.error('user/logout', e);
    }
  },
  async confirm({ commit }, payload) {
    try {
      commit('setTokens', {
        access: this.$cookies.get('access'),
        refresh: this.$cookies.get('refresh'),
        userStatus: UserStatuses.Confirmed,
      });
      this.$cookies.set('role', payload.role, { path: '/' });
      return await this.$axios.$post('/v1/auth/confirm-email', payload);
    } catch (e) {
      return false;
    }
  },
  async getUserData({ commit }) {
    try {
      const { result } = await this.$axios.$get('/v1/profile/me');
      commit('setUserData', result);
      if (result.wallet?.address) connectWithMnemonic(result.wallet.address);
      return success(result);
    } catch (e) {
      return error();
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
    try {
      const response = await this.$axios.$post('/v1/profile/set-role', payload);
      commit('setUserRole', response.result);
      return response;
    } catch (e) {
      return false;
    }
  },
  async editEmployerData({ commit }, payload) {
    try {
      const response = await this.$axios.$put('/v1/employer/profile/edit', payload);
      commit('setUserData', response.result);
      return response.ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async editWorkerData({ commit }, payload) {
    try {
      const response = await this.$axios.$put('/v1/worker/profile/edit', payload);
      commit('setUserData', response.result);
      return response.ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async refreshTokens({ commit }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await this.$axios.$post('/v1/auth/refresh-tokens');
      commit('setTokens', response.result);
      return response;
    } catch (e) {
      throw e;
    }
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
      commit('setTwoFAStatus', false);
      return response;
    } catch (e) {
      const { data } = e.response;
      return error(data.code, data.msg, data);
    }
  },
  async enable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/enable', payload);
      commit('setTwoFACode', response.result);
      return response;
    } catch (e) {
      const { data } = e.response;
      return error(data.code, data.msg, data);
    }
  },
  async confirmEnable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/confirm', payload);
      commit('setEnable2FA', response.result);
      commit('setTwoFAStatus', true);
      return response;
    } catch (e) {
      const { data } = e.response;
      return error(data.code, data.msg, data);
    }
  },

  async sendPhone({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/phone/send-code', payload);
      commit('setVerificationCode', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async confirmPhone({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/phone/confirm', payload);
      return response.ok;
    } catch (e) {
      console.log('user/confirmPhone');
      return false;
    }
  },
  async validateTOTP({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/validate-totp', payload);
      return response.result.isValid;
    } catch (e) {
      console.log('user/validateTOTP');
      return false;
    }
  },
  // TODO delete, waiting when backend will be catch all this events
  async payUserRaisedView({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/worker/me/raise-view/pay', payload);
      return response.ok;
    } catch (e) {
      console.log('profile/worker/me/raise-view/pay');
      return false;
    }
  },
  /**
   *
   * @param commit
   * @param type - string: questsTariff || usersTariff
   * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
   */
  async fetchRaiseViewPrice({ commit }, { type }) { // new method
    try {
      const periods = RaiseViewTariffPeriods[type];
      const tariffByIndex = {
        0: PaidTariff.GoldPlus,
        1: PaidTariff.Gold,
        2: PaidTariff.Silver,
        3: PaidTariff.Bronze,
      };
      const tariffs = ['0', '1', '2', '3'];
      let result;
      const toFetch = [];
      for (let i = 0; i < periods.length; i += 1) {
        for (let j = 0; j < tariffs.length; j += 1) {
          toFetch.push(async () => {
            const cost = await fetchContractData(
              type,
              WQPromotion,
              WORKNET_PROMOTION,
              [tariffs[j], periods[i]],
              GetWalletProvider(),
            );
            console.log(cost);
            result[tariffByIndex[j]][i] = new BigNumber(+cost).shiftedBy(-18).toString();
            return success();
          });
        }
      }
      await Promise.all(toFetch);
      console.log('prices', result);
      return success(result);
    } catch (e) {
      console.log('user/fetchRaiseViewPrice', e);
      return error();
    }
  },
  async getRaiseViewPrice({ commit }, { type }) { // todo: del
    try {
      const periods = RaiseViewTariffPeriods[type];
      const tariffs = ['1', '2', '3', '4'];
      const price = {};
      for (let i = 0; i < tariffs.length; i += 1) {
        price[tariffs[i]] = {};
        for (let j = 0; j < periods.length; j += 1) {
          const data = [tariffs[i], periods[j]];
          /* eslint-disable no-await-in-loop */
          const cost = await fetchContractData( // TODO: refactor to promise all
            type,
            WQPromotion,
            WORKNET_PROMOTION,
            data,
            GetWalletProvider(),
          );
          price[tariffs[i]][periods[j]] = new BigNumber(+cost).shiftedBy(-18).toString();
        }
      }
      return success(price);
    } catch (e) {
      console.log('user/getRaiseViewPrice');
      return error(e.code, 'Error in get raise view price', e);
    }
  },
  async promoteUserOnContract({ commit }, { cost, tariff, period }) {
    try {
      const inst = createInstance(WQPromotion, WORKNET_PROMOTION);
      const value = new BigNumber(cost).shiftedBy(18).toString();
      const { gas, gasPrice } = await getGasPrice(
        WQPromotion,
        WORKNET_PROMOTION,
        'promoteUser',
        [tariff, period],
        value,
      );
      const params = {
        from: getWalletAddress(),
        gasPrice,
        gas,
        value,
      };
      const response = await inst.methods.promoteUser(tariff, period).send(params);
      return success(response);
    } catch (e) {
      console.log('user/buyRaiseView');
      showToast('Promote user error:', `${e.message}`, 'danger');
      return error(e.code, 'Error in method promote user', e);
    }
  },
  setRememberMe({ commit }, payload) {
    commit('setRememberMe', payload);
  },
};
