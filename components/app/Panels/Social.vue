<template>
  <div>
    <span>
      <a
        v-if="userFacebook"
        class="social__link"
        :href="'https://facebook.com/' + userFacebook || ''"
        target="_blank"
      >
        <span
          class="icon-facebook"
        />
      </a>
      <a
        v-if="userTwitter"
        class="social__link"
        :href="'https://twitter.com/' + userTwitter || ''"
        target="_blank"
      >
        <span
          class="icon-twitter"
        />
      </a>
      <a
        v-if="userInstagram"
        class="social__link"
        :href="'https://www.instagram.com/' + userInstagram || ''"
        target="_blank"
      >
        <span
          class="icon-instagram"
        />
      </a>
      <a
        v-if="userLinkedin"
        class="social__link"
        :href="'https://linkedin.com/' + userLinkedin || ''"
        target="_blank"
      >
        <span
          class="icon-LinkedIn"
        />
      </a>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SocialPanel',
  computed: {
    ...mapGetters({
      socials: 'data/getSocials',
      userInstagram: 'user/getUserInstagram',
      userTwitter: 'user/getUserTwitter',
      userLinkedin: 'user/getUserLinkedin',
      userFacebook: 'user/getUserFacebook',
    }),
  },
};
</script>

<style lang="scss" scoped>

.icon {
  font-size: 20px;
  cursor: pointer;
  &-facebook::before {
    @extend .icon;
    color: #0A7EEA;
  }
  &-twitter::before {
    @extend .icon;
    color: #24CAFF;
  }
  &-instagram::before {
    @extend .icon;
    color: #C540F3;
  }
  &-LinkedIn:before {
    @extend .icon;
    content: "\e9ed";
    color: #57A6EF;
  }
}

.social {
  &__link {
    text-decoration: none;
  }
}

</style>
