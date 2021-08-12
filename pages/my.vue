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
            v-for="(item, i) in questStatus"
            :key="i"
            :mode="btnMode(i)"
            class="quests__btn"
            @click="item.click"
          >
            {{ item.name }}
          </base-btn>
        </div>
        <quests
          v-if="questsData.count !== 0"
          :limit="questLimits"
          :selected-tab="selectedTab"
          :object="questsData"
        />
        <emptyData
          v-else
          :description="$t(`errors.emptyData.${userRole}.allQuests.desc`)"
          :button-text="$t(`errors.emptyData.${userRole}.allQuests.btnText`)"
          :button-link="userRole === 'employer' ? '/create-quest' : ''"
        />
        <base-pager
          v-model="page"
          :total-pages="totalPagesValue"
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
      page: 1,
      perPager: 1,
      totalPagesValue: 1,
      sortData: '',
    };
  },
  computed: {
    ...mapGetters({
      tabs: 'data/getTabs',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      questsData: 'quests/getUserInfoQuests',
    }),
    questStatus() {
      return [
        {
          name: this.$t('myQuests.statuses.all'),
          click: () => this.switchQuests('', 0),
        },
        {
          name: this.$t('myQuests.statuses.fav'),
          click: () => this.switchQuests('starred=true', 1),
        },
        {
          name: this.$t('myQuests.statuses.requested'),
          click: () => this.switchQuests('status=5', 2),
        },
        {
          name: this.$t('myQuests.statuses.completed'),
          click: () => this.switchQuests('status=6', 3),
        },
        {
          name: this.$t('myQuests.statuses.active'),
          click: () => this.switchQuests('status=2', 4),
        },
        {
          name: this.$t('myQuests.statuses.invited'),
          click: () => this.switchQuests('status=4', 5),
        },
      ];
    },
    totalPages() {
      return Math.ceil(this.questsData.count / this.perPager);
    },
  },
  watch: {
    async page() {
      const payload = {
        userId: this.userData.id,
        query: `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`,
      };
      this.SetLoader(true);
      await this.$store.dispatch('quests/getUserQuests', payload);
      this.SetLoader(false);
      this.totalPagesValue = this.totalPages;
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.$store.dispatch('quests/getUserQuests', {
      userId: this.userData.id,
      query: `limit=${this.perPager}`,
    });
    this.totalPagesValue = this.totalPages;
    this.SetLoader(false);
  },
  methods: {
    async switchQuests(query, id) {
      this.selectedTab = id;
      this.sortData = query;
      const payload = {
        userId: this.userData.id,
        query: `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`,
      };
      this.SetLoader(true);
      await this.$store.dispatch('quests/getUserQuests', payload);
      this.SetLoader(false);
      this.totalPagesValue = this.totalPages;
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
