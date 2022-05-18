<template>
  <span
    class="visibility-button__icon"
    :class="{'icon-show': !isPasswordVisible, 'icon-hide': isPasswordVisible }"
    @click="$emit('toggleVisibility', !isPasswordVisible)"
  />
</template>

<script>
export default {
  name: 'BtnPasswordVisibility',
  props: {
    isPasswordVisible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-show, .icon-hide {
  color: $blue;
  font-size: 25px;
  &:hover::before {
    cursor: pointer;
    color: $blue;
  }
}
.icon-Lock:before {
  content: "\ea24";
  color: $blue;
  font-size: 25px;
}

</style>
