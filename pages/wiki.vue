<template>
  <div class="wiki">
    <div class="wiki__header">
      <div class="wiki__container">
        <h3 class="wiki__title">
          {{ $t('wiki.title') }}
        </h3>
        <div class="wiki__search-field">
          <BaseInput
            class="wiki__input"
            :is-search="true"
            :placeholder="$t('wiki.searchPlaceholder')"
          />
          <BaseButton
            class="wiki__search-button"
            :text="$t('wiki.search')"
          />
        </div>
      </div>
    </div>
    <main class="wiki__container content">
      <nav class="wiki__navigation">
        <ul
          v-for="(item, index) in navigation"
          :key="index"
          class="wiki__ul"
          @click="selectTab(item)"
        >
          <li class="wiki__item">
            {{ $t(`wiki.navigation.${item.name}`) }}
          </li>
        </ul>
      </nav>
      <Header
        v-if="currentTab !== ''"
        :current-tab="currentTab"
      />
      <Header />
    </main>
  </div>
</template>

<script>
import Header from '~/components/wiki/header.vue';

export default {
  name: 'Wiki',
  components: {
    Header,
  },
  data() {
    return {
      currentTab: '',
      navigation: [
        {
          name: 'header',
          subtitle: 'There are two types of header: for employer and for employee.',
          cards: {
            0: {
              title: 'Header for employer',
              image: '~/assets/img/wiki/header1.svg',
            },
            1: {
              title: '',
              subtitle: '',
              image: '',
            },
          },
        },
        'profile',
        'instruments',
        'statuses',
        'buttons',
        'employee',
        'employer',
        'user',
        'quest'],
    };
  },
  methods: {
    selectTab(item) {
      this.currentTab = item;
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
  &__container {
    width: 1180px;
    margin: 0 auto;
  }
  &__title {
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 34px;
    font-family: 'Inter', sans-serif;
    line-height: 130%;
    color:  $white;
  }
  &__search-field {
    background: $white;
    height: 83px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  &__input {
    align-self: flex-end;
    width: 850px;
  }
  &__search-button {
    width: 220px;
  }
  &__navigation {
    width: 280px;
    background: $white;
  }
  &__item {
    list-style-type: none;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    line-height: 130%;
    padding: 15px;
    cursor: pointer;
  }
}
.content {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>
