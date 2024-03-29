<template>
  <div class="template">
    <div class="template__body">
      <div class="template__container">
        <div class="template__top">
          <div
            class="template__logo"
            @click="toMain()"
          >
            <img
              src="~assets/img/app/logo_white.svg"
              alt="WorkQuest"
            >
            <span>WorkQuest</span>
          </div>
        </div>
        <div class="template__center">
          <nuxt />
        </div>
        <div class="template__footer">
          <div class="template__links">
            <a
              v-for="(item, i) in templateLinks"
              :key="i"
              class="template__link"
              :href="item.url"
              target="_blank"
            >
              {{ item.title }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <loader v-if="isLoading" />
    </transition>
    <ctm-modal />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path } from '~/utils/enums';

export default {
  name: 'RoleLayout',
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
    }),
    templateLinks() {
      return [
        {
          url: '/docs/terms.pdf',
          title: this.$t('layout.links.terms'),
        },
        {
          url: '/docs/privacy.pdf',
          title: this.$t('layout.links.privacy'),
        },
      ];
    },
  },
  methods: {
    toMain() {
      this.$router.push(Path.SIGN_IN);
    },
  },
};
</script>

<style lang="scss" scoped>
.template {
  &__body {
    background: linear-gradient(#103D7C 45%, transparent 40%) no-repeat;
  }
  &__container {
    min-height: 100vh;
    width: 100%;
    display: grid;
    grid-template-rows: auto 1fr auto;
    max-width: 1170px;
    margin: 0 auto;
  }
  &__center {
    display: flex;
    align-items: center;
  }
  &__top {
    display: initial;
    width: 100%;
    padding-top: 20px;
  }
  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    cursor: pointer;
    span {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: #FFFFFF;
    }
  }
  &__content {
    display: grid;
    align-items: center;
  }
  &__bottom {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-gap: 53px;
  }
  &__long {
    justify-self: flex-end;
  }
  &__slogan {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 55px;
    line-height: 130%;
    color: #FFFFFF;
    padding: 100px 0 0 100px;
    white-space: pre-line;
  }
  &__footer {
    display: flex;
    align-items: center;
    padding-bottom: 26px;
    justify-content: flex-end;
  }
  &__links {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;
  }
  &__link {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
    cursor: pointer;
    text-decoration: none;
  }
}

@include _1199 {
 .template {
  &__center {
    padding: 20px;
  }
 }
}

@include _1199 {
  .template {
    &__footer {
      padding: 20px;
    }
    &__top {
      padding: 20px;
    }
  }
}

@include _575 {
  .template {
    &__container {
      grid-gap: 30px;
    }

    &__footer {
      justify-content: center;
    }
  }
}
</style>
