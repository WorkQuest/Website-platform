<template>
  <div
    class="auction"
    data-selector="PAGE-AUCTION"
  >
    <div class="auction__content">
      <h2 class="auction__title">
        {{ $t('auction.title') }}
      </h2>
      <div class="auction__topbar">
        <div class="auction__topbar-switcher">
          <base-btn
            data-selector="ACTION-AUCTION-SELECT-INACTIVE"
            :mode="currentTab === $options.LotsStatuses.INACTIVE ? 'activeTab' : 'light'"
            :padding="true"
            @click="currentTab = $options.LotsStatuses.INACTIVE"
          >
            {{ $t('auction.tabs.inactive') }}
          </base-btn>
          <base-btn
            data-selector="ACTION-AUCTION-SELECT-CURRENT"
            :mode="currentTab === $options.LotsStatuses.STARTED ? 'activeTab' : 'light'"
            :padding="true"
            @click="currentTab = $options.LotsStatuses.STARTED"
          >
            {{ $t('auction.tabs.current') }}
          </base-btn>
          <base-btn
            data-selector="ACTION-AUCTION-SELECT-COMPLETED"
            :mode="currentTab === $options.LotsStatuses.BOUGHT ? 'activeTab' : 'light'"
            :padding="true"
            @click="currentTab = $options.LotsStatuses.BOUGHT"
          >
            {{ $t('auction.tabs.completed') }}
          </base-btn>
        </div>
        <div class="auction__topbar-sort">
          <base-btn
            class="auction__topbar-sort-button"
            mode="light"
            selector="AUCTION-TIME-SORT"
            @click="changeTimeSorting"
          >
            <span class="item-btn__text">
              {{ $t('auction.time') }}
            </span>
            <span :class="`item-btn__icon icon icon-Sorting_${sort === 'desc' ? 'descending' : 'ascending'}`" />
          </base-btn>
        </div>
      </div>
      <div
        v-if="lotsCount"
        class="auction__list"
        :class="[
          {'auction__list_completed': $options.LotsStatuses.BOUGHT === currentTab},
          {'auction__list_current': [$options.LotsStatuses.STARTED, $options.LotsStatuses.INACTIVE].includes(currentTab)},
        ]"
      >
        <auction-card
          v-for="(lot,i) in lots"
          :key="lot.id + i"
          :lot="lot"
          :type-of-lot="currentTab"
        />
      </div>
      <empty-data
        v-else
        :description="$tc('errors.emptyData.emptyCollaterals')"
      />
      <div class="auction__pager-block">
        <base-pager
          v-if="totalPages > 1"
          v-model="currentPage"
          class="auction__pager"
          :total-pages="totalPages"
          @input="setPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AuctionCard from '~/components/app/pages/auction/AuctionCard';
import { Layout } from '~/utils/enums';
import { IS_PLUG_PROD } from '~/utils/locker-data';
import { AUCTION_CARDS_LIMIT, LotsStatuses } from '~/utils/сonstants/auction';

export default {
  name: 'Auction',
  LotsStatuses,
  layout({ app }) {
    // TODO PLUG for release
    if (IS_PLUG_PROD) return Layout.DEFAULT;
    return app.$cookies.get('access') ? Layout.DEFAULT : Layout.GUEST;
  },
  components: {
    AuctionCard,
  },
  data() {
    return {
      currentTab: LotsStatuses.INACTIVE,

      params: {
        limit: AUCTION_CARDS_LIMIT,
        offset: 0,
      },
      sort: 'desc',
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters({
      isAuth: 'user/isAuth',
      userData: 'user/getUserData',
      walletAddress: 'user/getUserWalletAddress',

      lots: 'auction/getLots',
      lotsCount: 'auction/getLotsCount',

      isWalletConnected: 'wallet/getIsWalletConnected',
    }),
    totalPages() {
      return Math.ceil(this.lotsCount / AUCTION_CARDS_LIMIT) || 0;
    },
  },
  watch: {
    async currentTab() {
      this.currentPage = 1;
      this.sort = 'desc';
      await this.clearLots();
      await this.setPage(this.currentPage);
    },
  },
  async beforeMount() {
    if (!this.isWalletConnected) {
      await this.$store.dispatch('wallet/checkWalletConnected', {
        nuxt: this.$nuxt,
        needConfirm: this.isAuth,
      });
    }
  },
  async mounted() {
    await this.setPage(this.currentPage);
    await this.fetchDuration();
    if (!this.isWalletConnected) return;
    await this.getBalance();
  },
  methods: {
    ...mapActions({
      getBalance: 'wallet/getBalance',

      fetchLots: 'auction/fetchLots',
      clearLots: 'auction/clearLots',
      fetchDuration: 'auction/fetchAuctionsDuration',
    }),
    async changeTimeSorting() {
      this.sort = this.sort === 'asc' ? 'desc' : 'asc';
      await this.setPage(this.currentPage);
    },
    async setPage(value) {
      this.currentPage = value;
      this.params.offset = AUCTION_CARDS_LIMIT * (value - 1);
      await this.fetchLots({ lotStatus: this.currentTab, params: this.params, sort: this.sort });
    },
  },
};
</script>

<style lang="scss" scoped>
.auction {
  padding: 0 15px;

  &__content {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
  }

  &__title {
    margin-top: 30px;
    margin-bottom: 44px;

    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
  }

  &__topbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 37px;
    &-switcher {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 10px;
      & > button {
        min-width: 175px;
      }
    }
    &-sort {
      &-button {
        min-width: 180px;
        display: grid;
        grid-gap: 5px;
        grid-template-columns:  100px 20px;
      }
    }
  }

  &__list {
    display: grid;
    grid-gap: 15px;
    &_current {
      grid-template-columns: repeat(3, 1fr);
    }
    &_completed {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__pager {
    margin-top: 35px;
  }
}
.icon {
  color: $black800;
  font-size: 24px;
}
@include _1099 {
  .auction {
    &__list {
      &_current {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
@include _767 {
  .auction {
    &__title {
      margin-top: 30px;
      margin-bottom: 20px;
    }
    &__list_completed {
      grid-template-columns: repeat(1, 1fr);
    }
    &__topbar {
      display: grid;
      grid-template-rows: repeat(2, auto);
      grid-gap: 10px;
      justify-content: normal;

      &-sort {
        &-button {
          width: 180px;
          min-width: 130px;
          display: grid;
          grid-gap: 0;
          grid-template-columns: 93px 20px;
          margin: 0 auto;
        }
      }
    }
    &__pager {
      &-block {
        display: flex;
        justify-content: center;
      }
    }
  }
}

@include _575 {
  .auction{
    &__topbar-switcher {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(2, 1fr);
      grid-gap: 10px;
      justify-content: normal;
    }

    &__topbar-sort > button {
      width: 100%;
      margin: 0;
    }

    &__list_current {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
