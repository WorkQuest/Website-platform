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
        { 'base-btn_red': mode === 'red' },
        { 'base-btn_green': mode === 'green' },
        { 'base-btn_orange': mode === 'orange' },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
.base-btn {
  width: 100%;
  height: 45px;
  color: #ffffff;
  font-family: 'GothamPro', sans-serif;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  text-transform: uppercase;
  line-height: normal;
  transition: .3s;
  background: #0c82c3;
  border-radius: 23px;
  &:hover {
    -webkit-filter: brightness(.84) saturate(.84) hue-rotate(-5deg);
    filter: brightness(.84) saturate(.84) hue-rotate(-5deg);
  }
  &_disabled {
    pointer-events: none;
    background: #D1D1CF;
  }
  &_red {
    background: #ff7c43;
  }
  &_green {
    background: #27a860;
  }
  &_orange {
    background: #ffa604;
  }
}
</style>
