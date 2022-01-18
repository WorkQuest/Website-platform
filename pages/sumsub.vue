<template>
  <div class="main">
    <div class="main__body">
      <div id="sumsub-websdk-container" />
    </div>
  </div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';
import { mapGetters } from 'vuex';

export default {
  name: 'Sumsub',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      accessToken: 'sumsub/getSumSubBackendToken',
      userData: 'user/getUserData',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    await this.createAccessToken();
    // await this.getApiHealthStatus();
    this.initSumSub();
    this.SetLoader(false);
  },
  methods: {
    async createAccessToken() {
      try {
        const payload = {
          userId: this.accessToken.userId,
        };
        await this.$store.dispatch('sumsub/createAccessTokenBackend', payload);
      } catch (e) {
        console.log(e);
      }
    },
    async getApiHealthStatus() {
      try {
        const response = await this.$store.dispatch('sumsub/apiHealth');
      } catch (e) {
        console.log(e);
      }
    },
    initSumSub() {
      const accessToken = this.accessToken.token;
      const applicantEmail = this.userData.email;
      const applicantPhone = this.userData.phone;

      const snsWebSdkInstance = snsWebSdk.Builder('https://test-api.sumsub.com', 'basic-kyc')
        .withAccessToken(accessToken, () => {
        })
        .withConf({
          lang: 'en',
          email: applicantEmail,
          phone: applicantPhone, // if available
          onMessage: (type, payload) => {
            console.log('WebSDK onMessage', type, payload);
          },
          onError: (error) => {
            console.log('WebSDK onError', error);
          },
        }).build();

      snsWebSdkInstance.launch('#sumsub-websdk-container');
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  @include main;
  &-white {
   @include main;
   background: $white;
   background: #FFFFFF;
   margin: 0 0 20px 0;
   border-radius: 6px;
   justify-content: center;
 }
  &__body {
   max-width: 1180px;
   height: 100%;
 }
}
</style>
