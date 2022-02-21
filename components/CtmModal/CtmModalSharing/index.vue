<template>
  <ctm-modal-box :title="$t('sharing.title')">
    <div class="ctm-modal__content share">
      <span class="share__text">{{ $t('sharing.socialText') }}</span>
      <div class="share__socials">
        <button
          v-for="(link,idx) in socialLinks"
          :key="idx"
          class="socials__btn"
          :class="`socials__btn-${link.icon}`"
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
        </button>
      </div>
      <span class="share__text">{{ $t('sharing.share') }}</span>
      <div class="share__link">
        <div class="share__text share__text_hidden">
          {{ sharingLink }}
        </div>
        <button
          v-clipboard:copy="sharingLink"
          v-clipboard:success="ClipboardSuccessHandler"
          v-clipboard:error="ClipboardErrorHandler"
          class="share__copy"
          type="button"
        >
          <span class="icon-copy" />
        </button>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path } from '~/utils/enums';

export default {
  name: 'ModalSharing',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    socialLinks() {
      return [
        { icon: 'telegram', url: '' },
        { icon: 'twitter', url: '' },
        { icon: 'facebook', url: '' },
        { icon: 'LinkedIn', url: '' },
      ];
    },
    sharingLink() {
      const { itemId } = this.options;
      const url = window.location.origin;
      if (this.options.mode === 'quest') return `${url}${Path.QUESTS}/${itemId}`;
      if (this.options.mode === 'profile') return `${url}${Path.PROFILE}/${itemId}`;
      return 'error';
    },
  },
};
</script>

<style lang="scss" scoped>
.share {
  min-width: 382px !important;
  &__text {
    @include text-simple;
    @include normal-font-size;
    &_hidden {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &__socials {
    display: grid;
    grid-template-columns: repeat(4, 40px);
    grid-template-rows: 40px;
    grid-gap: 25px;
    margin: 10px 0 25px 0;
  }
  &__link {
    display: flex;
    margin-top: 5px;
    padding: 12.5px 54px 12.5px 15px;
    border: 1px solid $black0;
    border-radius: 6px;
  }
  &__copy {
    position: absolute;
    right: 45px;
    & span {
      font-size: 20px;
      color: $blue;
    }
  }
}
.socials {
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: $black0;
    &:hover {
      background: $blue;
      & span {
        color: $white;
      }
      & img {
        transition: 0.5s;
        filter: brightness(1000%) grayscale(100%);
      }
    }
  }
  &__icon {
    font-size: 20px;
  }
  &__btn-telegram img {
    width: 16px;
    height: 14px;
  }
  &__btn-twitter span {
    color: #24CAFF;
  }
  &__btn-facebook span {
    color: #3B67D7;
  }
  &__btn-LinkedIn span {
    color: #0A7EEA;
  }
}

</style>
