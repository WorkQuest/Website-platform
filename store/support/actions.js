import {
  error,
  success,
} from '~/utils/web3';

export default {
  async sendSupportMessage(_, payload) {
    try {
      const response = await this.$axios.$post('/v1/user-support-ticket/create', payload);
      return success(response.result);
    } catch (e) {
      return error();
    }
  },
};
