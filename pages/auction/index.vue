<template>
  <div
    class="auction"
    data-selector="PAGE-AUCTION"
  >
    <div class="search">
      <div class="search__block">
        <base-field
          v-model="searchValue"
          class="search__block-item"
          is-search
          is-hide-error
          :placeholder="searchPlaceholder"
          data-selector="INPUT-SEARCH"
          @input="goSearchDebounce"
          @enter="goSearch"
        />
        <div class="search__block-item">
          <base-btn
            data-selector="ACTION-AUCTION-SEARCH"
            @click="goSearch"
          >
            {{ $t('auction.search.button') }}
          </base-btn>
        </div>
      </div>
    </div>
    <div class="auction__content">
      <h2 class="auction__title">
        {{ $t('auction.title') }}
      </h2>
      <div class="auction__topbar">
        <div class="auction__topbar-switcher">
          <base-btn
            data-selector="ACTION-AUCTION-SELECT-CURRENT"
            :mode="currentTab === 'current' ? 'activeTab' : 'light'"
            :padding="true"
            @click="currentTab = 'current'"
          >
            {{ $t('auction.tabs.current') }}
          </base-btn>
          <base-btn
            data-selector="ACTION-AUCTION-SELECT-COMPLETED"
            :mode="currentTab === 'completed' ? 'activeTab' : 'light'"
            :padding="true"
            @click="currentTab = 'completed'"
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
            <span :class="`item-btn__icon icon icon-Sorting_${selectedSort === 'desc' ? 'descending' : 'ascending'}`" />
          </base-btn>
        </div>
      </div>
      <div
        class="auction__list"
        :class="`auction__list_${currentTab}`"
      >
        <auction-card
          v-for="auction in auctionMock"
          :key="auction.id"
          :auction="auction"
          :is-completed="currentTab === 'completed'"
        />
      </div>
      <div class="auction__pager-block">
        <base-pager
          v-if="pagination.totalPages > 1"
          v-model="pagination.currentPage"
          class="auction__pager"
          :total-pages="pagination.totalPages"
          @input="setPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AuctionCard from '~/components/app/pages/auction/AuctionCard';

