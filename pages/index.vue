<template>
  <div class="links">
    <n-link
      v-for="(item, i) in links"
      :key="`item-${i}`"
      :to="item.path"
    >
      {{ item.title }}
    </n-link>
  </div>
</template>
<script>
export default {
  name: 'Index',
  layout: 'auth',
  computed: {
    links() {
      return [
        {
          title: 'About',
          path: '/about',
        },
        {
          title: 'Registration',
          path: '/sign-up',
        },
        {
          title: 'Login',
          path: '/sign-in',
        },
        {
          title: 'Role',
          path: '/role',
        },
        {
          title: 'Profile',
          path: '/profile',
        },
        {
          title: 'Questors',
          path: '/questors',
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.links {
  grid-gap: 20px;
  padding: 20px;
  min-height: 100vh;
  display: none;
  a {
    color: #2b51ff;
  }
}
</style>
