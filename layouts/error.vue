<template>
  <div class="error">
    <h1>Something was wrong....</h1>
    <div>
      Click there to back
      <base-btn nuxt-link="my">
        Back
      </base-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorLayout',
};
</script>

<style scoped lang="scss">
.error {
  margin-top: 20px;
}
.h1 {
  font-size: 32px;
  font-weight: 700;
}
</style>
