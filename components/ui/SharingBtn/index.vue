<template>
  <base-btn
    v-click-outside="hideIcons"
    class="sharingBtn"
    mode="share"
    data-selector="SHOW-SHARE-BUTTON"
    @click="toggleMenu"
  >
    <span class="icon-share_outline sharingBtn__chain" />
    <div
      v-if="isShowMenu"
      class="sharingBtn__socials"
    >
      <a
        v-for="(link,idx) in socialLinks"
        :key="idx"
        class="socials__links"
        :class="`socials__btn-${link.icon}`"
        :data-selector="`SOCIALS-LINK-BUTTON-${link.icon}`"
        target="_blank"
        rel="noopener noreferrer"
        :href="makeHref(link)"
      >
        <img
          v-if="link.icon === 'telegram'"
          class="socials__btn-telegram"
          :data-selector="`SOCIALS-LINK-ICON-${link.icon}`"
          alt=""
          :src="$options.images.TELEGRAM"
        >
        <span
          v-else
          class="socials__icon"
          :data-selector="`SOCIALS-LINK-ICON-${link.icon}`"
          :class="`icon-${link.icon}`"
        />
      </a>
    </div>
  </base-btn>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import { images } from '~/utils/images';

export default {
  name: 'SharingBtn',
  directives: { ClickOutside },
  images,
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowMenu: false,
    };
  },
  computed: {
    socialLinks() {
      return [
        { icon: 'telegram', url: 'https://telegram.me/share/url?url=' },
        { icon: 'twitter', url: 'https://twitter.com/intent/tweet?url=' },
        { icon: 'facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=' },
        { icon: 'LinkedIn', url: 'https://www.linkedin.com/sharing/share-offsite/?url=' },

      ];
    },
  },
  methods: {
    toggleMenu() {
      this.isShowMenu = !this.isShowMenu;
    },
    hideIcons() {
      this.isShowMenu = false;
    },
    makeHref(item) {
      switch (item.icon) {
        case 'telegram':
        case 'twitter':
        case 'facebook': {
          return `${item.url}${this.url}`;
        }
        case 'LinkedIn': {
          const encodedURI = encodeURIComponent(this.url).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);
          return `${item.url}${encodedURI}`;
        }
        default: {
          return '';
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sharingBtn{
    position: relative;
    border-radius: 6px;
  &:hover &__chain::before {
    color: $white;
  }
  &__chain:before{
    color: $blue;
    font-size: 25px;
  }
  &__socials{
    position : absolute;
    display : flex;
    top: -40px;
    gap: 10px;
  }
}
.socials {
  &__links {
    display : flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    width: 34px;
    height: 34px;
    padding: 3px;
    box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.3);
    border: 1px solid $black100;
    background: $black0;
    text-decoration: none;
    transition: ease-out .2s;
    &:hover {
      background: $blue;
      border-color: $blue;
      & span {
        color: $white;
      }
      & img {
        filter: brightness(1000%) grayscale(0%);
      }
    }
  }
  &__icon {
    font-size: 25px;
  }
  &__btn-telegram{
    padding: 3px;
    width: 34px;
    height: 34px;
  }
  &__btn-telegram img {
    height: 25px;
    width: 25px;
  }
  &__btn-twitter span {
    color: #24CAFF;
  }
  &__btn-facebook span {
    color: #3B67D7;
  }
  &__btn-LinkedIn span {
    color: $lightblue;
  }
}
@include _480 {
  .sharingBtn{
    &__socials{
      right: -25px;
    }
  }
}
</style>
