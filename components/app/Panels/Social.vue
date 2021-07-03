<template>
  <div>
    <span
      v-for="(item, i) in socials"
      :key="i"
    >
      <a
        class="social__link"
        :href="item.url"
        target="_blank"
      >
        <span
          :class="item.class"
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
