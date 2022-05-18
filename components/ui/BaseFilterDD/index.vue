<template>
  <div
    v-click-outside="hideDd"
    data-selector="COMPONENT-BASE-FILTER-DD"
    class="dd"
  >
    <div
      class="dd dd__container"
    >
      <button
        class="dd__btn"
        data-selector="ACTION-BTN-TOGGLE-DD"
        @click="toggleDd"
      >
        {{ $t('filters.dd.1') }}
        <span
          :class="isOpenDD ? 'icon-caret_down' : 'icon-caret_up'"
        />
      </button>
      <transition name="fade">
        <div
          v-if="!isOpenDD"
          class="dd__list"
          :class="{'hide': isOpenDD}"
        >
          <div
            class="dd filter"
            :class="{'hide': isOpenDD}"
          >
            <div class="filter__btn">
              <base-btn
                mode="outline"
                data-selector="ACTION-BTN-SHOW-FILTER-FULL"
                @click="showFilterFull"
              >
                {{ $t('filters.filterBtn') }}
              </base-btn>
            </div>
            <base-field
              v-model="searchLine"
              class="filter__search"
              data-selector="INPUT-SEARCH"
              :placeholder="$t('meta.placeholders.searchSpecSkill')"
              :is-search="true"
              :is-hide-error="true"
            />
            <div class="filter__body">
              <div
                v-for="(item, specIdx) in searchFilters"
                :id="specIdx"
                :key="specIdx"
                :data-selector="`SEARCH-FILTERS-${specIdx}`"
                :class="{'item__hidden' : !isMatchedSpec(item, specIdx)}"
              >
                <div
                  class="filter__item item"
                >
                  <div
                    class="item"
                    :data-selector="`ACTION-BTN-TOGGLE-CATEGORY-${specIdx}`"
                    @click="toggleCategory(specIdx)"
                  >
                    <span
                      class="item__title"
                    >{{ item.title }}</span>
                    <span
                      v-if="!visible[specIdx]"
                      class="icon-caret_down"
                    />
                    <span
                      v-else
                      class="icon-caret_up"
                    />
                  </div>
                  <div class="filter__item sub">
                    <div
                      class="sub__body"
                      :class="[{'hide': !visible[specIdx]}]"
                    >
                      <div
                        v-if="searchLine.length === 0"
                        class="sub__item checkbox"
                        :data-selector="`ACTION-BTN-SELECT-ALL-${specIdx}`"
                        @click="selectAll(specIdx)"
                      >
                        <input
                          :id="specIdx"
                          v-model="selectedAll[specIdx]"
                          :data-selector="`SELECT-ALL-CHECKBOX-${specIdx}`"
                          class="checkbox checkbox__box sub"
                          type="checkbox"
                          :name="$t('filters.commonSub.selectAll')"
                        >
                        <label
                          :for="specIdx"
                          class="sub__label"
                        >{{ $t('filters.commonSub.selectAll') }}</label>
                      </div>

                      <div
                        v-for="(sub, skillIdx) in item.items"
                        :id="skillIdx"
                        :key="skillIdx"
                        class="sub__item"
                        :class="{'item__hidden' : !isMatchedSkill(sub)}"
                        :data-selector="`ACTION-BTN-SELECT-SUB-${skillIdx}`"
                        @click="selectSub(specIdx, skillIdx)"
                      >
                        <input
                          :id="sub.id"
                          v-model="selected[getPath(specIdx, skillIdx)]"
                          :data-selector="`SUB-CHECKBOX-${sub.id}`"
                          class="checkbox checkbox__box sub"
                          type="checkbox"
                          :name="sub.title"
                        >
                        <label
                          :id="skillIdx"
                          class="sub__label"
                        >{{ sub.title }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dd__btn">
            <base-btn
              :data-selector="`ACTION-BTN-APPLY`"
              @click="handleSubmit"
            >
              {{ $t('meta.btns.apply') }}
            </base-btn>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Dd',
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isOpenDD: true,
      selected: {},
      selectedAll: [],
      visible: {},
      searchLine: '',
    };
  },
  computed: {
    ...mapGetters({
      filters: 'quests/getFilters',
      selectedSpecializationsFilters: 'quests/getSelectedSpecializationsFilters',
    }),
    searchFilters() {
      const f = {};
      const specsKeys = Object.keys(this.filters);
      for (let i = 0; i < specsKeys.length; i += 1) {
        const spec = this.filters[specsKeys[i]];
        f[i] = {
          title: this.$t(`filters.skills.${spec.id}.title`),
          index: spec.id,
          items: {},
        };
        const skillsKeys = Object.keys(spec.skills);
        for (let j = 0; j < skillsKeys.length; j += 1) {
          const index = spec.skills[skillsKeys[j]];
          f[i].items[j] = {
            index,
            title: this.$t(`filters.skills.${spec.id}.sub.${index}`),
          };
        }
      }
      return f;
    },
  },
  watch: {
    isOpenDD() {
      this.selected = this.selectedSpecializationsFilters?.selected || {};
      this.selectedAll = this.selectedSpecializationsFilters?.selectedAll || [];
      this.visible = this.selectedSpecializationsFilters?.visible || {};
    },
  },
  async mounted() {
    if (!this.filters) await this.$store.dispatch('quests/getFilters');
  },
  methods: {
    hideDd() {
      this.isOpenDD = true;
    },
    handleSubmit() {
      const queryKeys = Object.keys(this.selected);
      const query = [];
      for (let i = 0; i < queryKeys.length; i += 1) {
        const path = queryKeys[i];
        if (this.selected[path] === true) {
          query.push(path);
        }
      }
      const data = {
        query,
        selected: this.selected,
        selectedAll: this.selectedAll,
        visible: this.visible,
      };
      this.$store.dispatch('quests/setSelectedSpecializationsFilters', data);
      this.hideDd();
    },
    showFilterFull() {
      this.ShowModal({
        key: modals.questFilterFull,
        selected: this.selected,
        selectedAll: this.selectedAll,
        visible: this.visible,
      });
    },
    getPath(specIdx, skillIdx) {
      return `${this.searchFilters[specIdx].index}.${this.searchFilters[specIdx].items[skillIdx].index}`;
    },
    selectAll(specIdx) {
      const copy = { ...this.selected };
      const isSelect = !this.selectedAll[specIdx];
      const skillsKeys = Object.keys(this.searchFilters[specIdx].items);
      for (let i = 0; i < skillsKeys.length; i += 1) {
        const path = this.getPath(specIdx, i);
        copy[path] = isSelect;
      }
      this.selectedAll[specIdx] = isSelect;
      this.selected = copy;
    },
    selectSub(specIdx, skillIdx) {
      const path = this.getPath(specIdx, skillIdx);
      this.selected = {
        ...this.selected,
        [path]: !this.selected[path],
      };
    },
    toggleDd() {
      this.isOpenDD = !this.isOpenDD;
    },
    toggleCategory(index) {
      this.visible = {
        ...this.visible,
        [index]: !this.visible[index],
      };
    },
    isMatchedSpec(spec, specIdx) {
      const matches = Object.values(spec.items).filter((skill) => (skill.title.toLowerCase().includes(this.searchLine.toLowerCase())));
      if (this.searchLine.length > 0 && matches.length > 0) {
        this.visible[specIdx] = true;
      } else if (matches.length === 0) {
        this.visible[specIdx] = false;
      }
      return matches.length > 0;
    },
    isMatchedSkill(skill) {
      return skill.title.toLowerCase().includes(this.searchLine.toLowerCase());
    },
  },
};
</script>

