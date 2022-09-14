import ENV from '~/utils/addresses/index';

export default {
  async createAccessTokenBackend() {
    const { result } = await this.$axios.$get('/v1/sumsub/create-access-token');
    return result.token;
  },
};
