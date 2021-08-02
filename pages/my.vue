<template>
  <div class="main__body">
    <div class="quests">
      <div class="quests__container">
        <div class="quests__body">
          <div
            class="quests__title"
          >
            {{ $t('quests.MyQuests') }}
          </div>
          <div
            class="quests__content"
            :class="{'quests__content_employer': userRole === 'employer'}"
          >
            <base-btn
              v-for="item in tabs"
              :key="item.id"
              :mode="btnMode(item.id)"
              class="quests__btn"
              @click="filterCards(item.id)"
            >
              {{ item.title }}
            </base-btn>
          </div>
          <Quests
            :limit="100"
            :selected-tab="selectedTab"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import { mapGetters } from 'vuex';
import Quests from '~/components/app/Pages/Common/Quests';

const value = new Vue();

export default {
  name: 'My',
  components: {
    Quests,
  },
  data() {
    return {
      selectedTab: 0,
      isShowFavourite: false,
      questLimits: 100,
    };
  },
  computed: {
    ...mapGetters({
      tabs: 'data/getTabs',
      userRole: 'user/getUserRole',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
    const additionalValue = `?limit=${this.questLimits}&offset=0`;
    return this.$store.dispatch('quests/getAllQuests', additionalValue);
  },
  methods: {
    filterCards(id) {
      this.selectedTab = id;
      this.isShowFavourite = id === 1;
    },
    btnMode(id) {
      if (this.selectedTab === id) {
        return ' ';
      }
      return 'light';
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  &__body {
    justify-self: center;
    width: 100%;
    max-width: 1180px;
  }
}
.styles {
  &__full {
    width: 100%;
    height: 100%;
  }
}
.quests {
  width: 100%;
  background-color: #f6f8fa;
  &__container {
    display: flex;
    justify-content: center;
  }
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
    color: $black800;
    margin: 20px 0 20px 0;
  }
  &__body {
    @extend .styles__full;
    max-width: 1180px;
  }
  &__content {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(6, auto);
    grid-gap: 10px;
    margin-bottom: 20px;
    &_employer {
      margin-bottom: 0;
    }
  }
}
</style>
