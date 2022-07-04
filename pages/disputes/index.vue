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
          v-if="disputesCount > 0"
          class="page__dispute-cards"
        >
          <card-dispute
            v-for="(item, i) in disputes"
            :key="i"
            :loading="loading"
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
import CardDispute from '~/components/app/pages/disputes/CardDispute';

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
    loading: false,
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
      this.loading = true;
      this.ScrollToTop();
      this.SetLoader(true);
      await this.$store.dispatch('disputes/getUserDisputes', this.query);
      this.loading = false;
      this.SetLoader(false);
    },
  },
};

</script>

<style lang="scss" scoped>

.main {
  @include main;
&-white {
   @include main-white;
 }
}

.page {
  &__none {
    display: grid;
    width: 100%;
    align-items: center;
    justify-items: center;
  }

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
  .main {
    &__body {
      padding: 20px;
    }
  }
  .page {
    &__dispute-cards {
      grid-template-columns: 1fr;
      grid-gap: 15px;
    }
  }
}

@include _575 {
  .main {
    &__body {
      padding: 0 20px;
    }
  }
  .page {
    &__dispute-cards {
      grid-gap: 15px;
    }
    &__text {
      font-size: 12px;
    }
    &__decision {
      font-size: 12px;
    }
  }
}

</style>
