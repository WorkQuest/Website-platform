<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__content">
        <nuxt />
      </div>
    </div>
    <transition name="fade">
      <!--      <loader v-if="isLoadihng" />-->
      <!--      loader-->
    </transition>
    <ctm-modal />
  </div>
</template>
<script>
export default {
  // middleware: 'auth',
};
</script>
<style lang="scss" scoped>
.primary {
  //height: 100vh;
  //overflow-y: auto;
}
.template {
  //min-height: 100vh;
  //overflow: hidden;
  background: #ebecec;
  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 120;
  }
}
</style>
