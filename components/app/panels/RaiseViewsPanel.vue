<template>
  <div class="raising">
    <div class="raising__back">
      <base-btn
        mode="back"
        data-selector="PREVIOUS-STEP"
        @click="backButtonCallback()"
      >
        {{ $t('meta.btns.back') }}
        <template v-slot:left>
          <span class="icon-chevron_big_left" />
        </template>
      </base-btn>
    </div>
    <div class="raising__header">
      {{ $t('raising-views.raisingViews') }}
    </div>
    <div class="raising__block-label">
      {{ $t('raising-views.choosePeriod') }}
    </div>
    <div class="raising__period period">
      <div
        v-for="(item, i) in periodTabs"
        :key="i"
        :data-selector="`ACTION-BTN-SWITCH-PERIOD-${i}`"
        class="period__item period-item"
        :class="{'period-item_active': period === i}"
        @click="switchPeriod(i)"
      >
        <h2
          class="period-item__title"
          :class="{'period-item__title_active': period === i}"
        >
          {{ item }}
        </h2>
      </div>
    </div>
    <div class="raising__block-label">
      {{ $t('raising-views.chooseLevel') }}
    </div>
    <div class="raising__level">
      <label
        v-for="(item, i) of levelTabs"
        :key="i"
        class="level"
        :class="{level_active: i === level, [`level_${item.color}`]: level === i}"
        :for="`radio${i}`"
        @click="switchLevel(i)"
      >
        <div class="level__left">
          <input
            :id="`radio${i}`"
            name="higherLevel"
            type="radio"
            class="level__left_radio"
            :value="level"
          >
          <div class="level__info">
            <div
              class="level__info_title level__info_gold"
              :class="`level__info_${item.color}`"
            >
              {{ item.title }}
            </div>
            <div class="level__info_description">
              {{ item.description }}
            </div>
          </div>
        </div>
        <div class="level__right">
          <div class="level__right_price">
            $ {{ item.price }}
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RaiseViewsPanel',
  props: {
    periodTabs: {
      type: Array,
      default: () => [],
    },
    levelTabs: {
      type: Array,
      default: () => [],
    },
    backButtonCallback: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      period: 0,
      level: 0,
    };
  },
  methods: {
    switchPeriod(i) {
      this.period = i;
      this.$emit('switchPeriod', i);
    },
    switchLevel(i) {
      this.level = i;
      this.$emit('switchLevel', i);
    },
  },
};
</script>

<style lang="scss" scoped>

.raising {
  &__header {
    margin: 0 0 20px 0;
    color: $black800;
    font-weight: 500;
    font-size: 20px;
  }
  &__block-label {
    color: $black800;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
  }
  &__level {
    margin-top: 10px;
  }
}

.period {
  margin: 10px 0 20px 0;
  display: flex;
}

.period-item {
  width: 246px;
  height: 46px;
  border-radius: 6px;
  background: $white;
  padding: 12.5px 0;
  text-align: center;
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 20px;
  }

  &_active {
    background: $blue;
    cursor: default;
  }
  &__title {
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black800;

    &_active {
      color: $white;
    }
  }
}

.level {
  background: $white;
  min-height: 133px;
  border-radius: 6px;
  padding: 20px;
  display: flex;
  justify-content: space-between;

  cursor: pointer;
  transition: 0.3s all;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
  &:hover {
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }

  &_active {
    border: 1px solid;
  }

  &_gold {
    border-color: $yellow;
  }
  &_silver {
    border-color: $grey200;
  }
  &_bronze {
    border-color: $brown;
  }

  &__left {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;

    &_radio {
      height: 25px;
      width: 25px;
    }
  }

  &__right {
    flex-shrink: 0;
    display: flex;
    align-self: center;
    &_price {
      user-select: none;
      font-weight: 500;
      font-size: 20px;
      line-height: 130%;
      color: $black800;
    }
  }

  &__info {
    user-select: none;
    margin-right: 20px;
    &_title {
      padding: 2px;
      display: inline-block;
      color: $white;
      border-radius: 6px;
    }
    &_gold {
      background: $yellow;
    }
    &_silver {
      background: $grey200;
    }
    &_bronze {
      background: $brown;
    }
    &_description {
      margin-top: 10px;
      color: $black500;
      font-weight: 400;
      font-size: 16px;
      line-height: 130%;
    }
  }
}

</style>
