<template>
  <div>
    <span
      v-for="(item, i) in socials"
      :key="i"
    >
      <nuxt-link
        class="social__link"
        :to="item.url"
      >
        <span
          :class="item.class"
        />
      </nuxt-link>
    </span>
  </div>
</template>

<script>
export default {
  name: 'SocialPanel',
  data() {
    return {
      socials: [
        {
          url: '/profile',
          class: 'icon-facebook',
        },
        {
          url: '/profile',
          class: 'icon-twitter',
        },
        {
          url: '/profile',
          class: 'icon-instagram',
        },
        {
          url: '/profile',
          class: 'icon-LinkedIn',
        },
      ],
    };
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
