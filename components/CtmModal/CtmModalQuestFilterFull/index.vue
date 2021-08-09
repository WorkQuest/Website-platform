<template>
  <ctm-modal-box
    :title="$t('filters.titleAll')"
    class="filter"
  >
    <div class="ctm-modal__content filter">
      <div class="filter filter__container">
        <div class="filter__body">
          <div
            v-for="(item, i) in filterItems"
            :key="i"
            class="filter__items"
          >
            <div
              class="filter__item"
            >
              <span
                class="filter item"
                @click="toggleSub(item)"
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
              <div class="filter__item sub">
                <div
                  v-for="(sub, idx) in item.body"
                  :key="idx"
                  class="sub__body"
                  :class="[{'hide': item.visible}]"
                >
                  <div class="sub__item">
                    <input
                      :id="sub.title"
                      type="checkbox"
                      :name="item.title"
                      :value="sub.status"
                    >
                    <label
                      :for="sub.title"
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
  </ctm-modal-box>
</template>

<script>

export default {
  name: 'CtmModalChangeRoleWarning',
  data() {
    return {
      filterItems: [
        {
          title: this.$t('filters.items.1.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.9'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.10'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.11'),
              status: true,
            },
            {
              title: this.$t('filters.items.1.sub.12'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.2.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.2.sub.9'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.3.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.3.sub.9'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.4.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.4.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.4.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.4.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.4.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.4.sub.5'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.5.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.5.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.5.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.5.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.5.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.5.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.5.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.5.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.5.sub.8'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.6.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.9'),
              status: true,
            },
            {
              title: this.$t('filters.items.6.sub.10'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.7.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.9'),
              status: true,
            },
            {
              title: this.$t('filters.items.7.sub.10'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.8.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.8.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.8.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.8.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.8.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.8.sub.5'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.9.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.9.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.9.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.9.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.9.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.9.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.9.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.9.sub.7'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.10.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.10.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.10.sub.2'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.11.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.11.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.11.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.11.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.11.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.11.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.11.sub.6'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.12.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.12.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.12.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.12.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.12.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.12.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.12.sub.6'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.13.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.13.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.13.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.13.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.13.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.13.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.13.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.13.sub.6'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.14.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.14.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.14.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.14.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.14.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.14.sub.5'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.15.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.15.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.15.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.15.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.15.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.15.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.15.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.15.sub.7'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.16.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.16.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.16.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.16.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.16.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.16.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.16.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.16.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.16.sub.8'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.17.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.17.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.17.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.17.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.17.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.17.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.17.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.17.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.17.sub.7'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.18.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.9'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.10'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.11'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.12'),
              status: true,
            },
            {
              title: this.$t('filters.items.18.sub.13'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.19.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.9'),
              status: true,
            },
            {
              title: this.$t('filters.items.19.sub.10'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.20.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.9'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.10'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.11'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.12'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.13'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.14'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.15'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.16'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.17'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.18'),
              status: true,
            },
            {
              title: this.$t('filters.items.20.sub.19'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.21.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.9'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.10'),
              status: true,
            },
            {
              title: this.$t('filters.items.21.sub.11'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.22.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.22.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.22.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.22.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.22.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.22.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.22.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.22.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.22.sub.8'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.23.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.23.sub.9'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.24.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.24.sub.9'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.25.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.25.sub.9'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.26.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.6'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.7'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.8'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.9'),
              status: true,
            },
            {
              title: this.$t('filters.items.26.sub.10'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.27.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.27.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.27.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.27.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.27.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.27.sub.5'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.28.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.28.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.28.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.28.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.28.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.28.sub.5'),
              status: true,
            },
            {
              title: this.$t('filters.items.28.sub.6'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.29.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.29.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.29.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.29.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.29.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.29.sub.5'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.30.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.30.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.30.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.30.sub.3'),
              status: true,
            },
            {
              title: this.$t('filters.items.30.sub.4'),
              status: true,
            },
            {
              title: this.$t('filters.items.30.sub.5'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.31.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.31.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.31.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.31.sub.3'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.32.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.32.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.32.sub.2'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.33.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.33.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.33.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.33.sub.3'),
              status: true,
            },
          ],
        },
        {
          title: this.$t('filters.items.34.title'),
          visible: false,
          body: [
            {
              title: this.$t('filters.commonSub.selectAll'),
              status: true,
            },
            {
              title: this.$t('filters.items.34.sub.1'),
              status: true,
            },
            {
              title: this.$t('filters.items.34.sub.2'),
              status: true,
            },
            {
              title: this.$t('filters.items.34.sub.3'),
              status: true,
            },
          ],
        },
      ],
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    toggleSub(item) {
      item.visible = !item.visible;
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 10px;
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

.hide {
  display: none;
}

.item {
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
  &__container {
    overflow-y: auto;
    max-width: 95% !important;
    height: 90% !important;
  }
  &__body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin: 10px 0 0 0;
    padding: 10px 0 0 0;
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
</style>
