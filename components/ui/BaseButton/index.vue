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
    <div class="icon-btn_left">
      <slot name="left" />
    </div>
    <slot />
    <div class="icon-btn_right">
      <slot name="right" />
    </div>
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
        { 'base-btn_borderless-left': mode === 'borderless-left' },
        { 'base-btn_borderless-right': mode === 'borderless-right' },
        { 'base-btn_tag': mode === 'tag' },
        { 'base-btn_agree': mode === 'agree' },
        { 'base-btn_goToChat': mode === 'goToChat' },
        { 'base-btn_dispute': mode === 'dispute' },
        { 'base-btn_messages': mode === 'goToMessages' },
        { 'base-btn_show-messages': mode === 'showYourMessage' },
        { 'base-btn_delete': mode === 'delete' },
        { 'base-btn_approve': mode === 'approve' },
        { 'base-btn_back': mode === 'back' },
        { 'base-btn_grey': mode === 'grey' },
        { 'base-btn_verification': mode === 'ver' },
        { 'base-btn_black': mode === 'black' },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  &-btn {
    &_left {
      margin: 0 5px 0 0;
    }
    &_right {
      margin: 0 0 0 5px;
    }
  }
}
.base-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 46px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 130%;
  text-align: center;
  transition: .3s;
  background: $blue;
  border-radius: 6px;
  &:hover {
    background: #103D7C;
  }
  &_black {
    background: $black800 !important;
    color: $white !important;
    &:hover {
      background: $black700 !important;
    }
  }
  &_verification {
    background: $white !important;
    color: $blue !important;
    &:hover {
      background: $black100 !important;
    }
  }
  &_grey {
    background-color: $black0 !important;
    &:hover {
      background: $black100 !important;
    }
  }
  &_back {
    transition: .3s !important;
    background-color: transparent !important;
    color: $black500 !important;
    &:hover {
      background-color: transparent !important;
      color: $black500 !important;
    }
  }
  &_approve {
    background-color: $green !important;
    color: $white !important;
    border-radius: 6px !important;
    border: 1px solid $green !important;
    &:hover {
      background-color: $white !important;
      color: $green !important;
      border-radius: 6px !important;
    }
  }
  &_agree {
    background-color: $green !important;
    color: $white !important;
    padding: 0;
    &:hover {
      background-color: $green !important;
      color: $white !important;
      box-shadow: 0 0 5px rgba(0,0,0,0.5) !important;
    }
  }
  &_delete {
    background-color: $red !important;
    color: $white !important;
    &:hover {
      background-color: #cc0000 !important;
      color: $white !important;
    }
  }
  &_show-messages {
    background-color: transparent !important;
    color: $blue !important;
  }
  &_messages {
    background-color: $white !important;
    color: $green !important;
    transition: .3s !important;
    font-size: 12px !important;
    &:hover {
      color: #77e377 !important;
      background-color: $white !important;
    }
  }
  &_goToChat {
    background-color: $white !important;
    color: $green !important;
    border: 1px solid $black400 !important;
    &:hover {
      background-color: $white !important;
      color: $green !important;
      border: 1px solid $black600 !important;
      box-shadow: 0 0 2px rgba(0,0,0,0.5) !important;
    }
  }
  &_dispute {
    background-color: $red !important;
    &:hover {
      box-shadow: 0 0 5px rgba(0,0,0,0.5) !important;
      background-color: $red !important;
    }
  }
  &_disabled {
    pointer-events: none !important;
    background: #D1D1CF !important;
  }
  &_outline {
    width: 100%;
    border: 1px solid rgba(0, 131, 199, 0.1) !important;
    background: #FFFFFF !important;
    color: $blue !important;
    padding: 0;
    &:hover {
      background: #F7F8FA !important;
      color: $blue !important;
    }
  }
  &_borderless {
    background: #FFFFFF !important;
    color: $blue !important;
    &-left {
      @extend .base-btn_borderless;
      justify-content: flex-start !important;
    }
    &-right {
      @extend .base-btn_borderless;
      justify-content: flex-end !important;
    }
    &:hover {
      color: #3992ff;
      background: $white;
    }
  }
  &_tag {
    background: rgba(0, 131, 199, 0.1) !important;
    border-radius: 3px !important;
    color: $blue !important;
    &:hover {
      background: rgba(0, 131, 199, 0.2) !important;
    }
  }
  &_light {
    background: #FFFFFF !important;
    color: $black800 !important;
    &:hover {
      background: $black100 !important;
    }
  }
}

@include _575 {
  .base-btn {
    font-size: 14px;
  }
}
</style>
