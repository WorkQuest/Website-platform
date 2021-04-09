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
  </div>
</template>

<script>
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
      distanceIndex: 0,
    };
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    toggleMap() {
      this.isShowMap = !this.isShowMap;
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
