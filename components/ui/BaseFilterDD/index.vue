<template>
  <div
    v-click-outside="hideDd"
    class="dd"
  >
    <div
      class="dd dd__container"
    >
      <button
        class="dd__btn"
        @click="toggleDd"
      >
        {{ $t('filters.dd.1') }}
        <span
          v-if="isOpenDD"
          class="icon-caret_down"
        />
        <span
          v-else
          class="icon-caret_up"
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
                @click="showFilterFull"
              >
                {{ $t('filters.filterBtn') }}
              </base-btn>
            </div>
            <div class="filter__body">
              <div
                v-for="(item, i) in filters.categories"
                :id="i"
                :key="i"
              >
                <div
                  class="filter__item item"
                >
                  <span
                    :id="i"
                    class="item"
                    @click="toggleSub(item, i)"
                  >
                    <span
                      class="item__title"
                    >{{ item.title }}</span>
                    <span
                      v-if="!item.visible"
                      class="icon-caret_down"
                    />
                    <span
                      v-else
                      class="icon-caret_up"
                    />
                  </span>
                  <div
                    class="filter__item sub"
                  >
                    <div
                      v-for="(sub, idx) in item.items"
                      :id="idx"
                      :key="idx"
                      class="sub__body"
                      :class="[{'hide': !item.visible}]"
                    >
                      <div
                        :id="idx"
                        class="sub__item"
                      >
                        <input
                          :id="idx"
                          ref="checkbox"
                          type="checkbox"
                          :name="sub.title"
                          :value="sub.status"
                          @click="sub.func(filters, selected)"
                        >
                        <label
                          :id="idx"
                          class="sub__label"
                        >{{ sub.title }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import modals from '~/store/modals/modals';

export default {
  name: 'Dd',
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isOpenDD: true,
      selectedAll: [],
      filters: {
        categories: {
          category1: {
            title: this.$t('filters.items.1.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items)); console.log(this.selected); },
              },
              2: {
                title: this.$t('filters.items.1.sub.1'),
                func: (filters, selected) => {
                  function checkItems() {
                    console.log(filters);
                    const item = filters.categories.category1.items[2];
                    if (selected.includes(item)) {
                      console.info(1);
                      selected.filter(Object.keys(item)).splice(Object.keys(item));
                      console.log(selected);
                      selected.concat(selected);
                    } else if (!selected.includes(item)) {
                      console.info(2);
                      selected.push(Object.keys(item));
                      console.log(selected);
                    }
                  }
                  checkItems();
                  console.info(this.selected);
                },
              },
              3: {
                title: this.$t('filters.items.1.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[3])); console.log(this.selected); },
              },
              4: {
                title: this.$t('filters.items.1.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[4])); console.log(this.selected); },
              },
              5: {
                title: this.$t('filters.items.1.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[5])); console.log(this.selected); },
              },
              6: {
                title: this.$t('filters.items.1.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[6])); console.log(this.selected); },
              },
              7: {
                title: this.$t('filters.items.1.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[7])); console.log(this.selected); },
              },
              8: {
                title: this.$t('filters.items.1.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[8])); console.log(this.selected); },
              },
              9: {
                title: this.$t('filters.items.1.sub.8'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[9])); console.log(this.selected); },
              },
              10: {
                title: this.$t('filters.items.1.sub.9'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[10])); console.log(this.selected); },
              },
              11: {
                title: this.$t('filters.items.1.sub.10'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[11])); console.log(this.selected); },
              },
              12: {
                title: this.$t('filters.items.1.sub.11'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[12])); console.log(this.selected); },
              },
              13: {
                title: this.$t('filters.items.1.sub.12'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category1.items[13])); console.log(this.selected); },
              },
            },
          },
          category2: {
            title: this.$t('filters.items.2.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items)); },
              },
              2: {
                title: this.$t('filters.items.2.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.2.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.2.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.2.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.2.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.2.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.2.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[8].title)); },
              },
              9: {
                title: this.$t('filters.items.2.sub.8'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[9].title)); },
              },
              10: {
                title: this.$t('filters.items.2.sub.9'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category2.items[10].title)); },
              },
            },
          },
          category3: {
            title: this.$t('filters.items.3.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items)); },
              },
              2: {
                title: this.$t('filters.items.3.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.3.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.3.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.3.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.3.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.3.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.3.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[8].title)); },
              },
              9: {
                title: this.$t('filters.items.3.sub.8'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[9].title)); },
              },
              10: {
                title: this.$t('filters.items.3.sub.9'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category3.items[10].title)); },
              },
            },
          },
          category4: {
            title: this.$t('filters.items.4.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category4.items)); },
              },
              2: {
                title: this.$t('filters.items.4.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category4.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.4.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category4.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.4.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category4.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.4.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category4.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.4.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category4.items[6].title)); },
              },
            },
          },
          category5: {
            title: this.$t('filters.items.5.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items)); },
              },
              2: {
                title: this.$t('filters.items.5.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.5.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.5.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.5.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.5.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.5.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.5.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items[8].title)); },
              },
              9: {
                title: this.$t('filters.items.5.sub.8'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category5.items[9].title)); },
              },
            },
          },
          category6: {
            title: this.$t('filters.items.6.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items)); },
              },
              2: {
                title: this.$t('filters.items.6.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.6.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.6.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.6.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.6.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.6.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.6.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[8].title)); },
              },
              9: {
                title: this.$t('filters.items.6.sub.8'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[9].title)); },
              },
              10: {
                title: this.$t('filters.items.6.sub.9'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[10].title)); },
              },
              11: {
                title: this.$t('filters.items.6.sub.10'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category6.items[11].title)); },
              },
            },
          },
          category7: {
            title: this.$t('filters.items.7.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items)); },
              },
              2: {
                title: this.$t('filters.items.7.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.7.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.7.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.7.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.7.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.7.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.7.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[8].title)); },
              },
              9: {
                title: this.$t('filters.items.7.sub.8'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[9].title)); },
              },
              10: {
                title: this.$t('filters.items.7.sub.9'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[10].title)); },
              },
              11: {
                title: this.$t('filters.items.7.sub.10'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category7.items[11].title)); },
              },
            },
          },
          category8: {
            title: this.$t('filters.items.8.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category8.items)); },
              },
              2: {
                title: this.$t('filters.items.8.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category8.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.8.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category8.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.8.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category8.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.8.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category8.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.8.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category8.items[6].title)); },
              },
            },
          },
          category9: {
            title: this.$t('filters.items.9.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category9.items)); },
              },
              2: {
                title: this.$t('filters.items.9.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category9.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.9.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category9.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.9.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category9.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.9.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category9.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.9.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category9.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.9.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category9.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.9.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category9.items[8].title)); },
              },
            },
          },
          category10: {
            title: this.$t('filters.items.10.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category10.items)); },
              },
              2: {
                title: this.$t('filters.items.10.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category10.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.10.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category10.items[3].title)); },
              },
            },
          },
          category11: {
            title: this.$t('filters.items.11.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category11.items)); },
              },
              2: {
                title: this.$t('filters.items.11.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category11.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.11.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category11.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.11.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category11.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.11.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category11.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.11.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category11.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.11.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category11.items[7].title)); },
              },
            },
          },
          category12: {
            title: this.$t('filters.items.12.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category12.items)); },
              },
              2: {
                title: this.$t('filters.items.12.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category12.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.12.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category12.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.12.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category12.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.12.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category12.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.12.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category12.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.12.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category12.items[7].title)); },
              },
            },
          },
          category13: {
            title: this.$t('filters.items.13.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category13.items)); },
              },
              2: {
                title: this.$t('filters.items.13.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category13.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.13.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category13.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.13.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category13.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.13.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category13.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.13.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category13.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.13.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category13.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.13.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category13.items[8].title)); },
              },
            },
          },
          category14: {
            title: this.$t('filters.items.14.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category14.items)); },
              },
              2: {
                title: this.$t('filters.items.14.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category14.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.14.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category14.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.14.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category14.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.14.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category14.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.14.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category14.items[6].title)); },
              },
            },
          },
          category15: {
            title: this.$t('filters.items.15.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category15.items)); },
              },
              2: {
                title: this.$t('filters.items.15.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category15.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.15.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category15.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.15.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category15.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.15.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category15.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.15.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category15.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.15.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category15.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.15.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category15.items[8].title)); },
              },
            },
          },
          category16: {
            title: this.$t('filters.items.16.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items)); },
              },
              2: {
                title: this.$t('filters.items.16.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.16.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.16.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.16.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.16.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.16.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.16.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items[8].title)); },
              },
              9: {
                title: this.$t('filters.items.16.sub.8'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category16.items[9].title)); },
              },
            },
          },
          category17: {
            title: this.$t('filters.items.17.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category17.items)); },
              },
              2: {
                title: this.$t('filters.items.17.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category17.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.17.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category17.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.17.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category17.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.17.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category17.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.17.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category17.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.17.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category17.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.17.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category17.items[8].title)); },
              },
            },
          },
          category18: {
            title: this.$t('filters.items.18.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items)); },
              },
              2: {
                title: this.$t('filters.items.18.sub.1'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[2].title)); },
              },
              3: {
                title: this.$t('filters.items.18.sub.2'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[3].title)); },
              },
              4: {
                title: this.$t('filters.items.18.sub.3'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[4].title)); },
              },
              5: {
                title: this.$t('filters.items.18.sub.4'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[5].title)); },
              },
              6: {
                title: this.$t('filters.items.18.sub.5'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[6].title)); },
              },
              7: {
                title: this.$t('filters.items.18.sub.6'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[7].title)); },
              },
              8: {
                title: this.$t('filters.items.18.sub.7'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[8].title)); },
              },
              9: {
                title: this.$t('filters.items.18.sub.8'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[9].title)); },
              },
              10: {
                title: this.$t('filters.items.18.sub.9'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[10].title)); },
              },
              11: {
                title: this.$t('filters.items.18.sub.10'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[11].title)); },
              },
              12: {
                title: this.$t('filters.items.18.sub.11'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[12].title)); },
              },
              13: {
                title: this.$t('filters.items.18.sub.12'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[13].title)); },
              },
              14: {
                title: this.$t('filters.items.18.sub.13'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category18.items[14].title)); },
              },
            },
          },
          category19: {
            title: this.$t('filters.items.19.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category19.items)); },
              },
              2: {
                title: this.$t('filters.items.19.sub.1'),
              },
              3: {
                title: this.$t('filters.items.19.sub.2'),
              },
              4: {
                title: this.$t('filters.items.19.sub.4'),
              },
              5: {
                title: this.$t('filters.items.19.sub.5'),
              },
              6: {
                title: this.$t('filters.items.19.sub.6'),
              },
              7: {
                title: this.$t('filters.items.19.sub.7'),
              },
              8: {
                title: this.$t('filters.items.19.sub.8'),
              },
              9: {
                title: this.$t('filters.items.19.sub.9'),
              },
              10: {
                title: this.$t('filters.items.19.sub.10'),
              },
            },
          },
          category20: {
            title: this.$t('filters.items.20.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category20.items)); },
              },
              2: {
                title: this.$t('filters.items.20.sub.1'),
              },
              3: {
                title: this.$t('filters.items.20.sub.2'),
              },
              4: {
                title: this.$t('filters.items.20.sub.3'),
              },
              5: {
                title: this.$t('filters.items.20.sub.4'),
              },
              6: {
                title: this.$t('filters.items.20.sub.5'),
              },
              7: {
                title: this.$t('filters.items.20.sub.6'),
              },
              8: {
                title: this.$t('filters.items.20.sub.7'),
              },
              9: {
                title: this.$t('filters.items.20.sub.8'),
              },
              10: {
                title: this.$t('filters.items.20.sub.9'),
              },
              11: {
                title: this.$t('filters.items.20.sub.10'),
              },
              12: {
                title: this.$t('filters.items.20.sub.11'),
              },
              13: {
                title: this.$t('filters.items.20.sub.12'),
              },
              14: {
                title: this.$t('filters.items.20.sub.13'),
              },
              15: {
                title: this.$t('filters.items.20.sub.14'),
              },
              16: {
                title: this.$t('filters.items.20.sub.15'),
              },
              17: {
                title: this.$t('filters.items.20.sub.16'),
              },
              18: {
                title: this.$t('filters.items.20.sub.17'),
              },
              19: {
                title: this.$t('filters.items.20.sub.18'),
              },
              20: {
                title: this.$t('filters.items.20.sub.19'),
              },
            },
          },
          category21: {
            title: this.$t('filters.items.21.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category21.items)); },
              },
              2: {
                title: this.$t('filters.items.21.sub.1'),
              },
              3: {
                title: this.$t('filters.items.21.sub.2'),
              },
              4: {
                title: this.$t('filters.items.21.sub.3'),
              },
              5: {
                title: this.$t('filters.items.21.sub.4'),
              },
              6: {
                title: this.$t('filters.items.21.sub.5'),
              },
              7: {
                title: this.$t('filters.items.21.sub.6'),
              },
              8: {
                title: this.$t('filters.items.21.sub.7'),
              },
              9: {
                title: this.$t('filters.items.21.sub.8'),
              },
              10: {
                title: this.$t('filters.items.21.sub.9'),
              },
              11: {
                title: this.$t('filters.items.21.sub.10'),
              },
              12: {
                title: this.$t('filters.items.21.sub.11'),
              },
            },
          },
          category22: {
            title: this.$t('filters.items.22.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category22.items)); },
              },
              2: {
                title: this.$t('filters.items.22.sub.1'),
              },
              3: {
                title: this.$t('filters.items.22.sub.2'),
              },
              4: {
                title: this.$t('filters.items.22.sub.3'),
              },
              5: {
                title: this.$t('filters.items.22.sub.4'),
              },
              6: {
                title: this.$t('filters.items.22.sub.5'),
              },
              7: {
                title: this.$t('filters.items.22.sub.6'),
              },
              8: {
                title: this.$t('filters.items.22.sub.7'),
              },
              9: {
                title: this.$t('filters.items.22.sub.8'),
              },
            },
          },
          category23: {
            title: this.$t('filters.items.23.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category23.items)); },
              },
              2: {
                title: this.$t('filters.items.23.sub.1'),
              },
              3: {
                title: this.$t('filters.items.23.sub.2'),
              },
              4: {
                title: this.$t('filters.items.23.sub.3'),
              },
              5: {
                title: this.$t('filters.items.23.sub.4'),
              },
              6: {
                title: this.$t('filters.items.23.sub.5'),
              },
              7: {
                title: this.$t('filters.items.23.sub.6'),
              },
              8: {
                title: this.$t('filters.items.23.sub.7'),
              },
              9: {
                title: this.$t('filters.items.23.sub.8'),
              },
              10: {
                title: this.$t('filters.items.23.sub.9'),
              },
            },
          },
          category24: {
            title: this.$t('filters.items.24.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category24.items)); },
              },
              2: {
                title: this.$t('filters.items.24.sub.1'),
              },
              3: {
                title: this.$t('filters.items.24.sub.2'),
              },
              4: {
                title: this.$t('filters.items.24.sub.3'),
              },
              5: {
                title: this.$t('filters.items.24.sub.4'),
              },
              6: {
                title: this.$t('filters.items.24.sub.5'),
              },
              7: {
                title: this.$t('filters.items.24.sub.6'),
              },
              8: {
                title: this.$t('filters.items.24.sub.7'),
              },
              9: {
                title: this.$t('filters.items.24.sub.8'),
              },
              10: {
                title: this.$t('filters.items.24.sub.9'),
              },
            },
          },
          category25: {
            title: this.$t('filters.items.25.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category25.items)); },
              },
              2: {
                title: this.$t('filters.items.25.sub.1'),
              },
              3: {
                title: this.$t('filters.items.25.sub.2'),
              },
              4: {
                title: this.$t('filters.items.25.sub.3'),
              },
              5: {
                title: this.$t('filters.items.25.sub.4'),
              },
              6: {
                title: this.$t('filters.items.25.sub.5'),
              },
              7: {
                title: this.$t('filters.items.25.sub.6'),
              },
              8: {
                title: this.$t('filters.items.25.sub.7'),
              },
              9: {
                title: this.$t('filters.items.25.sub.8'),
              },
              10: {
                title: this.$t('filters.items.25.sub.9'),
              },
            },
          },
          category26: {
            title: this.$t('filters.items.26.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category26.items)); },
              },
              2: {
                title: this.$t('filters.items.26.sub.1'),
              },
              3: {
                title: this.$t('filters.items.26.sub.2'),
              },
              4: {
                title: this.$t('filters.items.26.sub.3'),
              },
              5: {
                title: this.$t('filters.items.26.sub.4'),
              },
              6: {
                title: this.$t('filters.items.26.sub.5'),
              },
              7: {
                title: this.$t('filters.items.26.sub.6'),
              },
              8: {
                title: this.$t('filters.items.26.sub.7'),
              },
              9: {
                title: this.$t('filters.items.26.sub.8'),
              },
              10: {
                title: this.$t('filters.items.26.sub.9'),
              },
              11: {
                title: this.$t('filters.items.26.sub.10'),
              },
            },
          },
          category27: {
            title: this.$t('filters.items.27.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category27.items)); },
              },
              2: {
                title: this.$t('filters.items.27.sub.1'),
              },
              3: {
                title: this.$t('filters.items.27.sub.2'),
              },
              4: {
                title: this.$t('filters.items.27.sub.3'),
              },
              5: {
                title: this.$t('filters.items.27.sub.4'),
              },
              6: {
                title: this.$t('filters.items.27.sub.5'),
              },
            },
          },
          category28: {
            title: this.$t('filters.items.28.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category28.items)); },
              },
              2: {
                title: this.$t('filters.items.28.sub.1'),
              },
              3: {
                title: this.$t('filters.items.28.sub.2'),
              },
              4: {
                title: this.$t('filters.items.28.sub.3'),
              },
              5: {
                title: this.$t('filters.items.28.sub.4'),
              },
              6: {
                title: this.$t('filters.items.28.sub.5'),
              },
              7: {
                title: this.$t('filters.items.28.sub.6'),
              },
            },
          },
          category29: {
            title: this.$t('filters.items.29.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category29.items)); },
              },
              2: {
                title: this.$t('filters.items.29.sub.1'),
              },
              3: {
                title: this.$t('filters.items.29.sub.2'),
              },
              4: {
                title: this.$t('filters.items.29.sub.3'),
              },
              5: {
                title: this.$t('filters.items.29.sub.4'),
              },
              6: {
                title: this.$t('filters.items.29.sub.5'),
              },
            },
          },
          category30: {
            title: this.$t('filters.items.30.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category30.items)); },
              },
              2: {
                title: this.$t('filters.items.30.sub.1'),
              },
              3: {
                title: this.$t('filters.items.30.sub.2'),
              },
              4: {
                title: this.$t('filters.items.30.sub.3'),
              },
              5: {
                title: this.$t('filters.items.30.sub.4'),
              },
              6: {
                title: this.$t('filters.items.30.sub.5'),
              },
            },
          },
          category31: {
            title: this.$t('filters.items.31.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category31.items)); },
              },
              2: {
                title: this.$t('filters.items.31.sub.1'),
              },
              3: {
                title: this.$t('filters.items.31.sub.2'),
              },
              4: {
                title: this.$t('filters.items.31.sub.3'),
              },
            },
          },
          category32: {
            title: this.$t('filters.items.32.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category32.items)); },
              },
              2: {
                title: this.$t('filters.items.32.sub.1'),
              },
              3: {
                title: this.$t('filters.items.32.sub.2'),
              },
            },
          },
          category33: {
            title: this.$t('filters.items.33.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category33.items)); },
              },
              2: {
                title: this.$t('filters.items.33.sub.1'),
              },
              3: {
                title: this.$t('filters.items.33.sub.2'),
              },
              4: {
                title: this.$t('filters.items.33.sub.3'),
              },
            },
          },
          category34: {
            title: this.$t('filters.items.34.title'),
            visible: false,
            items: {
              1: {
                title: this.$t('filters.commonSub.selectAll'),
                func: () => { this.selected.push(Object.keys(this.filters.categories.category34.items)); },
              },
              2: {
                title: this.$t('filters.items.34.sub.1'),
              },
              3: {
                title: this.$t('filters.items.34.sub.2'),
              },
              4: {
                title: this.$t('filters.items.34.sub.3'),
              },
            },
          },
        },
      },
    };
  },
  mounted() {
    this.closeItem();
  },
  methods: {
    hideDd() {
      this.isOpenDD = true;
    },
    toggleDd() {
      this.isOpenDD = !this.isOpenDD;
    },
    addToArray(item, sub) {
      this.selected.push((this.filters.categories.category + [item.id].items[sub.id]));
      console.log(this.selected);
    },
    // toggleCheckbox(sub, category, idx) {
    //   function checkItems() {
    //     if (selected.include(sub.title)) {
    //       // selected.filter(sub.title, idx, this.selected);
    //       console.log(this.selected);
    //     } else {
    //       // selected.push(sub.title);
    //       console.log(this.selected);
    //     }
    //   }
    //   console.log(sub.title);
    //   if (sub.title) {
    //     // checkItems(sub, idx, this.selected);
    //     console.log(1);
    //     // console.log(idx);
    //     // selected.forEach(() => {});
    //     // console.log(idx);
    //   } else {
    //     // item.items[idx].title;
    //     console.log(2);
    //   }
    //   console.log(item.items);
    // },
    toggleSub(item) {
      item.visible = !item.visible;
    },
    closeItem() {
      const acc = document.getElementsByClassName('filter__item');
      // eslint-disable-next-line no-const-assign,no-plusplus
      for (let i = 0; i < acc.length; i++) {
        acc[i].onclick = () => {
          this.classList.toggle('hide');
          this.nextElementSibling.classList.toggle('hide');
        };
      }
    },
    showFilterFull() {
      this.ShowModal({
        key: modals.questFilterFull,
      });
    },
  },
};
</script>

<style scoped lang="scss">

.hide {
  display: none;
}

.filter {
  &__body {
    overflow-y: auto;
    height: 300px;
    margin: 10px 0 0 0;
    padding: 10px 0 0 0;
  }
  &__item {
    &:hover {
      cursor: pointer;
    }
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
    width: 300px;
    margin: 0 0 5px 0;
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
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    width: 100%;
    max-width: 400px;
    background: #FFFFFF;
    border-radius: 6px;
    &_gray {
      background-color: $black0;
    }
  }
  &__list {
    @include box;
    width: 400px;
    position: absolute;
    background: #FFFFFF;
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