<style scoped lang="scss">
.icon {
  cursor: pointer;
  font-size: 25px;
  color: $blue !important;
  &-caret_up::before {
    @extend .icon;
    content: "\ea4b";
  }
  &-caret_down::before {
    @extend .icon;
    content: "\ea48";
  }
}

.checkbox {
  z-index: 3;
  &:hover {
    cursor: pointer;
  }
  &__box {
    cursor: pointer;
    pointer-events: none;
  }
}

.hide {
  display: none;
}

.filter {
  &__body {
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior-y: contain;
    height: 400px;
    margin: 10px 0 0 0;
    padding: 10px 0 0 0;
    min-width: 358px;
  }
  &__item {
    &:hover {
      cursor: pointer;
    }
  }
  &__search {
    margin: 15px 0;
  }
}

.item {
  width: 100%;
  &__hidden {
    display: none;
  }
}

.sub {
  &__label {
    text-overflow: ellipsis;
    display: contents;
    &:hover {
      text-shadow: 0px -1px 10px -3px rgba(34, 60, 80, 0.4);
      cursor: pointer;
    }
  }
  &__item {
    width: 100%;
    margin: 0 0 5px 0;
    z-index: 1;
    &:hover {
      text-shadow: 0px -1px 10px -3px rgba(34, 60, 80, 0.4);
      cursor: pointer;
    }
    &:last-child {
      margin: 0;
    }
  }
}

.dd {
  &__container {
    display: flex;
    align-items: center;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
    min-width: 131px;
    position: relative;
    text-align: left;
  }
  &__btn {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    width: 100%;
    max-width: 400px;
    background: $white;
    border-radius: 6px;
    justify-items: center;
    border: 1px solid transparent;
    &_gray {
      background-color: $black0;
    }
    &:hover {
      border: 1px solid $black100;
    }
  }
  &__list {
    @include box;
    width: 400px;
    position: absolute;
    background: $white;
    top: calc(100% + 4px);
    display: grid;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 15px;
    padding: 15px 20px;
    z-index: 1;
  }
}
</style>
