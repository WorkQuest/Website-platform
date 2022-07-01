<template>
  <base-btn
    class="sharingBtn"
    mode="share"
    data-selector="SHOW-SHARE-MODAL"
    @click="isShowMenu=!isShowMenu"
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
        target="_blank"
        rel="noopener noreferrer"
        :href="makeHref(link)"
      >
        <img
          v-if="link.icon === 'telegram'"
          class="socials__btn-telegram"
          alt=""
          src="~assets/img/icons/telegram.png"
        >
        <span
          v-else
          class="socials__icon"
          :class="`icon-${link.icon}`"
        />
      </a>
    </div>
  </base-btn>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SharingBtn',
  props: {
    message: {
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
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    socialLinks() {
      return [
        { icon: 'telegram', url: 'https://telegram.me/share/url?url=' },
        { icon: 'twitter', url: 'https://twitter.com/intent/tweet?url=' },
      ];
    },
  },
  methods: {
    makeHref(item) {
      switch (item.icon) {
        case 'telegram':
        case 'twitter':
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
    width: 46px;
    height: 46px;
    border-radius: 6px;
  &:hover &__chain::before {
    color: $white;
  }
  &__chain:before{
    color: $blue;
    font-size: 25px!important;
  }
  &__socials{
    position : absolute;
    display : flex;
    top: -40px;
    gap: 3px;
  }
}
.socials {
  &__links {
    border-radius: 6px;
    padding: 3px;
    background: $black0;
    text-decoration: none;
    transition: ease-out .2s;
    &:hover {
      background: $blue;
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
    width: 31px;
    height: 34px;
  }
  &__btn-telegram img {
    width: 25px;
    height: 25px;
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
</style>
