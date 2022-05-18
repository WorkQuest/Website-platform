<template>
  <div />
</template>
<script>
import { mapGetters } from 'vuex';
import { Path, UserRole, UserStatuses } from '~/utils/enums';

export default {
  name: 'Index',
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      isAuth: 'user/isAuth',
    }),
  },
  async created() {
    const userStatus = this.$cookies.get('userStatus');
    if (+userStatus === UserStatuses.Confirmed && this.isAuth) {
      if (!this.userData.id) await this.$store.dispatch('user/getUserData');
      if (this.userData.role === UserRole.EMPLOYER) await this.$router.push(Path.WORKERS);
      else if (this.userData.role === UserRole.WORKER) await this.$router.push(Path.QUESTS);
    } else await this.$router.push(Path.SIGN_IN);
  },
};
</script>
