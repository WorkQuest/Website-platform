<template>
  <div
    class="wiki"
    @touchmove="onTouchMove"
  >
    <div
      ref="header"
      class="wiki__header"
    >
      <div class="wiki__content">
        <h3 class="wiki__title">
          {{ $t('wiki.title') }}
        </h3>
        <div class="wiki__fields">
          <div class="wiki__search-field">
            <div class="wiki__search-holder">
              <base-field
                v-model="searchValue"
                class="wiki__input"
                :is-search="true"
                :is-hide-error="true"
                data-selector="SEARCH"
                :placeholder="$t('wiki.searchPlaceholder')"
                @input="handleSearch"
                @focus="handleSearch"
              />
              <div
                v-if="searched.length"
                v-click-outside="() => { searched = [] }"
                class="wiki__searched searched"
              >
                <a
                  v-for="(item, index) of searched"
                  v-show="item.id"
                  :key="index"
                  class="searched__item"
                  :href="item.id ? '#' + item.id : ''"
                  @click="gotoTab(item.tab)"
                >
                  <span class="searched__item_nav">{{ item.tabName }}</span> - {{ item.text }}
                </a>
              </div>
            </div>
            <div class="wiki__button-field">
              <base-btn
                class="wiki__search-button"
                data-selector="SEARCH-BTN"
                :text="$t('wiki.search')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-wrapper">
      <nav
        ref="nav"
        class="wiki__navigation navigation__mobile"
        :class="{'wiki__navigation_light': isMoving}"
        @touchmove="(e) => moveItems(e, 'nav')"
      >
        <ul class="wiki__ul">
          <li
            v-for="(item, key) in navigation"
            :key="key"
            class="wiki__item"
            :class="{'wiki__item_dark': isMoving && item !== currentTab, 'wiki__item_active': item === currentTab}"
            @click="selectTab(item)"
          >
            {{ $t(`wiki.navigation.${item}.title`) }}
          </li>
        </ul>
      </nav>
      <main class="content wiki__content">
        <nav class="wiki__navigation navigation__desktop">
          <ul class="wiki__ul">
            <li
              v-for="(item, key) in navigation"
              :key="key"
              :class="{'wiki__item_active': item === currentTab}"
              class="wiki__item"
              @click="selectTab(item)"
            >
              {{ $t(`wiki.navigation.${item}.title`) }}
            </li>
          </ul>
        </nav>
        <Content
          class="wiki__main"
          :current-tab="currentTab"
        />
      </main>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import Content from '~/components/wiki/content.vue';

export default {
  name: 'Wiki',
  components: {
    Content,
  },
  directives: {
    ClickOutside,
  },
  data() {
    return {
      currentTab: 'header',
      searchValue: '',
      interval: null,
      searched: [],
      pageX: 0,
      isMoving: false,
    };
  },
  computed: {
    navigation() {
      return Object.keys(this.$t('wiki.navigation'));
    },
    wikiData() {
      const result = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const nav of this.navigation) {
        const cards = Object.keys(this.$t(`wiki.navigation.${nav}.cards`));
        result[nav] = {
          tabName: this.$t(`wiki.navigation.${nav}.title`),
          title: this.$t(`wiki.navigation.${nav}.title`).toLowerCase(),
          cardKeys: cards,
          cards: {},
        };
        // eslint-disable-next-line no-restricted-syntax
        for (const card of cards) {
          const cardTitle = this.$t(`wiki.navigation.${nav}.cards.${card}.title`);
          let cardSubtitle = '';
          if (this.$te(`wiki.navigation.${nav}.cards.${card}.subtitle`)) {
            cardSubtitle = this.$t(`wiki.navigation.${nav}.cards.${card}.subtitle`);
          }
          result[nav].cards[card] = {
            cardTitle: cardTitle.toLowerCase(),
            cardSubtitle: cardSubtitle.toLowerCase(),
            title: cardTitle,
            subtitle: cardSubtitle,
          };
        }
      }
      return result;
    },
  },
  mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    selectTab(item) {
      this.currentTab = item;
      window.scrollTo(0, 50);
    },
    moveItems(event, payload) {
      const x = event.changedTouches[0].pageX;
      const delta = this.pageX - x;
      this.$refs[payload].scrollLeft += delta;
      this.pageX = x;
    },
    onTouchstart(event) {
      this.pageX = event.changedTouches[0].pageX;
    },
    onTouchMove() {
      this.isMoving = this.$refs.header.getBoundingClientRect().y < -157;
    },
    handleSearch() {
      clearTimeout(this.interval);
      if (!this.searchValue.length) {
        this.searched = [];
        return;
      }
      this.interval = setTimeout(() => this.searchData(), 250);
    },
    gotoTab(tab) {
      this.currentTab = tab;
      this.searched = [];
      this.isMoving = true;
    },
    async searchData() {
      const results = [];
      const word = this.searchValue.toLowerCase();
      const data = this.wikiData;
      // eslint-disable-next-line no-restricted-syntax
      for (const nav of Object.keys(data)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const card of data[nav].cardKeys) {
          const { cardTitle, cardSubtitle } = data[nav].cards[card];
          if (cardSubtitle.indexOf(word) !== -1) {
            if (results.filter((item) => item.text === cardSubtitle).length === 0) {
              results.push({
                tab: nav,
                tabName: data[nav].tabName,
                text: `${data[nav].cards[card].title} - ${data[nav].cards[card].subtitle}`,
                id: cardTitle,
              });
            }
          } else if (cardTitle.indexOf(word) !== -1) {
            if (results.filter((item) => item.text === cardTitle).length === 0) {
              results.push({
                tab: nav,
                tabName: data[nav].tabName,
                text: data[nav].cards[card].title,
                id: cardTitle,
              });
            }
          } else if (data[nav].title.indexOf(word) !== -1) {
            if (results.filter((item) => item.text === data[nav].title).length === 0) {
              results.push({
                tab: nav,
                tabName: data[nav].tabName,
                text: data[nav].title,
              });
            }
          }
        }
      }
      this.searched = results;
    },
  },
};
</script>

