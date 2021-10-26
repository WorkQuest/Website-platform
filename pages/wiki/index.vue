<template>
  <div class="wiki">
    <div
      ref="header"
      class="wiki__header"
    >
      <div
        class="wiki__content"
      >
        <h3
          class="wiki__title"
        >
          {{ $t('wiki.title') }}
        </h3>
        <div
          class="wiki__fields"
        >
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
    <div class="main-wrapper">
      <nav
        class="wiki__navigation navigation__mobile"
        :class="{'wiki__navigation_light': isMoving}"
      >
        <ul
          class="wiki__ul"
        >
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
      <main
        class="content wiki__content"
        @touchend="onTouchEnd"
        @touchstart="onTouchstart"
      >
        <nav
          class="wiki__navigation navigation__desktop"
        >
          <ul
            class="wiki__ul"
          >
            <li
              v-for="(item, key) in navigation"
              :key="key"
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
      isMoving: false,
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
      this.isMoving = this.$refs.header.getBoundingClientRect().y < -150;
      this.pageX = event.changedTouches[0].pageX;
      console.log(this.$refs.header.getBoundingClientRect().y);
    },
    onTouchEnd(event) {
      this.isMoving = this.$refs.header.getBoundingClientRect().y < -150;
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
.navigation {
  &__desktop {
    display: flex;
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
      &_light {
        background: $white;
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
  .navigation {
    &__desktop {
    display: none;
  }
  &__mobile {
    display: flex;
  }
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
       &_cut {
        margin: 0;
        width: 100%;
      }
    }
    &__fields {
      &_cut {
        margin: 0;
        display: block;
        width: 100%;
      }
    }
    &__input {
      width: 235px;
       &_cut {
        width: 365px;
      }
    }
    &__search-field {
      padding: 0 10px 0 0;
    }
  }
}
</style>
