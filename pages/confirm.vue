<template>
  <div />
</template>

<script>
export default {
  layout: 'auth',
  async mounted() {
    this.SetLoader(true);
    await this.$store.dispatch('user/confirm', {
      confirmCode: this.$route.query.token,
    });
    await this.$store.dispatch('main/showToast', {
      title: 'Success',
      text: 'Your account has been successfully verified',
    });
    this.$router.push('/sign-in');
    this.SetLoader(false);
  },
};
</script>
