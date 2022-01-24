<template>
  <div class="employees">
    <search-with-map
      class="employees__search"
      @isShowMap="isShowMap = $event"
    />
    <div class="employees__content">
      <h2 class="employees__title">
        {{ $t('workers.topWorkers') }}
      </h2>
      <filters-panel
        class="employees__filters"
        @sortSpec="sortBySpec"
        @sortTime="sortByTime"
        @sortPrice="sortByPrice"
        @sortRating="sortByRating"
        @sortPriority="sortByPriority"
        @sortWorkplace="sortByWorkplace"
      />
      <div
        v-if="employeeCount"
        class="employees__cards"
      >
        <employee-card
          v-for="(user,id) in employeeList"
          :key="id"
          :user="user"
          @click="showDetails(user)"
        />
      </div>
      <empty-data
        v-else
        :description="$t('errors.emptyData.noEmployees')"
      />
      <base-pager
        v-if="totalPages > 1"
        v-model="page"
        class="employees__pager"
        :total-pages="totalPages"
        @input="setPage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Employees',
  data() {
    return {
      page: 1,
      query: {
        limit: 12,
        offset: 0,
        'sort[createdAt]': 'desc',
      },
      specFilter: {},
      isShowMap: true,
      isFetching: false,
      boundsTimeout: null,
    };
  },
  computed: {
    ...mapGetters({
      mapBounds: 'quests/getMapBounds',
      employeeList: 'quests/getEmployeeList',
      employeeCount: 'quests/getEmployeeCount',
    }),
    totalPages() { return Math.ceil(this.employeeCount / this.query.limit); },
  },
  watch: {
    async isShowMap() { await this.fetchEmployeeList(true); },
    async mapBounds(newV, oldV) {
      if (!this.isShowMap || !Object.keys(oldV).length) return;
      if (
        newV?.center?.lng === oldV?.center?.lng
        && newV?.center?.lat === oldV?.center?.lat
        && newV?.northEast?.lng === oldV?.northEast?.lng
        && newV?.northEast?.lat === oldV?.northEast?.lat
        && newV?.southWest?.lng === oldV?.southWest?.lng
        && newV?.southWest?.lat === oldV?.southWest?.lat
      ) return;
      clearTimeout(this.boundsTimeout);
      this.boundsTimeout = setTimeout(async () => await this.fetchEmployeeList(true), 500);
    },
  },
  async mounted() {
    this.SetLoader(true);
    const isShow = JSON.parse(localStorage.getItem('isShowMap'));
    if (typeof isShow === 'boolean') this.isShowMap = isShow;
    await this.fetchEmployeeList();
    this.SetLoader(false);
  },
  beforeDestroy() {
    clearTimeout(this.boundsTimeout);
    this.$store.commit('quests/setEmployeeList', { count: null, users: [] });
  },
  methods: {
    async setPage(newPage) {
      this.page = newPage;
      await this.fetchEmployeeList();
    },
    async fetchEmployeeList(isResetPage = false) {
      if (this.isFetching) return;
      this.isFetching = true;

      if (this.isShowMap && Object.keys(this.mapBounds).length) {
        this.query['north[longitude]'] = this.mapBounds.northEast.lng;
        this.query['north[latitude]'] = this.mapBounds.northEast.lat;
        this.query['south[longitude]'] = this.mapBounds.southWest.lng;
        this.query['south[latitude]'] = this.mapBounds.southWest.lat;
      } else {
        delete this.query['north[longitude]'];
        delete this.query['north[latitude]'];
        delete this.query['south[longitude]'];
        delete this.query['south[latitude]'];
      }

      if (isResetPage) this.page = 1;
      const { query: { limit }, page } = this;
      this.query.offset = (page - 1) * limit;

      await this.$store.dispatch('quests/employeeList', {
        query: this.query,
        specFilter: this.specFilter,
      });

      this.isFetching = false;
    },
    async sortBySpec(value) {
      this.specFilter = value;
      await this.fetchEmployeeList(true);
    },
    async sortByTime(value) {
      this.query['sort[createdAt]'] = value;
      await this.fetchEmployeeList();
    },
    async sortByPrice(value) {
      if (!Object.keys(value).length) {
        delete this.query['betweenWagePerHour[from]'];
        delete this.query['betweenWagePerHour[to]'];
      } else this.query = { ...this.query, ...value };
      await this.fetchEmployeeList(true);
    },
    async sortByRating(value) {
      if (!Object.keys(value).length) delete this.query['ratingStatus[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchEmployeeList(true);
    },
    async sortByPriority(value) {
      if (!Object.keys(value).length) delete this.query['priority[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchEmployeeList(true);
    },
    async sortByWorkplace(value) {
      if (!Object.keys(value).length) delete this.query['workplace[0]'];
      else this.query = { ...this.query, ...value };
      await this.fetchEmployeeList(true);
    },
    showDetails(worker) {
      this.$store.dispatch('quests/setCurrentWorker', worker);
      this.$router.push(`/profile/${worker.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>

.employees {
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
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 360px;
    grid-gap: 20px;
    margin-top: 20px;
  }

  &__pager {
    margin-top: 20px;
  }
}

@include _1199 {
  .employees {

    &__content {
      padding: 0 20px;
    }
    &__cards {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

@include _991 {
  .employees__cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include _575 {
  .employees {

    &__content {
      padding: 0 10px;
    }

    &__cards {
      grid-template-columns: 1fr;
      grid-gap: 10px;
    }
  }
}
</style>
