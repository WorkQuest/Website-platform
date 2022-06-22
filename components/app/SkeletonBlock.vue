<template>
  <div
    class="skeleton"
    :class="{skeleton__avatar: isAvatar, skeleton__block: !isAvatar}"
  />
</template>

<script>
export default {
  name: 'SkeletonBlock',
  props: {
    isAvatar: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
$base-color: #ddd;
$shine-color: #e8e8e8;
$animation-duration: 1.6s;
$avatar-offset: 52 + 16;
.skeleton {
  display: inline-block;
  width: 100%;
  min-height: 20px;
  height: 100%;
  background-image: linear-gradient(90deg, $base-color 0px, $shine-color 40px, $base-color 80px);
  background-size: 1200px;

  &__avatar {
    border-radius: 50%;
    animation: shine-avatar $animation-duration infinite linear;
  }

  &__block {
    border-radius: 6px;
    min-width: 60px;
    animation: shine-lines $animation-duration infinite linear;
  }
}
@keyframes shine-avatar {
  0% {
    background-position: -100px + $avatar-offset
  }
  40%, 100% {
    background-position: 140px + $avatar-offset
  }
}

@keyframes shine-lines {
  0% {
    background-position: -100px
  }
  40%, 100% {
    background-position: 1200px
  }
}
</style>
