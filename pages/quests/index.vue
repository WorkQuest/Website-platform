<template>
  <div
    class="quests"
    data-selector="PAGE-QUESTS"
  >
    <search-with-map
      class="quests__search"
      @isShowMap="isShowMap = $event"
      @search="search = $event"
    />
    <div class="quests__content">
      <h2 class="quests__title">
        {{ $t('meta.questsBig') }}
      </h2>
      <panel-filters
        class="quests__filters"
        @sortSpec="sortBySpec"
        @sortTime="sortByTime"
        @sortPrice="sortByPrice"
        @sortPriority="sortByPriority"
        @sortWorkplace="sortByWorkplace"
        @sortTypeOfJob="sortTypeOfJob"
        @sortPayPeriod="sortPayPeriod"
      />
      <div
        v-if="questsCount"
        class="quests__cards"
      >
        <card-quest
          v-for="(quest,i) in questsList"
          :key="i"
          :data-selector="`QUEST-CARD-${i}`"
          :quest-index="i"
          :quest="quest"
          @clickFavoriteStar="updateQuests(quest)"
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
import { Path } from '~/utils/enums';

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
        'statuses[0]': 1,
      },
      specFilter: {},
      isShowMap: true,
      isFetching: false,
      searchTimeout: null,
    };
  },
  computed: {
    ...mapGetters({
      mapBounds: 'google-map/getBounds',
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
        newV?.northEast?.lng === oldV?.northEast?.lng
        && newV?.northEast?.lat === oldV?.northEast?.lat
        && newV?.southWest?.lng === oldV?.southWest?.lng
        && newV?.southWest?.lat === oldV?.southWest?.lat
      ) return;
      await this.fetchQuestsList(true);
    },
    async search() {
      if (!this.isShowMap) {
        this.query.q = this.search;
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(async () => await this.fetchQuestsList(true), 300);
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
  async beforeDestroy() {
    clearTimeout(this.searchTimeout);
    await this.$store.dispatch('google-map/resetMap');
    this.$store.commit('quests/setAllQuests', { count: null, quests: [] });
  },
  methods: {
    async updateQuests(item) {
      this.SetLoader(true);
      if (!item?.star && item?.id) await this.$store.dispatch('quests/setStarOnQuest', item.id);
      else await this.$store.dispatch('quests/takeAwayStarOnQuest', item.id);

      await this.fetchQuestsList();
      this.SetLoader(false);
    },
    async setPage(newPage) {
      this.page = newPage;
      this.ScrollToTop();
      await this.fetchQuestsList();
    },
    async fetchQuestsList(isResetPage = false) {
      if (this.isFetching) return;
      this.isFetching = true;

      if (isResetPage) this.page = 1;
      const { query: { limit }, page } = this;
      this.query.offset = (page - 1) * limit;

      if (this.isShowMap) {
        if (!this.mapBounds.northEast.lng) {
          this.isFetching = false;
          return;
        }
        this.query['northAndSouthCoordinates[north][longitude]'] = this.mapBounds.northEast.lng;
        this.query['northAndSouthCoordinates[north][latitude]'] = this.mapBounds.northEast.lat;
        this.query['northAndSouthCoordinates[south][longitude]'] = this.mapBounds.southWest.lng;
        this.query['northAndSouthCoordinates[south][latitude]'] = this.mapBounds.southWest.lat;

        await Promise.all([
          this.$store.dispatch('google-map/questsPoints', {
            query: { ...this.query },
            specFilter: this.specFilter,
          }),
          this.$store.dispatch('quests/getAllQuests', {
            query: this.query,
            specFilter: this.specFilter,
          }),
        ]);
      } else {
        delete this.query['northAndSouthCoordinates[north][longitude]'];
        delete this.query['northAndSouthCoordinates[north][latitude]'];
        delete this.query['northAndSouthCoordinates[south][longitude]'];
        delete this.query['northAndSouthCoordinates[south][latitude]'];

        await this.$store.dispatch('quests/getAllQuests', {
          query: this.query,
          specFilter: this.specFilter,
        });
      }

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
      if (!Object.keys(value).length) delete this.query['typeOfEmployments[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchQuestsList(true);
    },
    async sortPayPeriod(value) {
      if (!Object.keys(value).length) delete this.query['payPeriods[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchQuestsList(true);
    },

    showDetails(quest) {
      this.$router.push(`${Path.QUESTS}/${quest.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>

.quests {
  @include text-simple;

  &__content {
    width: 100%;
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
