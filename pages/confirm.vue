<template>
  <div />
</template>

<script>
export default {
  async mounted() {
    await this.$store.dispatch('user/confirm', {
      confirmCode: this.$route.query.token,
    });
    this.$router.push('/sign-in');
  },
};
</script>
