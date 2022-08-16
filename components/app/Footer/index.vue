<template>
  <div class="footer">
    <div class="footer__body">
      <div
        class="footer__top"
        :class="{'footer__top_hidden' : isTopHidden}"
      >
        <div class="footer__left">
          <div
            class="footer__logo"
            @click="clickLogoHandler"
          >
            <img
              src="/img/app/logo_gray.svg"
              alt="Logo"
            >
            <span>WorkQuest</span>
          </div>
          <div class="footer__links links footer__links_pc">
            <div class="links__block">
              <div class="links__title">
                {{ $t('footer.download') }}
              </div>
              <div class="links__big">
                <a
                  v-for="item in marketLinks"
                  :key="item.key"
                  :class="`links__store links__store_${item.key}`"
                  :href="item.href"
                  target="_blank"
                />
              </div>
            </div>
            <div class="links__block">
              <div class="links__title">
                {{ $t('footer.follow') }}
              </div>
              <div class="links__small">
                <a
                  v-for="item in socialList"
                  :key="item.key"
                  :class="`links__social links__social_${item.key}`"
                  :href="item.href"
                  target="_blank"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="footer__right">
          <div class="footer__menus">
            <div class="footer__items footer__items_main">
              <div class="footer__block">
                <div class="footer__item">
                  <div class="footer__text footer__text_black">
                    {{ $t('footer.company.title') }}
                  </div>
                  <div class="footer__items footer__items_links">
                    <a
                      v-for="(item,key) in companyLinks"
                      :key="key"
                      :href="item.path"
                      class="footer__text footer__text_grey"
                      target="_blank"
                    >
                      {{ item.title }}
                    </a>
                    <div
                      class="footer__text footer__text_grey"
                      @click="showSupportModal"
                    >
                      {{ $t('meta.contactUs') }}
                    </div>
                    <div
                      class="footer__text footer__text_grey"
                      @click="showSupportModal"
                    >
                      {{ $t('footer.company.support') }}
                    </div>
                  </div>
                </div>
                <div class="footer__item">
                  <div class="footer__text footer__text_black">
                    {{ $t('footer.legalInfo.title') }}
                  </div>
                  <div class="footer__items footer__items_links">
                    <a
                      v-for="(item,key) in legalInfoLinks"
                      :key="key"
                      target="_blank"
                      type="link"
                      :href="item.path"
                      class="footer__text footer__text_grey"
                    >
                      {{ item.title }}
                    </a>
                  </div>
                </div>
              </div>
              <div class="footer__block">
                <div class="footer__item">
                  <div class="footer__text footer__text_black">
                    {{ $t('footer.DeFi.title') }}
                  </div>
                  <div class="footer__items footer__items_links">
                    <a
                      v-for="(item,key) in DeFiLinks.firstColumn"
                      :key="key"
                      :href="item.path"
                      class="footer__text footer__text_grey"
                    >
                      {{ item.title }}
                    </a>
                  </div>
                </div>
                <div class="footer__item">
                  <div class="footer__text footer__text_black" />
                  <div class="footer__items footer__items_links footer__items_last-column">
                    <a
                      v-for="(item,key) in DeFiLinks.secondColumn"
                      :key="key"
                      :href="item.path"
                      class="footer__text footer__text_grey"
                    >
                      {{ item.title }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer__links links footer__links_mobile">
            <div class="links__block">
              <div class="links__title">
                {{ $t('footer.download') }}
              </div>
              <div class="links__big">
                <a
                  v-for="item in marketLinks"
                  :key="item.key"
                  :class="`links__store links__store_${item.key}`"
                  :href="item.href"
                  target="_blank"
                />
              </div>
            </div>
            <div class="links__block">
              <div class="links__title">
                {{ $t('footer.follow') }}
              </div>
              <div class="links__small">
                <a
                  v-for="item in socialList"
                  :key="item.key"
                  :class="`links__social links__social_${item.key}`"
                  :href="item.href"
                  target="_blank"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="footer__left">
          <div class="footer__rights">
            <div class="footer__text footer__text_rights">
              © WorkQuest {{ new Date().getFullYear() }}
            </div>
            <div class="footer__text footer__text_rights">
              {{ $t('ui.footer.rights') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { Path } from '~/utils/enums';
import { URLS, LEGAL_INFO, COMPANY } from '~/utils/сonstants/footer';

export default {
  name: 'Footer',
  props: {
    isTopHidden: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
    }),
    legalInfoLinks() {
      return [
        { title: this.$t('footer.legalInfo.risks'), path: LEGAL_INFO.RISKS },
        { title: this.$t('footer.legalInfo.privacyPolicy'), path: LEGAL_INFO.PRIVACY_POLICY },
        { title: this.$t('meta.terms'), path: LEGAL_INFO.TERM_CONDITIONS },
        { title: this.$t('meta.aml'), path: LEGAL_INFO.AML_POLICY },
        { title: this.$t('footer.legalInfo.cookiePolicy'), path: LEGAL_INFO.COOKIE_POLICY },
      ];
    },
    companyLinks() {
      return [
        { title: this.$t('footer.company.wqWiki'), path: URLS.WIKI },
        { title: this.$t('meta.aboutUs'), path: COMPANY.ABOUT_US },
        { title: this.$t('footer.company.leadership'), path: COMPANY.LEADERSHIP },
      ];
    },
    DeFiLinks() {
      return {
        firstColumn: [
          { title: this.$t('footer.DeFi.retirement'), path: Path.RETIREMENT },
          { title: this.$t('footer.DeFi.referral'), path: Path.REFERRAL },
          { title: this.$t('footer.DeFi.P2P'), path: Path.INSURING },
          { title: this.$t('footer.DeFi.savingsProduct'), path: Path.SAVINGS },
          { title: this.$t('footer.DeFi.lending'), path: Path.LENDING },
        ],
        secondColumn: [
          { title: this.$t('meta.liquidityMining'), path: Path.MINING },
          { title: this.$t('footer.DeFi.wqBridge'), path: Path.BRIDGE },
          { title: this.$t('footer.DeFi.staking'), path: Path.STAKING },
          { title: this.$t('footer.DeFi.wqDAO'), path: URLS.DAO },
        ],
      };
    },
    socialList() {
      return [
        { key: 'twitter', href: URLS.SOCIALS.TWITTER },
        { key: 'youtube', href: URLS.SOCIALS.YOUTUBE },
        { key: 'reddit', href: URLS.SOCIALS.REDDIT },
        { key: 'facebook', href: URLS.SOCIALS.FACEBOOK },
        { key: 'linkedin', href: URLS.SOCIALS.LINKEDIN },
        { key: 'instagram', href: URLS.SOCIALS.INSTAGRAM },
        { key: 'telegram', href: URLS.SOCIALS.TELEGRAM },
      ];
    },
    marketLinks() {
      return [
        { key: 'app-store', href: URLS.STORES.APP_STORE },
        { key: 'play-market', href: URLS.STORES.PLAY_MARKET },
      ];
    },
  },
  methods: {
    clickLogoHandler() {
      this.$emit('clickOnLogo');
    },
    showSupportModal() {
      this.ShowModal({
        key: modals.support,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  &__items {
    display: grid;
    grid-template-columns: repeat(2, minmax(170px, auto));
    grid-gap: 50px;
    &_links {
      grid-template-columns: repeat(1, 1fr);
      grid-template-rows: repeat(5, 1fr);
      grid-gap: 10px;
    }
  }
  &__item {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-gap: 15px;
  }
  &__body {
    max-width: 1180px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
  }
  &__top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    &_hidden {
      display: none;
    }
  }
  &__bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 72px;
    align-items: center;
  }
  &__links {
    display: flex;
    grid-gap: 35px;
    flex-direction: column;
    &_mobile {
      display: none;
    }
  }
  &__link {
    @include text-simple;
    font-size: 16px;
    line-height: 130%;
    color: $blue;
    cursor: pointer;
    text-decoration: none;
  }
  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    cursor: pointer;
    span {
      @include text-simple;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: $black400;
    }
  }

  &__text {
    @include text-simple;
    &_grey {
      font-weight: normal;
      font-size: 16px;
      color: $black500;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    &_black {
      height: 24px;
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
      color: $black700;
    }
    &_rights {
      font-size: 14px;
      line-height: 130%;
      color: $black500;
    }
  }
  &__rights {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;
  }
  &__right {
    display: flex;
    align-items: flex-end;
  }
  &__left {
    display: flex;
    grid-gap: 20px;
    flex-direction: column;
  }
  &__block {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 30px;
    &_links {
      display: flex;
      grid-gap: 25px;
    }
  }
  .links {
    &__block {
      display: flex;
      flex-direction: column;
      grid-gap: 10px;
    }
    &__title {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
    }
    &__big {
      display: flex;
      grid-gap: 10px;
    }
    &__small {
      display: flex;
      justify-content: space-between;
    }
    &__store {
      width: 170px;
      height: 56px;
      &_app-store {
        background-image: url('/img/app/app_store_button.svg');
      }
      &_play-market {
        background-image: url('/img/app/play_market_button.svg');
      }
    }
    &__social {
      width: 40px;
      height: 40px;
      border: 0.3px solid $black0;
      &_twitter {
        background-image: url('assets/img/social/footer_twitter.svg');
        border-radius: 10px;
        &:hover, &:active {
          background-image: url('assets/img/social/footer_twitter_active.svg')
        }
      }
      &_youtube {
        background-image: url('assets/img/social/footer_youtube.svg');
        border-radius: 10px;
        &:hover, &:active {
          background-image: url('assets/img/social/footer_youtube_active.svg')
        }
      }
      &_reddit {
        background-image: url('assets/img/social/footer_reddit.svg');
        border-radius: 10px;
        &:hover, &:active {
          background-image: url('assets/img/social/footer_reddit_active.svg')
        }
      }
      &_facebook {
        background-image: url('assets/img/social/footer_facebook.svg');
        border-radius: 10px;
        &:hover, &:active {
          background-image: url('assets/img/social/footer_facebook_active.svg')
        }
      }
      &_linkedin {
        background-image: url('assets/img/social/footer_linkedin.svg');
        border-radius: 10px;
        &:hover, &:active {
          background-image: url('assets/img/social/footer_linkedin_active.svg')
        }
      }
      &_instagram {
        background-image: url('assets/img/social/footer_instagram.svg');
        border-radius: 10px;
        &:hover, &:active {
          background-image: url('assets/img/social/footer_instagram_active.svg')
        }
      }
      &_telegram {
        background-image: url('assets/img/social/footer_telegram.svg');
        border-radius: 10px;
        &:hover, &:active {
          background-image: url('assets/img/social/footer_telegram_active.svg')
        }
      }
    }
  }
}

@include _1199 {
  .footer {
    padding: 0 20px;
    &__menus {
      width: 100%;
      margin: 20px 0;
    }
    &__top {
      flex-direction: column;
    }
    &__right {
      flex-direction: column;
      align-items: flex-start;
    }
    &__links {
      &_pc {
        display: none;
      }
      &_mobile {
        display: grid;
        grid-template-columns: auto auto;
        flex-direction: row;
        justify-content: space-between;
        grid-gap: 35px;
      }
    }
    &__items {
      &_main {
        grid-template-columns: 350px auto;
        display: grid;
        justify-content: flex-start;
        grid-gap: 35px;
      }
    }
    .links {
      &__small {
        grid-gap: 10px;
      }
    }
  }
}

@include _991 {
  .footer {
    &__links {
      width: auto;
      &_mobile {
        width: auto;
      }
    }
  }
}

@include _767 {
  .footer {
    &__items {
      &_main {
        grid-template-columns: auto;
        grid-gap: 25px;
      }
    }
    &__links {
      &_mobile {
        grid-gap: 25px;
      }
    }
    &__block {
      grid-gap: 20px;
    }
  }
  .links {
    &__big {
      flex-direction: column;
    }
  }
}

@include _575 {
  .footer {
    &__bottom {
      display: grid;
    }
    &__left {
      grid-column: 1/2;
    }
    &__rights {
      grid-column: 1/2;
    }
    &__rights {
      display: flex;
    }
    &__top {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 30px;
      &_hidden {
        display: none;
      }
    }
    &__links {
      &_mobile {
        grid-template-columns: auto;
      }
    }
    &__items {
      &_links {
        grid-template-columns: 1fr;
      }
    }
  }
  .links__big {
    flex-direction: row;
  }
}

@include _480 {
  .footer {
    &__links {
      &_mobile {
        width: 100%;
        flex-direction: column;
      }
    }
    .links {
      &__block {
        width: 100%;
      }
      &__small {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
      }
    }
  }
}

@include _380 {
  .footer {
    padding: 0 10px;
  }
}

@include _350 {
  .footer {
    &__block {
      grid-template-columns: auto;
      grid-gap: 10px;
    }
    &__items {
      &_last-column {
        grid-template-rows: repeat(4, 1fr);
      }
    }
    &__text {
      &_block {
        display: none;
      }
    }
  }
  .links {
    &__big {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
