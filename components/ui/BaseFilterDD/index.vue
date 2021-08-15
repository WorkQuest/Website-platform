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
                    class="item"
                    @click="toggleItem(item, i)"
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
                    {{ selected }}
                    <div
                      class="sub__body"
                      :class="[{'hide': !item.visible}]"
                    >
                      <div
                        class="sub__item"
                        @click="selectAll(item)"
                      >
                        <input
                          id="1"
                          ref="checkbox"
                          type="checkbox"
                          :name="$t('filters.commonSub.selectAll')"
                        >
                        <label
                          for="1"
                          class="sub__label"
                        >{{ $t('filters.commonSub.selectAll') }}</label>
                      </div>

                      <div
                        v-for="(sub, idx) in item.items"
                        :id="idx"
                        :key="idx"
                        class="sub__item"
                      >
                        <input
                          :id="sub.id"
                          ref="checkbox"
                          v-model="selected"
                          type="checkbox"
                          :name="sub.title"
                          :value="sub.title"
                          @click="selectSub(sub, item)"
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
      selected: [],
      filters: {
        categories: {
          1: {
            id: 1,
            title: this.$t('filters.items.1.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.1.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.1.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.1.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.1.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.1.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.1.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.1.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.1.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.1.sub.9'),
              },
              11: {
                id: 11,
                title: this.$t('filters.items.1.sub.10'),
              },
              12: {
                id: 12,
                title: this.$t('filters.items.1.sub.11'),
              },
              13: {
                id: 13,
                title: this.$t('filters.items.1.sub.12'),
              },
            },
          },
          2: {
            id: 2,
            title: this.$t('filters.items.2.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.2.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.2.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.2.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.2.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.2.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.2.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.2.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.2.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.2.sub.9'),
              },
            },
          },
          3: {
            id: 3,
            title: this.$t('filters.items.3.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.3.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.3.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.3.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.3.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.3.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.3.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.3.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.3.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.3.sub.9'),
              },
            },
          },
          4: {
            id: 4,
            title: this.$t('filters.items.4.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.4.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.4.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.4.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.4.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.4.sub.5'),
              },
            },
          },
          5: {
            id: 5,
            title: this.$t('filters.items.5.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.5.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.5.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.5.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.5.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.5.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.5.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.5.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.5.sub.8'),
              },
            },
          },
          6: {
            id: 6,
            title: this.$t('filters.items.6.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.6.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.6.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.6.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.6.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.6.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.6.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.6.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.6.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.6.sub.9'),
              },
              11: {
                id: 11,
                title: this.$t('filters.items.6.sub.10'),
              },
            },
          },
          7: {
            id: 7,
            title: this.$t('filters.items.7.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.7.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.7.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.7.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.7.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.7.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.7.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.7.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.7.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.7.sub.9'),
              },
              11: {
                id: 11,
                title: this.$t('filters.items.7.sub.10'),
              },
            },
          },
          8: {
            id: 8,
            title: this.$t('filters.items.8.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.8.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.8.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.8.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.8.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.8.sub.5'),
              },
            },
          },
          9: {
            id: 9,
            title: this.$t('filters.items.9.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.9.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.9.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.9.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.9.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.9.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.9.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.9.sub.7'),
              },
            },
          },
          10: {
            id: 10,
            title: this.$t('filters.items.10.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.10.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.10.sub.2'),
              },
            },
          },
          11: {
            id: 11,
            title: this.$t('filters.items.11.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.11.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.11.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.11.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.11.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.11.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.11.sub.6'),
              },
            },
          },
          12: {
            id: 12,
            title: this.$t('filters.items.12.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.12.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.12.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.12.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.12.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.12.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.12.sub.6'),
              },
            },
          },
          13: {
            id: 13,
            title: this.$t('filters.items.13.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.13.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.13.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.13.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.13.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.13.sub.4'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.13.sub.5'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.13.sub.6'),
              },
            },
          },
          14: {
            id: 14,
            title: this.$t('filters.items.14.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.14.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.14.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.14.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.14.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.14.sub.5'),
              },
            },
          },
          15: {
            id: 15,
            title: this.$t('filters.items.15.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.15.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.15.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.15.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.15.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.15.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.15.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.15.sub.7'),
              },
            },
          },
          16: {
            id: 16,
            title: this.$t('filters.items.16.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.16.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.16.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.16.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.16.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.16.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.16.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.16.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.16.sub.8'),
              },
            },
          },
          17: {
            id: 17,
            title: this.$t('filters.items.17.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.17.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.17.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.17.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.17.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.17.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.17.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.17.sub.7'),
              },
            },
          },
          18: {
            id: 18,
            title: this.$t('filters.items.18.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.18.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.18.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.18.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.18.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.18.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.18.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.18.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.18.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.18.sub.9'),
              },
              11: {
                id: 11,
                title: this.$t('filters.items.18.sub.10'),
              },
              12: {
                id: 12,
                title: this.$t('filters.items.18.sub.11'),
              },
              13: {
                id: 13,
                title: this.$t('filters.items.18.sub.12'),
              },
              14: {
                id: 14,
                title: this.$t('filters.items.18.sub.13'),
              },
            },
          },
          19: {
            id: 19,
            title: this.$t('filters.items.19.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.19.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.19.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.19.sub.4'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.19.sub.5'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.19.sub.6'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.19.sub.7'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.19.sub.8'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.19.sub.9'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.19.sub.10'),
              },
            },
          },
          20: {
            id: 20,
            title: this.$t('filters.items.20.title'),
            visible: false,
            items: {
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
          21: {
            title: this.$t('filters.items.21.title'),
            visible: false,
            id: 21,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.21.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.21.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.21.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.21.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.21.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.21.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.21.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.21.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.21.sub.9'),
              },
              11: {
                id: 11,
                title: this.$t('filters.items.21.sub.10'),
              },
              12: {
                id: 12,
                title: this.$t('filters.items.21.sub.11'),
              },
            },
          },
          22: {
            id: 22,
            title: this.$t('filters.items.22.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.22.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.22.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.22.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.22.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.22.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.22.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.22.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.22.sub.8'),
              },
            },
          },
          23: {
            id: 23,
            title: this.$t('filters.items.23.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.23.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.23.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.23.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.23.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.23.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.23.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.23.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.23.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.23.sub.9'),
              },
            },
          },
          24: {
            id: 24,
            title: this.$t('filters.items.24.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.24.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.24.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.24.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.24.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.24.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.24.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.24.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.24.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.24.sub.9'),
              },
            },
          },
          25: {
            id: 25,
            title: this.$t('filters.items.25.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.25.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.25.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.25.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.25.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.25.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.25.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.25.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.25.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.25.sub.9'),
              },
            },
          },
          26: {
            id: 26,
            title: this.$t('filters.items.26.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.26.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.26.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.26.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.26.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.26.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.26.sub.6'),
              },
              8: {
                id: 8,
                title: this.$t('filters.items.26.sub.7'),
              },
              9: {
                id: 9,
                title: this.$t('filters.items.26.sub.8'),
              },
              10: {
                id: 10,
                title: this.$t('filters.items.26.sub.9'),
              },
              11: {
                id: 11,
                title: this.$t('filters.items.26.sub.10'),
              },
            },
          },
          27: {
            id: 27,
            title: this.$t('filters.items.27.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.27.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.27.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.27.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.27.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.27.sub.5'),
              },
            },
          },
          28: {
            id: 28,
            title: this.$t('filters.items.28.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.28.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.28.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.28.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.28.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.28.sub.5'),
              },
              7: {
                id: 7,
                title: this.$t('filters.items.28.sub.6'),
              },
            },
          },
          29: {
            id: 29,
            title: this.$t('filters.items.29.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.29.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.29.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.29.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.29.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.29.sub.5'),
              },
            },
          },
          30: {
            id: 30,
            title: this.$t('filters.items.30.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.30.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.30.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.30.sub.3'),
              },
              5: {
                id: 5,
                title: this.$t('filters.items.30.sub.4'),
              },
              6: {
                id: 6,
                title: this.$t('filters.items.30.sub.5'),
              },
            },
          },
          31: {
            id: 31,
            title: this.$t('filters.items.31.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.31.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.31.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.31.sub.3'),
              },
            },
          },
          32: {
            id: 32,
            title: this.$t('filters.items.32.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.32.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.32.sub.2'),
              },
            },
          },
          33: {
            id: 33,
            title: this.$t('filters.items.33.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.33.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.33.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.33.sub.3'),
              },
            },
          },
          34: {
            id: 34,
            title: this.$t('filters.items.34.title'),
            visible: false,
            items: {
              2: {
                id: 2,
                title: this.$t('filters.items.34.sub.1'),
              },
              3: {
                id: 3,
                title: this.$t('filters.items.34.sub.2'),
              },
              4: {
                id: 4,
                title: this.$t('filters.items.34.sub.3'),
              },
            },
          },
        },
      },
    };
  },
  computed: {
    selectedArray() {
      return this.selected;
    },
  },
  mounted() {
    this.closeItem();
  },
  methods: {
    selectAll(item) {
      console.log(item.items);
      const { length } = Object.keys(item.items);
      const { checkbox } = this.$refs;
      let i = Object.keys(item.items)[0];
      console.log(i);
      function toggleChecked() {
        checkbox[i].checked = !checkbox[i].checked;
      }
      // eslint-disable-next-line no-plusplus
      for (i; i < length; i++) {
        toggleChecked();
        if (checkbox[i].checked) {
          this.selected.push(item.items[i].title);
        } else if (!checkbox[i].checked) {
          this.selected.splice(item.items[i].title);
        }
      }
      toggleChecked();
      console.log(this.selected);
    },
    selectSub(sub) {
      if (sub.id) {
        const { checkbox } = this.$refs;
        const i = sub.id;
        checkbox[i].checked = !checkbox[i].checked;
      }
    },
    hideDd() {
      this.isOpenDD = true;
    },
    toggleDd() {
      this.isOpenDD = !this.isOpenDD;
    },
    toggleItem(item) {
      const categories = item;
      console.log(categories);
      let i = item.id;
      const { length } = Object.keys(categories);
      if (item.visible) {
        // eslint-disable-next-line no-plusplus
        for (i; i < length; i++) {
          item.visible = false;
        }
      } else if (!item.visible) {
        // eslint-disable-next-line no-plusplus
        for (i; i < length; i++) {
          item.visible = true;
        }
      }
      // item.visible = !item.visible;
    },
    closeItem() {
      const acc = document.getElementsByClassName('filter__item');
      for (let i = 0; i < acc.length; i += 1) {
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
