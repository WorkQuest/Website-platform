<template>
  <div
    class="dd"
  >
    <div
      class="dd dd__container"
    >
      <button
        class="dd__btn"
        @click="isOpenDD = !isOpenDD"
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
              v-for="(item, i) in filterItems"
              :id="i"
              :key="i"
              ref="item"
            >
              <div
                class="filter__item item"
              >
                <span
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
                    v-for="(sub, idx) in item.body"
                    :id="idx"
                    :key="idx"
                    ref="sub"
                    class="sub__body"
                    :class="[{'hide': !item.visible}]"
                    @click="selectAll(idx)"
                  >
                    <div
                      :id="sub.title"
                      class="sub__item"
                    >
                      <input
                        :id="idx"
                        type="checkbox"
                        :name="item.title"
                        :value="sub.status"
                      >
                      <label
                        :for="idx"
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
      filterItems: [
        {
          title: this.$t('filters.items.1.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.9'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.10'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.11'), status: false,
            },
            {
              title: this.$t('filters.items.1.sub.12'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.2.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.2.sub.9'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.3.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.3.sub.9'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.4.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.4.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.4.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.4.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.4.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.4.sub.5'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.5.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.5.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.5.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.5.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.5.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.5.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.5.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.5.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.5.sub.8'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.6.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.9'), status: false,
            },
            {
              title: this.$t('filters.items.6.sub.10'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.7.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.9'), status: false,
            },
            {
              title: this.$t('filters.items.7.sub.10'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.8.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.8.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.8.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.8.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.8.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.8.sub.5'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.9.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.9.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.9.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.9.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.9.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.9.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.9.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.9.sub.7'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.10.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.10.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.10.sub.2'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.11.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.11.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.11.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.11.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.11.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.11.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.11.sub.6'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.12.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.12.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.12.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.12.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.12.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.12.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.12.sub.6'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.13.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.13.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.13.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.13.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.13.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.13.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.13.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.13.sub.6'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.14.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.14.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.14.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.14.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.14.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.14.sub.5'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.15.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.15.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.15.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.15.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.15.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.15.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.15.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.15.sub.7'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.16.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.16.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.16.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.16.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.16.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.16.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.16.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.16.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.16.sub.8'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.17.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.17.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.17.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.17.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.17.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.17.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.17.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.17.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.17.sub.7'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.18.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.9'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.10'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.11'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.12'), status: false,
            },
            {
              title: this.$t('filters.items.18.sub.13'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.19.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.9'), status: false,
            },
            {
              title: this.$t('filters.items.19.sub.10'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.20.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.9'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.10'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.11'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.12'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.13'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.14'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.15'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.16'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.17'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.18'), status: false,
            },
            {
              title: this.$t('filters.items.20.sub.19'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.21.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.9'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.10'), status: false,
            },
            {
              title: this.$t('filters.items.21.sub.11'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.22.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.22.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.22.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.22.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.22.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.22.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.22.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.22.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.22.sub.8'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.23.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.23.sub.9'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.24.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.24.sub.9'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.25.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.25.sub.9'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.26.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.6'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.7'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.8'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.9'), status: false,
            },
            {
              title: this.$t('filters.items.26.sub.10'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.27.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.27.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.27.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.27.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.27.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.27.sub.5'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.28.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.28.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.28.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.28.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.28.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.28.sub.5'), status: false,
            },
            {
              title: this.$t('filters.items.28.sub.6'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.29.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.29.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.29.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.29.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.29.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.29.sub.5'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.30.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.30.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.30.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.30.sub.3'), status: false,
            },
            {
              title: this.$t('filters.items.30.sub.4'), status: false,
            },
            {
              title: this.$t('filters.items.30.sub.5'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.31.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.31.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.31.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.31.sub.3'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.32.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.32.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.32.sub.2'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.33.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.33.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.33.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.33.sub.3'), status: false,
            },
          ],
        },
        {
          title: this.$t('filters.items.34.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'), status: false,
            },
            {
              title: this.$t('filters.items.34.sub.1'), status: false,
            },
            {
              title: this.$t('filters.items.34.sub.2'), status: false,
            },
            {
              title: this.$t('filters.items.34.sub.3'), status: false,
            },
          ],
        },
      ],
      isOpenedCategory: '',
    };
  },
  mounted() {
    this.closeItem();
  },
  methods: {
    hideDd() {
      this.isOpenDD = false;
    },
    selectAll(idx) {
      if (this.$refs.sub[idx].id === '0') {
        // eslint-disable-next-line no-plusplus
        console.log(idx++);
        const subs = this.$refs.sub[idx].childNodes[0].childNodes[0];
        console.log(subs.attributes[4].value);
        subs.attributes[4].value = !subs.attributes[4].value;
        subs.checked = !subs.checked;
      }
    },
    toggleSub(item, i, isOpenedCategory) {
      console.log(i);
      if (i === isOpenedCategory) {
        item.visible = !item.visible;
      }
      if (i !== isOpenedCategory) {
        item.visible = !item.visible;
      }
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
