<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__content">
        <nuxt />
      </div>
    </div>
    <transition name="fade">
      <loader v-if="isLoading" />
    </transition>
    <ctm-modal />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DefaultLayout',
  ...mapGetters({
    isLoading: 'main/getIsLoading',
  }),
};
</script>
<style lang="scss" scoped>
.primary {
  height: 100vh;
  overflow-y: auto;
}
.template {
  min-height: 100vh;
  overflow: hidden;
  background: #ebecec;
  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 120;
  }
}
</style>