<style lang="scss" scoped>
.wiki {
  background: $black0;
  &__header {
    background: $darkblue;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  &__content {
    width: 1180px;
    margin: 0 auto;
  }
  &__title {
    @include text-simple;
    @include normal-font-size;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 34px;
    color:  $white;
  }
  &__fields {
    display: flex;
    align-items: center;
  }
  &__search-field {
    background: $white;
    height: 83px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-radius: 6px;
  }
  &__search-holder {
    position: relative;
  }
  &__input {
    width: 880px;
  }
  &__button-field {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 20px;
    border-left: $black0 1px solid;
  }
  &__search-button {
    width: 220px;
    margin-left: 20px;
  }
  &__header-button {
    width: 46px;
    height: 63px;
    margin-left: 10px;
    display: none;
  }
  &__navigation {
    width: 280px;
    background: $white;
    height: 477px;
    border-radius: 6px;
  }
  &__item {
    @include text-simple;
    @include normal-font-size;
    list-style-type: none;
    font-size: 18px;
    padding: 15px;
    cursor: pointer;
    &:hover {
      background: #E9EDF2;
      transition: 300ms;
    }
    &_active {
      font-weight: 600;
    }
  }
}
.content {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 20px;
}
.navigation {
  &__desktop {
    display: block;
  }
  &__mobile {
    display: none;
  }
}
@include _1199 {
  .wiki {
    &__content {
    width: 950px;
    }
    &__input {
    width: 650px;
    }
  }
}
@include _991 {
  .wiki {
    &__content {
      width: 750px;
    }
    &__input {
      width: 450px;
    }
  }
}
@include _767 {
  .wiki {
    position: relative;
    &__title {
      font-size: 28px;
    }
    &__header {
      height: 230px;
      margin-bottom: 0;
    }
    &__navigation {
      position: sticky;
      background: $darkblue;
      top: 70px;
      border-radius: 0;
      left: 0;
      width: 100vw;
      height: 50px;
      transition: background linear 100ms;
      &_light {
        background: $white;
        transition: background linear 100ms;
      }
    }
    &__ul {
      align-items: center;
      justify-content: space-between;
      display: flex;
      grid-gap: 10px;
      height: 50px;
      overflow: scroll;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
    &__item {
      font-size: 14px;
      width: 122px;
      padding: 8px;
      box-sizing: border-box;
      white-space: nowrap;
      margin: 7px;
      color: $white;
      border-radius: 6px;
      &_active {
        background: $blue;
        color: $white;
        font-weight: 400;
      }
      &_dark {
        color: $black800;
      }
      &:hover {
        background: $blue;
      }
    }
    &__button-field {
      margin-left: 10px;
    }
    &__search-button {
      width: 86px;
      height: 37px;
      margin-left: 10px;
    }
    &__input {
      width: 443px;
    }
    &__content {
      width: 575px;
    }
     &__search-field {
      height: 53px;
      padding: 0 10px;
     }
  }
  .content {
    grid-template-columns: 1fr;
  }
  .navigation {
    &__desktop {
    display: none;
    }
  &__mobile {
    display: block;
    margin-bottom: 15px;
    z-index: 1;
  }
}
}
@include _575 {
  .wiki {
    &__content {
      width: 480px;
    }
    &__input {
      width: 354px;
    }
  }
}
@include _480 {
  .wiki {
    &__content {
      width: 380px;
    }
    &__input {
      width: 254px;
    }
  }
}
@include _380 {
  .wiki {
    &__content {
      width: 343px;
    }
    &__input {
      width: 229px;
    }
    &__search-field {
      padding: 0 4px 0 4px;
    }
  }
}

.searched {
  z-index: 2;
  background: white;
  border-radius: 6px;
  position: absolute;
  top: 110%;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  width: 100%;
  border-top: 1px solid $black100;
  box-shadow: 0 4px 3px rgba(0, 7, 5, 0.3);

  max-height: 50vh;
  overflow-y: auto;
  overscroll-behavior: contain;

  &__item {
    font-size: 16px;
    line-height: 130%;
    font-weight: normal;
    color: $black800;
    text-decoration: none;
    cursor: pointer;
    padding: 10px;

    &_nav{
      line-height: 130%;
      font-weight: 500;
    }

    &:hover {
      background: $black100;
    }
  }
}
</style>
