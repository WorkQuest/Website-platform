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
  height: 43px;
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
  &_verification {
    background: $white;
    color: $blue;
    &:hover {
      background: $black100;
    }
  }
  &_grey {
    background-color: $black100;
    &:hover {
      background: $black200;
    }
  }
  &_back {
    transition: .3s;
    background-color: transparent;
    color: $black500;
    &:hover {
      background-color: transparent;
      color: $black500;
    }
  }
  &_approve {
    background-color: $green;
    color: $white;
    border-radius: 6px;
    border: 1px solid $green;
    &:hover {
      background-color: $white;
      color: $green;
      border-radius: 6px;
    }
  }
  &_agree {
    background-color: $green;
    color: $white;
    &:hover {
      background-color: $green;
      color: $white;
      box-shadow: 0 0 5px rgba(0,0,0,0.5);
    }
  }
  &_delete {
    background-color: $red;
    color: $white;
    &:hover {
      background-color: #cc0000;
      color: $white;
    }
  }
  &_show-messages {
    background-color: transparent;
    color: $blue;
  }
  &_messages {
    background-color: $white;
    color: $green;
    border-radius: 6px;
    transition: .3s;
    border: 1px solid $green;
    &:hover {
      background-color: $green;
      color: $white;
      border-radius: 6px;
    }
  }
  &_goToChat {
    background-color: $white;
    color: $green;
    border: 1px solid $black400;
    &:hover {
      background-color: $white;
      color: $green;
      border: 1px solid $black600;
      box-shadow: 0 0 2px rgba(0,0,0,0.5);
    }
  }
  &_dispute {
    background-color: $red;
    &:hover {
      box-shadow: 0 0 5px rgba(0,0,0,0.5);
      background-color: $red;
    }
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
  &_borderless {
    background: #FFFFFF;
    color: $blue;
    &-left {
      @extend .base-btn_borderless;
      justify-content: flex-start;
    }
    &-right {
      @extend .base-btn_borderless;
      justify-content: flex-end;
    }
    &:hover {
      color: #3992ff;
      background: $white;
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

@include _575 {
  .base-btn {
    font-size: 14px;
  }
}
</style>
