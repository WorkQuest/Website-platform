<template>
  <div class="profile">
    <Header
      :title="'John Queston'"
      :sub-title="'Last sin 23 min.'"
      :avatar="avatar"
    />
    <div class="profile__container">
      <div>
        left
      </div>
      <div>
        sidebar
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data: () => ({
    avatar: require('~/assets/img/app/fake_profile.png'),
  }),
};
</script>

<style lang="scss" scoped>

</style>
