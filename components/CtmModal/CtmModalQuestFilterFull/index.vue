<template>
  <ctm-modal-box
    :title="$t('modals.titles.filters.titleAll')"
    class="filter"
  >
    <div class="filter__container">
      <div class="filter__body">
        <div
          v-for="(item, specIdx) in searchFilters"
          :id="specIdx"
          :key="specIdx"
          class="filter__items"
        >
          <div class="filter__item item">
            <div
              class="item"
              @click="toggleCategory(specIdx)"
            >
              <span class="item__title">
                {{ item.title }}
              </span>
              <span
                v-show="!visible[specIdx]"
                class="icon-caret_down"
              />
              <span
                v-show="visible[specIdx]"
                class="icon-caret_up"
              />
            </div>
            <transition name="fade">
              <div class="filter filter__item sub">
                <div
                  v-show="visible[specIdx]"
                  class="sub__item"
                  @click="selectAll(specIdx)"
                >
                  <input
                    :id="specIdx"
                    v-model="selectedAll[specIdx]"
                    class="checkbox checkbox__box sub"
                    type="checkbox"
                    :name="$t('filters.commonSub.selectAll')"
                  >
                  <label
                    :for="specIdx"
                    class="sub__label"
                  >
                    {{ $t('filters.commonSub.selectAll') }}
                  </label>
                </div>
                <div
                  v-for="(sub, skillIdx) in item.items"
                  :key="skillIdx"
                  class="sub__body"
                  :class="{'hide': !visible[specIdx]}"
                >
                  <div
                    :id="skillIdx"
                    class="sub__item"
                    @click="selectSub(specIdx, skillIdx)"
                  >
                    <input
                      :id="sub.id"
                      v-model="selected[getPath(specIdx, skillIdx)]"
                      class="checkbox checkbox__box sub"
                      type="checkbox"
                      :name="sub.title"
                    >
                    <label
                      :for="sub.id"
                      class="sub__label"
                    >
                      {{ sub.title }}
                    </label>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="filter__btns">
        <base-btn
          mode="outline"
          data-selector="CLEAN-UP"
          @click="cleanUp()"
        >
          {{ $t('meta.cleanUp') }}
        </base-btn>
        <base-btn
          data-selector="APPLY"
          @click="handleSubmit"
        >
          {{ $t('meta.btns.apply') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'CtmModalChangeRoleWarning',
  data() {
    return {
      selected: {},
      selectedAll: [],
      visible: {},
    };
  },
  computed: {
    ...mapGetters({
      filters: 'quests/getFilters',
      options: 'modals/getOptions',
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
  async mounted() {
    this.selected = this.options?.selected || {};
    this.selectedAll = this.options?.selectedAll || [];
    this.visible = this.options?.visible || {};

    if (!this.filters) await this.$store.dispatch('quests/getFilters');
  },
  methods: {
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
      this.CloseModal();
    },
    getPath(specIdx, skillIdx) {
      return `${this.searchFilters[specIdx].index}.${this.searchFilters[specIdx].items[skillIdx].index}`;
    },
    cleanUp() {
      this.selectedAll = [];
      this.selected = {};
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
    toggleCategory(index) {
      this.visible = {
        ...this.visible,
        [index]: !this.visible[index],
      };
    },
  },
};
</script>

<style lang="scss" scoped>

.checkbox {
  z-index: 3;
  &__box {
    cursor: pointer;
  }
}

.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 1180px;
    width: 100%;
  }
  &__content {
    padding: 28px;
    display: grid;
    justify-items: flex-end;
  }
  &__header {
    padding: 30px 28px 0 40px !important;
  }
}

.message {
  &__action {
    width: 100%;
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

.hide {
  display: none;
}

.item {
  width: 100%;
  &__title {
    margin: 10px 0 0 0;
    @include text-simple;
    font-size: 16px;
    font-weight: 600;
    color: $black800;
    cursor: pointer;
    &:last-child {
      margin: 10px 0 10px 0;
    }
  }
}

.filter {
  min-height: 50%;
  min-width: 65% !important;
  justify-content: center;
  &__btns {
    margin: 44px 8% 20px 0;
    display: flex;
    justify-self: self-end;
    width: 320px;
    gap: 10px;
  }
  &__container {
    margin: 0 0 0 13px;
    overflow-y: auto;
    display: inline-grid;
    justify-content: center;
  }
  &__body {
    height: 100%;
    max-height: max-content;
    column-count: 4;
    column-gap: 0;
  }
  &__items {
    break-inside: avoid;
    padding: 15px;
    cursor: pointer;
    &:hover {
      text-shadow: 0px -1px 10px -3px rgba(34, 60, 80, 0.4);
    }
  }
}

.message {
  &__action {
    width: 100%;
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }
  &__wrapper {
    width: 45%;
  }
}

.icon-caret {
  &_down, &_up {
    &::before {
      color: $blue;
    }
  }
}

@include _1300 {
 .filter {
   &__body {
     grid-template-columns: repeat(3, 1fr);
   }
 }
}
@include _991 {
  .filter {
    &__body {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
@include _767 {
  .filter {
    &__body {
      grid-template-columns: repeat(1, 1fr);
    }
    &__btns {
      margin: 20px auto;
    }
  }
}
@include _575 {
  .filter {
    &__body {
      display: grid;
    }
  }
}
@include _380 {
  .filter {
    &__items {
      word-break: break-word;
      padding: 15px 5px;
    }
    &__btns {
      margin: 10px;
    }
  }
}
@include _350 {
  .filter {
    padding: 5px;
    &__container {
      margin: 0;
    }
    &__items {
      word-break: break-word;
    }
    &__btns {
      margin: 0 auto;
      flex-direction: column;
      max-width: 288px;
    }
  }
}
</style>
