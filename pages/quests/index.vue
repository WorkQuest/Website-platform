<template>
  <div class="quests">
    <search-with-map
      class="quests__search"
      @isShowMap="isShowMap = $event"
      @search="search = $event"
    />
    <div class="quests__content">
      <h2 class="quests__title">
        {{ $t('ui.quests') }}
      </h2>
      <filters-panel
        class="quests__filters"
        @sortSpec="sortBySpec"
        @sortTime="sortByTime"
        @sortPrice="sortByPrice"
        @sortPriority="sortByPriority"
        @sortWorkplace="sortByWorkplace"
        @sortTypeOfJob="sortTypeOfJob"
      />
      <div
        v-if="questsCount"
        class="quests__cards"
      >
        <quest-card
          v-for="(quest,id) in questsList"
          :key="id"
          :quest="quest"
        />
      </div>
      <empty-data
        v-else
        :description="$t('errors.emptyData.emptyQuests')"
      />
      <base-pager
        v-if="totalPages > 1"
        v-model="page"
        class="quests__pager"
        :total-pages="totalPages"
        @input="setPage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Quests',
  data() {
    return {
      page: 1,
      search: '',
      query: {
        limit: 5,
        offset: 0,
        'sort[createdAt]': 'desc',
      },
      specFilter: {},
      isShowMap: true,
      isFetching: false,
      boundsTimeout: null,
      searchTimeout: null,
    };
  },
  computed: {
    ...mapGetters({
      mapBounds: 'quests/getMapBounds',
      questsList: 'quests/getAllQuests',
      questsCount: 'quests/getAllQuestsCount',
    }),
    totalPages() { return Math.ceil(this.questsCount / this.query.limit); },
  },
  watch: {
    async isShowMap() { await this.fetchQuestsList(true); },
    async mapBounds(newV, oldV) {
      if (!this.isShowMap) return;
      if (
        newV?.center?.lng === oldV?.center?.lng
        && newV?.center?.lat === oldV?.center?.lat
        && newV?.northEast?.lng === oldV?.northEast?.lng
        && newV?.northEast?.lat === oldV?.northEast?.lat
        && newV?.southWest?.lng === oldV?.southWest?.lng
        && newV?.southWest?.lat === oldV?.southWest?.lat
      ) return;
      clearTimeout(this.boundsTimeout);
      this.boundsTimeout = setTimeout(async () => await this.fetchQuestsList(true), 500);
    },
    async search() {
      if (!this.isShowMap) {
        this.query.q = this.search;
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(async () => await this.fetchEmployeeList(true), 300);
      } else delete this.query.q;
    },
  },
  async mounted() {
    this.SetLoader(true);
    const isShow = JSON.parse(localStorage.getItem('isShowMap'));
    if (typeof isShow === 'boolean') this.isShowMap = isShow;
    await this.fetchQuestsList();
    this.SetLoader(false);
  },
  beforeDestroy() {
    clearTimeout(this.boundsTimeout);
    clearTimeout(this.searchTimeout);
    this.$store.commit('quests/setAllQuests', { count: null, quests: [] });
  },
  methods: {
    async setPage(newPage) {
      this.page = newPage;
      await this.fetchQuestsList();
    },
    async fetchQuestsList(isResetPage = false) {
      if (this.isFetching) return;
      this.isFetching = true;

      if (this.isShowMap) {
        if (!Object.keys(this.mapBounds).length) {
          this.isFetching = false;
          return;
        }
        this.query['northAndSouthCoordinates[north][longitude]'] = this.mapBounds.northEast.lng;
        this.query['northAndSouthCoordinates[north][latitude]'] = this.mapBounds.northEast.lat;
        this.query['northAndSouthCoordinates[south][longitude]'] = this.mapBounds.southWest.lng;
        this.query['northAndSouthCoordinates[south][latitude]'] = this.mapBounds.southWest.lat;
      } else {
        delete this.query['northAndSouthCoordinates[north][longitude]'];
        delete this.query['northAndSouthCoordinates[north][latitude]'];
        delete this.query['northAndSouthCoordinates[south][longitude]'];
        delete this.query['northAndSouthCoordinates[south][latitude]'];
      }
      if (isResetPage) this.page = 1;
      const { query: { limit }, page } = this;
      this.query.offset = (page - 1) * limit;
      await this.$store.dispatch('quests/getAllQuests', {
        query: this.query,
        specFilter: this.specFilter,
      });

      this.isFetching = false;
    },
    async sortBySpec(value) {
      this.specFilter = value;
      await this.fetchQuestsList(true);
    },
    async sortByTime(value) {
      this.query['sort[createdAt]'] = value;
      await this.fetchQuestsList();
    },
    async sortByPrice(value) {
      if (!Object.keys(value).length) {
        delete this.query['betweenWagePerHour[from]'];
        delete this.query['betweenWagePerHour[to]'];
      } else this.query = { ...this.query, ...value };
      await this.fetchQuestsList(true);
    },
    async sortByPriority(value) {
      if (!Object.keys(value).length) delete this.query['priorities[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchQuestsList(true);
    },
    async sortByWorkplace(value) {
      if (!Object.keys(value).length) delete this.query['workplaces[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchQuestsList(true);
    },
    async sortTypeOfJob(value) {
      if (!Object.keys(value).length) delete this.query['employments[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchQuestsList(true);
    },
    showDetails(quest) {
      this.$router.push(`/quests/${quest.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>

.quests {
  @include text-simple;

  &__content {
    width: 100%;
    height: 100%;
    max-width: 1180px;
    margin: 0 auto;
  }

  &__title {
    margin-top: 30px;
    font-size: 25px;
    font-weight: 500;
    line-height: 32px;
  }

  &__filters {
    margin-top: 25px;
  }

  &__cards {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    margin-top: 20px;
  }

  &__pager {
    margin-top: 20px;
  }
}

@include _1199 {
  .quests__content {
    padding: 0 20px;
  }
}

@include _575 {
  .quests {

    &__content {
      padding: 0 10px;
    }

    &__cards {
      grid-gap: 10px;
    }
  }
}
</style>
