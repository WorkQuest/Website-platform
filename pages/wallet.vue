<template>
  <div>
    Wallet
  </div>
</template>

<script>
export default {
  name: 'Wallet',
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style scoped>

</style>
