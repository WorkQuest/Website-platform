<template>
  <div>
    {{ additionalInfo }}
    <span>
      <a
        v-if="userFacebook"
        class="social__link"
        :href="socialURL('facebook')"
        target="_blank"
      >
        <span
          class="icon-facebook"
        />
      </a>
      <a
        v-if="userTwitter"
        class="social__link"
        :href="socialURL('twitter')"
        target="_blank"
      >
        <span
          class="icon-twitter"
        />
      </a>
      <a
        v-if="userInstagram"
        class="social__link"
        :href="socialURL('instagram')"
        target="_blank"
      >
        <span
          class="icon-instagram"
        />
      </a>
      <a
        v-if="userLinkedin"
        class="social__link"
        :href="socialURL('linkedin')"
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
  methods: {
    socialURL(socialNetwork) {
      let socialPath = '';
      if (this.$route.path === '/workers/1') {
        socialPath = `https://${socialNetwork}.com/`;
      } else {
        switch (socialNetwork) {
          case 'facebook':
            socialPath = `https://${socialNetwork}.com/${this.userFacebook}` || '';
            break;
          case 'twitter':
            socialPath = `https://${socialNetwork}.com/${this.userTwitter}` || '';
            break;
          case 'instagram':
            socialPath = `https://${socialNetwork}.com/${this.userInstagram}` || '';
            break;
          case 'linkedin':
            socialPath = `https://${socialNetwork}.com/${this.userLinkedin}` || '';
            break;
          default:
            socialPath = '#';
        }
      }
      return socialPath;
    },
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
