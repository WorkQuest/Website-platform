<template>
  <div>
    <span>
      <a
        v-if="facebook"
        class="social__link"
        :href="socialURL('facebook')"
        target="_blank"
      >
        <span
          class="icon-facebook"
        />
      </a>
      <a
        v-if="twitter"
        class="social__link"
        :href="socialURL('twitter')"
        target="_blank"
      >
        <span
          class="icon-twitter"
        />
      </a>
      <a
        v-if="instagram"
        class="social__link"
        :href="socialURL('instagram')"
        target="_blank"
      >
        <span
          class="icon-instagram"
        />
      </a>
      <a
        v-if="linkedin"
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

export default {
  name: 'SocialPanel',
  props: {
    social: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
    };
  },
  watch: {
    social() {
      this.twitter = this.social.twitter;
      this.facebook = this.social.facebook;
      this.instagram = this.social.instagram;
      this.linkedin = this.social.linkedin;
    },
  },
  methods: {
    socialURL(socialNetwork) {
      let socialPath = '';
      if (this.$route.path === '/workers/1') {
        socialPath = `https://${socialNetwork}.com/`;
      } else {
        switch (socialNetwork) {
          case 'facebook':
            socialPath = `https://${socialNetwork}.com/${this.facebook}` || '';
            break;
          case 'twitter':
            socialPath = `https://${socialNetwork}.com/${this.twitter}` || '';
            break;
          case 'instagram':
            socialPath = `https://${socialNetwork}.com/${this.instagram}` || '';
            break;
          case 'linkedin':
            socialPath = `https://${socialNetwork}.com/${this.linkedin}` || '';
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
