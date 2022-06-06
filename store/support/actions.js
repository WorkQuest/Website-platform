import {
  error,
  success,
} from '~/utils/web3';

export default {
  async sendSupportMessage(_, payload) {
    try {
      const response = await this.$axios.$post('/v1/user-support-ticket/create', payload);
      if (response && response.ok) {
        return success(response.result);
      }
      return error();
    } catch (e) {
      return error();
    }
  },
};
