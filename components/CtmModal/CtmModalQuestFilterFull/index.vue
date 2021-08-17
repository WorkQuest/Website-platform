<template>
  <ctm-modal-box
    :title="$t('filters.titleAll')"
    class="filter"
  >
    <div class="filter ctm-modal__content filter">
      <div class="filter">
        <div class="filter__container">
          <div class="filter__body">
            <div
              v-for="(item, i) in filters.categories"
              :id="i"
              :key="i"
              class="filter__items"
            >
              <div
                class="filter__item item"
              >
                <div
                  class="item"
                  @click="toggleCategory(filters, item, i)"
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
                </div>
                <transition name="fade">
                  <div class="filter filter__item sub">
                    <div
                      v-if="!item.visible"
                      class="sub__item"
                      @click="selectAll(i)"
                    >
                      <input
                        :id="i"
                        :ref="`allCheckbox${i}`"
                        type="checkbox"
                        :name="$t('filters.commonSub.selectAll')"
                        @change="selectAll(i)"
                      >
                      <label
                        :for="i"
                        class="sub__label"
                      >{{ $t('filters.commonSub.selectAll') }}</label>
                    </div>
                    <div
                      class="sub__body"
                      :class="[{'hide': item.visible}]"
                    >
                      <div
                        v-for="(sub, idx) in item.items"
                        :id="idx"
                        :key="idx"
                        class="sub__item"
                        @click="selectSub(idx, i)"
                      >
                        <input
                          :id="sub.id"
                          :ref="`checkbox${i}`"
                          class="checkbox checkbox__box sub"
                          type="checkbox"
                          :name="sub.title"
                          @change="selectSub(idx, i)"
                        >
                        <label
                          :for="sub.title"
                          class="sub__label"
                        >{{ sub.title }}</label>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>

export default {
  name: 'CtmModalChangeRoleWarning',
  data() {
    return {
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
  methods: {
    selectAll(idx) {
      const { length } = Object.keys(this.$refs.[`checkbox${idx}`]);
      const selectAllCheckbox = this.$refs.[`allCheckbox${idx}`];
      const checkboxes = this.$refs.[`checkbox${idx}`];
      selectAllCheckbox[0].checked = !selectAllCheckbox[0].checked;
      for (let i = 0; i < length; i += 1) {
        checkboxes[i].checked = selectAllCheckbox[0].checked;
      }
    },
    selectSub(item, category) {
      const checkbox = this.$refs.[`checkbox${category}`][+item - 2];
      checkbox.checked = !checkbox.checked;
    },
    hide() {
      this.CloseModal();
    },
    toggleCategory(filters, item, index) {
      const { categories } = filters;
      categories[index].visible = !categories[index].visible;
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
  max-width: 100% !important;
  justify-content: center;
  &__container {
    overflow-y: auto;
    display: grid;
    justify-content: space-between;
  }
  &__body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin: 10px 0 0 0;
    padding: 10px 0 0 0;
    grid-gap: 20px;
  }
  &__items {
    margin: 0 0 10px 0;
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
  }
}

</style>
