<template>
  <div class="wiki">
    <div
      class="wiki__header"
      :class="{'wiki__header_cut': isMoved, 'wiki__header_hidden': isScrolledDown}"
    >
      <div class="wiki__content">
        <h3
          v-if="!isMoved"
          class="wiki__title"
        >
          {{ $t('wiki.title') }}
        </h3>
        <div class="wiki__fields">
          <div class="wiki__search-field">
            <base-field
              v-model="search"
              class="wiki__input"
              :is-search="true"
              :is-hide-error="true"
              :placeholder="$t('wiki.searchPlaceholder')"
            />
            <div class="wiki__button-field">
              <base-btn
                class="wiki__search-button"
                :text="$t('wiki.search')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <main
      class="content wiki__content"
      @touchend="onTouchEnd"
      @touchstart="onTouchstart"
    >
      <nav
        class="wiki__navigation"
        :class="{'wiki__navigation_cut': isMoved, 'wiki__navigation_hidden': isScrolledDown}"
      >
        <ul
          ref="nav"
          class="wiki__ul"
          @touchstart="onTouchstart"
          @touchmove="(e) => moveItems(e, 'nav')"
        >
          <li
            v-for="(item, key) in navigation"
            :key="key"
            class="wiki__item"
            :class="{'wiki__item_dark': isMoved && item !== currentTab, 'wiki__item_active': item === currentTab}"
            @click="selectTab(item)"
          >
            {{ $t(`wiki.navigation.${item}.title`) }}
          </li>
        </ul>
      </nav>
      <Content
        :current-tab="currentTab"
      />
    </main>
  </div>
</template>

<script>
import Content from '~/components/wiki/content.vue';

export default {
  name: 'Wiki',
  components: {
    Content,
  },
  data() {
    return {
      currentTab: 'header',
      search: '',
      pageX: 0,
      isMoved: false,
      isScrolledDown: false,
    };
  },
  computed: {
    navigation() {
      return Object.keys(this.$t('wiki.navigation'));
    },
  },
  mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    selectTab(item) {
      this.currentTab = item;
    },
    moveItems(event, payload) {
      event.preventDefault();
      const x = event.changedTouches[0].pageX;
      const delta = this.pageX - x;
      this.$refs[payload].scrollLeft += delta;
      this.pageX = x;
    },
    onTouchstart(event) {
      this.isMoved = true;
      this.pageX = event.changedTouches[0].pageX;
    },
    onTouchEnd(event) {
      if (event.changedTouches[0].pageX > this.pageX) {
        this.isScrolledDown = true;
      } else {
        this.isScrolledDown = false;
      }
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
  &__input {
    width: 900px;
  }
  &__button-field {
    height: 100%;
    display: flex;
    align-items: center;
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
@include _1199 {
  .wiki {
    &__content {
    width: 950px;
    }
    &__input {
    width: 665px;
    }
  }
}
@include _991 {
  .wiki {
    &__content {
      width: 750px;
    }
    &__input {
      width: 470px;
    }
  }
}
@include _767 {
  .wiki {
    position: relative;
    &__title {
      font-weight: 28px;
    }
    &__header {
      height: 230px;
      margin-bottom: 60px;
      &_cut {
        position: fixed;
        height: 53px;
        width: 100%;
        background: $white;
        transition: all ease 100ms;
      }
      &_hidden {
        display: none;
        transition: all ease 100ms;
      }
    }
    &__navigation {
      position: absolute;
      background: $darkblue;
      top: 230px;
      border-radius: 0;
      left: 0;
      width: 100vw;
      height: 50px;
      &_cut {
        position: fixed;
        top: 125px;
        background: $black0;
        transition: all ease 100ms;
      }
      &_hidden {
        top: 70px;
      }
    }
    &__ul {
      align-items: center;
      justify-content: space-between;
      display: flex;
      grid-gap: 5px;
      height: 50px;
      overflow: hidden;
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
  .opened {
  display: block;
  }
}
@include _575 {
  .wiki {
    &__content {
      width: 480px;
    }
    &__input {
      width: 362px;
    }
  }
}
@include _480 {
  .wiki {
    &__content {
      width: 380px;
    }
    &__input {
      width: 262px;
    }
  }
}
@include _380 {
  .wiki {
    &__content {
      width: 343px;
    }
    &__input {
      width: 235px;
    }
    &__search-field {
      padding: 0 10px 0 0;
    }
  }
}
</style>
