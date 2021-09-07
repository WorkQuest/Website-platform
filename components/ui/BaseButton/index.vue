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
    {{ text }}
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
    text: {
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
  &_share-user-info {
    background-color: transparent;
    transition: .5s;
    height: 24px;
    width: 24px;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a         %3Cpath d='M17.5 22C16.4179 22.0125 15.3923 21.5181 14.7282 20.6637C14.0641 19.8094 13.8379 18.6935 14.117 17.648L7.85697 14.07C6.77525 15.0611 5.18965 15.2708 3.88746 14.5951C2.58526 13.9194 1.84384 12.5023 2.03134 11.0472C2.21883 9.5922 3.2953 8.40926 4.72625 8.08577C6.15719 7.76227 7.63783 8.36714 8.43297 9.60002L14.116 6.35102C14.0424 6.07321 14.0035 5.78738 14 5.50002C13.9856 3.82674 15.1478 2.37316 16.7832 2.01884C18.4186 1.66452 20.0781 2.50676 20.7576 4.03594C21.4371 5.56511 20.95 7.36125 19.5909 8.33753C18.2319 9.31381 16.3742 9.20211 15.142 8.07002L8.99097 11.585C8.98488 11.8443 8.94863 12.1021 8.88297 12.353L15.142 15.93C16.2942 14.8726 18.0087 14.7093 19.3399 15.5303C20.671 16.3514 21.2946 17.9568 20.8668 19.461C20.439 20.9653 19.0639 22.0023 17.5 22ZM17.5 17C16.6715 17 16 17.6716 16 18.5C16 19.3284 16.6715 20 17.5 20C18.3284 20 19 19.3284 19 18.5C19 17.6716 18.3284 17 17.5 17ZM5.49997 10C4.67154 10 3.99997 10.6716 3.99997 11.5C3.99997 12.3284 4.67154 13 5.49997 13C6.3284 13 6.99997 12.3284 6.99997 11.5C6.99997 10.6716 6.3284 10 5.49997 10ZM17.5 4.00002C16.6715 4.00002 16 4.67159 16 5.50002C16 6.32845 16.6715 7.00002 17.5 7.00002C18.3284 7.00002 19 6.32845 19 5.50002C19 4.67159 18.3284 4.00002 17.5 4.00002Z' fill='%237C838D'/%3E\a         %3C/svg%3E                                                                   \a         ");
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    right: 0;
    top: 28px;
    &:hover {
      filter: brightness(70%);
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a         %3Cpath d='M17.5 22C16.4179 22.0125 15.3923 21.5181 14.7282 20.6637C14.0641 19.8094 13.8379 18.6935 14.117 17.648L7.85697 14.07C6.77525 15.0611 5.18965 15.2708 3.88746 14.5951C2.58526 13.9194 1.84384 12.5023 2.03134 11.0472C2.21883 9.5922 3.2953 8.40926 4.72625 8.08577C6.15719 7.76227 7.63783 8.36714 8.43297 9.60002L14.116 6.35102C14.0424 6.07321 14.0035 5.78738 14 5.50002C13.9856 3.82674 15.1478 2.37316 16.7832 2.01884C18.4186 1.66452 20.0781 2.50676 20.7576 4.03594C21.4371 5.56511 20.95 7.36125 19.5909 8.33753C18.2319 9.31381 16.3742 9.20211 15.142 8.07002L8.99097 11.585C8.98488 11.8443 8.94863 12.1021 8.88297 12.353L15.142 15.93C16.2942 14.8726 18.0087 14.7093 19.3399 15.5303C20.671 16.3514 21.2946 17.9568 20.8668 19.461C20.439 20.9653 19.0639 22.0023 17.5 22ZM17.5 17C16.6715 17 16 17.6716 16 18.5C16 19.3284 16.6715 20 17.5 20C18.3284 20 19 19.3284 19 18.5C19 17.6716 18.3284 17 17.5 17ZM5.49997 10C4.67154 10 3.99997 10.6716 3.99997 11.5C3.99997 12.3284 4.67154 13 5.49997 13C6.3284 13 6.99997 12.3284 6.99997 11.5C6.99997 10.6716 6.3284 10 5.49997 10ZM17.5 4.00002C16.6715 4.00002 16 4.67159 16 5.50002C16 6.32845 16.6715 7.00002 17.5 7.00002C18.3284 7.00002 19 6.32845 19 5.50002C19 4.67159 18.3284 4.00002 17.5 4.00002Z' fill='%237C838D'/%3E\a         %3C/svg%3E                                                                   \a         ");
      background-color: transparent;
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
  &_max{
    background-color: $black0;
    color: $blue;
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
    &:hover{
      background-color: $black0;
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
    transition: 0.5s;
    &:hover {
      background: $black100 !important;
    }
  }
  &_add{
    background-color: $white;
    color: $blue;
    &:hover{
      background-color: $blue;
      color: $white;
    }
  }
}

@include _575 {
  .base-btn {
    font-size: 14px;
  }
}
</style>
