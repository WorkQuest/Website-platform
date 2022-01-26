<template>
  <div
    class="filters-panel"
    data-selector="FILTER-PANEL"
  >
    <base-filter-dd class="filters-panel__item" />
    <base-dd
      v-if="userRole === UserRole.EMPLOYER"
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
      v-if="userRole === UserRole.WORKER"
      v-model="selectedTypeOfJob"
      class="filters-panel__item"
      mode="blackFont"
      :items="typeOfJobItems"
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
      <span :class="`item-btn__icon icon icon-Sorting_${selectedSort === 'desc' ? 'descending' : 'ascending'}`" />
    </base-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  UserRole,
  RatingFilter,
  PriorityFilter,
  WorkplaceFilter,
  TypeOfJobFilter,
} from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'FiltersPanel',
  data() {
    return {
      selectedRating: null,
      selectedPriority: null,
      selectedTypeOfJob: null,
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
    UserRole() { return UserRole; },
    selectedSpec() {
      const specs = this.selectedSpecializations?.query || [];
      const query = {};
      specs.forEach((item, i) => { query[`specialization[${i}]`] = item; });
      return query;
    },
    ratingItems() {
      const items = [this.$t('quests.allVariants')];
      RatingFilter.forEach((item) => { if (item) items.push(this.$t(`quests.rating.${item}`)); });
      return items;
    },
    priorityItems() {
      const items = [this.$t('quests.priority.all')];
      PriorityFilter.forEach((item) => { if (item.value) items.push(this.$t(`quests.runtime.${item.key}`)); });
      return items;
    },
    typeOfJobItems() {
      const items = [this.$t('quests.allVariants')];
      TypeOfJobFilter.forEach((item) => { if (item.value) items.push(this.$t(`quests.employment.${item}`)); });
      return items;
    },
    workplaceItems() { return WorkplaceFilter.map((item) => this.$t(`workPlaces.${item}`)); },
    prices() {
      const { from, to } = this.selectedPrice;
      if (from && to) return { title: `${from} - ${to}`, hasPrice: true };
      if (!from && to) return { title: `0 - ${to}`, hasPrice: true };
      if (from && !to) return { title: `> ${from}`, hasPrice: true };
      return { title: this.$t('quests.price'), hasPrice: false };
    },
  },
  watch: {
    selectedSpec() { this.$emit('sortSpec', this.selectedSpec); },
    selectedRating() {
      const { selectedRating } = this;
      const query = selectedRating ? { 'ratingStatus[0]': RatingFilter[selectedRating] } : {};
      this.$emit('sortRating', query);
    },
    selectedPriority() {
      const { selectedPriority } = this;
      const query = selectedPriority ? { 'priority[0]': PriorityFilter[selectedPriority].value } : {};
      this.$emit('sortPriority', query);
    },
    selectedTypeOfJob() {
      const { selectedTypeOfJob } = this;
      const query = selectedTypeOfJob ? { 'employments[0]': TypeOfJobFilter[selectedTypeOfJob] } : {};
      this.$emit('sortTypeOfJob', query);
    },
    selectedWorkplace() {
      const { selectedWorkplace } = this;
      const query = selectedWorkplace ? { 'workplace[0]': WorkplaceFilter[selectedWorkplace] } : {};
      this.$emit('sortWorkplace', query);
    },
    selectedPrice() {
      const { selectedPrice: { from, to } } = this;
      const query = {};
      if (from || to) {
        query['betweenWagePerHour[from]'] = from || 0;
        query['betweenWagePerHour[to]'] = to || 99999999999999;
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
