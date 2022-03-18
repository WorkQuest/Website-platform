<template>
  <div
    class="status-kyc"
    :class="[
      {'status-kyc_notVerified': !status},
      {'status-kyc_verified': status}
    ]"
  >
    {{ status === 0 ? $t("settings.notVerified") : $t("meta.verified") }}
    <span
      class="status-kyc__icon icon-check_all_big"
      :class="[
        {'status-kyc__icon_gray': !status},
        {'status-kyc__icon_white': status}
      ]"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'StatusKYC',
  computed: {
    ...mapGetters({
      status: 'user/getStatus2FA',
    }),
  },
};
</script>

<style lang="scss" scoped>
.status-kyc {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 159px;
  max-height: 34px;
  padding: 8px 13px;
  border-radius: 36px;
  &_verified {
    background: $blue;
    color: $white;
  }
  &_notVerified {
    background: $black100;
    color: $black300;
  }
  &__icon {
    font-size: 25px;
    align-items: center;
    padding-left: 10px;
    &_white {
      color: $white;
    }
    &_gray {
      color: $black300;
    }
  }
}
</style>
