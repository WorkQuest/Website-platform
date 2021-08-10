<template>
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
        <quests
          v-if="questsObjects.count !== 0"
          :limit="questLimits"
          :selected-tab="selectedTab"
          :object="questsObjects"
        />
        <emptyData
          v-else
          :description="$t(`errors.emptyData.${userRole}.allQuests.desc`)"
          :button-text="$t(`errors.emptyData.${userRole}.allQuests.btnText`)"
          :button-link="userRole === 'employer' ? '/create-quest' : ''"
        />
      </div>
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import { mapGetters } from 'vuex';
import quests from '~/components/app/pages/common/quests';
import emptyData from '~/components/app/info/emptyData';

const value = new Vue();

export default {
  name: 'My',
  components: {
    quests,
    emptyData,
  },
  data() {
    return {
      selectedTab: 0,
      isShowFavourite: false,
      questLimits: 100,
      questsObjects: {},
    };
  },
  computed: {
    ...mapGetters({
      tabs: 'data/getTabs',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.questsObjects = await this.$store.dispatch('quests/getUserQuests', this.userData.id);
    this.SetLoader(false);
  },
  methods: {
    filterCards(id) {
      this.selectedTab = id;
      this.isShowFavourite = id === 1;
    },
    btnMode(id) {
      if (this.selectedTab === id) {
        return '';
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
