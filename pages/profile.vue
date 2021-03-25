<template>
  <div class="content">
    <div v-if="userRole === 'worker'">
      <WorkerProfile />
    </div>
    <div v-if="userRole === 'employer'">
      <EmployerProfile />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import WorkerProfile from '@/screens/workersProfile';
import EmployerProfile from '@/screens/employerProfile';

export default {
  name: 'Profile',
  components: {
    WorkerProfile,
    EmployerProfile,
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      userRole: 'user/getUserRole',
    }),
  },
};
</script>