export default {
  name: 'Auction',
  components: {
    AuctionCard,
  },
  data() {
    return {
      searchValue: '',
      searchTimeout: null,
      currentTab: 'current',
      selectedSort: 'desc',
      auctionMock: [
        {
          recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
          price: 11,
          currency: 'ETH',
          feePercent: 13,
          isFeeIncluded: true,
          startTime: 1645454143,
          endsIn: 1645464143,
          id: '25f1df1a3f971e4f56c9e559e2204fad',
        },
        {
          recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
          price: 12,
          currency: 'WUSD',
          feePercent: 13,
          isFeeIncluded: true,
          startTime: 1645454143,
          endsIn: 1645464143,
          id: 'af974453e64ec88c33b0275d8bb6ac6c',
        },
        {
          recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
          price: 15,
          currency: 'ETH',
          feePercent: 13,
          isFeeIncluded: true,
          startTime: 1645454143,
          endsIn: 1645464143,
          id: 'a1c47b0f29b31f59c2f15755f84c71ee',
        },
        {
          recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
          price: 5,
          currency: 'WUSD',
          feePercent: 13,
          isFeeIncluded: true,
          startTime: 1645454143,
          endsIn: 1645464143,
          id: '99742ce9ab0fcc33df69babb39cfac52',
        },
        {
          recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
          price: 20,
          currency: 'ETH',
          feePercent: 13,
          isFeeIncluded: true,
          startTime: 1645454143,
          endsIn: 1645464143,
          id: '31a40c78b0b98154ec9128be269bc593',
        },
        {
          recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
          price: 100,
          currency: 'WUSD',
          feePercent: 20,
          isFeeIncluded: false,
          startTime: 1645454143,
          endsIn: 1645464143,
          id: '1faffc89f8e46865fb7b29307be6d68a',
        },
      ],
      pagination: {
        totalPages: 10,
        currentPage: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
    }),
    searchPlaceholder() {
      return this.$t('auction.search.placeholder');
    },
  },
  watch: {
    currentTab: {
      handler(value) {
        if (value === 'current') {
          this.auctionMock = [
            {
              recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
              price: 11,
              currency: 'ETH',
              feePercent: 13,
              isFeeIncluded: true,
              startTime: 1645454143,
              endsIn: 1645464143,
              id: '25f1df1a3f971e4f56c9e559e2204fad',
            },
            {
              price: 12,
              currency: 'WUSD',
              feePercent: 13,
              isFeeIncluded: true,
              startTime: 1645454143,
              endsIn: 1645464143,
              id: 'af974453e64ec88c33b0275d8bb6ac6c',
              recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
            },
            {
              price: 15,
              currency: 'ETH',
              feePercent: 13,
              isFeeIncluded: true,
              startTime: 1645454143,
              endsIn: 1645464143,
              id: 'a1c47b0f29b31f59c2f15755f84c71ee',
              recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
            },
            {
              price: 5,
              currency: 'WUSD',
              feePercent: 13,
              isFeeIncluded: true,
              startTime: 1645454143,
              endsIn: 1645464143,
              id: '99742ce9ab0fcc33df69babb39cfac52',
              recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
            },
            {
              price: 20,
              currency: 'ETH',
              feePercent: 13,
              isFeeIncluded: true,
              startTime: 1645454143,
              endsIn: 1645464143,
              id: '31a40c78b0b98154ec9128be269bc593',
              recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
            },
            {
              price: 100,
              currency: 'WUSD',
              feePercent: 20,
              isFeeIncluded: false,
              startTime: 1645454143,
              endsIn: 1645464143,
              id: '1faffc89f8e46865fb7b29307be6d68a',
              recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
            },
          ];
        } else {
          this.auctionMock = [
            {
              type: 'Deal',
              sender: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
              recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
              lotSize: 30000,
              lotSizeCurrency: 'ETH',
              price: 30000,
              priceCurrency: 'WUSD',
              timestamp: 1645464243,
              txHash: '0xf147e37ba5120bb7ef511441dfb0fc7d0e8b85af7e5632cf2a6eb63e0220e9c9',
              id: '25f1df1a3f971e4f56c9e559e2204fan',
            },
            {
              type: 'Deal',
              sender: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
              recipient: '0x7dCE9A5FFbfc87F9DEbA00d37B9C3d252F3d954C',
              lotSize: 10000,
              lotSizeCurrency: 'ETH',
              price: 10000,
              priceCurrency: 'WUSD',
              timestamp: 1645463243,
              txHash: '0x45e1a65f361e55c7b65c98ebb7d3f84e8bde230d50ad68023c69d4902930ad00',
              id: '1faffc89f8e46865fb7b29307be6d68n',
            },
          ];
        }
      },
    },
  },
  mounted() {
    this.$nuxt.setLayout(this.userData.id ? 'default' : 'guest');
  },
  methods: {
    goSearch() {
      clearTimeout(this.searchTimeout);
      console.log('search');// TODO search
    },
    goSearchDebounce() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        console.log('search'); // TODO search
      }, 600);
    },
    changeTimeSorting() {
      this.selectedSort = this.selectedSort === 'asc' ? 'desc' : 'asc';
    },
    setPage(value) {
      this.pagination.currentPage = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  max-width: 1180px;
  margin: 30px auto;

  &__block {
    display: grid;
    grid-template-columns: 1fr 260px;

    @include box;
  }

  &__block-item {
    padding: 20px;
    border-right: 1px solid $black0;

    &:last-child {
      border-right: none;
    }
  }
}
.auction {
  padding: 0 15px;

  &__content {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
  }

  &__title {
    margin-top: 73px;
    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
    margin-bottom: 44px;
  }

  &__topbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 37px;
    &-switcher {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
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
  color:$black800;
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
@include _991 {
  .auction {
    &__list {
      &_completed {
        grid-template-columns: repeat(1, 1fr);
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
    &__list {
      &_current {
        grid-template-columns: repeat(1, 1fr);
      }
    }
    &__topbar {
      &-sort {
        &-button {
          min-width: 130px;
          display: grid;
          grid-gap: 0;
          grid-template-columns: 93px 20px;
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
  .search {
    &__block {
      grid-template-columns: 1fr 140px;
      &-item {
        padding: 5px;
      }
    }
  }
}
</style>
