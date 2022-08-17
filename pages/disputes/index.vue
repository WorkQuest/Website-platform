<template>
  <div
    class="main"
    data-selector="PAGE-DISPUTES"
  >
    <div class="main__body">
      <div class="page">
        <h2 class="page__title">
          {{ $t('meta.disputes') }}
        </h2>
        <div
          v-if="disputesCount > 0 || isFetching"
          class="page__dispute-cards"
        >
          <card-dispute
            v-for="i in 10"
            v-show="isFetching"
            :key="'skeleton' + i"
            is-skeleton
          />
          <card-dispute
            v-for="(item, i) in disputes"
            v-show="!isFetching"
            :key="i"
            :dispute="item"
            :data-selector="`TO-DISPUTES-ROUTE-${i}`"
          />
        </div>
        <emptyData
          v-else
          :description="$tc(`errors.emptyData.emptyDisputes`)"
        />
        <base-pager
          v-if="totalPages > 1"
          v-model="currentPage"
          :total-pages="totalPages"
          class="page__pager"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import emptyData from '~/components/app/info/emptyData';
import { DisputeStatues } from '~/utils/enums';
import CardDispute from '~/components/app/CardDispute';

const LIMIT = 10;

export default {
  name: 'Disputes',
  components: {
    CardDispute,
    emptyData,
  },
  DisputeStatues,
  data: () => ({
    currentPage: 1,
    query: {
      limit: LIMIT,
      offset: 0,
    },
    isFetching: true,
  }),
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      disputes: 'disputes/getUserDisputes',
      disputesCount: 'disputes/getUserDisputesCount',
    }),

    totalPages() {
      return Math.ceil(this.disputesCount / this.query.limit);
    },
  },
  watch: {
    async currentPage() {
      this.query.offset = (this.currentPage - 1) * LIMIT;
      await this.getUserDisputes();
    },
  },
  async mounted() {
    await this.getUserDisputes();
  },
  methods: {
    async getUserDisputes() {
      this.isFetching = true;
      this.ScrollToTop();
      await this.$store.dispatch('disputes/getUserDisputes', this.query);
      this.isFetching = false;
    },
  },
};

</script>

<style lang="scss" scoped>

.main {
  @include main;
}

.page {
  &__title {
    @include text-simple;
    margin: 20px 0;
    font-size: 25px;
    color: $black800;
    text-align: left;
    word-break: break-word;
  }

  &__dispute-cards {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: auto;
    grid-gap: 15px;
  }

  .pager {
    margin-top: 20px;
  }
}

@include _1199 {
  .page {
    &__dispute-cards {
      grid-template-columns: 1fr;
      grid-gap: 15px;
    }
  }
}

@include _575 {
  .page {
    &__dispute-cards {
      grid-gap: 15px;
    }
  }
}

</style>
