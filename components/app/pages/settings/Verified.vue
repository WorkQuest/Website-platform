<template>
  <div class="verified">
    {{ status2FA === 0 ? $t("settings.notVerified") : $t("settings.verified") }}
    <span class="verified__icon icon-check_all_big" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Verified',
  computed: {
    ...mapGetters({
      status2FA: 'user/getStatus2FA',
    }),
  },
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 25px;
  color: $blue;
  align-items: center;
  &-check_all_big:before {
    @extend .icon;
    content: "\ea00";
    color: $white;
    padding: 0 0 0 10px;
  }
}
</style>
