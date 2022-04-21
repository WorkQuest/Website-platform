<template>
  <base-btn
    mode="max"
    class="visibility-button"
    :is-submit="false"
    @click="$emit('toggleVisibility', !isPasswordVisible)"
  >
    <span
      class="visibility-button__icon"
      :class="{'icon-show': !isPasswordVisible, 'icon-hide': isPasswordVisible }"
    />
  </base-btn>
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
    color: $blue;
  }
}
.icon-Lock:before {
  content: "\ea24";
  color: $blue;
  font-size: 25px;
}
.visibility-button {
   background-color: transparent !important;
}
</style>
