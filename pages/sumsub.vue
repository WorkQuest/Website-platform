<template>
  <div class="kyc">
    <div class="kyc__body">
      <div class="kyc__header">
        {{ $t('kyc.KYC') }}
      </div>
      <div class="kyc__content">
        <div
          v-if="statusKYC === $options.SumSubStatuses.NOT_VERIFIED"
          id="sumsub-websdk-container"
        />
        <div
          v-if="statusKYC === $options.SumSubStatuses.VERIFIED"
          class="kyc__verified"
        >
          <img
            class="kyc__image"
            src="~/assets/img/ui/questAgreed.svg"
            alt=""
          >
          <div class="kyc__text">
            {{ $t('kyc.alreadyVerified') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';
import { mapGetters } from 'vuex';
import { SumSubStatuses } from '~/utils/enums';

export default {
  name: 'KYC',
  SumSubStatuses,
  data() {
    return {
      isInited: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      statusKYC: 'user/getStatusKYC',
      currentLocale: 'user/getCurrentLang',
    }),
  },
  watch: {
    async currentLocale() {
      if (this.isInited) await this.initSumSub();
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.initSumSub();
    this.SetLoader(false);
  },
  methods: {
    async initSumSub() {
      if (this.statusKYC === SumSubStatuses.VERIFIED) return;
      const { email } = this.userData;
      try {
        const accessToken = await this.$store.dispatch('sumsub/createAccessTokenBackend');
        const snsWebSdkInstance = snsWebSdk.init(accessToken, () => {})
          .withBaseUrl(this.ENV.SUMSUB_URL)
          .withConf({
            lang: this.currentLocale,
            email,
          })
          .build();
        snsWebSdkInstance.launch('#sumsub-websdk-container');
        this.isInited = true;
      } catch (e) {
        console.error('Error with snsWebSdkInstance. ', e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.kyc {
  @include main;
  @include text-simple;

  #sumsub-websdk-container {
    width: 100%;
    .content-wrapper {
      .content {
        max-width: 100%;
      }
    }
  }

  &__body {
    max-width: 1180px;
    height: 100%;
  }

  &__header {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: $black800;
    margin: 30px 0 20px;
  }

  &__image {
    height: 100px;
    width: 100px;
  }

  &__text {
    margin-top: 10px;
  }

  &__verified {
    padding: 20px 0 20px 0;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  &__content {
    display: flex;
    height: calc(100% - 86px);
    background: $white;
    border-radius: 6px;
    justify-content: center;
    align-items: center;
  }
}

@include _767 {
  .kyc {
    &__header {
      margin-left: 15px;
    }
  }
}
</style>
