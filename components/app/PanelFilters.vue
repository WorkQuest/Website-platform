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
      data-selector="RATING"
    />
    <base-dd
      v-model="selectedPriority"
      class="filters-panel__item"
      mode="blackFont"
      :items="priorityItems"
      :placeholder="$t('quests.priority')"
      data-selector="PRIORITY"
    />
    <base-dd
      v-if="userRole === UserRole.WORKER"
      v-model="selectedTypeOfEmployment"
      class="filters-panel__item"
      mode="blackFont"
      :items="typeOfJobItems"
      :placeholder="$t('meta.typeOfJob')"
      data-selector="TYPE-EMPLOYMENT"
    />
    <base-dd
      v-if="userRole === UserRole.WORKER"
      v-model="selectedWorkplace"
      class="filters-panel__item"
      mode="blackFont"
      :items="workplaceItems"
      :placeholder="$t('quests.distantWork.title')"
      data-selector="WORKPLACE"
    />
    <base-dd
      v-else
      v-model="selectPayPeriod"
      class="filters-panel__item"
      mode="blackFont"
      :items="payPeriodItems"
      :placeholder="$t('quests.payPeriods.title')"
      data-selector="WORKPLACE"
    />
    <base-btn
      class="filters-panel__item-btn item-btn"
      mode="filter"
      data-selector="SHOW-PRICE"
      @click="showPriceSearch"
    >
      <span
        class="item-btn__text"
        :class="{'item-btn__text-price': prices.hasPrice}"
      >
        {{ prices.title }}
      </span>
      <template v-slot:right>
        <span
          :class="[isPriceModalShowed ? 'icon-caret_up' : 'icon-caret_down', 'item-btn__icon icon  icon_blue']"
        />
      </template>
    </base-btn>
    <base-btn
      class="filters-panel__item-btn item-btn"
      mode="filter"
      data-selector="TIME-SORT"
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
import BigNumber from 'bignumber.js';
import {
  UserRole,
  RatingFilter,
  PriorityFilter,
  WorkplaceFilter,
  TypeOfEmploymentFilters,
  PayPeriodsFilter,
} from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'PanelFilters',
  data() {
    return {
      selectedRating: null,
      selectedPriority: null,
      selectedTypeOfEmployment: null,
      selectedWorkplace: null,
      selectPayPeriod: null,
      selectedSort: 'desc',
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      selectedPrice: 'quests/getSelectedPriceFilter',
      selectedSpecializations: 'quests/getSelectedSpecializationsFilters',
      activeModalKey: 'modals/getCurrentModalKey',
      isModalShowed: 'modals/getIsShow',
    }),
    UserRole() { return UserRole; },
    selectedSpec() {
      const specs = this.selectedSpecializations?.query || [];
      const query = {};
      specs.forEach((item, i) => { query[`specializations[${i}]`] = item; });
      return query;
    },
    ratingItems() {
      return RatingFilter.map((item, i) => (i === 0 ? this.$t('quests.allVariants') : this.$t(`quests.rating.${item.key}`)));
    },
    priorityItems() {
      return PriorityFilter.map((item, i) => (i === 0 ? this.$t('meta.priority.all') : this.$t(`meta.priority.${item.key}`)));
    },
    typeOfJobItems() {
      return TypeOfEmploymentFilters.map((item, i) => (i === 0 ? this.$t('quests.allVariants') : this.$t(`quests.employment.${item}`)));
    },
    workplaceItems() {
      return WorkplaceFilter.map((item) => this.$t(`workPlaces.${item}`));
    },
    payPeriodItems() {
      return PayPeriodsFilter.map((item, i) => (i === 0 ? this.$t('quests.allVariants')
        : this.$t(`quests.payPeriods.${item}`)));
    },
    prices() {
      const { from, to } = this.selectedPrice;
      if (from && to) return { title: `${from} - ${to}`, hasPrice: true };
      if (!from && to) return { title: `0 - ${to}`, hasPrice: true };
      if (from && !to) return { title: `> ${from}`, hasPrice: true };
      return { title: this.$t(`meta.${this.userRole === UserRole.WORKER ? 'price' : 'costPerHour'}`), hasPrice: false };
    },
    isPriceModalShowed() {
      return this.isModalShowed && this.activeModalKey === modals.priceSearch;
    },
    isEmployer() {
      return this.userRole === UserRole.EMPLOYER;
    },
  },
  watch: {
    selectedSpec() { this.$emit('sortSpec', this.selectedSpec); },
    selectedRating(index) {
      this.$emit('sortRating', index ? { 'ratingStatuses[0]': RatingFilter[index].value } : {});
    },
    selectedPriority(index) {
      this.$emit('sortPriority', index ? { 'priorities[0]': PriorityFilter[index].value } : {});
    },
    selectedTypeOfEmployment(index) {
      this.$emit('sortTypeOfEmployment', index ? { 'typeOfEmployments[0]': TypeOfEmploymentFilters[index] } : {});
    },
    selectedWorkplace(index) {
      this.$emit('sortWorkplace', index ? { 'workplaces[0]': WorkplaceFilter[index] } : {});
    },
    selectPayPeriod(index) {
      this.$emit('sortPayPeriod', index ? { 'payPeriods[0]': PayPeriodsFilter[index] } : {});
    },
    selectedPrice() {
      const { selectedPrice: { from, to } } = this;
      const query = {};
      if (this.isEmployer) {
        query['betweenCostPerHour[from]'] = from || 0;
        query['betweenCostPerHour[to]'] = to || 99999999999999;
      } else {
        query['priceBetween[from]'] = from ? new BigNumber(from).shiftedBy(18).toString() : '0';
        query['priceBetween[to]'] = to ? new BigNumber(to).shiftedBy(18).toString()
          : new BigNumber('99999999999999').shiftedBy(18).toString();
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
      this.ShowModal({ key: modals.priceSearch, title: this.$t(`meta.${this.isEmployer ? 'costPerHour' : 'price'}`) });
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
