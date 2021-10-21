<template>
  <div class="wiki">
    <div class="wiki__header">
      <div class="wiki__content">
        <h3 class="wiki__title">
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
          <base-btn
            class="wiki__header-button"
            @click="handleClick"
          >
            <img
              v-if="!isOpened"
              src="../../assets/img/wiki/up.svg"
              alt="menu"
            >
            <img
              v-if="isOpened"
              src="../../assets/img/wiki/down.svg"
              alt="close menu"
            >
          </base-btn>
        </div>
      </div>
    </div>
    <main class="content wiki__content">
      <nav
        class="wiki__navigation"
        :class="{opened: isOpened}"
      >
        <ul
          v-for="(item, key) in navigation"
          :key="key"
          class="wiki__ul"
          @click="selectTab(item)"
        >
          <li
            class="wiki__item"
            :class="{'wiki__item_bold': item === currentTab}"
            @click="handleClick"
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
      isOpened: false,
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
    handleClick() {
      if (this.isOpened) {
        this.isOpened = false;
      } else {
        this.isOpened = true;
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
    &_bold {
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
    &__title {
      font-weight: 28px;
    }
    &__header {
      height: 230px;
      margin-bottom: 10px;
    }
    &__navigation {
      display: none;
      position: absolute;
      top: -10px;
      width: 575px;
    }
    &__header-button {
      display: flex;
    }
    &__search-button {
      max-width: 100px;
      margin-left: 10px;
    }
     &__input {
      width: 365px;
    }
     &__content {
      width: 575px;
    }
     &__search-field {
      height: 63px;
      padding: 0 10px;
     }
  }
  .content {
    grid-template-columns: 1fr;
    position: relative;
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
      width: 273px;
    }
    &__navigation {
      width: 480px;
    }
  }
}
@include _480 {
  .wiki {
    &__content {
      width: 380px;
    }
    &__input {
      width: 195px;
    }
    &__navigation {
      width: 380px;
    }
  }
}
@include _380 {
  .wiki {
    &__content {
      width: 343px;
    }
    &__input {
      width: 168px;
    }
    &__search-field {
      padding: 0 10px 0 0;
    }
    &__navigation {
      width: 343px;
    }
  }
}
</style>
