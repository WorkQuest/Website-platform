<template>
  <div class="main__body">
    <Quests />
  </div>
</template>

<script>

import Vue from 'vue';
import Quests from '~/components/app/Pages/Common/Quests';

const value = new Vue();

export default {
  name: 'My',
  components: { Quests },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.main {
  &__body {
    justify-self: center;
    width: 100%;
    max-width: 1180px;
  }
}
</style>
