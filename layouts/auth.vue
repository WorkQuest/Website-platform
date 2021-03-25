<template>
  <div class="template">
    <nuxt />
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  middleware: 'guest',
};
</script>

<style lang="scss" scoped>
</style>
