<template>
  <div class="quests">
    <div class="quests__top">
      <transition name="fade-fast">
        <GMap
          v-if="isShowMap"
          ref="gMap"
          class="quests__map"
          language="en"
          :center="{lat: locations[0].lat, lng: locations[0].lng}"
          :zoom="6"
        />
      </transition>
      <div class="quests__search">
        <div class="search">
          <div class="search__toggle">
            <base-checkbox
              v-model="isShowMap"
              name="map"
              :label="$t('quests.ui.showMap')"
            />
          </div>
          <div class="search__inputs">
            <base-field
              v-model="search"
              is-search
              class="search__input"
              :placeholder="$t('quests.ui.search')"
              :mode="'icon'"
            />
          </div>
          <div class="search__dd">
            <base-dd
              v-model="distanceIndex"
              :items="distance"
            />
          </div>
          <div class="search__actions">
            <base-btn class="search__btn">
              Search quests
            </base-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="quests__content">
      <div
        class="quests__body"
        :class="{'quests__body_wrap': !isShowMap}"
      >
        <div class="quests__title">
          <div class="quests__text quests__text_title">
            {{ $t('quests.searchResults') }}
          </div>
        </div>
        <div class="quests__tools tools">
          <div class="tools__left">
            <base-btn
              :mode="'light'"
              @click="changeSorting('price')"
            >
              <span class="tools__text">
                {{ $t('quests.price') }}
              </span>
              <span
                v-if="priceSort === 'desc'"
                class="icon-Sorting_descending"
              />
              <span
                v-if="priceSort === 'asc'"
                class="icon-Sorting_ascending"
              />
            </base-btn>
            <base-btn
              :mode="'light'"
              @click="changeSorting('time')"
            >
              <span class="tools__text">
                {{ $t('quests.time') }}
              </span>
              <span
                v-if="timeSort === 'desc'"
                class="icon-Sorting_descending"
              />
              <span
                v-if="timeSort === 'asc'"
                class="icon-Sorting_ascending"
              />
            </base-btn>
            <!--            <base-btn :mode="'light'">-->
            <!--              <span class="tools__text">-->
            <!--                {{ $t('quests.priority') }}-->
            <!--              </span>-->
            <!--              <span class="icon-caret_right" />-->
            <!--            </base-btn>-->
            <base-dd
              v-model="priorityIndex"
              :items="priority"
            />
          </div>
          <div class="tools__right">
            <base-btn
              :mode="'light'"
              @click="showSkillsModal()"
            >
              <span class="tools__text">
                {{ $t('quests.type') }}
              </span>
              <span class="icon-caret_right" />
            </base-btn>
          </div>
        </div>
        <div
          v-if="tags.length"
          class="quests__tags tags"
        >
          <div
            v-for="(item, i) in tags"
            :key="i"
            class="tags__item"
          >
            <base-btn
              class="tags__btn"
              mode="tag"
            >
              {{ item }}
              <span
                class="icon-close_small"
                @click="deleteTag(item)"
              />
            </base-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Quests',
  data() {
    return {
      isShowMap: true,
      search: '',
      locations: [
        {
          lat: 56.475565,
          lng: 84.967270,
        },
      ],
      distance: [
        '+ 100 m',
        '+ 500 m',
        '+ 1000 m',
      ],
      priority: [
        this.$t('quests.priority.all'),
        this.$t('quests.priority.low'),
        this.$t('quests.priority.normal'),
        this.$t('quests.priority.urgent'),
      ],
      priorityIndex: 0,
      distanceIndex: 0,
      priceSort: 'desc',
      timeSort: 'desc',
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    toggleMap() {
      this.isShowMap = !this.isShowMap;
    },
    changeSorting(type) {
      if (type === 'price') {
        // eslint-disable-next-line no-unused-expressions
        this.priceSort === 'desc' ? this.priceSort = 'asc' : this.priceSort = 'desc';
      }
      if (type === 'time') {
        // eslint-disable-next-line no-unused-expressions
        this.timeSort === 'desc' ? this.timeSort = 'asc' : this.timeSort = 'desc';
      }
    },
    deleteTag(tag) {
      this.$store.dispatch('ui/deleteTags', tag);
    },
    showSkillsModal() {
      this.ShowModal({
        key: modals.skills,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.quests {
  &__top {
    position: relative;
    min-height: 160px;
  }
  &__search {
    position: absolute;
    max-width: 1180px;
    height: 83px;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1200;
    @include box;
  }
  &__content {
    display: flex;
    justify-content: center;
  }
  &__body {
    padding-top: 30px;
    max-width: 1180px;
    width: 100%;
    height: 100%;
    &_wrap {
      padding-top: 10px;
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    &_title  {
      font-weight: 500;
      font-size: 25px;
      line-height: 130%;
      color: $black800;
    }
  }
  &__tags {
    padding-top: 30px;
    max-width: 1180px;
  }
  &__tools {
    padding-top:  20px;
  }
}
.tags {
  display: flex;
  &__btn {
    span::before {
      color: $blue;
      font-size: 24px;
      padding-left: 3px;
    }
  }
  &__item {
    min-width: 135px;
    max-width: 150px;
    &:not(:first-child) {
      margin-left: 20px;
    }
  }
}
.tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__left {
    display: grid;
    grid-template-columns: 103px 152px minmax(141px, auto);
    grid-gap: 20px;
    span::before {
      padding-left: 10px;
      margin-right: -10px;
      color: $black400;
      font-size: 24px;
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
  }
  &__right {
    min-width: 149px;
    span::before {
      padding-left: 10px;
      margin-right: -10px;
      color: $black400;
      font-size: 24px;
    }
  }
}
.search {
  display: grid;
  grid-template-columns: 154px 1fr 143px 260px;
  align-items: center;
  height: 100%;
  justify-items: center;
  &__dd {
    border-left: 1px solid #F7F8FA;
    height: 100%;
  }
  &__icon {
    margin-bottom: -10px;
    &::before {
      font-size: 24px;
      color: $blue;
    }
  }
  &__inputs {
    padding: 0 20px;
    width: 100%;
    display: grid;
    align-items: center;
  }
  &__input {
    display: flex;
    align-items: center;
  }
  &__btn {
    max-width: 220px;
  }
  &__toggle {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #F7F8FA;
  }
  &__actions {
    height: 100%;
    border-left: 1px solid #F7F8FA;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}
.quests::v-deep {
  .GMap__Wrapper {
    height: 435px;
  }
  .ctm-field__left {
    padding-top: 6px;
  }
}
</style>
