<template>
  <a
    v-if="link !== ''"
    class="base-btn"
    :class="btnClass"
    :href="link"
    target="_blank"
  >
    <slot />
  </a>
  <nuxt-link
    v-else-if="nuxtLink !==''"
    class="base-btn"
    :class="btnClass"
    :to="nuxtLink"
  >
    <slot />
  </nuxt-link>
  <button
    v-else
    class="base-btn"
    :class="btnClass"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
<script>
export default {
  props: {
    link: {
      type: String,
      default: '',
    },
    nuxtLink: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
  },
  computed: {
    btnClass() {
      const { mode, disabled } = this;
      return [
        { 'base-btn_disabled': disabled },
        { 'base-btn_light': mode === 'light' },
        { 'base-btn_outline': mode === 'outline' },
        { 'base-btn_tag': mode === 'tag' },
        { 'base-btn_agree': mode === 'agree' },
        { 'base-btn_goToChat': mode === 'goToChat' },
        { 'base-btn_dispute': mode === 'dispute' },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
.base-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 43px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 130%;
  text-align: center;
  transition: .3s;
  background: #0083C7;
  border-radius: 6px;
  &:hover {
    background: #103D7C;
  }
  &_agree {
    background-color: $green;
    color: $white;
  }
  &_agree:hover {
    background-color: $green;
    color: $white;
    box-shadow: 0 0 5px rgba(0,0,0,0.5);
  }
  &_goToChat {
    background-color: $white;
    color: $green;
    border: 1px solid $black400;
  }
  &_goToChat:hover {
    background-color: $white;
    color: $green;
    border: 1px solid $black600;
    box-shadow: 0 0 2px rgba(0,0,0,0.5);
  }
  &_dispute {
    background-color: $red;
  }
  &_dispute:hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.5);
    background-color: $red;
  }
  &_disabled {
    pointer-events: none;
    background: #D1D1CF;
  }
  &_outline {
    border: 1px solid rgba(0, 131, 199, 0.1);
    background: #FFFFFF;
    color: $blue;
    &:hover {
      background: #F7F8FA;
      color: $blue;
    }
  }
  &_tag {
    background: rgba(0, 131, 199, 0.1);
    border-radius: 3px;
    color: $blue;
    &:hover {
      background: rgba(0, 131, 199, 0.2);
    }
  }
  &_light {
    background: #FFFFFF;
    color: $black800;
    &:hover {
      background: $black100;
    }
  }
}
</style>
