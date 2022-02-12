<template>
  <div
    class="filters-panel"
    data-selector="FILTER-PANEL"
  >
    <base-filter-dd class="filters-panel__item" />
    <base-dd
      v-if="userRole === $options.UserRole.EMPLOYER"
      v-model="selectedRating"
      class="filters-panel__item"
      mode="blackFont"
      :items="ratingItems"
      :placeholder="$t('quests.rating.title')"
    />
    <base-dd
      v-model="selectedPriority"
      class="filters-panel__item"
      mode="blackFont"
      :items="priorityItems"
      :placeholder="$t('quests.priority.title')"
    />
    <base-dd
      v-if="userRole === $options.UserRole.WORKER"
      v-model="selectedEmployment"
      class="filters-panel__item"
      mode="blackFont"
      :items="employmentItems"
      :placeholder="$t('quests.typeOfJob')"
    />
    <base-dd
      v-model="selectedWorkplace"
      class="filters-panel__item"
      mode="blackFont"
      :items="workplaceItems"
      :placeholder="$t('quests.distantWork.title')"
    />
    <base-btn
      class="filters-panel__item-btn item-btn"
      mode="light"
      data-selector="ACTION-SHOW-PRICE"
      @click="showPriceSearch"
    >
      <span
        class="item-btn__text"
        :class="{'item-btn__text-price': prices.hasPrice}"
      >
        {{ prices.title }}
      </span>
      <template v-slot:right>
        <span class="item-btn__icon icon icon-caret_down icon_blue" />
      </template>
    </base-btn>
    <base-btn
      class="filters-panel__item-btn item-btn"
      mode="light"
      data-selector="ACTION-TIME-SORT"
      @click="sortByTime"
    >
      <span class="item-btn__text">
        {{ $t('quests.time') }}
      </span>
      <template v-slot:right>
        <span
          class="item-btn__icon icon"
          :class="`icon-Sorting_${selectedSort === 'desc' ? 'descending' : 'ascending'}`"
        />
      </template>
    </base-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { UserRole, Filters, Priority } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'FiltersPanel',
  UserRole,
  data() {
    return {
      selectedRating: null,
      selectedPriority: null,
      selectedEmployment: null,
      selectedWorkplace: null,
      selectedSort: 'desc',
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      selectedPrice: 'quests/getSelectedPriceFilter',
      selectedSpecializations: 'quests/getSelectedSpecializationsFilters',
    }),
    ratingItems() {
      return Filters.EMPLOYEE_RATING.map((item) => this.$t(`ratings.${item}`));
    },
    priorityItems() {
      return Filters.PRIORITIES.map((item) => this.$t(`priorities.${item}`));
    },
    employmentItems() {
      return Filters.EMPLOYMENTS.map((item) => this.$t(`employments.${item}`));
    },
    workplaceItems() {
      return Filters.WORKPLACES.map((item) => this.$t(`workplaces.${item}`));
    },
    prices() {
      const { from, to } = this.selectedPrice;
      if (from && to) return { title: `${from} - ${to}`, hasPrice: true };
      if (!from && to) return { title: `0 - ${to}`, hasPrice: true };
      if (from && !to) return { title: `> ${from}`, hasPrice: true };
      return { title: this.$t('quests.price'), hasPrice: false };
    },
  },
  watch: {
    selectedSpecializations: {
      deep: true,
      handler() {
        const specs = this.selectedSpecializations?.query || [];
        const query = {};
        specs.forEach((item, i) => { query[`specializations[${i}]`] = item; });
        this.$emit('sortSpec', query);
      },
    },
    selectedRating(index) {
      const query = index ? { 'ratingStatuses[0]': Filters.EMPLOYEE_RATING[index] } : {};
      this.$emit('sortRating', query);
    },
    selectedPriority(index) {
      const key = Filters.PRIORITIES[index].toUpperCase();
      const query = index ? { 'priorities[0]': Priority[key].key } : {};
      this.$emit('sortPriority', query);
    },
    selectedEmployment(index) {
      const query = index ? { 'employments[0]': Filters.EMPLOYMENTS[index] } : {};
      this.$emit('sortEmployment', query);
    },
    selectedWorkplace(index) {
      const query = index ? { 'workplaces[0]': Filters.WORKPLACES[index] } : {};
      this.$emit('sortWorkplace', query);
    },
    selectedPrice() {
      const { selectedPrice: { from, to } } = this;
      const query = {};
      const queryName = this.userRole === UserRole.EMPLOYER ? 'betweenWagePerHour' : 'priceBetween';
      if (from || to) {
        query[`${queryName}[from]`] = from || 0;
        query[`${queryName}[to]`] = to || 99999999999999;
      }
      this.$emit('sortPrice', query);
    },
  },
  beforeDestroy() {
    this.$store.commit('quests/setSelectedPriceFilter', { from: null, to: null });
    this.$store.commit('quests/setSelectedSpecializationsFilters', {
      query: '', selected: {}, visible: {}, selectedAll: {},
    });
  },
  methods: {
    showPriceSearch() {
      this.ShowModal({ key: modals.priceSearch });
    },
    sortByTime() {
      this.selectedSort = this.selectedSort === 'desc' ? 'asc' : 'desc';
      this.$emit('sortTime', this.selectedSort);
    },
  },
};
</script>

<style lang="scss" scoped>

.filters-panel {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 43px;
  grid-gap: 20px;

  &__item, &__item-btn {
    min-width: 180px;
  }
}

.item-btn {
  padding: 0 20px;

  &__text {
    margin-right: auto;

    &-price {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.icon {
  color:$black800;
  font-size: 24px;

  &_blue {
    color: $blue;
  }
}

@include _1199 {
  .filters-panel {

    &__item, &__item-btn {
      min-width: 160px;
    }
  }
}

@include _1099 {
  .filters-panel {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 43px);
  }
}

@include _575 {
  .filters-panel {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 43px);
    grid-gap: 10px;
  }
}
</style>
