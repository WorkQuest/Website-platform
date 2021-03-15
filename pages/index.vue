<template>
  <div>
    Index page
  </div>
</template>
<script>
export default {
  name: 'Index',
  created() {
    this.$router.push('/about');
  },
};
</script>

<style lang="scss" scoped>

</style>
