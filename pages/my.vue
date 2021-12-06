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
          v-if="questsData.count !== 0 && userRole === 'employer'"
          :limit="questLimits"
          :selected-tab="selectedTab"
          :object="questsData"
        />
        <quests
          v-if="questsList.count !== 0 && userRole === 'worker'"
          :limit="questLimits"
          :selected-tab="selectedTab"
          :object="questResponses.responses"
        />
        <emptyData
          v-if="questsList.count === 0 && questsData.count === 0"
          :description="$t(`errors.emptyData.${userRole}.allQuests.desc`)"
          :btn-text="$t(`errors.emptyData.${userRole}.allQuests.btnText`)"
          link="/create-quest"
        />
        <base-pager
          v-if="questsData.count !== 0 && questsList.count !== 0 && totalPagesValue !== 1"
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
      questResponses: {},
      selectedTab: 0,
      isShowFavourite: false,
      questLimits: 100,
      questsObjects: {},
      page: 1,
      perPager: 11,
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
      questsList: 'quests/getAllQuests',
    }),
    questStatus() {
      return [
        {
          name: this.$t('myQuests.statuses.all'),
          click: () => this.switchQuests('', 0, 0),
        },
        {
          name: this.$t('myQuests.statuses.fav'),
          click: () => this.switchQuests('starred=true', 0, 1),
        },
        {
          name: this.$t('myQuests.statuses.requested'),
          click: () => this.switchQuests('status=5', 0, 2),
        },
        {
          name: this.$t('myQuests.statuses.completed'),
          click: () => this.switchQuests('status=6', 0, 3),
        },
        {
          name: this.$t('myQuests.statuses.active'),
          click: () => this.switchQuests('status=2', 0, 4),
        },
        {
          name: this.$t('myQuests.statuses.invited'),
          click: () => this.switchQuests('status=4', 0, 5),
        },
      ];
    },
    totalPages() {
      return Math.ceil(this.questsData.count / this.perPager);
    },
  },
  watch: {
    async page() {
      this.SetLoader(true);
      if (this.userRole === 'employer') {
        const payload = {
          userId: this.userData.id,
          query: `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}&${this.sortData}`,
        };
        await this.$store.dispatch('quests/getUserQuests', payload);
      } if (this.userRole === 'worker') {
        const payload = `performing=${true}`;
        await this.$store.dispatch('quests/getAllQuests', payload);
      }
      this.totalPagesValue = this.totalPages;
      this.SetLoader(false);
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.getResponsesToQuestForAuthUser();
    await this.$store.dispatch('quests/getAllQuests');
    await this.$store.dispatch('quests/getUserQuests', {
      userId: this.userData.id,
      query: `limit=${this.perPager}`,
    });
    this.totalPagesValue = this.totalPages;
    this.SetLoader(false);
  },
  methods: {
    async getResponsesToQuestForAuthUser() {
      if (this.userRole === 'worker') {
        this.questResponses = await this.$store.dispatch('quests/getResponsesToQuestForAuthUser');
      }
    },
    async switchQuests(query, perPage, id) {
      this.SetLoader(true);
      this.page = 1;
      this.selectedTab = id;
      this.sortData = query;
      if (this.userRole === 'employer') {
        const payload = {
          userId: this.userData.id,
          query: `limit=${this.perPager}&offset=${(this.page - 1) * perPage}&${this.sortData}`,
        };
        await this.$store.dispatch('quests/getUserQuests', payload);
      } if (this.userRole === 'worker') {
        const payload = `performing=${true}`;
        await this.$store.dispatch('quests/getAllQuests', payload);
      }
      this.totalPagesValue = this.totalPages;
      this.SetLoader(false);
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
