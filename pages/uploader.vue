<template>
  <div class="main">
    <uploader />
  </div>
</template>

<script>
import uploader from '../components/ui/Uploader';

export default {
  name: 'Uploader',
  components: {
    uploader,
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>

.main {
  @include main;
  width: 100%;
  &-white {
    border: 1px solid $black0;
    @include main-white;
  }
}
</style>
