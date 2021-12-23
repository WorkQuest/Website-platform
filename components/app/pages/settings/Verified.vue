<template>
  <div class="verified">
    {{ status2FA === 0 ? $t("settings.notVerified") : $t("settings.verified") }}
    <span class="icon-check_all_big" />
  </div>
</template>

<script>
export default {
  name: 'Verified',
  data() {
    return {
      status2FA: 0,
    };
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
