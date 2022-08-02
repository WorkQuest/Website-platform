<template data-selector="COMPONENT-BASE-BTN">
  <a
    v-if="link !== ''"
    class="base-btn"
    :class="btnClass"
    :href="link"
    target="_blank"
    :data-selector="`BASE-BTN-LINK-${link}`"
  >
    <slot />
  </a>
  <nuxt-link
    v-else-if="nuxtLink !==''"
    class="base-btn"
    :class="btnClass"
    :data-selector="`BASE-BTN-NUXT-LINK-${nuxtLink}`"
    :to="nuxtLink"
  >
    <slot />
  </nuxt-link>
  <button
    v-else
    class="base-btn"
    :class="btnClass"
    :type="isSubmit ? 'submit' : 'button'"
    :data-selector="`ACTION-BTN-CLICK-${dataSelector.toUpperCase()}`"
    @click="$emit('click', $event)"
  >
    {{ text }}
    <span
      v-if="$slots.left"
      class="icon icon-btn_left"
    >
      <slot name="left" />
    </span>
    <slot />
    <span
      v-if="$slots.right"
      class="icon icon-btn_right"
    >
      <slot name="right" />
    </span>
  </button>
</template>
<script>
export default {
  props: {
    link: {
      type: String,
      default: '',
    },
    isSubmit: {
      type: Boolean,
      default: true,
    },
    dataSelector: {
      type: String,
      default: '',
    },
    nuxtLink: {
      type: String,
      default: '',
    },
    disabled: {
      type: [Boolean, String],
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    padding: {
      type: Boolean,
      default: false,
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
        { 'base-btn_cross': mode === 'cross' },
        { 'base-btn_approve': mode === 'approve' },
        { 'base-btn_back': mode === 'back' },
        { 'base-btn_grey': mode === 'grey' },
        { 'base-btn_verification': mode === 'ver' },
        { 'base-btn_black': mode === 'black' },
        { 'base-btn_max': mode === 'max' },
        { 'base-btn_share': mode === 'share' },
        { 'base-btn_add': mode === 'add' },
        { 'base-btn_portfolio-edit': mode === 'portfolioEdit' },
        { 'base-btn_portfolio-close': mode === 'portfolioClose' },
        { 'base-btn_share-user-info': mode === 'share-btn' },
        { 'base-btn_active-tab': mode === 'activeTab' },
        { 'base-btn_filter': mode === 'filter' },
        { 'base-btn_padding': this.padding },
        { 'base-btn_messages base-btn_report': mode === 'report' },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  &-btn {
    &_left {
      padding-right: 5px;
    }
    &_right {
      padding-left: 5px;
    }
  }
}
.base-btn {
  user-select: none;
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
  &_padding {
    padding: 0 10px;
  }
  &_share-user-info {
    @include share-user;
    height: 24px;
    width: 24px;
    &:hover {
      @include share-user;
      filter: brightness(70%);
      cursor: pointer;
    }
  }
  &_portfolio-edit {
    position: absolute;
    left: 30px;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    border-radius: 6px;
    padding: 2px;
    transition: 0.5s;
    background: $yellow;
    filter: grayscale(50%);
    &:hover {
      filter: grayscale(0);
      background: $yellow;
    }
  }
  &_portfolio-close {
    position: absolute;
    left: 5px;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    border-radius: 6px;
    padding: 2px;
    transition: 0.5s;
    filter: grayscale(50%);
    background: $red;
    &:hover {
      filter: grayscale(0);
      background: $red;
    }
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
  &_share {
    background-color: $black0;
    &:hover {
      background: $blue;
    }
  }
  &_max {
    background-color: $black0;
    color: $blue;
    font-weight: 600;
    font-size: 16px;
    height:40px;
    line-height: 130%;
    &:hover {
      background-color: $black0;
    }
  }
  &_back {
    padding: 0 17px;
    transition: .3s !important;
    background-color: transparent !important;
    color: $black800 !important;
    opacity: 1;
    &:hover {
      background-color: transparent !important;
      opacity: 0.8;
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
  &_cross {
    background: transparent !important;
    color: $red !important;
    &:hover {
      color: #cc0000 !important;
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
    color: $black800 !important;
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
    border: 1px solid rgba(0, 170, 91, 0.1) !important;
    &:hover {
      background-color: $white !important;
      color: $green !important;
      border: 1px solid rgba(0, 170, 91, 0.2) !important;
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
    color: $black200 !important;
    background: $black0 !important;
  }
  &_outline {
    width: 100%;
    border: 1px solid rgba(0, 131, 199, 0.1);
    background: $white;
    color: $blue;
    padding: 0;
    &:hover {
      background: $black0;
      color: $blue;
    }
  }
  &_borderless {
    background: $white;
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
    background: rgba(0, 131, 199, 0.1) !important;
    border-radius: 3px !important;
    color: $blue !important;
    &:hover {
      background: rgba(0, 131, 199, 0.2) !important;
    }
  }
  &_light {
    background: #FFFFFF;
    color: $black800;
    transition: 0.5s;
    &:hover {
      background: $black100 !important;
    }
  }
  &_add {
    background-color: $white;
    color: $blue;
    &:hover {
      background-color: $blue;
      color: $white;
    }
  }
  &_active-tab {
    &:hover {
      background: $blue;
      cursor: unset;
    }
  }
  &_filter {
    color: $black800 !important;
    background-color: $white !important;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid $black100;
    }
  }
  &_report {
    width: 24px;
    height: 24px;
    & span {
      color: $black500;
      font-size: 24px;
    }
    &:hover {
      & span {
        color: $errorText;
      }
    }
  }
}
</style>
