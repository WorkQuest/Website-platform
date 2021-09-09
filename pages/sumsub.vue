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
    }),
  },
  async mounted() {
    this.SetLoader(true);
    await this.createAccessToken();
    await this.getApiHealthStatus();
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
        console.log(response.result);
      } catch (e) {
        console.log(e);
      }
    },
    initSumSub() {
      const { token } = this.accessToken;
      function launchWebSdk() {
        const snsWebSdkInstance = snsWebSdk.init(
          token,
          (newAccessTokenCallback) => {
            // Access token expired
            // get a new one and pass it to the callback to re-initiate the WebSDK
            newAccessTokenCallback(token);
          },
        )
          // flag to start SDK for the test environment
          // please remove it as soon as migrating to the production environment
          .onTestEnv()
          .withConf({
            lang: 'en', // language of WebSDK texts and comments (ISO 639-1 format)
            onMessage: (type, payload) => {
              // see below what kind of messages the WebSDK generates
              console.log('WebSDK onMessage', type, payload);
            },
            uiConf: {
              customCss: 'https://url.com/styles.css',
            },
            onError: (error) => {
              console.error('WebSDK onError', error);
            },
          })
          .build();

        snsWebSdkInstance.launch('#sumsub-websdk-container');
      }
      launchWebSdk();
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
