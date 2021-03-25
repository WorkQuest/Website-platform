<template>
  <div>
    <div />
  </div>
</template>

<script>
export default {
  name: 'ConfirmPage',
  layout: 'confirm',
  async mounted() {
    await this.$store.dispatch('user/confirm', {
      confirmCode: this.$route.query.token,
    });
    this.$store.dispatch('main/showInfo', 'Email confirmed successfully');
    this.$router.push('/sign-in');
  },
};
</script>
